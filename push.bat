@echo off
echo ==============================================
echo Updating and Deploying Portfolio to GitHub...
echo ==============================================
set GIT_EXE="C:\Users\pavrn\AppData\Local\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd\git.exe"

%GIT_EXE% -C "%~dp0" add .
%GIT_EXE% -C "%~dp0" commit -m "Update portfolio content"
%GIT_EXE% -C "%~dp0" push origin main

echo.
echo ==============================================
echo Update complete! GitHub Pages will update in ~30s.
echo Live URL: https://pav-code006.github.io/Pav-portfolio/
echo ==============================================
pause
