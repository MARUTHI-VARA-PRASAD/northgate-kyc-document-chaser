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

From this directory, set a Google Cloud project and enable the required APIs:

```powershell
gcloud config set project YOUR_PROJECT_ID
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com
gcloud artifacts repositories create northgate-apps --repository-format=docker --location=us-central1
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

The [`deploy.yml`](.github/workflows/deploy.yml) workflow is retained for a
future Cloud Run deployment but is manual-only until GCP credentials are
configured.

Configure these repository settings before enabling deployment:

- Add a `GCP_SA_KEY` Actions secret containing a Google Cloud service-account
  key with permissions to create/use Artifact Registry repositories and deploy
  Cloud Run services.
- Optionally add a `GCP_REGION` Actions variable. It defaults to
  `us-central1`.
- Enable the Cloud Run, Artifact Registry, and IAM Credentials APIs in the
  target Google Cloud project.

## One-time local deployment

If you have a Google Cloud service-account JSON file but have not configured
GitHub yet, use the included PowerShell deployment helper:

1. Install and start [Google Cloud CLI](https://cloud.google.com/sdk/docs/install)
   and [Docker Desktop](https://www.docker.com/products/docker-desktop/).
2. Copy `deploy.local.ps1.example` to `deploy.local.ps1`.
3. Fill in the project ID and the path to your credential JSON file.
4. Run:

```powershell
.\deploy.ps1
```

The local configuration and credential files are excluded by `.gitignore`.
Never commit a service-account JSON file or paste its contents into chat.
