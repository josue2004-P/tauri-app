use crate::domain::services::password_service::PasswordService;
use async_trait::async_trait;
use bcrypt::{hash, verify, DEFAULT_COST};

pub struct BcryptService;

#[async_trait]
impl PasswordService for BcryptService {
    fn hash(&self, password: &str) -> Result<String, String> {
        hash(password, DEFAULT_COST)
            .map_err(|e| format!("Error al encriptar contraseña: {}", e.to_string()))
    }

    fn verify(&self, password: &str, hash: &str) -> Result<bool, String> {
        verify(password, hash)
            .map_err(|e| format!("Error al verificar contraseña: {}", e.to_string()))
    }
}