use crate::domain::perfiles::entity::Perfil;
use crate::domain::perfiles::repository::PerfilRepository;
use std::sync::Arc;

pub struct GetAllPerfilesUseCase {
    perfil_repository: Arc<dyn PerfilRepository>,
}

impl GetAllPerfilesUseCase {
    pub fn new(perfil_repository: Arc<dyn PerfilRepository>) -> Self {
        Self { 
            perfil_repository 
        }
    }

    pub async fn execute(&self) -> Result<Vec<Perfil>, String> {
        // Llama directamente al repositorio para traer la colección estructurada
        self.perfil_repository.find_all().await
    }
}