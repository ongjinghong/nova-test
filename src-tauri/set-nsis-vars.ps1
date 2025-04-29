# Simpler approach: create a temporary NSIS script that defines paths relative to the build directory
$nsisPrefixContent = @"
!define TAURI_ROOT_DIR "$((Get-Location).Path)"
!define WIX_PATH "C:\Program Files (x86)\Windows Kits\10\bin\10.0.22621.0\x64"
!include "custom_nsis.nsi"
"@

# Write the prefix script
$nsisPrefixContent | Out-File -Encoding utf8 "build_script.nsi"

# Run NSIS with the wrapper script
& makensis.exe build_script.nsi

# Clean up the temporary file
Remove-Item "build_script.nsi"
