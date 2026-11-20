// Fictional hiring data for the skills-board prototype: one open role, six CVs and hiring history.
// Candidates and CV text are invented. No demographic information is stored or used.

export const JOB = {
  id: 'J-204', title: 'Senior Data Analyst', team: 'Insights', location: 'Lagos (hybrid)',
  summary: 'Turn product and sales data into decisions the leadership team can act on.',
  requirements: [
    {id: 'sql', label: 'SQL', weight: 3, must: true, years: 3, keys: ['sql', 'postgres', 'bigquery', 'mysql']},
    {id: 'python', label: 'Python for analysis', weight: 2, must: false, years: 2, keys: ['python', 'pandas', 'jupyter']},
    {id: 'bi', label: 'Dashboards (Power BI / Tableau / Looker)', weight: 2, must: true, years: 2, keys: ['power bi', 'tableau', 'looker', 'dashboard']},
    {id: 'stats', label: 'Statistics and experiments', weight: 2, must: false, years: 1, keys: ['a/b test', 'experiment', 'regression', 'statistic']},
    {id: 'etl', label: 'Data pipelines (ETL)', weight: 1, must: false, years: 1, keys: ['etl', 'pipeline', 'airflow', 'dbt']},
    {id: 'comms', label: 'Stakeholder communication', weight: 2, must: true, years: 0, keys: ['presented', 'stakeholder', 'workshop', 'led a team']},
  ],
};

const C = (id, name, source, text) => ({id, name, source, text, stage: 'Applied'});
export const candidates = [
  C('C1', 'Adaeze Okafor', 'Referral', 'Data analyst with 5 years of SQL experience in Postgres and BigQuery at a fintech. Built Looker dashboards used weekly by the leadership team. Wrote Python and pandas notebooks for churn analysis. Ran A/B tests on onboarding flows and presented results to stakeholders every month.'),
  C('C2', 'Tobi Bankole', 'Job board', 'Business intelligence developer. 4 years building Power BI dashboards for retail clients. Designed ETL pipelines with Airflow and dbt. Strong SQL (MySQL, 4 years). Ran stakeholder workshops to gather requirements.'),
  C('C3', 'Musa Danjuma', 'LinkedIn', 'Recent statistics graduate. Used Python and Jupyter for coursework; regression and experiment design in final-year project. Internship building a Tableau dashboard for a logistics company. Basic SQL from online courses.'),
  C('C4', 'Ifeoma Nwankwo', 'Agency', 'Analytics lead with 7 years of SQL in Postgres. Presented quarterly insights to leadership and led a team of three analysts. Built Tableau dashboards and an ETL pipeline in dbt. Some Python for automation.'),
  C('C5', 'Kunle Ajayi', 'Job board', 'Marketing coordinator who managed social media campaigns and reported weekly numbers in spreadsheets. Presented campaign results to the marketing team. Interested in moving into data analysis.'),
  C('C6', 'Grace Eze', 'Referral', 'Data scientist with 3 years of Python and pandas, building regression models and running experiments for pricing. SQL in BigQuery for 3 years. Created dashboards in Looker for the product team.'),
];

export const STAGES = ['Applied', 'Screen', 'Interview', 'Offer', 'Hired', 'Not progressing'];

/** Headcount by role family and the plan for next year (for the workforce forecast). */
export const workforce = [
  {family: 'Engineering', now: 42, growth: 0.25, attrition: 0.14},
  {family: 'Data & analytics', now: 11, growth: 0.35, attrition: 0.12},
  {family: 'Sales', now: 26, growth: 0.15, attrition: 0.22},
  {family: 'Customer support', now: 18, growth: 0.1, attrition: 0.28},
  {family: 'Operations', now: 14, growth: 0.05, attrition: 0.1},
];

/** Past hires: days from application to each stage (for reporting). */
export const pastHires = [{role: 'Backend Engineer', days: 34, source: 'Referral'}, {role: 'Product Designer', days: 41, source: 'Agency'}, {role: 'Data Analyst', days: 29, source: 'Referral'}, {role: 'Sales Lead', days: 52, source: 'Job board'}, {role: 'Support Specialist', days: 21, source: 'Job board'}, {role: 'Data Engineer', days: 38, source: 'LinkedIn'}];

export const roles = [
  {id: 'recruiter', label: 'Recruiter', can: ['move', 'job', 'export']},
  {id: 'manager', label: 'Hiring Manager', can: ['move']},
  {id: 'hr', label: 'HR Director', can: ['job', 'export']},
  {id: 'viewer', label: 'Viewer', can: []},
];
export const people = {recruiter: 'Bimpe Lawal', manager: 'Emeka Obi', hr: 'Folake Ade', viewer: 'Guest'};
