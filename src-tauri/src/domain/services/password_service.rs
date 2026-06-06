use async_trait::async_trait;

#[async_trait]
pub trait PasswordService: Send + Sync {
    fn hash(&self, password: &str) -> Result<String, String>;
    fn verify(&self, password: &str, hash: &str) -> Result<bool, String>;
}