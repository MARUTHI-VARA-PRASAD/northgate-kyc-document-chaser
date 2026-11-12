$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$envPath = Join-Path $root ".env"

if (-not (Test-Path -LiteralPath $envPath -PathType Leaf)) {
  throw "Missing .env. Open .env and set GCP_PROJECT_ID before deploying."
}

$settings = @{}
Get-Content -LiteralPath $envPath | ForEach-Object {
  $line = $_.Trim()
  if ([string]::IsNullOrWhiteSpace($line) -or $line.StartsWith("#")) {
    return
  }

  $separator = $line.IndexOf("=")
  if ($separator -lt 1) {
    throw "Invalid .env line. Expected KEY=VALUE."
  }

  $name = $line.Substring(0, $separator).Trim()
  $value = $line.Substring($separator + 1).Trim()
  if ($value.Length -ge 2 -and (($value.StartsWith('"') -and $value.EndsWith('"')) -or ($value.StartsWith("'") -and $value.EndsWith("'")))) {
    $value = $value.Substring(1, $value.Length - 2)
  }
  $settings[$name] = $value
}

$projectId = $settings["GCP_PROJECT_ID"]
$region = if ($settings["GCP_REGION"]) { $settings["GCP_REGION"] } else { "us-central1" }
$repository = if ($settings["ARTIFACT_REPOSITORY"]) { $settings["ARTIFACT_REPOSITORY"] } else { "northgate-apps" }

if ([string]::IsNullOrWhiteSpace($projectId) -or $projectId.StartsWith("YOUR_")) {
  throw "Set your GCP project ID in .env: GCP_PROJECT_ID=your-project-id"
}

if (-not (Get-Command gcloud -ErrorAction SilentlyContinue)) {
  throw "Google Cloud CLI is not installed. Install it from https://cloud.google.com/sdk/docs/install and run this script again."
}

Set-Location $root

Write-Host "Opening Google Cloud sign-in..."
& gcloud auth login
if ($LASTEXITCODE -ne 0) {
  throw "Google Cloud sign-in failed."
}

& gcloud config set project $projectId
if ($LASTEXITCODE -ne 0) {
  throw "Could not select project '$projectId'. Check the project ID and your company account access."
}

Write-Host "Enabling required Google Cloud services..."
& gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com --project=$projectId
if ($LASTEXITCODE -ne 0) {
  throw "Could not enable required services. Ask your GCP administrator for permission."
}

& gcloud artifacts repositories describe $repository --location=$region --project=$projectId *> $null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Creating Artifact Registry repository '$repository'..."
  & gcloud artifacts repositories create $repository --repository-format=docker --location=$region --project=$projectId --description="Northgate KYC Chaser Docker images"
  if ($LASTEXITCODE -ne 0) {
    throw "Could not create or access Artifact Registry repository '$repository'."
  }
}

Write-Host "Building and deploying with Google Cloud Build..."
& gcloud builds submit --config cloudbuild.yaml --project=$projectId --substitutions=_REGION=$region,_REPOSITORY=$repository .
if ($LASTEXITCODE -ne 0) {
  throw "Deployment failed. Review the Cloud Build error above."
}

$serviceUrl = & gcloud run services describe northgate-kyc-chaser --region=$region --project=$projectId --format="value(status.url)"
Write-Host ""
Write-Host "Deployment complete."
Write-Host "URL: $serviceUrl"
