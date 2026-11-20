# Architecture

Status: **proposed**. The website and the prototype run entirely in the browser on fictional data. None of the AWS services below are deployed or connected.

## Today: browser-only prototype

- Vite + React, server-rendered to static HTML for every route (`scripts/prerender.mjs`).
- Fictional jobs, CVs and hiring history live in `src/data.js`; skills extraction, matching, interview guides, pipeline rules and the workforce forecast are pure functions in `src/engine.js`, tested with `node --test`.
- Changes persist in `localStorage`; roles are switched in the UI, not authenticated.

## Why AWS

ForgeTalent is a proposed AI recruitment and workforce planning platform for agencies, growing companies and HR departments. It reads CVs and application documents at volume, and every extracted skill must stay linked to its evidence. Designing on AWS lets extraction, interpretation, workflows and forecasting run as managed services, with each organisation’s candidate data protected and isolated.

## Proposed production service

| Stage | Services | What happens |
|---|---|---|
| 1. Upload | Amazon S3 | CVs and application documents are stored encrypted, separated by organisation and role. |
| 2. Extract | Amazon Textract, AWS Lambda | Text, sections and dates are read from PDFs and scans; Lambda runs the processing steps. |
| 3. Interpret | Amazon Bedrock | Skills, experience and evidence quotes are extracted against the job's requirements; interview guides are drafted. |
| 4. Workflow | Amazon DynamoDB | Jobs, requirements, candidates, pipeline stages and recruiter decisions are stored with their history. |
| 5. Forecast | Amazon SageMaker AI | Workforce models project hiring needs from growth plans and attrition. |
| Across every stage | AWS Lambda, AWS KMS, Amazon Cognito, Amazon CloudWatch | AWS Lambda runs document processing; AWS KMS encrypts candidate data; Amazon Cognito separates recruiter and hiring-manager roles; Amazon CloudWatch monitors jobs and APIs |

### Services and their role

- **Amazon Bedrock** — Summarises CVs against requirements with evidence quotes and drafts structured interview guides.
- **Amazon Textract** — Extracts text, sections and dates from CVs and application documents.
- **Amazon SageMaker AI** — Trains and hosts workforce demand forecasting models.
- **Amazon S3** — Stores protected recruitment documents, encrypted per organisation.
- **Amazon DynamoDB** — Holds jobs, requirements, candidates, pipeline stages and decisions.
- **AWS Lambda** — Runs document processing and pipeline workflows.
- **Amazon Cognito** — Signs users in and separates recruiter, hiring-manager and admin roles.
- **AWS KMS** — Encrypts candidate data with customer-specific keys.
- **Amazon CloudWatch** — Collects logs and metrics for processing jobs and APIs.

The same lists live in `src/aws.js` and are shown on the home page (`#technology`).

### Design rules

1. **Recruiters decide.** ForgeTalent organises evidence; human recruiters review candidates and own every hiring decision.
2. **Evidence, not guesses.** Every skill shown links to the sentence in the CV it came from; nothing is inferred from names, photos, age or background.
3. **Missing is not rejected.** A missing requirement is flagged for the interview, never used to reject a candidate automatically.
4. **Isolated by customer.** Each organisation's applications sit in their own encrypted partition with role checks on every request.

## Website lead capture

The pilot and contact forms post to HubSpot (see `docs/crm-plan.md`). If a server-side intake is needed later, Amazon API Gateway + AWS Lambda can validate submissions and Amazon SES can notify the founder.
