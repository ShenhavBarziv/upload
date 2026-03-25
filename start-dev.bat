@echo off
setlocal

set "ROOT=%~dp0"

echo Launching server dev environment...
pushd "%ROOT%server" >nul
start "Server Dev" cmd /k "npm run dev"
popd >nul

echo Launching client dev environment...
pushd "%ROOT%client" >nul
start "Client Dev" cmd /k "npm run dev"
popd >nul

echo Both client and server dev processes are starting in separate windows.
endlocal
