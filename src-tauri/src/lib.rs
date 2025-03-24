mod msgraph_api;
use base64;
use chrono::Local;
use chrono::Timelike;
use reqwest::header::{HeaderMap, HeaderValue, CONTENT_TYPE};
use reqwest::Client;
use serde_json::json;
use umya_spreadsheet::*;
use std::path::PathBuf;

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
fn export_to_performance_xlsx(
    data: String,
    quarters: String,
    data_by_quarter: String,
    path: String
) -> Result<(), String> {
    let data: Vec<Vec<String>> = serde_json::from_str(&data).map_err(|e| e.to_string())?;
    let quarters: Vec<String> = serde_json::from_str(&quarters).map_err(|e| e.to_string())?;
    let data_by_quarter: Vec<Vec<Vec<String>>> = serde_json::from_str(&data_by_quarter).map_err(|e| e.to_string())?;

    let mut book = new_file();

    // Rename the default sheet
    let sheet_name = "2025";
    book.get_sheet_by_name_mut("Sheet1").unwrap().set_name(sheet_name);

    let mut font = Font::default();

    // Define header style
    let mut header_style = Style::default();
    header_style.set_background_color("0054AE");
    let mut color = Color::default();
    color.set_argb("FFFFFFFF");
    font.set_color(color);
    header_style.set_font(font.clone());
    header_style.get_alignment_mut().set_horizontal(HorizontalAlignmentValues::Center);
    header_style.get_alignment_mut().set_vertical(VerticalAlignmentValues::Center);

    // Define cell style
    let mut cell_style = Style::default();
    cell_style.set_background_color(Color::COLOR_WHITE);
    cell_style.get_alignment_mut().set_horizontal(HorizontalAlignmentValues::Center);
    cell_style.get_alignment_mut().set_vertical(VerticalAlignmentValues::Center);

    // Define header style
    let mut total_header_style = Style::default();
    total_header_style.set_background_color("FFA500");
    total_header_style.get_alignment_mut().set_horizontal(HorizontalAlignmentValues::Center);
    total_header_style.get_alignment_mut().set_vertical(VerticalAlignmentValues::Center);

    // Define total style
    let mut total_cell_style = Style::default();
    total_cell_style.set_background_color("FFFF00");
    total_cell_style.get_alignment_mut().set_horizontal(HorizontalAlignmentValues::Center);
    total_cell_style.get_alignment_mut().set_vertical(VerticalAlignmentValues::Center);

    // Populate the main sheet
    if let Some(sheet) = book.get_sheet_by_name_mut(sheet_name) {
        for (i, row) in data.iter().enumerate() {
            for (j, cell) in row.iter().enumerate() {
                let mut style = &cell_style;
                    if i == 0 {
                        if j == row.len() -1 || j == row.len() - 2 {
                            style = &total_header_style
                        } else {
                            style = &header_style
                        }
                    } else if i == data.len() - 1 {
                        style = &total_cell_style
                    } else {
                        if j == row.len() -1 || j == row.len() - 2 {
                            style = &total_cell_style
                        }
                    }
                sheet.get_cell_mut((j as u32 + 1, i as u32 + 1))
                    .set_value(cell) // Directly set the cell value
                    .set_style(style.clone());
            }
        }
        sheet.get_column_dimension_mut("A").set_width(40.0);
        for col in ["B", "C", "D", "E", "F", "G", "H", "I", "J"] {
            sheet.get_column_dimension_mut(col).set_width(20.0);
        }
    }

    // Create and populate sheets for each quarter
    for (i, quarter) in quarters.iter().enumerate() {
        let _ = book.new_sheet(quarter);
        if let Some(sheet) = book.get_sheet_by_name_mut(quarter) {
            for (j, row) in data_by_quarter[i].iter().enumerate() {
                for (k, cell) in row.iter().enumerate() {
                    let mut style = &cell_style;
                    if j == 0 {
                        if k == row.len() -1 || k == row.len() - 2 {
                            style = &total_header_style
                        } else {
                            style = &header_style
                        }
                    } else if j == data.len() - 1 {
                        style = &total_cell_style
                    } else {
                        if k == row.len() -1 || k == row.len() - 2 {
                            style = &total_cell_style
                        }
                    }
                    sheet.get_cell_mut((k as u32 + 1, j as u32 + 1))
                        .set_value(cell) // Directly set the cell value
                        .set_style(style.clone());
                }
            }
            sheet.get_column_dimension_mut("A").set_width(40.0);
            for col in ["B", "C", "D", "E", "F", "G", "H", "I", "J"] {
                sheet.get_column_dimension_mut(col).set_width(20.0);
            }
        }
    }

    // Write the workbook to a file
    let mut basepath = PathBuf::from(path);
    basepath.push("Innovation_Performance.xlsx");
    writer::xlsx::write(&book, basepath).map_err(|e| e.to_string())?;

    Ok(())
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
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            fetch_profile_photo,
            get_greeting,
            get_lookup_id,
            export_to_performance_xlsx,
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
