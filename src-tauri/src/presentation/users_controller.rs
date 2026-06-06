use tauri::State;
use std::sync::Arc;
use crate::domain::users::entity::User;
use crate::application::users::create_user::CreateUserUseCase;
use crate::domain::users::repository::UserRepository;
use crate::domain::services::password_service::PasswordService; 

#[tauri::command]
pub async fn register_user_command(
    user_data: User,
    repo_state: State<'_, Arc<dyn UserRepository>>,
    password_state: State<'_, Arc<dyn PasswordService>>,
) -> Result<User, String> {
    let repo = repo_state.inner().clone();
    let password_service = password_state.inner().clone();

    let use_case = CreateUserUseCase::new(repo,password_service);
    
    use_case.execute(user_data).await
}