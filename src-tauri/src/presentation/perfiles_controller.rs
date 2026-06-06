use tauri::State;
use std::sync::Arc;
use crate::domain::perfiles::entity::Perfil;
use crate::domain::perfiles::repository::PerfilRepository;
use crate::application::perfiles::create_perfil::CreatePerfilUseCase;
use crate::application::perfiles::get_all_perfiles::GetAllPerfilesUseCase;

#[tauri::command]
pub async fn create_perfil_command(
    perfil_data: Perfil,
    perfil_state: State<'_, Arc<dyn PerfilRepository>>,
) -> Result<Perfil, String> {
    let use_case = CreatePerfilUseCase::new(perfil_state.inner().clone());
    use_case.execute(perfil_data).await
}

#[tauri::command]
pub async fn get_all_perfiles_command(
    perfil_state: State<'_, Arc<dyn PerfilRepository>>,
) -> Result<Vec<Perfil>, String> {
    let use_case = GetAllPerfilesUseCase::new(perfil_state.inner().clone());
    use_case.execute().await
}