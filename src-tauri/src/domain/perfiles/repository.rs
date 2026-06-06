use async_trait::async_trait;
use crate::domain::perfiles::entity::Perfil;

#[async_trait]
pub trait PerfilRepository: Send + Sync {
    async fn create(&self, perfil: Perfil) -> Result<Perfil, String>;
    async fn find_by_nombre(&self, nombre: &str) -> Result<Option<Perfil>, String>;
    async fn find_by_id(&self, id: i64) -> Result<Option<Perfil>, String>;
    async fn find_all(&self) -> Result<Vec<Perfil>, String>;
}