use crate::domain::users::entity::User;
use crate::domain::users::repository::UserRepository;
use crate::domain::services::password_service::PasswordService;
use std::sync::Arc;

pub struct CreateUserUseCase {
    user_repository: Arc<dyn UserRepository>,
    password_service: Arc<dyn PasswordService>,
}

impl CreateUserUseCase {
    pub fn new(
        user_repository: Arc<dyn UserRepository>,
        password_service: Arc<dyn PasswordService>,
    ) -> Self {
        Self { 
            user_repository,
            password_service
        }
    }

    pub async fn execute(&self, mut user: User) -> Result<User, String> {
        if user.email.is_empty() || user.password.is_empty() {
            return Err("El email y la contraseña son requeridos".to_string());
        }

        if user.perfil_id <= 0 {
            return Err("Se requiere asignar un ID de perfil válido al usuario".to_string());
        }
        
        if let Some(_) = self.user_repository.find_by_email(&user.email).await? {
            return Err("El correo electrónico ya está registrado".to_string());
        }

        let hashed_password = self.password_service.hash(&user.password)?;
        user.password = hashed_password;

        user.created_at = Some(chrono::Utc::now().to_rfc3339());
        user.is_activo = true;

        self.user_repository.create(user).await
    }
}