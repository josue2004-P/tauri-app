pub mod domain;
pub mod application;
pub mod infrastructure;
pub mod presentation;

use std::sync::{Arc, Mutex};
use tauri::Manager;
use rusqlite::Connection;

use crate::domain::users::repository::UserRepository;
use crate::infrastructure::database::sqlite_user_repository::SqliteUserRepository;

use crate::domain::perfiles::repository::PerfilRepository; 
use crate::infrastructure::database::sqlite_perfil_repository::SqlitePerfilRepository; 

use crate::presentation::users_controller::register_user_command;
use crate::presentation::auth_controller::{login_user_command, renew_token_command}; 

use crate::domain::services::password_service::PasswordService;
use crate::infrastructure::security::bcrypt_service::BcryptService;
use crate::domain::services::token_service::TokenService;
use crate::infrastructure::security::jwt_service::JwtService;


#[tauri::command]
fn initialize_app(_app_handle: tauri::AppHandle) -> Result<(), String> {
    Ok(())
}

pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let app_dir = app.path().app_data_dir()
                .unwrap_or_else(|_| std::env::current_dir().unwrap());

            std::fs::create_dir_all(&app_dir).map_err(|e| e.to_string())?;
            let db_path = app_dir.join("lab_piedad.db");

            let conn = Connection::open(&db_path).map_err(|e| e.to_string())?;

            conn.execute(
                "CREATE TABLE IF NOT EXISTS users_profiles (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nombre TEXT NOT NULL UNIQUE,
                    created_at TEXT DEFAULT NULL,
                    updated_at TEXT DEFAULT NULL
                );",
                [],
            ).map_err(|e| e.to_string())?;

            conn.execute(
                "CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    perfil_id INTEGER NOT NULL, -- 👈 AGREGADO
                    name TEXT NOT NULL,
                    email TEXT NOT NULL UNIQUE,
                    email_verified_at TEXT DEFAULT NULL,
                    password TEXT NOT NULL,
                    is_activo INTEGER NOT NULL DEFAULT 1,
                    remember_token TEXT DEFAULT NULL,
                    created_at TEXT DEFAULT NULL,
                    updated_at TEXT DEFAULT NULL,
                    FOREIGN KEY (perfil_id) REFERENCES users_profiles(id) -- 👈 RELACIÓN EN DB
                );",
                [],
            ).map_err(|e| e.to_string())?;
                        
            let _shared_conn = Arc::new(Mutex::new(conn));

            let user_repository: Arc<dyn UserRepository> = Arc::new(SqliteUserRepository {
                connection: Mutex::new(Connection::open(&db_path).map_err(|e| e.to_string())?), 
            });

            let perfil_repository: Arc<dyn PerfilRepository> = Arc::new(SqlitePerfilRepository {
                connection: Mutex::new(Connection::open(&db_path).map_err(|e| e.to_string())?),
            });

            let password_service: Arc<dyn PasswordService> = Arc::new(BcryptService);
            let token_service: Arc<dyn TokenService> = Arc::new(JwtService::new(
                "SuperSecretKey_LabPiedad_2026_SecureIndustrialErp!".to_string()
            ));

            app.manage(user_repository);
            app.manage(perfil_repository);
            app.manage(password_service);
            app.manage(token_service);
            
            Ok(())
        })  
        .invoke_handler(tauri::generate_handler![
            register_user_command,
            login_user_command,
            renew_token_command,
            initialize_app
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");            
}