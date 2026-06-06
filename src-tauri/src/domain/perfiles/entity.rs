use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Perfil {
    pub id: Option<i64>,
    pub nombre: String,
    pub created_at: Option<String>,
    pub updated_at: Option<String>,
}