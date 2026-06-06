use crate::domain::users::repository::UserRepository;
use crate::domain::perfiles::repository::PerfilRepository;
use crate::domain::services::password_service::PasswordService;
use crate::domain::services::token_service::TokenService;
use crate::domain::auth::response::LoginResponse;       
use std::sync::Arc;

pub struct LoginUserUseCase {
    user_repository: Arc<dyn UserRepository>,
    perfil_repository: Arc<dyn PerfilRepository>,
    password_service: Arc<dyn PasswordService>,
    token_service: Arc<dyn TokenService>,
}

impl LoginUserUseCase {
    pub fn new(
        user_repository: Arc<dyn UserRepository>,
        perfil_repository: Arc<dyn PerfilRepository>,
        password_service: Arc<dyn PasswordService>,
        token_service: Arc<dyn TokenService>,
    ) -> Self {
        Self {
            user_repository,
            perfil_repository,
            password_service,
            token_service,
        }
    }
    pub async fn execute(&self, email: &str, password: &str) -> Result<LoginResponse, String> {
        if email.is_empty() || password.is_empty() {
            return Err("El correo y la contraseña son requeridos".to_string());
        }

        let mut user = match self.user_repository.find_by_email(email).await? {
            Some(u) => u,
            None => return Err("Credenciales incorrectas".to_string()),
        };

        if !user.is_activo {
            return Err("Este usuario se encuentra inactivo.".to_string());
        }

        let is_valid = self.password_service.verify(password, &user.password)?;
        if !is_valid {
            return Err("Credenciales incorrectas".to_string());
        }

        if let Some(perfil_data) = self.perfil_repository.find_by_id(user.perfil_id).await? {
            user.perfil = Some(perfil_data);
        } else {
            return Err("Error interno: El perfil asignado a este usuario no existe".to_string());
        }

        let user_id = user.id.ok_or("Error interno: Usuario sin ID asignado")?;
        let generated_jwt = self.token_service.generate_token(user_id, &user.email)?;

        user.password = "".to_string();

        Ok(LoginResponse { 
            user,
            access_token: generated_jwt 
        })
    }
}