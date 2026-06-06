use tauri::State;
use std::sync::Arc;
use crate::application::auth::login_user::LoginUserUseCase;
use crate::application::auth::renew_token::RenewTokenUseCase;

use crate::domain::users::repository::UserRepository;
use crate::domain::perfiles::repository::PerfilRepository;
use crate::domain::services::password_service::PasswordService;
use crate::domain::auth::response::LoginResponse; 
use crate::domain::services::token_service::TokenService;

use crate::presentation::guards::auth_guard; 

#[tauri::command]
pub async fn login_user_command(
    email: String,
    password: String,
    repo_state: State<'_, Arc<dyn UserRepository>>,
    perfil_state: State<'_, Arc<dyn PerfilRepository>>,
    password_state: State<'_, Arc<dyn PasswordService>>,
    token_state: State<'_, Arc<dyn TokenService>>,
) -> Result<LoginResponse, String> {
    let repo = repo_state.inner().clone();
    let perfil_repo = perfil_state.inner().clone();
    let password_service = password_state.inner().clone();
    let token_service = token_state.inner().clone();
    
    let use_case = LoginUserUseCase::new(repo, perfil_repo, password_service, token_service);
    use_case.execute(&email, &password).await
}

#[tauri::command]
pub async fn renew_token_command(
    authorization: String,
    repo_state: State<'_, Arc<dyn UserRepository>>,
    perfil_state: State<'_, Arc<dyn PerfilRepository>>,
    token_state: State<'_, Arc<dyn TokenService>>,
) -> Result<LoginResponse, String> {
    let repo = repo_state.inner().clone();
    let perfil_repo = perfil_state.inner().clone();
    let token_service = token_state.inner().clone();

    let user_id = auth_guard(&authorization, &token_service)?;
    
    let use_case = RenewTokenUseCase::new(repo,perfil_repo,token_service);
    use_case.execute(user_id).await
}