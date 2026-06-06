// src-tauri/src/bin/http_server.rs
use axum::{routing::{post, get}, Json, Router, Extension, http::StatusCode};
use std::sync::{Arc, Mutex};
use rusqlite::Connection;
use serde::Deserialize;
use std::path::PathBuf;

// Infraestructura y Repositorios existentes
use tauri_app_lib::domain::users::repository::UserRepository;
use tauri_app_lib::infrastructure::database::sqlite_user_repository::SqliteUserRepository;
use tauri_app_lib::domain::services::password_service::PasswordService;
use tauri_app_lib::infrastructure::security::bcrypt_service::BcryptService;
use tauri_app_lib::domain::services::token_service::TokenService;
use tauri_app_lib::infrastructure::security::jwt_service::JwtService;
use tauri_app_lib::domain::users::entity::User;
    
// --- NUEVO: Importaciones del Módulo de Perfiles ---
use tauri_app_lib::domain::perfiles::repository::PerfilRepository;
use tauri_app_lib::infrastructure::database::sqlite_perfil_repository::SqlitePerfilRepository;
use tauri_app_lib::domain::perfiles::entity::Perfil;

// Casos de Uso existentes y nuevos
use tauri_app_lib::application::auth::login_user::LoginUserUseCase;
use tauri_app_lib::application::users::create_user::CreateUserUseCase;
use tauri_app_lib::application::auth::renew_token::RenewTokenUseCase;

use tauri_app_lib::application::perfiles::create_perfil::CreatePerfilUseCase;   
use tauri_app_lib::application::perfiles::get_all_perfiles::GetAllPerfilesUseCase; 

#[derive(Deserialize)]
struct LoginPayload {
    email: String,
    password: String,
}

#[tokio::main]
async fn main() {
    let home_dir = std::env::var("HOME").expect("No se pudo determinar el directorio HOME");
    
    let mut db_path = PathBuf::from(home_dir);
    db_path.push(".local/share/com.josue.tauri-app/lab_piedad.db");
    
    println!("📂 Conectando a la base de datos real del ERP en:");
    println!("👉 {:?}", db_path);

    // 1. Repositorio de Usuarios (Tomamos prestada la ruta con &)
    let conn_user = Connection::open(&db_path).expect("Error abriendo conexión de usuarios");
    let repo: Arc<dyn UserRepository> = Arc::new(SqliteUserRepository { connection: Mutex::new(conn_user) });

    // 2. Repositorio de Perfiles (Volvemos a usar &db_path de forma segura)
    let conn_perfil = Connection::open(&db_path).expect("Error abriendo conexión de perfiles");
    let perfil_repo: Arc<dyn PerfilRepository> = Arc::new(SqlitePerfilRepository { connection: Mutex::new(conn_perfil) });

    let password_service: Arc<dyn PasswordService> = Arc::new(BcryptService);
    let token_service: Arc<dyn TokenService> = Arc::new(JwtService::new(
        "SuperSecretKey_LabPiedad_2026_SecureIndustrialErp!".to_string()
    ));

    // Montamos la aplicación de Axum
    let app = Router::new()
        // Rutas de Autenticación / Usuarios
        .route("/api/auth/login", post(login_handler))
        .route("/api/auth/register", post(register_handler))
        .route("/api/auth/renew", post(renew_token_handler))

        // --- NUEVO: Rutas del catálogo de Perfiles ---
        .route("/api/perfiles", post(create_perfil_handler).get(get_all_perfiles_handler))
        
        // Capa de Inyección de dependencias como Extensiones globales
        .layer(Extension(repo))
        .layer(Extension(perfil_repo)) // <-- Pasamos el nuevo repositorio a Axum
        .layer(Extension(password_service))
        .layer(Extension(token_service));

    let listener = tokio::net::TcpListener::bind("127.0.0.1:4000").await.unwrap();
    println!("🚀 Servidor HTTP para Postman corriendo en: http://127.0.0.1:4000");
    axum::serve(listener, app).await.unwrap();
}

// =========================================================================
// HANDLERS EXISTENTES
// =========================================================================

async fn login_handler(
    Extension(repo): Extension<Arc<dyn UserRepository>>,
    Extension(perfil_repo): Extension<Arc<dyn PerfilRepository>>,
    Extension(password_service): Extension<Arc<dyn PasswordService>>,
    Extension(token_service): Extension<Arc<dyn TokenService>>,
    Json(payload): Json<LoginPayload>,
) -> Result<Json<tauri_app_lib::domain::auth::response::LoginResponse>, (StatusCode, String)> {
    let use_case = LoginUserUseCase::new(repo, perfil_repo, password_service, token_service);
    match use_case.execute(&payload.email, &payload.password).await {
        Ok(res) => Ok(Json(res)),
        Err(e) => Err((StatusCode::UNAUTHORIZED, e)),
    }
}

async fn renew_token_handler(
    Extension(repo): Extension<Arc<dyn UserRepository>>,
    Extension(perfil_repo): Extension<Arc<dyn PerfilRepository>>,
    Extension(token_service): Extension<Arc<dyn TokenService>>,
    headers: axum::http::HeaderMap, 
) -> Result<Json<tauri_app_lib::domain::auth::response::LoginResponse>, (StatusCode, String)> {
    
    let auth_header = headers
        .get(axum::http::header::AUTHORIZATION)
        .and_then(|h| h.to_str().ok())
        .unwrap_or("");

    let user_id = tauri_app_lib::presentation::guards::auth_guard(auth_header, &token_service)
        .map_err(|e| (StatusCode::UNAUTHORIZED, e))?;

    let use_case = RenewTokenUseCase::new(repo, perfil_repo, token_service);
    
    match use_case.execute(user_id).await {
        Ok(res) => Ok(Json(res)),
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, e)),
    }
}

async fn register_handler(
    Extension(repo): Extension<Arc<dyn UserRepository>>,
    Extension(password_service): Extension<Arc<dyn PasswordService>>,
    Json(user_data): Json<User>, 
) -> Result<Json<User>, (StatusCode, String)> {
    let use_case = CreateUserUseCase::new(repo, password_service);
    match use_case.execute(user_data).await {
        Ok(new_user) => Ok(Json(new_user)),
        Err(e) => Err((StatusCode::BAD_REQUEST, e)),
    }
}

// =========================================================================
// --- NUEVO: HANDLERS PARA EL MANEJO DE PERFILES ---
// =========================================================================

// POST /api/perfiles -> Crear Perfil
async fn create_perfil_handler(
    Extension(perfil_repo): Extension<Arc<dyn PerfilRepository>>,
    Json(perfil_data): Json<Perfil>,
) -> Result<Json<Perfil>, (StatusCode, String)> {
    let use_case = CreatePerfilUseCase::new(perfil_repo);
    match use_case.execute(perfil_data).await {
        Ok(new_perfil) => Ok(Json(new_perfil)),
        Err(e) => Err((StatusCode::BAD_REQUEST, e)),
    }
}

// GET /api/perfiles -> Listar todos los Perfiles
async fn get_all_perfiles_handler(
    Extension(perfil_repo): Extension<Arc<dyn PerfilRepository>>,
) -> Result<Json<Vec<Perfil>>, (StatusCode, String)> {
    let use_case = GetAllPerfilesUseCase::new(perfil_repo);
    match use_case.execute().await {
        Ok(lista_perfiles) => Ok(Json(lista_perfiles)),
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, e)),
    }
}