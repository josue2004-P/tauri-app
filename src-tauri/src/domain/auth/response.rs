// src-tauri/src/domain/auth/response.rs
use serde::Serialize;
use crate::domain::users::entity::User;

#[derive(Debug, Serialize)]
pub struct LoginResponse {
    pub user: User,
    pub access_token: String,
}