use serde::{Serialize, Deserialize};
use crate::domain::perfiles::entity::Perfil;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: Option<i64>,
    #[serde(rename = "perfilId")]
    pub perfil_id: i64, 
    pub name: String,
    pub email: String,
    pub email_verified_at: Option<String>,
    pub password: String,
    pub is_activo: bool,
    pub remember_token: Option<String>,
    pub created_at: Option<String>,
    pub updated_at: Option<String>,

    pub perfil: Option<Perfil>,
}