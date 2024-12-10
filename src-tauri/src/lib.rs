use base64;
use chrono::Local;
use chrono::Timelike;
use reqwest::header::{HeaderMap, HeaderName, HeaderValue, CONTENT_TYPE};
use reqwest::Client;
use serde_json::{json, Value};
use std::collections::HashMap;


#[tauri::command]
async fn fetch_person(token: String, input: String) -> Result<Value, String> {
    let client = Client::new();
    let url = format!("https://graph.microsoft.com/v1.0/users?$count=true&$search=\"displayName:{}\"&$filter=endsWith(mail,'intel.com')&$orderBy=displayName&$select=id,displayName", input);

    let mut headers = HeaderMap::new();
    headers.insert("ConsistencyLevel", HeaderValue::from_static("eventual"));
    headers.insert(CONTENT_TYPE, HeaderValue::from_static("application/json"));

    let response = client
        .get(&url)
        .headers(headers)
        .bearer_auth(token)
        .send()
        .await
        .map_err(|err| {
            println!("Request error: {}", err);
            err.to_string()
        })?;

    let data: Value = response.json().await.map_err(|err| {
        println!("JSON parsing error: {}", err);
        err.to_string()
    })?;
    Ok(data)
}

#[tauri::command]
async fn access_sharepoint_list(
    token: String,
    site_id: String,
    list_id: String,
    max_item: String,
) -> Result<Value, String> {
    let client = Client::new();
    let url = format!(
        "https://graph.microsoft.com/v1.0/sites/{}/lists/{}/items?top={}&expand=fields",
        site_id, list_id, max_item
    );

    let response = client
        .get(&url)
        .bearer_auth(token)
        .send()
        .await
        .map_err(|err| err.to_string())?;

    let data: Value = response.json().await.map_err(|err| err.to_string())?;

    Ok(data)
}

#[tauri::command]
async fn get_sharepoint_list_image(
    token: String,
    site_id: String,
    image_id: String,
) -> Result<Value, String> {
    let client = Client::new();
    let api_url = format!(
        "https://graph.microsoft.com/v1.0/sites/{}/lists/Site Assets/items/{}/driveItem",
        site_id, image_id
    );

    let response = client
        .get(api_url)
        .bearer_auth(token) // set token as bearer auth
        .send()
        .await
        .map_err(|e| format!("Error sending request: {}", e))?;

    let data: Value = response.json().await.map_err(|err| err.to_string())?;

    Ok(data)
}

#[tauri::command]
async fn access_news_list(
    token: String,
    site_id: String,
    list_id: String,
    max_item: String,
    sort: String,
) -> Result<Value, String> {
    let client = Client::new();
    let url = format!("https://graph.microsoft.com/v1.0/sites/{}/lists/{}/items?$expand=fields&$orderby=fields/{} desc&$top={}", site_id, list_id, sort, max_item);

    let mut headers = HeaderMap::new();
    let prefer_header = HeaderName::from_static("prefer");
    headers.insert(
        prefer_header,
        HeaderValue::from_static("HonorNonIndexedQueriesWarningMayFailRandomly"),
    );

    let response = client
        .get(&url)
        .headers(headers)
        .bearer_auth(token)
        .send()
        .await
        .map_err(|err| err.to_string())?;

    let data: Value = response.json().await.map_err(|err| err.to_string())?;

    Ok(data)
}

#[tauri::command]
async fn add_sharepoint_item(
    token: String,
    site_id: String,
    list_id: String,
    fields: HashMap<String, Option<Value>>,
) -> Result<String, String> {
    let client = Client::new();

    let url = format!(
        "https://graph.microsoft.com/v1.0/sites/{}/lists/{}/items",
        site_id, list_id
    );

    // Constructing the update data by excluding fields with None values
    let mut filtered_fields = serde_json::Map::new();
    for (key, value) in fields {
        if let Some(val) = value {
            if val != Value::String("".to_string()) && val != Value::Array(vec![]) {
                filtered_fields.insert(key, json!(val));
            }
        }
    }

    // If no fields remain after filtering, return early
    if filtered_fields.is_empty() {
        return Err("No fields to update".to_string());
    }

    let update_data = json!({
        "fields": Value::Object(filtered_fields)
    });

    let response = client
        .post(&url)
        .bearer_auth(token)
        .json(&update_data)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if response.status().is_success() {
        Ok("Item created successfully".to_string())
    } else {
        Err(format!(
            "Failed to update item: {}",
            response.text().await.unwrap_or_default()
        ))
    }
}

#[tauri::command]
async fn update_sharepoint_item(
    token: String,
    site_id: String,
    list_id: String,
    item_id: String,
    fields: HashMap<String, Option<Value>>,
) -> Result<String, String> {
    let client = Client::new();

    let url = format!(
        "https://graph.microsoft.com/v1.0/sites/{}/lists/{}/items/{}",
        site_id, list_id, item_id
    );

    // Constructing the update data by excluding fields with None values
    let mut filtered_fields = serde_json::Map::new();
    for (key, value) in fields {
        if let Some(val) = value {
            if val != Value::String("".to_string()) && val != Value::Array(vec![]) {
                filtered_fields.insert(key, json!(val));
            }
        }
    }

    // If no fields remain after filtering, return early
    if filtered_fields.is_empty() {
        return Err("No fields to update".to_string());
    }

    let update_data = json!({
        "fields": Value::Object(filtered_fields)
    });

    let response = client
        .patch(&url)
        .bearer_auth(token)
        .json(&update_data)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if response.status().is_success() {
        Ok("Item updated successfully".to_string())
    } else {
        Err(format!(
            "Failed to update item: {}",
            response.text().await.unwrap_or_default()
        ))
    }
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
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            fetch_profile_photo,
            fetch_person,
            access_sharepoint_list,
            get_sharepoint_list_image,
            access_news_list,
            add_sharepoint_item,
            update_sharepoint_item,
            get_greeting,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
