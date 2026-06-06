#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri_app_lib::run;

fn main() {
    run(); 
}