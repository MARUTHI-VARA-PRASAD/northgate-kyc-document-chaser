# Northgate KYC Document Chaser

Deployable static prototype for the Northgate corporate KYC onboarding workflow.

## What is included

- Consolidated missing-document checklist for the RM.
- Generated email draft that updates as document status changes.
- Explicit RM review and approval gate. The prototype never sends email automatically.
- Three-day follow-up interaction simulation.
- Executive metrics and JTBD context from the supplied brief.
- Demo state persistence in the browser with `localStorage`.

The prototype uses synthetic case data only. It is not a production KYC decisioning or document-authenticity system.

## Deploy to Google Cloud Run

Cloud Run serves the Dockerized static frontend. The included
[Dockerfile](./Dockerfile) builds the app and serves it with Nginx on port 8080.

### One-time GCP setup

Install the [Google Cloud CLI](https://cloud.google.com/sdk/docs/install), then
authenticate and select your project:

```powershell
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
gcloud services enable run.googleapis.com artifactregistry.googleapis.com iamcredentials.googleapis.com
gcloud artifacts repositories create northgate-apps --repository-format=docker --location=us-central1
```

The repository is created only once. If it already exists, continue to the next
step. For a different region, use the same region consistently in the commands
and GitHub variable below.

For GitHub Actions, use keyless authentication instead of storing a service
account JSON key:

1. Create a deployer service account in IAM, for example
   `northgate-github-deployer`.
2. Grant it `Cloud Run Admin` and `Artifact Registry Writer` at the project
   level. Grant it `Service Account User` on the Cloud Run runtime service
   account (usually the default compute service account).
3. Create a Workload Identity Federation pool and GitHub OIDC provider. Set
   the provider attribute condition to your repository, such as
   `assertion.repository == 'YOUR_GITHUB_OWNER/YOUR_REPOSITORY'`.
4. Allow that repository to impersonate the deployer service account:

```powershell
gcloud iam service-accounts add-iam-policy-binding `
  northgate-github-deployer@YOUR_PROJECT_ID.iam.gserviceaccount.com `
  --role=roles/iam.workloadIdentityUser `
  --member="principalSet://iam.googleapis.com/projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/GITHUB_POOL/attribute.repository/YOUR_GITHUB_OWNER/YOUR_REPOSITORY"
```

In the GitHub repository, add these settings:

- **Variable** `GCP_PROJECT_ID`: your GCP project ID.
- **Variable** `GCP_REGION`: `us-central1` (optional; this is the default).
- **Secret** `GCP_WORKLOAD_IDENTITY_PROVIDER`: the full provider resource name.
- **Secret** `GCP_SERVICE_ACCOUNT`: the deployer service-account email.

The [deploy workflow](./.github/workflows/deploy.yml) runs the build and Docker
smoke test for pull requests. A push to `main` builds and pushes an immutable
image to Artifact Registry and deploys it to Cloud Run. It can also be started
manually with `workflow_dispatch`.

### Manual Cloud Build deployment

If you prefer the Google Cloud CLI for a one-off deployment, enable Cloud Build
and run:

```powershell
gcloud services enable cloudbuild.googleapis.com
gcloud builds submit --config cloudbuild.yaml .
```

The build deploys the container to Cloud Run and prints the service URL. To use another region:

```powershell
gcloud builds submit --config cloudbuild.yaml . --substitutions=_REGION=europe-west1
```

For a private internal prototype, remove `--allow-unauthenticated` from `cloudbuild.yaml` and configure Cloud Run IAM for the intended users.

## Run locally

This is a Vite + TypeScript frontend application. Install dependencies locally
and run the Vite development server:

```powershell
npm install
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`.

Create a production build with:

```powershell
npm run build
```

The compiled frontend is written to `dist/`.

If Docker is available:

```powershell
docker build -t northgate-kyc-chaser .
docker run --rm -p 8080:8080 northgate-kyc-chaser
```

The browser prototype uses synthetic case data and persists the current demo
state in `localStorage`. It does not send email or upload documents. The RM
approval step intentionally remains a human-in-the-loop gate.

## GitHub Actions deployment

The [`pages.yml`](.github/workflows/pages.yml) workflow builds the TypeScript
application and deploys the `dist/` output to GitHub Pages after a push to
`main`. Pull requests run the build job only; `workflow_dispatch` can be used
to start the workflow manually.

To enable it:

1. Push this project to a GitHub repository.
2. Open **Settings > Pages**.
3. Set **Source** to **GitHub Actions**.
4. Push to `main` or run the **Build & Deploy TypeScript App to GitHub Pages**
   workflow manually.

The published URL will be:

```text
https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPOSITORY_NAME/
```

No GCP project, service-account credential, Docker registry, or GitHub secret is
needed for GitHub Pages.

The deployment workflow is CI/CD and does not use a long-lived GCP key.

## One-time local deployment

If you have a Google Cloud service-account JSON file but have not configured
GitHub yet, use the included PowerShell deployment helper:

1. Install the [Google Cloud CLI](https://cloud.google.com/sdk/docs/install).
   Docker Desktop is not required for this deployment because Google Cloud
   Build builds the image remotely.
2. Open `.env` and set `GCP_PROJECT_ID` to your company GCP project ID.
3. Run `gcloud auth login` when the deployment script opens the Google sign-in page.
4. Run:

```powershell
.\deploy.ps1
```

The deployment uses your signed-in Google account and Google Cloud Build, so no
service-account JSON file is required. The `.env` file is excluded by
`.gitignore`.
