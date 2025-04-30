# Get the absolute path and escape backslashes for NSIS
$currentPath = (Get-Location).Path
$nsisPath = $currentPath -replace '\\', '\\'

# Print debug info
Write-Host "Current directory: $currentPath"
Write-Host "NSIS path variable: $nsisPath"

# Create temporary NSIS script with properly escaped paths
$nsisPrefixContent = @"
!define TAURI_ROOT_DIR "$nsisPath"
!define TAURI_DIR_PATH "$nsisPath"
!define WIX_PATH "C:\\Program Files (x86)\\Windows Kits\\10\\bin\\10.0.22621.0\\x64"
!include "custom_nsis.nsi"
"@

# Write the prefix script
try {
    $nsisPrefixContent | Out-File -Encoding utf8 "build_script.nsi"
    Write-Host "Successfully created build_script.nsi"
} catch {
    Write-Host "Error creating build_script.nsi: $_" -ForegroundColor Red
    exit 1
}

# Verify the NSIS executable exists
if (!(Get-Command "makensis.exe" -ErrorAction SilentlyContinue)) {
    Write-Host "makensis.exe not found. Make sure NSIS is installed and in your PATH." -ForegroundColor Red
    exit 1
}

# Check if custom_nsis.nsi exists
if (!(Test-Path "custom_nsis.nsi")) {
    Write-Host "custom_nsis.nsi not found in the current directory." -ForegroundColor Red
    exit 1
}

# Run NSIS with the wrapper script and capture output
Write-Host "Running NSIS compiler..."
$nsisOutput = & makensis.exe -V2 build_script.nsi 2>&1
$nsisExitCode = $LASTEXITCODE
$nsisOutput | ForEach-Object { Write-Host $_ }

# Check if NSIS command succeeded
if ($nsisExitCode -ne 0) {
    Write-Host "NSIS compilation failed with exit code $nsisExitCode" -ForegroundColor Red
    exit $nsisExitCode
}

# Clean up the temporary file
try {
    Remove-Item "build_script.nsi"
    Write-Host "Cleaned up build_script.nsi"
} catch {
    Write-Host "Warning: Could not remove temporary file: $_" -ForegroundColor Yellow
}

# Check for the output installer file
$expectedOutputFile = "nsis-output.exe"
$expectedOutputPath = Join-Path $currentPath "target\release\bundle\nsis"
if (Test-Path "$expectedOutputPath\$expectedOutputFile") {
    Write-Host "Success! Installer file created at $expectedOutputPath\$expectedOutputFile" -ForegroundColor Green
} else {
    Write-Host "Warning: Expected output file not found at $expectedOutputPath\$expectedOutputFile" -ForegroundColor Yellow
    Write-Host "The NSIS script might be outputting to a different location." -ForegroundColor Yellow
}

Write-Host "NSIS build completed successfully" -ForegroundColor Green
