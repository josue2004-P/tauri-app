use std::sync::Arc;
use crate::domain::services::token_service::TokenService;

pub fn auth_guard(authorization: &str, token_service: &Arc<dyn TokenService>) -> Result<i64, String> {
    if authorization.is_empty() {
        return Err("Acceso denegado: Cabecera de autorización vacía".to_string());
    }

    if !authorization.starts_with("Bearer ") {
        return Err("Acceso denegado: Formato de token inválido".to_string());
    }

    let token = &authorization[7..];

    let user_id = token_service.validate_token(token)
        .map_err(|_| "Acceso denegado: Sesión expirada".to_string())?;

    Ok(user_id)
}