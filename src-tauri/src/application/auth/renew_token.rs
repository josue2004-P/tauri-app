use crate::domain::users::repository::UserRepository;
use crate::domain::perfiles::repository::PerfilRepository;
use crate::domain::services::token_service::TokenService;
use crate::domain::auth::response::LoginResponse;
use std::sync::Arc;

pub struct RenewTokenUseCase {
    user_repository: Arc<dyn UserRepository>,
    perfil_repository: Arc<dyn PerfilRepository>,
    token_service: Arc<dyn TokenService>,
}

impl RenewTokenUseCase {
    pub fn new(
        user_repository: Arc<dyn UserRepository>,
        perfil_repository: Arc<dyn PerfilRepository>,
        token_service: Arc<dyn TokenService>,
    ) -> Self {
        Self {
            user_repository,
            perfil_repository,
            token_service,
        }
    }

    pub async fn execute(&self, user_id: i64) -> Result<LoginResponse, String> {
    
        let mut user = match self.user_repository.find_by_id(user_id).await? {
            Some(u) => u,
            None => return Err("El usuario de la sesión ya no existe".to_string()),
        };

        if !user.is_activo { 
            return Err("La cuenta de usuario ha sido desactivada".to_string());
        }

        if let Some(perfil_data) = self.perfil_repository.find_by_id(user.perfil_id).await? {
            user.perfil = Some(perfil_data);
        }

        let new_jwt = self.token_service.generate_token(user_id, &user.email)?;
        user.password = "".to_string();

        Ok(LoginResponse {
            user,
            access_token: new_jwt,
        })
    }
}