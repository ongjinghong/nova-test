use base64::encode;
use reqwest::header::{HeaderMap, HeaderName, HeaderValue, CONTENT_TYPE};
use reqwest::Client;
use serde_json::{json, Value};
use std::collections::HashMap;

#[tauri::command]
pub async fn get_intel_employee_name(token: String, input: String) -> Result<Value, String> {
    let client = Client::new();
    let url = format!("https://graph.microsoft.com/v1.0/users?$count=true&$search=\"displayName:{}\"&$filter=endsWith(mail,'intel.com')&$orderBy=displayName&$select=id,displayName&$top=5", input);

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
pub async fn get_ms_profile(token: String) -> Result<Value, String> {
    let client = Client::new();
    let response = client
        .get("https://graph.microsoft.com/v1.0/me")
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
pub async fn get_ms_profile_pic(token: String) -> Result<Option<String>, String> {
    let client = Client::new();
    let response = client
        .get("https://graph.microsoft.com/v1.0/me/photo/$value")
        .bearer_auth(token)
        .send()
        .await
        .map_err(|err| {
            println!("Request error: {}", err);
            err.to_string()
        })?;

    if response.status().is_success() {
        let body = response.bytes().await.map_err(|err| {
            println!("Error reading response body: {}", err);
            err.to_string()
        })?;
        let base64_image = encode(&body);
        Ok(Some(base64_image))
    } else if response.status().as_u16() == 404 {
        println!("Profile photo not found.");
        Ok(None)
    } else {
        Err(format!(
            "Failed to fetch profile photo: {}",
            response.status()
        ))
    }
}

#[tauri::command]
pub async fn get_manager(token: String) -> Result<Value, String> {
    let client = Client::new();
    let response = client
        .get("https://graph.microsoft.com/v1.0/me/manager")
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
pub async fn get_direct_reports(token: String) -> Result<Value, String> {
    let client = Client::new();
    let response = client
        .get("https://graph.microsoft.com/v1.0/me/directReports")
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
pub async fn fetch_sharepoint_list_item(
    token: String,
    site_id: String,
    list_id: String,
    list_type: String,
    max_item: i32,
    sort: Option<String>,
    sort_column: Option<String>,
) -> Result<Value, String> {
    let client = Client::new();
    let url;
    let mut headers = HeaderMap::new();

    if list_type == "news" {
        if sort.is_none() || sort_column.is_none() {
            return Err("Sort column and sort order must be provided".to_string());
        }
        headers.insert(
            HeaderName::from_static("prefer"),
            HeaderValue::from_static("HonorNonIndexedQueriesWarningMayFailRandomly"),
        );
        url = format!(
            "https://graph.microsoft.com/v1.0/sites/{}/lists/{}/items?$expand=fields&$orderby=fields/{} {}&$top={}",
            site_id, list_id, sort_column.unwrap(), sort.unwrap(), max_item
        );
    } else if list_type == "data" {
        url = format!(
            "https://graph.microsoft.com/v1.0/sites/{}/lists/{}/items?$expand=fields&$top={}",
            site_id, list_id, max_item
        );
    } else if list_type == "24submission" {
        url = format!(
            "https://graph.microsoft.com/v1.0/sites/{}/lists/{}/items?$expand=fields($select=Title,ProblemStatement,SolutionandBenefits,Site,Domain,Quarter,Category,Status,EA,SRNumber,SubmissionPlatform,SubmissionID,PrimaryAuthor,SecondaryAuthor,Created,Modified)&$top={}",
            site_id, list_id, max_item
        );
    } else if list_type == "25submission" {
        url = format!(
            "https://graph.microsoft.com/v1.0/sites/{}/lists/{}/items?$expand=fields($select=Title,ProblemStatement,SolutionandBenefits,Site,Domain,Quarter,Category,Status,EA,SRNumber,SubmissionPlatform,SubmissionPlatformID,PrimaryAuthor,SecondaryAuthors,Duration,Created,Modified)&$top={}",
            site_id, list_id, max_item
        );
    // } else if list_type == "user" {
    //     url = format!(
    //         "https://graph.microsoft.com/v1.0/sites/{}/lists/{}/items?$filter=fields/ContentType eq 'Person'&$expand=fields($select=Title,EMail,JobTitle,Department,Picture)&$select=id,fields&$top={}",
    //         site_id, list_id, max_item
    //     );
    } else {
        return Err("Invalid list type".to_string());
    }

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
pub async fn add_sharepoint_list_item(
    token: String,
    site_id: String,
    list_id: String,
    fields: HashMap<String, Value>,
) -> Result<String, String> {
    let client = Client::new();

    let url = format!(
        "https://graph.microsoft.com/v1.0/sites/{}/lists/{}/items",
        site_id, list_id
    );

    let update_data = json!({
        "fields": fields
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
pub async fn update_sharepoint_list_item(
    token: String,
    site_id: String,
    list_id: String,
    item_id: String,
    fields: HashMap<String, Value>,
) -> Result<String, String> {
    let client = Client::new();

    let url = format!(
        "https://graph.microsoft.com/v1.0/sites/{}/lists/{}/items/{}",
        site_id, list_id, item_id
    );

    let update_data = json!({
        "fields": fields
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
pub async fn fetch_sharepoint_list_image(
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
