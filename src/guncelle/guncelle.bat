@echo off
copy /y "%~dp0guncelle.ps1" "%TEMP%\cor3-guncelle.ps1" >nul
start "cor3 guncelle" powershell -NoProfile -ExecutionPolicy Bypass -File "%TEMP%\cor3-guncelle.ps1" "%~dp0."
exit
