$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$configPath = Join-Path $root "deploy.local.ps1"

if (-not (Test-Path -LiteralPath $configPath)) {
  throw "Missing deploy.local.ps1. Copy deploy.local.ps1.example, fill in the values, and run this script again."
}

. $configPath

$required = @{
  GcpProjectId = $GcpProjectId
  GcpRegion = $GcpRegion
  ArtifactRepository = $ArtifactRepository
  CloudRunService = $CloudRunService
  GcpCredentialsFile = $GcpCredentialsFile
}

foreach ($entry in $required.GetEnumerator()) {
  if ([string]::IsNullOrWhiteSpace([string]$entry.Value) -or [string]$entry.Value.StartsWith("YOUR_")) {
    throw "Set $($entry.Key) in deploy.local.ps1 before deploying."
  }
}

if (-not (Test-Path -LiteralPath $GcpCredentialsFile -PathType Leaf)) {
  throw "Credential file not found: $GcpCredentialsFile"
}

if (-not (Get-Command gcloud -ErrorAction SilentlyContinue)) {
  throw "gcloud CLI is not installed or not on PATH. Install Google Cloud CLI, restart PowerShell, and run this script again."
}

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  throw "Docker CLI is not installed or not on PATH. Install Docker Desktop, start it, and run this script again."
}

Set-Location $root

Write-Host "Authenticating to Google Cloud..."
& gcloud auth activate-service-account --key-file="$GcpCredentialsFile" --quiet
& gcloud config set project "$GcpProjectId" --quiet

Write-Host "Enabling required APIs..."
& gcloud services enable run.googleapis.com artifactregistry.googleapis.com --project="$GcpProjectId"

Write-Host "Creating or reusing Artifact Registry repository..."
& gcloud artifacts repositories create "$ArtifactRepository" `
  --repository-format=docker `
  --location="$GcpRegion" `
  --description="Docker repository for Northgate KYC Chaser" `
  --project="$GcpProjectId" `
  --quiet
if ($LASTEXITCODE -ne 0) {
  Write-Host "Repository already exists or could not be created; continuing to verify access."
}

& gcloud auth configure-docker "$GcpRegion-docker.pkg.dev" --quiet

Write-Host "Building TypeScript application..."
& npm ci
& npm run build

$image = "$GcpRegion-docker.pkg.dev/$GcpProjectId/$ArtifactRepository/$CloudRunService`:manual"

Write-Host "Building and pushing Docker image..."
& docker build --tag $image .
& docker push $image

Write-Host "Deploying to Cloud Run..."
& gcloud run deploy "$CloudRunService" `
  --image="$image" `
  --region="$GcpRegion" `
  --project="$GcpProjectId" `
  --platform=managed `
  --allow-unauthenticated `
  --port=8080 `
  --memory=256Mi `
  --cpu=1 `
  --min-instances=0 `
  --max-instances=5

$serviceUrl = & gcloud run services describe "$CloudRunService" `
  --region="$GcpRegion" `
  --project="$GcpProjectId" `
  --format="value(status.url)"

Write-Host ""
Write-Host "Deployment complete."
Write-Host "URL: $serviceUrl"
