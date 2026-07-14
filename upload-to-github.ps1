# GitHub Upload Automation Script
param(
    [Parameter(Mandatory=$true, HelpMessage="Enter your remote GitHub repository URL (e.g., https://github.com/username/repo-name.git)")]
    [string]$RepoUrl
)

# 1. Resolve Git executable path
$GitExe = "git"
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    if (Test-Path "C:\Program Files\Git\cmd\git.exe") {
        $GitExe = "C:\Program Files\Git\cmd\git.exe"
        Write-Host "Found Git at: $GitExe (Adding to temporary session PATH...)" -ForegroundColor Cyan
        $env:Path += ";C:\Program Files\Git\cmd"
    } else {
        Write-Host "Error: Git is not installed or not in your PATH." -ForegroundColor Red
        Write-Host "Please install Git first by running:" -ForegroundColor Yellow
        Write-Host "  winget install Git.Git" -ForegroundColor Cyan
        Write-Host "Then close and reopen your terminal before running this script." -ForegroundColor Yellow
        exit 1
    }
}

# 1.5 Configure Git identity if not already set
$hasEmail = & $GitExe config --global user.email
$hasName = & $GitExe config --global user.name

if ([string]::IsNullOrEmpty($hasEmail)) {
    Write-Host "Setting default Git user email to 'developer@waffor.com'..." -ForegroundColor Cyan
    & $GitExe config --global user.email "developer@waffor.com"
}
if ([string]::IsNullOrEmpty($hasName)) {
    Write-Host "Setting default Git user name to 'Waffor Developer'..." -ForegroundColor Cyan
    & $GitExe config --global user.name "Waffor Developer"
}

# 2. Initialize repository if not already initialized
if (!(Test-Path .git)) {
    Write-Host "Initializing local Git repository..." -ForegroundColor Green
    & $GitExe init
} else {
    Write-Host "Git repository already initialized." -ForegroundColor Yellow
}

# 3. Set branch name to main
& $GitExe branch -M main

# 4. Configure remote origin
if (& $GitExe remote | Select-String -Pattern "origin") {
    Write-Host "Updating remote 'origin' URL..." -ForegroundColor Yellow
    & $GitExe remote set-url origin $RepoUrl
} else {
    Write-Host "Adding remote 'origin'..." -ForegroundColor Green
    & $GitExe remote add origin $RepoUrl
}

# 5. Stage files (following .gitignore rules)
Write-Host "Staging project files..." -ForegroundColor Green
& $GitExe add .

# 6. Commit changes
Write-Host "Creating initial commit..." -ForegroundColor Green
& $GitExe commit -m "Initial commit - FoodHub Saga Order-to-Delivery System"

# 7. Push to GitHub
Write-Host "Pushing to GitHub (main branch)..." -ForegroundColor Green
Write-Host "NOTE: If you are not authenticated, a browser window will pop up asking you to log in to GitHub." -ForegroundColor Yellow
& $GitExe push -u origin main --force

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n=======================================================" -ForegroundColor Green
    Write-Host "SUCCESS: Your project has been successfully uploaded to GitHub!" -ForegroundColor Green
    Write-Host "=======================================================" -ForegroundColor Green
} else {
    Write-Host "`nError: Failed to push to GitHub. Please check your internet connection or credentials." -ForegroundColor Red
}
