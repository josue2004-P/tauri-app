// src-tauri/src/infrastructure/database/sqlite_user_repository.rs
use crate::domain::users::entity::User;
use crate::domain::users::repository::UserRepository;
use async_trait::async_trait;
use rusqlite::{params, Connection};
use std::sync::Mutex;

pub struct SqliteUserRepository {
    pub connection: Mutex<Connection>,
}

#[async_trait]
impl UserRepository for SqliteUserRepository {

    async fn create(&self, user: User) -> Result<User, String> {
        let is_activo_int = if user.is_activo { 1 } else { 0 };

        let conn = self.connection.lock().map_err(|e| format!("Error de bloqueo Mutex: {}", e))?;

        match conn.execute(
            "INSERT INTO users (perfil_id, name, email, password, is_activo, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
            params![
                user.perfil_id,
                user.name,
                user.email,
                user.password,
                is_activo_int,
                user.created_at.clone().unwrap_or_default()
            ],
        ) {
            Ok(_) => {
                let last_id = conn.last_insert_rowid();
                let mut saved_user = user;
                saved_user.id = Some(last_id);
                
                saved_user.password = "".to_string(); 
                Ok(saved_user)
            },
            Err(e) => {
                eprintln!("❌ Error real en la inserción SQLite: {:?}", e);
                Err(format!("Error al insertar usuario en la base de datos: {}", e))
            }
        }
    }

    async fn find_by_email(&self, email: &str) -> Result<Option<User>, String> {
        let conn = self.connection.lock().map_err(|e| e.to_string())?;
        
        let mut stmt = conn
            .prepare(
                "SELECT id, perfil_id, name, email, email_verified_at, password, is_activo, remember_token, created_at, updated_at 
                 FROM users WHERE email = ?1"
            )
            .map_err(|e| e.to_string())?;

        let mut user_iter = stmt.query_map(params![email], |row| {
            let is_activo_int: i32 = row.get(6)?;
            Ok(User {
                id: Some(row.get(0)?),
                perfil_id: row.get(1)?,
                name: row.get(2)?,
                email: row.get(3)?,
                email_verified_at: row.get(4)?,
                password: row.get(5)?,
                is_activo: is_activo_int == 1,
                remember_token: row.get(7)?,
                created_at: row.get(8)?,
                updated_at: row.get(9)?,
                perfil: None,
            })
        }).map_err(|e| e.to_string())?;

        if let Some(user_result) = user_iter.next() {
            let user = user_result.map_err(|e| e.to_string())?;
            Ok(Some(user))
        } else {
            Ok(None) 
        }
    }

    async fn find_by_id(&self, id: i64) -> Result<Option<User>, String> {
        let conn = self.connection.lock().map_err(|e| e.to_string())?;
        
        let mut stmt = conn
            .prepare(
                "SELECT id, perfil_id, name, email, email_verified_at, password, is_activo, remember_token, created_at, updated_at 
                 FROM users WHERE id = ?1"
            )
            .map_err(|e| e.to_string())?;

        let mut user_iter = stmt.query_map(params![id], |row| {
            let is_activo_int: i32 = row.get(6)?;
            Ok(User {
                id: Some(row.get(0)?),
                perfil_id: row.get(1)?,
                name: row.get(2)?,
                email: row.get(3)?,
                email_verified_at: row.get(4)?,
                password: row.get(5)?,
                is_activo: is_activo_int == 1,
                remember_token: row.get(7)?,
                created_at: row.get(8)?,
                updated_at: row.get(9)?,
                perfil: None,
            })
        }).map_err(|e| e.to_string())?;

        if let Some(user_result) = user_iter.next() {
            let user = user_result.map_err(|e| e.to_string())?;
            Ok(Some(user))
        } else {
            Ok(None)
        }
    }
}