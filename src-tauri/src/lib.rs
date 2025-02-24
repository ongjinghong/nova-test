mod msgraph_api;
use base64;
use chrono::Local;
use chrono::Timelike;
use reqwest::header::{HeaderMap, HeaderValue, CONTENT_TYPE};
use reqwest::Client;
use serde_json::json;

#[tauri::command]
async fn get_lookup_id(email: String) -> Result<i32, String> {
    let client = Client::new();

    let url = "https://prod-16.westus.logic.azure.com:443/workflows/819969e3d3634370981a0b7a172c16e1/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Udy74k1Xu2_BMIYZAmILOAQiq5AmqYugS6qB0WMW_tM";

    let payload = json!({
        "email": email
    });

    let response = client
        .post(url)
        .json(&payload)
        .send()
        .await
        .map_err(|err| err.to_string())?;

    let json_response: serde_json::Value = response.json().await.map_err(|err| err.to_string())?;

    let result = json_response["result"].as_i64().unwrap_or(0) as i32;

    Ok(result)
}

#[tauri::command]
async fn fetch_profile_photo(token: String, email: String) -> Result<String, String> {
    let client = Client::new();

    let url = format!(
        "https://graph.microsoft.com/v1.0//users/{}/photo/$value",
        email
    );
    let mut headers = HeaderMap::new();
    headers.insert(CONTENT_TYPE, HeaderValue::from_static("image/jpg"));
    let response = client
        .get(url)
        .headers(headers)
        .bearer_auth(token)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if response.status().is_success() {
        let bytes_result = response.bytes();

        if let Ok(bytes) = bytes_result.await {
            if !bytes.is_empty() {
                // Encode the image bytes to Base64
                let base64_image = base64::encode(bytes);
                return Ok(base64_image);
            } else {
                // Handle case where the image is empty
                return Err("Profile photo is empty.".to_string());
            }
        } else {
            return Err("Failed to retrieve image bytes.".to_string());
        }
    } else {
        Err(format!(
            "Failed to fetch profile photo: Status {}",
            response.status()
        ))
    }
}

#[tauri::command]
fn get_greeting() -> String {
    let current_hour = Local::now().hour();

    let greeting = match current_hour {
        0..=11 => "Good Morning",
        12..=17 => "Good Afternoon",
        _ => "Good Evening",
    };

    greeting.to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            fetch_profile_photo,
            get_greeting,
            get_lookup_id,
            msgraph_api::get_intel_employee_name,
            msgraph_api::get_ms_profile,
            msgraph_api::get_ms_profile_pic,
            msgraph_api::get_manager,
            msgraph_api::get_direct_reports,
            msgraph_api::fetch_sharepoint_list_item,
            msgraph_api::add_sharepoint_list_item,
            msgraph_api::update_sharepoint_list_item,
            msgraph_api::fetch_sharepoint_list_image,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
