use crate::domain::perfiles::entity::Perfil;
use crate::domain::perfiles::repository::PerfilRepository;
use std::sync::Arc;

pub struct CreatePerfilUseCase {
    perfil_repository: Arc<dyn PerfilRepository>,
}

impl CreatePerfilUseCase {
    pub fn new(perfil_repository: Arc<dyn PerfilRepository>) -> Self {
        Self { 
            perfil_repository 
        }
    }

    pub async fn execute(&self, mut perfil: Perfil) -> Result<Perfil, String> {
        // 1. Validación básica
        if perfil.nombre.is_empty() {
            return Err("El nombre del perfil es requerido".to_string());
        }

        // 2. Regla de negocio: No permitir nombres duplicados
        if let Some(_) = self.perfil_repository.find_by_nombre(&perfil.nombre).await? {
            return Err("El nombre de este perfil ya se encuentra registrado".to_string());
        }

        // 3. Formatear metadatos de auditoría antes de persistir
        perfil.created_at = Some(chrono::Utc::now().to_rfc3339());

        // 4. Delegar la persistencia a la capa de infraestructura
        self.perfil_repository.create(perfil).await
    }
}