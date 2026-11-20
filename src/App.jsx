import React, {useState} from 'react';
import site from './content.js';
import {JOB, candidates, workforce} from './data.js';
import {score, workforceForecast} from './engine.js';
import {ACROSS, SERVICES, STAGES, WHY} from './aws.js';
import {PROGRESS} from './forms.js';
import Board from './Board.jsx';
import PilotForm from './PilotForm.jsx';
import ContactForm from './ContactForm.jsx';

export function Logo({size = 30}) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <rect width="40" height="40" rx="10" fill="#1a1816" />
      <path d="M13 29V11h14M13 20h10" stroke="url(#ftg)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <defs><linearGradient id="ftg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#ff4d1c" /><stop offset="1" stopColor="#ffc24a" /></linearGradient></defs>
    </svg>
  );
}

const CHIPS = ['SQL', 'Looker', 'A/B tests', 'Python', 'pandas', 'Stakeholders', 'BigQuery', 'dbt', 'Tableau', 'Regression'];
const FC = workforceForecast(workforce);

function Header() {
  const [open, setOpen] = useState(false);
  const links = [['Evidence', '/#evidence'], ['Features', '/#features'], ['Fairness', '/#fairness'], ['Workforce', '/#workforce'], ['Pricing', '/#pricing'], ['Contact', '/#contact']];
  return (
    <header className="hd">
      <a href="/" className="brand" aria-label="ForgeTalent home"><Logo /><span>ForgeTalent</span></a>
      <nav id="nav" className={open ? 'nav open' : 'nav'} aria-label="Main">
        {links.map(([t, h]) => <a key={t} href={h} onClick={() => setOpen(false)}>{t}</a>)}
        <a className="nav-app" href="/app" onClick={() => setOpen(false)}>Open the skills board</a>
      </nav>
      <a className="hd-cta" href="#demo" data-magnetic>Request a demo</a>
      <button className="menu" aria-expanded={open} aria-controls="nav" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="heat" aria-hidden="true" />
      <div className="hero-copy">
        <p className="tag" data-r>Skills intelligence for recruiters and HR teams</p>
        <h1 id="hero-title" data-r>Build stronger teams through <span className="molten">skills intelligence.</span></h1>
        <p className="lede" data-r>{site.about}</p>
        <div className="ctas" data-r><a className="btn" href="#demo" data-magnetic data-cursor="Demo">Request a demo</a><a className="btn ghost" href="/app" data-cursor="Try">Open the skills board</a></div>
      </div>
      <div className="anvil" data-r aria-label="Skills from CVs forged into a job requirement">
        <div className="chips" aria-hidden="true">{CHIPS.map((c, i) => <span key={c} style={{'--i': i, '--x': `${(i % 5) * 22 - 44}%`, '--y': `${Math.floor(i / 5) * 60 - 160}%`, '--r': `${(i * 37) % 30 - 15}deg`}}>{c}</span>)}</div>
        <div className="req" data-tilt>
          <p className="mono">Requirement · {JOB.title}</p>
          <ul>{JOB.requirements.map((r) => <li key={r.id}><span>{r.label}</span><b>{r.must ? 'must' : 'nice'}</b></li>)}</ul>
          <p className="req-foot">Matched against documented evidence — not keywords.</p>
        </div>
      </div>
    </section>
  );
}

function Evidence() {
  const [sel, setSel] = useState('C1');
  const c = candidates.find((x) => x.id === sel);
  const s = score(c.text);
  const hits = new Set(s.ex.filter((e) => e.found).map((e) => e.evidence));
  return (
    <section className="sec" id="evidence" aria-labelledby="ev-title">
      <p className="tag">The core differentiator</p>
      <h2 id="ev-title">Every skill linked to the sentence that proves it.</h2>
      <div className="ev">
        <div className="ev-pick" role="tablist" aria-label="Candidates">{candidates.slice(0, 4).map((x) => <button key={x.id} role="tab" aria-selected={sel === x.id} className={sel === x.id ? 'on' : ''} onClick={() => setSel(x.id)}>Candidate {x.id.slice(1)}</button>)}</div>
        <article className="cv" data-r><p className="mono">CV extract · fictional</p><p className="cv-t">{c.text.split(/(?<=\.)\s+/).map((t, i) => <span key={i} className={hits.has(t) ? 'hit' : ''}>{t} </span>)}</p></article>
        <aside className="ev-score" data-r>
          <div className="ring" style={{'--p': s.pct}}><b>{s.pct}%</b><small>weighted match</small></div>
          <ul>{s.ex.map((e) => <li key={e.req.id} className={!e.found ? 'is-miss' : e.meets ? 'is-ok' : 'is-weak'}><span>{e.req.label}</span><em>{!e.found ? 'not shown' : e.meets ? `shown${e.years ? ` · ${e.years} yrs` : ''}` : 'below bar'}</em></li>)}</ul>
          {s.missingMust.length > 0 && <p className="flag">Missing must-haves are flagged for the interview — never an automatic rejection.</p>}
        </aside>
      </div>
    </section>
  );
}

const FEATURES = [
  ['AI-assisted CV analysis', 'Skills, experience and dates read from each CV, with the quote behind every claim.'],
  ['Skills-based application matching', 'Weighted requirements with must-haves and bars; partial credit when below the bar.'],
  ['Job description creation', 'Clear descriptions generated from the requirements — with an inclusive note on what we never ask.'],
  ['Structured interview guides', 'The same core questions for everyone, plus probes for each candidate’s gaps.'],
  ['Recruitment pipeline management', 'Stages from applied to hired, with a recorded reason for every move.'],
  ['Workforce demand forecasting', 'Hires needed per role family from growth plans and expected attrition.'],
  ['Recruitment reporting', 'Pipeline counts, time to hire and sources, ready for leadership.'],
];

function Features() {
  return (
    <section className="sec" id="features" aria-labelledby="ft-title">
      <p className="tag">Core product features</p>
      <h2 id="ft-title">Seven tools, forged together.</h2>
      <ol className="index">{FEATURES.map(([t, d], i) => <li key={t} data-r style={{'--d': '0ms'}}><span className="n">{String(i + 1).padStart(2, '0')}</span><h3>{t}</h3><p>{d}</p><span className="arr" aria-hidden="true">→</span></li>)}</ol>
    </section>
  );
}

function Fairness() {
  return (
    <section className="sec fair" id="fairness" aria-labelledby="fa-title">
      <div className="fair-grid">
        <div><p className="tag">Fair by design</p><h2 id="fa-title">Judged on what people have done.</h2><p className="intro">ForgeTalent reads experience, not identity. Blind review hides names by default, and every decision needs a written reason.</p></div>
        <div className="never" data-r><p className="mono">Never used to match or rank</p><ul>{['Names and photos', 'Age or date of birth', 'Gender or marital status', 'Nationality or ethnicity', 'Address or school prestige'].map((x) => <li key={x}>{x}</li>)}</ul></div>
      </div>
    </section>
  );
}

function Workforce() {
  const max = Math.max(...FC.map((r) => r.hires));
  return (
    <section className="sec" id="workforce" aria-labelledby="wf-title">
      <div className="split">
        <div><p className="tag">Workforce demand forecasting</p><h2 id="wf-title">Know next year’s hiring before it’s urgent.</h2><p className="intro">Growth plans plus expected leavers give the hires each role family needs — so recruiting starts before the gap opens.</p></div>
        <ul className="wf" data-r>{FC.map((r) => <li key={r.family}><span>{r.family}<small>{r.now} now → {r.target} planned · {r.leavers} expected leavers</small></span><i style={{width: `${(r.hires / max) * 100}%`}} /><b>{r.hires}</b></li>)}</ul>
      </div>
    </section>
  );
}

function Who() {
  return (
    <section className="sec" aria-labelledby="who-title">
      <p className="tag">Target customers</p>
      <h2 id="who-title">For the people who build teams.</h2>
      <div className="who">{[['Recruitment agencies', 'Many clients and roles — consistent, evidence-backed shortlists.'], ['Corporate HR departments', 'Fair, documented processes and workforce plans leadership can trust.'], ['Technology companies', 'Skills over pedigree for fast-moving technical roles.']].map(([t, d]) => <article key={t} data-r data-tilt data-spot><h3>{t}</h3><p>{d}</p></article>)}</div>
      <p className="decision">Decision-makers — HR directors · recruitment managers · talent acquisition specialists</p>
    </section>
  );
}

function Pricing() {
  const [seats, setSeats] = useState(3);
  const tier = seats <= 2 ? ['Starter', 59] : seats <= 10 ? ['Team', 49] : ['Scale', 39];
  return (
    <section className="sec" id="pricing" aria-labelledby="pr-title">
      <div className="split">
        <div><p className="tag">Business model</p><h2 id="pr-title">Priced by recruiter seats and hiring volume.</h2><p className="intro">Per-seat subscriptions with volume tiers; advanced features such as workforce forecasting are included from Team. Illustrative pricing for a proposed product.</p></div>
        <div className="seat" data-r data-spot>
          <p className="mono">Recruiter seats</p>
          <div className="stepper"><button aria-label="Fewer seats" onClick={() => setSeats(Math.max(1, seats - 1))}>−</button><output aria-live="polite">{seats}</output><button aria-label="More seats" onClick={() => setSeats(Math.min(50, seats + 1))}>+</button></div>
          <p className="seat-p"><b>${(seats * tier[1]).toLocaleString()}</b><span>/ month · {tier[0]} · ${tier[1]} per seat</span></p>
          <ul><li>CV analysis and skills matching</li><li>Interview guides and pipeline</li><li className={seats > 2 ? '' : 'off'}>Workforce forecasting and reporting</li></ul>
          <a className="btn" href="#demo" data-magnetic>Request a demo</a>
        </div>
      </div>
    </section>
  );
}

function Technology() {
  return (
    <section className="sec" id="technology" aria-labelledby="tech-title">
      <p className="tag">Planned AWS infrastructure</p>
      <h2 id="tech-title">How we use Amazon Web Services.</h2>
      <p className="intro">{WHY}</p>
      <ol className="stages">{STAGES.map(([t, svcs, d], i) => <li key={t} data-r style={{'--d': `${i * 80}ms`}}><span className="n">{String(i + 1).padStart(2, '0')}</span><h3>{t}</h3><p className="svcs">{svcs.map((s) => <span key={s}>{s}</span>)}</p><p>{d}</p></li>)}</ol>
      <div className="across" data-r><p className="tag">Across every stage</p><ul>{ACROSS.map(([a, b]) => <li key={a}><b>{a}</b> {b}</li>)}</ul></div>
      <h3 className="sub">Services and their role in ForgeTalent</h3>
      <dl className="svc">{SERVICES.map(([a, b]) => <div key={a}><dt>{a}</dt><dd>{b}</dd></div>)}</dl>
      <p className="fine">Planned, not yet deployed. This website and the skills board run in your browser on fictional data.</p>
    </section>
  );
}

function Team() {
  const p = site.team[0];
  return <section className="sec" id="team" aria-labelledby="team-title"><div className="team" data-r><span className="av" aria-hidden="true">{p.initials}</span><div><p className="tag">Founder</p><h2 id="team-title">{p.name}</h2><p>{p.bio}</p><ul className="tags">{p.focus.map((f) => <li key={f}>{f}</li>)}</ul></div></div></section>;
}

function Demo() {
  return (
    <section className="sec" id="demo" aria-labelledby="demo-title">
      <div className="split top">
        <div><p className="tag">Progress & demos</p><h2 id="demo-title">See your next shortlist built on evidence.</h2><p className="intro">ForgeTalent is a proposed product in its building stage. A demo walks through job creation, CV analysis and the pipeline; early pilots start with a few live roles, with recruiters approving every decision.</p>
          <ol className="progress">{PROGRESS.map(([st, t, d]) => <li key={t} className={st === 'Next' ? 'next' : ''}><span>{st}</span><div><b>{t}</b><p>{d}</p></div></li>)}</ol></div>
        <div className="card-form" data-r><PilotForm submitLabel="Request a demo" /></div>
      </div>
    </section>
  );
}

const FAQ = [['Does ForgeTalent make hiring decisions?', 'No. It organises evidence and drafts interview guides; human recruiters review candidates and make every decision.'], ['What does it ignore?', 'Names, photos, age, gender, marital status, nationality, ethnicity, address and school prestige are never used to match or rank.'], ['Can a missing skill reject someone?', 'No. Missing requirements are flagged for the interview so candidates can show what the CV doesn’t.'], ['Is ForgeTalent live?', 'Not yet. It is a proposed product; the skills board is a prototype running in your browser on fictional CVs.']];
function Faq() { return <section className="sec" aria-labelledby="faq-title"><p className="tag">FAQ</p><h2 id="faq-title">Questions HR teams ask.</h2><div className="faq">{FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></section>; }

function Contact() {
  return (
    <section className="sec" id="contact" aria-labelledby="contact-title">
      <div className="split top"><div><p className="tag">Contact</p><h2 id="contact-title">Talk to ForgeTalent.</h2><p className="intro">Questions about the product, ATS integrations, fairness and data handling, or partnerships. Messages go directly to the founder.</p><p className="mail"><a href={`mailto:${site.email}`}>{site.email}</a></p></div><div className="card-form" data-r><ContactForm /></div></div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="ft">
      <p className="ft-word" aria-hidden="true">ForgeTalent</p>
      <div className="ft-row"><a href="/" className="brand" aria-label="ForgeTalent home"><Logo /><span>ForgeTalent</span></a><nav aria-label="Footer"><a href="/app">Skills board</a><a href="/#technology">Technology (AWS)</a><a href="/#pricing">Pricing</a><a href="/#contact">Contact</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a></nav></div>
      <p className="fine">© 2026 ForgeTalent · {site.email} · Founded by {site.team[0].name}. A proposed product: features, integrations and AWS services are planned, pricing is illustrative and the skills board uses fictional CVs.</p>
    </footer>
  );
}

function Home() { return (<><Hero /><Evidence /><Features /><Fairness /><Workforce /><Who /><Pricing /><Technology /><Team /><Demo /><Faq /><Contact /></>); }

const LEGAL = {
  privacy: ['Privacy notice', [['This website', 'ForgeTalent is a proposed product. This website and the skills board run in your browser on fictional CVs.'], ['Skills board', 'Your changes are kept in your browser’s local storage (key forgetalent-board-v1) and never leave your device.'], ['Forms', `Until a form service is connected, the demo and contact forms open a pre-filled email to ${site.email}; nothing is sent until you send it. Please do not send CVs through the forms.`], ['Cookies & analytics', 'None.']]],
  terms: ['Terms of use', [['A proposed product', 'Nothing here is an offer of service. Pricing is illustrative.'], ['Demonstration only', 'The skills board uses fictional CVs and must not be used to assess real candidates.'], ['Recruiters decide', 'ForgeTalent organises evidence; recruiters make every hiring decision.']]],
};
function Legal({kind}) { const [title, items] = LEGAL[kind]; return <section className="sec legal"><p className="tag">Review draft</p><h1>{title}</h1>{items.map(([t, d]) => <div key={t}><h2>{t}</h2><p>{d}</p></div>)}</section>; }
function NotFound() { return <section className="sec legal"><p className="tag">404</p><h1>This page didn’t make the shortlist.</h1><p>We couldn’t find it.</p><p><a className="btn" href="/">Back to ForgeTalent</a></p></section>; }

export default function App({path = '/'}) {
  if (path.startsWith('/app')) return <Board />;
  const page = path === '/' ? <Home /> : path === '/privacy' ? <Legal kind="privacy" /> : path === '/terms' ? <Legal kind="terms" /> : <NotFound />;
  return (<><a className="skip" href="#main">Skip to content</a><Header /><main id="main">{page}</main><Footer /></>);
}
