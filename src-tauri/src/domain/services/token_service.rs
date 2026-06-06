use async_trait::async_trait;

#[async_trait]
pub trait TokenService: Send + Sync {
    fn generate_token(&self, user_id: i64, email: &str) -> Result<String, String>;
    fn validate_token(&self, token: &str) -> Result<i64, String>;
}