import test from 'node:test';
import assert from 'node:assert/strict';
import site from '../src/content.js';
import {JOB, STAGES, candidates, people, roles, workforce} from '../src/data.js';
import {act, extract, initial, interviewGuide, jobDescription, score, workforceForecast} from '../src/engine.js';

test('every found skill carries the exact CV sentence as evidence', () => {
  for (const c of candidates) for (const e of extract(c.text)) if (e.found) assert.ok(c.text.includes(e.evidence));
  const ex = extract(candidates[0].text).find((e) => e.req.id === 'sql');
  assert.equal(ex.years, 5); assert.ok(ex.meets);
});

test('scores reward evidence; weak claims count half; missing must-haves are flagged, not rejected', () => {
  const s1 = score(candidates[0].text); const s5 = score(candidates[4].text);
  assert.ok(s1.pct > s5.pct && s1.pct >= 90);
  assert.deepEqual(s5.missingMust.sort(), ['Dashboards (Power BI / Tableau / Looker)', 'SQL'].sort());
  const sql3 = extract(candidates[2].text).find((e) => e.req.id === 'sql');
  assert.ok(sql3.found && !sql3.meets, 'basic SQL from online courses is below the bar');
});

test('interview guides cover every requirement; job description and forecast are complete', () => {
  assert.equal(interviewGuide(candidates[1].text).length, JOB.requirements.length);
  const jd = jobDescription(); assert.ok(jd.must.length + jd.nice.length === JOB.requirements.length && /photos/.test(jd.note));
  const f = workforceForecast(workforce); assert.ok(f.every((r) => r.hires >= r.leavers));
});

test('pipeline moves need a reason and the right role; blind review is the default', () => {
  const ctx = (s) => ({roles, actor: people[s.role], stages: STAGES});
  let s = initial(candidates, roles);
  assert.equal(s.blind, true);
  assert.match(act(s, {type: 'move', id: 'C1', stage: 'Screen', reason: 'good'}, ctx(s)).error, /reason/);
  s = act(s, {type: 'move', id: 'C1', stage: 'Screen', reason: 'Strong SQL and Looker evidence'}, ctx(s)).state;
  assert.equal(s.cands[0].stage, 'Screen');
  const hr = act(s, {type: 'role', role: 'hr'}, ctx(s)).state;
  assert.equal(act(hr, {type: 'move', id: 'C2', stage: 'Screen', reason: 'Power BI and ETL evidence'}, ctx(hr)).ok, false);
});

test('founder and contact', () => {
  assert.equal(site.team[0].name, 'Michael Adeyemi');
  assert.equal(site.email, 'michael@forgetalent.top');
});
