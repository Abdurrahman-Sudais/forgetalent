// ForgeTalent rules: extract skills from CV text with the sentence that proves each one, score candidates
// against weighted requirements (missing items flagged, never auto-rejected), draft structured interview guides,
// write a job description, move candidates through the pipeline with reasons, and forecast hiring needs.
import {JOB} from './data.js';

export const can = (roles, roleId, perm) => !!roles.find((r) => r.id === roleId)?.can.includes(perm);
const sentences = (t) => t.split(/(?<=\.)\s+/);

/** For each requirement: the evidence sentence, years if stated, and whether it meets the bar. */
export function extract(text, job = JOB) {
  const ss = sentences(text);
  return job.requirements.map((r) => {
    // Try keys in priority order so the most specific sentence wins.
    let hit = null;
    for (const k of r.keys) { hit = ss.find((s) => s.toLowerCase().includes(k)); if (hit) break; }
    if (!hit) return {req: r, found: false};
    const ym = hit.match(/(\d+)\+?\s+years?/i);
    const years = ym ? Number(ym[1]) : null;
    const weak = /basic|online course|coursework|some|interested/i.test(hit);
    const meets = !weak && (r.years === 0 || years === null || years >= r.years);
    return {req: r, found: true, evidence: hit, years, weak, meets};
  });
}

/** Weighted coverage: full credit when the bar is met, half when present but below it. */
export function score(text, job = JOB) {
  const ex = extract(text, job);
  const max = job.requirements.reduce((s, r) => s + r.weight, 0);
  const got = ex.reduce((s, e) => s + (e.found ? (e.meets ? 1 : 0.5) * e.req.weight : 0), 0);
  return {pct: Math.round((got / max) * 100), ex, missingMust: ex.filter((e) => e.req.must && !e.found).map((e) => e.req.label), gaps: ex.filter((e) => !e.found || !e.meets)};
}

const Q = {
  sql: ['Walk us through a query you wrote that you are proud of: tables, joins and why.', 'How would you find the top 10% of customers by revenue each month?'],
  python: ['Describe an analysis you automated in Python. What would you change now?'],
  bi: ['Show us a dashboard you built. Who used it, and what decision did it change?'],
  stats: ['How would you decide whether an A/B test result is real or noise?'],
  etl: ['Tell us about a data pipeline that broke. How did you find and fix it?'],
  comms: ['Tell us about a time an analysis changed a stakeholder’s mind.', 'How do you explain uncertainty to a non-technical audience?'],
};

/** Structured interview guide: verify claims for strengths, probe gaps; same core questions for everyone. */
export function interviewGuide(text, job = JOB) {
  const {ex} = score(text, job);
  return ex.map((e) => ({skill: e.req.label, why: !e.found ? 'Not shown in the CV — explore' : !e.meets ? 'Below the stated bar — probe depth' : 'Shown in the CV — verify with an example', questions: Q[e.req.id] || []}));
}

export function jobDescription(job = JOB) {
  const must = job.requirements.filter((r) => r.must); const nice = job.requirements.filter((r) => !r.must);
  return {title: `${job.title} · ${job.team} · ${job.location}`, intro: job.summary, must: must.map((r) => `${r.label}${r.years ? ` (${r.years}+ years)` : ''}`), nice: nice.map((r) => `${r.label}${r.years ? ` (${r.years}+ years)` : ''}`), note: 'We assess skills from your experience. Tell us what you have done; we do not ask for photos, age or marital status.'};
}

/** Hires needed next year per role family: growth plus expected leavers. */
export function workforceForecast(rows) {
  return rows.map((r) => { const target = Math.round(r.now * (1 + r.growth)); const leavers = Math.round(r.now * r.attrition); return {...r, target, leavers, hires: target - r.now + leavers}; });
}

export function initial(candidates, roles) { return {cands: structuredClone(candidates), blind: true, log: [], role: roles[0].id}; }
const now = () => new Date().toISOString();

export function act(state, a, {roles, actor, stages}) {
  const fail = (error) => ({state, ok: false, error});
  if (a.type === 'role') return {state: {...state, role: a.role}, ok: true};
  if (a.type === 'blind') return {state: {...state, blind: !!a.value}, ok: true};
  const allow = (p) => can(roles, state.role, p);
  const log = (id, summary, patch) => ({ok: true, state: {...state, ...patch, log: [{at: now(), actor, role: state.role, id, summary}, ...state.log]}});
  if (a.type === 'move') {
    if (!allow('move')) return fail('Only recruiters and hiring managers move candidates.');
    const c = state.cands.find((x) => x.id === a.id); if (!c) return fail('Candidate not found.');
    if (!stages.includes(a.stage)) return fail('Unknown stage.');
    const why = (a.reason || '').trim();
    if (why.length < 10) return fail('Record the reason for this decision (at least 10 characters) — it keeps the process fair and auditable.');
    if (a.stage === 'Offer' && state.role !== 'recruiter' && state.role !== 'manager') return fail('Offers need a recruiter or hiring manager.');
    return log(c.id, `${c.stage} → ${a.stage} — ${why}`, {cands: state.cands.map((x) => (x.id === c.id ? {...x, stage: a.stage, reason: why, by: actor} : x))});
  }
  return fail('Unknown action.');
}
