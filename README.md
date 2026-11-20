# ForgeTalent

**Build stronger teams through skills intelligence.**

ForgeTalent is a proposed recruitment and workforce intelligence platform for recruitment agencies, corporate HR departments and technology companies. Its evidence-based skills system connects job requirements with documented candidate qualifications, organises recruitment workflows and identifies workforce development needs. Human recruiters review candidate information and make every hiring decision.

> ForgeTalent is a proposed product. Features, integrations and AWS services are planned until implemented and verified. Pricing is illustrative, and the prototype uses fictional data. Founder: **Michael Adeyemi**. Website: `forgetalent.top` · contact: `michael@forgetalent.top`.

## Design

The look is the forge: charcoal with film grain, molten orange-to-gold gradients, Syne for display type, Albert Sans for text and Space Mono for labels.

- **Hero:** a slow heat glow. On scroll, skill chips fly in from CVs and settle over a job-requirement card that tilts with the pointer.
- **Evidence:** an interactive panel where you pick a candidate to see CV sentences highlighted as evidence and a weighted-match ring.
- **Features:** an index list of all seven core features that fills with molten colour on hover.
- **Fair by design:** a light band listing what is never used to match or rank.
- **Workforce forecast:** bars per role family.
- **Who it's for:** target customers and decision-makers.
- **Pricing:** a recruiter-seat stepper with volume tiers.
- **Technology:** the planned AWS architecture (Bedrock, Textract, SageMaker AI, S3, DynamoDB, Lambda), with each service's role.
- **Closing sections:** founder, progress and the demo-request form, FAQ, contact form with a topic picker, and a molten wordmark footer.
- **Interactions:** an ember cursor that sends sparks flying on every click, magnetic buttons, a glowing scroll-progress bar and view-transition tabs in the prototype.

## Prototype (`/app`)

The skills board covers one fictional role (Senior Data Analyst) with six fictional CVs.

- **Skills extraction:** each requirement shows the exact CV sentence as evidence, plus years if stated. Weak claims ("basic", "coursework") count as below the bar.
- **Weighted matching:** must-haves and weights. Missing must-haves are flagged for the interview, never used to reject.
- **Blind review:** on by default, so names are hidden.
- **Interview guides:** structured per candidate, verifying strengths and probing gaps.
- **Pipeline:** a kanban from Applied to Hired. Every move needs a recorded reason, and only recruiters and hiring managers can move candidates.
- **Other tabs:** a job description generated from the requirements (with an inclusive note), a workforce forecast (growth plus attrition per role family), and recruitment reporting with CSV export.
- **Roles:** Recruiter, Hiring Manager, HR Director and Viewer.

Every decision in the prototype is made by a person and written to a log. Changes persist in the browser's `localStorage`, and motion is skipped for visitors who prefer reduced motion. All pages are server-rendered and readable without JavaScript.

## Structure

```
src/content.js      site facts and founder
src/data.js         fictional data and roles
src/engine.js       the prototype's rules (pure functions, tested)
src/aws.js          the planned AWS architecture shown on the home page
src/forms.js        demo-request and contact form rules and HubSpot payloads (tested)
src/fx.js           interaction layer: reveals, cursor, magnetic and tilt effects, progress bar
src/App.jsx         marketing pages · src/Board.jsx the prototype
docs/architecture.md  planned AWS architecture and design rules
docs/crm-plan.md      HubSpot forms, properties and pipeline
```

## Develop

```bash
npm install
npm run dev
```

```bash
npm run build   # Vite build, server render, static prerender of /, /app, /privacy, /terms and 404.html
npm test        # node --test
```

The output in `dist/` is fully static. Configs are included for Netlify/Cloudflare (`public/_headers`, `public/_redirects`) and Vercel (`vercel.json`).

Until HubSpot is configured, the forms keep requests in the browser and open a pre-filled email. To connect it, set `VITE_HUBSPOT_PORTAL_ID`, `VITE_HUBSPOT_FORM_GUID` and `VITE_HUBSPOT_CONTACT_FORM_GUID` (see `.env.example`), and update the privacy notice first.
