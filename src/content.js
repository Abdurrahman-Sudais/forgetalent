// ForgeTalent — site facts used by the pages, the prerender step and the tests.
// A proposed product: features, integrations and AWS services are planned until implemented and verified.
const site = {
  name: 'ForgeTalent',
  slug: 'forgetalent',
  tagline: 'Build stronger teams through skills intelligence.',
  about: 'ForgeTalent is a proposed recruitment and workforce intelligence platform that helps organisations understand candidate skills, organise recruitment workflows and identify workforce development needs. Human recruiters review the evidence and make every hiring decision.',
  url: 'https://forgetalent.top',
  email: 'michael@forgetalent.top',
  team: [
    {name: 'Michael Adeyemi', role: 'Founder', initials: 'MA', bio: 'Michael founded ForgeTalent after watching strong candidates fall through keyword filters while recruiters drowned in CVs. Michael leads product, customers and every pilot, with a focus on skills-based, fair hiring.', focus: ['Product', 'Skills-based hiring', 'Customer pilots']},
    {name: "Kemi Oladipo", role: "Co-founder", initials: "KO", bio: "Kemi leads customer success at ForgeTalent: onboarding recruitment agencies and HR teams, shaping structured, skills-based hiring workflows and turning recruiter feedback into product changes.", focus: ["Talent acquisition", "Pilot onboarding", "Fair hiring practice"]},
    {name: "Chinedu Okafor", role: "CTO", initials: "CO", bio: "Chinedu leads engineering: CV parsing, evidence-linked skills extraction, matching, interview guides, workforce forecasting and the AWS platform it runs on.", focus: ["Platform architecture", "Skills extraction", "AWS infrastructure"]},
  ],
  app: {
    title: 'Skills board',
    subtitle: 'Review six fictional CVs against a role’s requirements: evidence-linked skills, blind review, interview guides, the pipeline, a job description and a workforce forecast.',
  },
};
export default site;
