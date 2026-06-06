use crate::domain::services::token_service::TokenService;
use async_trait::async_trait;
use jsonwebtoken::{encode, decode, Header, Algorithm, EncodingKey, DecodingKey, Validation};
use serde::{Deserialize, Serialize};
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: String,
    email: String,
    exp: usize,  
}

pub struct JwtService {
    secret: String,
}

impl JwtService {
    pub fn new(secret: String) -> Self {
        Self { secret }
    }
}

#[async_trait]
impl TokenService for JwtService {
    fn generate_token(&self, user_id: i64, email: &str) -> Result<String, String> {
        let expiration = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map_err(|e| e.to_string())?
            .as_secs() + (24 * 3600); // Válido por 24 horas

        let claims = Claims {
            sub: user_id.to_string(),
            email: email.to_string(),
            exp: expiration as usize,
        };

        encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(self.secret.as_bytes()),
        )
        .map_err(|e| format!("Error generando JWT: {}", e.to_string()))
    }

    fn validate_token(&self, token: &str) -> Result<i64, String> {
        let token_data = decode::<Claims>(
            token,
            &DecodingKey::from_secret(self.secret.as_bytes()),
            &Validation::new(Algorithm::HS256),
        )
        .map_err(|e| format!("JWT Inválido: {}", e.to_string()))?;
    
        let user_id = token_data.claims.sub.parse::<i64>()
            .map_err(|_| "ID de usuario corrupto en token".to_string())?;

        Ok(user_id)
    }
}