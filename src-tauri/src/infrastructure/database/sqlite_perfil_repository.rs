use crate::domain::perfiles::entity::Perfil;
use crate::domain::perfiles::repository::PerfilRepository;
use async_trait::async_trait;
use rusqlite::{params, Connection};
use std::sync::Mutex;

pub struct SqlitePerfilRepository {
    pub connection: Mutex<Connection>,
}

#[async_trait]
impl PerfilRepository for SqlitePerfilRepository {
    async fn create(&self, perfil: Perfil) -> Result<Perfil, String> {
        let conn = self.connection.lock().map_err(|e| format!("Error de bloqueo Mutex: {}", e))?;

        match conn.execute(
            "INSERT INTO users_profiles (nombre, created_at) VALUES (?1, ?2)",
            params![
                perfil.nombre,
                perfil.created_at.clone().unwrap_or_default()
            ],
        ) {
            Ok(_) => {
                let last_id = conn.last_insert_rowid();
                let mut saved_perfil = perfil;
                saved_perfil.id = Some(last_id);
                Ok(saved_perfil)
            },
            Err(e) => {
                eprintln!("❌ Error real en la inserción de Perfil: {:?}", e);
                Err(format!("Error al insertar perfil en la base de datos: {}", e))
            }
        }
    }

    async fn find_by_nombre(&self, nombre: &str) -> Result<Option<Perfil>, String> {
        let conn = self.connection.lock().map_err(|e| e.to_string())?;
        
        let mut stmt = conn
            .prepare(
                "SELECT id, nombre, created_at, updated_at 
                 FROM users_profiles WHERE nombre = ?1"
            )
            .map_err(|e| e.to_string())?;

        let mut perfil_iter = stmt.query_map(params![nombre], |row| {
            Ok(Perfil {
                id: Some(row.get(0)?),
                nombre: row.get(1)?,
                created_at: row.get(2)?,
                updated_at: row.get(3)?,
            })
        }).map_err(|e| e.to_string())?;

        if let Some(perfil_result) = perfil_iter.next() {
            let perfil = perfil_result.map_err(|e| e.to_string())?;
            Ok(Some(perfil))
        } else {
            Ok(None) 
        }
    }

    async fn find_by_id(&self, id: i64) -> Result<Option<Perfil>, String> {
        let conn = self.connection.lock().map_err(|e| e.to_string())?;
        
        let mut stmt = conn
            .prepare(
                "SELECT id, nombre, created_at, updated_at 
                 FROM users_profiles WHERE id = ?1"
            )
            .map_err(|e| e.to_string())?;

        let mut perfil_iter = stmt.query_map(params![id], |row| {
            Ok(Perfil {
                id: Some(row.get(0)?),
                nombre: row.get(1)?,
                created_at: row.get(2)?,
                updated_at: row.get(3)?,
            })
        }).map_err(|e| e.to_string())?;

        if let Some(perfil_result) = perfil_iter.next() {
            let perfil = perfil_result.map_err(|e| e.to_string())?;
            Ok(Some(perfil))
        } else {
            Ok(None)
        }
    }

    async fn find_all(&self) -> Result<Vec<Perfil>, String> {
        let conn = self.connection.lock().map_err(|e| e.to_string())?;
        
        let mut stmt = conn
            .prepare("SELECT id, nombre, created_at, updated_at FROM users_profiles ORDER BY nombre ASC")
            .map_err(|e| e.to_string())?;

        let perfil_iter = stmt.query_map([], |row| {
            Ok(Perfil {
                id: Some(row.get(0)?),
                nombre: row.get(1)?,
                created_at: row.get(2)?,
                updated_at: row.get(3)?,
            })
        }).map_err(|e| e.to_string())?;

        let mut perfiles = Vec::new();
        for perfil_result in perfil_iter {
            perfiles.push(perfil_result.map_err(|e| e.to_string())?);
        }

        Ok(perfiles)
    }
}