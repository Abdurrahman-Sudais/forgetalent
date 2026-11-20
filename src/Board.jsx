import React, {useEffect, useState} from 'react';
import {flushSync} from 'react-dom';
import site from './content.js';
import {JOB, STAGES, candidates, pastHires, people, roles, workforce} from './data.js';
import {act, can, initial, interviewGuide, jobDescription, score, workforceForecast} from './engine.js';
import {vt} from './fx.js';
import {Logo} from './App.jsx';

const KEY = 'forgetalent-board-v1';

export default function Board() {
  const [state, setState] = useState(() => initial(candidates, roles));
  const [tab, setTab] = useState('cands');
  const [sel, setSel] = useState('C1');
  const [msg, setMsg] = useState('');
  const [move, setMove] = useState({});
  useEffect(() => { try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s?.cands) setState(s); } catch { /* ignore */ } }, []);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ } }, [state]);

  const actor = people[state.role];
  const allow = (p) => can(roles, state.role, p);
  const run = (a, after) => { const r = act(state, a, {roles, actor, stages: STAGES}); setMsg(r.ok ? '' : r.error); if (r.ok) { setState(r.state); after?.(); } };
  const go = (t) => vt(() => flushSync(() => { setTab(t); setMsg(''); }));
  const name = (c) => (state.blind ? `Candidate ${c.id.slice(1)}` : c.name);
  const ranked = state.cands.map((c) => ({c, s: score(c.text)})).sort((a, b) => b.s.pct - a.s.pct);
  const cur = state.cands.find((c) => c.id === sel); const cs = score(cur.text); const guide = interviewGuide(cur.text);
  const jd = jobDescription(); const fc = workforceForecast(workforce);
  const m = move[sel] || {};
  const exportCsv = () => { const rows = [['candidate', 'source', 'match %', 'missing must-haves', 'stage', 'reason'], ...ranked.map(({c, s}) => [name(c), c.source, s.pct, s.missingMust.join('; '), c.stage, c.reason || ''])].map((r) => r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(',')); const url = URL.createObjectURL(new Blob([rows.join('\n')], {type: 'text/csv'})); const a = document.createElement('a'); a.href = url; a.download = 'forgetalent-pipeline.csv'; a.click(); URL.revokeObjectURL(url); };

  return (
    <div className="sb">
      <header className="sb-top">
        <a href="/" className="brand" aria-label="Back to the ForgeTalent website"><Logo size={26} /><span>ForgeTalent</span></a>
        <span className="mono">{JOB.id} · {JOB.title} · {JOB.location}</span>
        <label className="sb-chk"><input type="checkbox" checked={state.blind} onChange={(e) => run({type: 'blind', value: e.target.checked})} /> Blind review</label>
        <label className="sb-role">Signed in as <select value={state.role} onChange={(e) => run({type: 'role', role: e.target.value})}>{roles.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}</select></label>
        <button className="btn ghost sm" onClick={() => { setState(initial(candidates, roles)); setMsg(''); }}>Reset</button>
      </header>
      <p className="sb-banner">Fictional CVs. Evidence is organised for recruiters; people make every hiring decision.</p>
      <main className="sb-main">
        <div className="sb-head"><h1>{site.app.title}</h1><div className="sb-tabs" role="tablist">{[['cands', 'Candidates'], ['pipe', 'Pipeline'], ['job', 'Job description'], ['wf', 'Workforce'], ['rep', 'Reporting']].map(([id, l]) => <button key={id} role="tab" aria-selected={tab === id} className={tab === id ? 'on' : ''} onClick={() => go(id)}>{l}</button>)}</div></div>
        {msg && <p className="sb-err" role="alert">{msg}</p>}

        {tab === 'cands' && (<div className="sb-grid">
          <aside className="sb-card"><h2>By evidence match</h2><ul className="rank">{ranked.map(({c, s}) => <li key={c.id}><button className={c.id === sel ? 'on' : ''} onClick={() => setSel(c.id)}><span className="pct" style={{'--p': s.pct}}>{s.pct}</span><span><b>{name(c)}</b><small>{c.stage}{s.missingMust.length ? ` · ${s.missingMust.length} must-have to explore` : ''}</small></span></button></li>)}</ul>
            {allow('export') && <button className="btn ghost sm" onClick={exportCsv}>Export (CSV)</button>}</aside>
          <section className="sb-card" key={sel}>
            <p className="mono">{cur.source} · stage: {cur.stage}</p><h2>{name(cur)} <small>{cs.pct}% match</small></h2>
            <ul className="skills">{cs.ex.map((e) => <li key={e.req.id} className={!e.found ? 'is-miss' : e.meets ? 'is-ok' : 'is-weak'}><div><b>{e.req.label}</b>{e.req.must && <em>must</em>}<small>{!e.found ? 'Not shown in the CV' : e.meets ? `Shown${e.years ? ` · ${e.years} years` : ''}` : 'Shown, below the bar'}</small></div>{e.found && <blockquote>“{e.evidence}”</blockquote>}</li>)}</ul>
            <h3>Move in the pipeline</h3>
            <div className="row"><select aria-label="New stage" value={m.stage ?? ''} onChange={(e) => setMove({...move, [sel]: {...m, stage: e.target.value}})} disabled={!allow('move')}><option value="">Choose a stage…</option>{STAGES.filter((s) => s !== cur.stage).map((s) => <option key={s}>{s}</option>)}</select>
              <input aria-label="Reason" placeholder="Reason for this decision (required)" value={m.reason ?? ''} onChange={(e) => setMove({...move, [sel]: {...m, reason: e.target.value}})} disabled={!allow('move')} />
              <button className="btn sm" disabled={!allow('move')} onClick={() => run({type: 'move', id: sel, stage: m.stage, reason: m.reason}, () => setMove({...move, [sel]: {}}))}>Move</button></div>
            {cur.reason && <p className="ok">Last decision by {cur.by}: “{cur.reason}”</p>}
          </section>
          <aside className="sb-card"><h2>Interview guide</h2><ol className="guide">{guide.map((g) => <li key={g.skill}><b>{g.skill}</b><small>{g.why}</small><ul>{g.questions.map((q) => <li key={q}>{q}</li>)}</ul></li>)}</ol></aside>
        </div>)}

        {tab === 'pipe' && (<div className="kanban">{STAGES.map((st) => <section key={st} className="col"><h3>{st} <span>{state.cands.filter((c) => c.stage === st).length}</span></h3>{state.cands.filter((c) => c.stage === st).map((c) => <button key={c.id} className="kcard" onClick={() => { setSel(c.id); go('cands'); }}><b>{name(c)}</b><small>{score(c.text).pct}% · {c.source}</small></button>)}</section>)}</div>)}

        {tab === 'job' && (<section className="sb-card jd"><p className="mono">Generated from the requirements · review before publishing</p><h2>{jd.title}</h2><p>{jd.intro}</p><h3>You will need</h3><ul>{jd.must.map((x) => <li key={x}>{x}</li>)}</ul><h3>Nice to have</h3><ul>{jd.nice.map((x) => <li key={x}>{x}</li>)}</ul><p className="note">{jd.note}</p></section>)}

        {tab === 'wf' && (<section className="sb-card"><h2>Hires needed next year</h2><table className="tbl"><thead><tr><th scope="col">Role family</th><th scope="col">Now</th><th scope="col">Planned</th><th scope="col">Expected leavers</th><th scope="col">Hires needed</th></tr></thead><tbody>{fc.map((r) => <tr key={r.family}><th scope="row">{r.family}</th><td>{r.now}</td><td>{r.target}</td><td>{r.leavers}</td><td><b>{r.hires}</b></td></tr>)}</tbody></table><p className="fine">Planned growth plus attrition at each family’s historical rate (fictional).</p></section>)}

        {tab === 'rep' && (<section className="sb-card"><h2>Recruitment reporting</h2><dl className="kpis">{STAGES.map((st) => <div key={st}><dt>{st}</dt><dd>{state.cands.filter((c) => c.stage === st).length}</dd></div>)}</dl><h3>Recent hires · days to hire</h3><ul className="hires">{pastHires.map((h) => <li key={h.role}><span>{h.role}<small>{h.source}</small></span><i style={{width: `${(h.days / 60) * 100}%`}} /><b>{h.days} d</b></li>)}</ul></section>)}

        <aside className="sb-log"><h2>Decision log</h2><ul>{state.log.slice(0, 8).map((l, i) => <li key={i}><time>{new Date(l.at).toLocaleTimeString()}</time> <b>{l.actor}</b> · {l.summary}</li>)}{!state.log.length && <li className="fine">Every pipeline decision and its reason appears here.</li>}</ul></aside>
      </main>
    </div>
  );
}
