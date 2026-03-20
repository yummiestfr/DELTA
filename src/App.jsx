import { useEffect, useRef, useState } from "react";
import { supabase } from "./supabase";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&family=Geist:wght@300;400;500;600&display=swap');

  :root {
    --bg: #080a0f;
    --bg-2: #0d1018;
    --surface: #161b2e;
    --surface-2: #1e2540;
    --border: rgba(255,255,255,0.07);
    --border-bright: rgba(255,255,255,0.14);
    --text: #f0f2f8;
    --text-2: #8b93a8;
    --text-3: #4d5668;
    --accent: #4f8eff;
    --accent-2: #7eb3ff;
    --accent-glow: rgba(79,142,255,0.18);
    --accent-glow-strong: rgba(79,142,255,0.35);
    --green: #3dd68c;
    --amber: #f5a623;
    --red: #ff4f6a;
    --radius: 12px;
    --radius-lg: 20px;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Geist', sans-serif;
    font-size: 16px;
    line-height: 1.6;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 9999;
    opacity: 0.6;
  }

  .display { font-family: 'DM Serif Display', serif; }
  .mono { font-family: 'DM Mono', monospace; }
  h1, h2, h3 { letter-spacing: -0.02em; }

  .container { max-width: 1120px; margin: 0 auto; padding: 0 32px; }
  section { position: relative; }

  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 20px 32px;
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(8,10,15,0.7);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
  }

  .nav-logo {
    display: flex; align-items: center; gap: 10px;
    font-family: 'DM Mono', monospace; font-size: 18px; font-weight: 500;
    color: var(--text); text-decoration: none; letter-spacing: 0.08em;
  }

  .nav-links {
    display: flex; align-items: center; gap: 32px; list-style: none;
  }

  .nav-links a {
    color: var(--text-2); text-decoration: none; font-size: 14px; transition: color 0.2s;
  }
  .nav-links a:hover { color: var(--text); }

  .nav-cta {
    background: var(--accent); color: #fff; border: none;
    padding: 9px 20px; border-radius: 8px; font-size: 14px; font-weight: 500;
    cursor: pointer; font-family: 'Geist', sans-serif; transition: all 0.2s;
    box-shadow: 0 0 20px var(--accent-glow);
  }
  .nav-cta:hover { background: var(--accent-2); box-shadow: 0 0 28px var(--accent-glow-strong); transform: translateY(-1px); }

  #hero { min-height: 100vh; display: flex; align-items: center; padding: 140px 0 100px; overflow: hidden; }

  .hero-glow {
    position: absolute; top: 0; left: 50%; transform: translateX(-50%);
    width: 900px; height: 600px;
    background: radial-gradient(ellipse at 50% 0%, rgba(79,142,255,0.12) 0%, transparent 70%);
    pointer-events: none;
  }

  .hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }

  .hero-tag {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--surface); border: 1px solid var(--border-bright);
    border-radius: 100px; padding: 6px 14px; font-size: 12px;
    font-family: 'DM Mono', monospace; color: var(--accent-2);
    letter-spacing: 0.06em; margin-bottom: 28px;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  .dot { width: 6px; height: 6px; background: var(--green); border-radius: 50%; animation: pulse 2s infinite; }
  .live-dot { width: 5px; height: 5px; background: var(--green); border-radius: 50%; animation: pulse 1.5s infinite; }

  .hero-title {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(44px, 5.5vw, 72px);
    line-height: 1.08; letter-spacing: -0.03em; margin-bottom: 24px; color: var(--text);
  }
  .hero-title em { font-style: italic; color: var(--accent-2); }

  .hero-sub { font-size: 18px; color: var(--text-2); line-height: 1.65; margin-bottom: 40px; max-width: 460px; font-weight: 300; }
  .hero-sub strong { color: var(--text); font-weight: 500; }

  .hero-actions { display: flex; align-items: center; gap: 16px; }

  .btn-primary {
    background: var(--accent); color: #fff; border: none;
    padding: 14px 28px; border-radius: 10px; font-size: 15px; font-weight: 500;
    cursor: pointer; font-family: 'Geist', sans-serif; transition: all 0.2s;
    box-shadow: 0 0 32px var(--accent-glow-strong);
    display: inline-flex; align-items: center; gap: 8px; text-decoration: none;
  }
  .btn-primary:hover { background: var(--accent-2); transform: translateY(-2px); box-shadow: 0 4px 40px var(--accent-glow-strong); }
  .btn-primary:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  .btn-ghost {
    background: transparent; color: var(--text-2); border: 1px solid var(--border-bright);
    padding: 14px 24px; border-radius: 10px; font-size: 15px; cursor: pointer;
    font-family: 'Geist', sans-serif; transition: all 0.2s;
    text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
  }
  .btn-ghost:hover { color: var(--text); border-color: var(--accent); background: var(--accent-glow); }

  .hero-visual { position: relative; }

  .signal-card {
    background: var(--bg-2); border: 1px solid var(--border-bright);
    border-radius: var(--radius-lg); padding: 24px; position: relative; overflow: hidden;
  }
  .signal-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent); opacity: 0.6;
  }

  .signal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .signal-title { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--text-3); letter-spacing: 0.1em; text-transform: uppercase; }

  .live-badge {
    background: rgba(61,214,140,0.1); border: 1px solid rgba(61,214,140,0.25);
    color: var(--green); font-size: 10px; font-family: 'DM Mono', monospace;
    padding: 3px 8px; border-radius: 100px; letter-spacing: 0.06em;
    display: flex; align-items: center; gap: 5px;
  }

  .signal-list { display: flex; flex-direction: column; gap: 10px; }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(12px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .signal-item {
    display: flex; align-items: flex-start; gap: 12px; padding: 12px;
    background: var(--surface); border-radius: 8px; border: 1px solid var(--border);
    animation: slideIn 0.4s ease both;
  }
  .signal-item:nth-child(1) { animation-delay: 0.1s; }
  .signal-item:nth-child(2) { animation-delay: 0.3s; }
  .signal-item:nth-child(3) { animation-delay: 0.5s; }
  .signal-item:nth-child(4) { animation-delay: 0.7s; }

  .signal-icon {
    width: 32px; height: 32px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; flex-shrink: 0;
  }
  .signal-icon.blue { background: rgba(79,142,255,0.12); }
  .signal-icon.green { background: rgba(61,214,140,0.1); }
  .signal-icon.amber { background: rgba(245,166,35,0.1); }

  .signal-text { flex: 1; }
  .signal-name { font-size: 13px; font-weight: 500; color: var(--text); margin-bottom: 2px; }
  .signal-detail { font-size: 12px; color: var(--text-2); }
  .signal-time { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--text-3); }

  .signal-action {
    margin-top: 2px; font-size: 11px; font-family: 'DM Mono', monospace;
    padding: 3px 8px; border-radius: 100px; border: 1px solid; display: inline-block;
  }
  .signal-action.act { color: var(--green); border-color: rgba(61,214,140,0.3); background: rgba(61,214,140,0.07); }
  .signal-action.watch { color: var(--amber); border-color: rgba(245,166,35,0.3); background: rgba(245,166,35,0.07); }
  .signal-action.sent { color: var(--accent-2); border-color: rgba(79,142,255,0.3); background: rgba(79,142,255,0.07); }

  #problem { padding: 120px 0; border-top: 1px solid var(--border); }

  .section-tag {
    font-family: 'DM Mono', monospace; font-size: 11px; color: var(--text-3);
    letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 16px; display: block;
  }
  .section-title {
    font-family: 'DM Serif Display', serif; font-size: clamp(32px, 4vw, 52px);
    line-height: 1.1; letter-spacing: -0.025em; margin-bottom: 20px;
  }
  .section-sub { font-size: 17px; color: var(--text-2); max-width: 520px; line-height: 1.7; font-weight: 300; }

  .problem-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start; margin-top: 72px; }
  .problem-items { display: flex; flex-direction: column; }
  .problem-item { display: flex; gap: 20px; padding: 24px 0; border-bottom: 1px solid var(--border); }
  .problem-num { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--text-3); padding-top: 4px; flex-shrink: 0; width: 24px; }
  .problem-text h4 { font-size: 15px; font-weight: 500; color: var(--text); margin-bottom: 6px; }
  .problem-text p { font-size: 14px; color: var(--text-2); line-height: 1.6; }

  .problem-stat-block {
    background: var(--bg-2); border: 1px solid var(--border-bright);
    border-radius: var(--radius-lg); padding: 36px; position: sticky; top: 100px;
  }
  .stat-header {
    font-family: 'DM Mono', monospace; font-size: 11px; color: var(--text-3);
    letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 28px;
    padding-bottom: 16px; border-bottom: 1px solid var(--border);
  }
  .stat-items { display: flex; flex-direction: column; gap: 28px; }
  .stat-value {
    font-family: 'DM Serif Display', serif; font-size: 48px; line-height: 1;
    letter-spacing: -0.03em; margin-bottom: 8px;
  }
  .stat-value.blue { color: var(--accent-2); }
  .stat-value.green { color: var(--green); }
  .stat-value.red { color: var(--red); }
  .stat-label { font-size: 13px; color: var(--text-2); line-height: 1.5; }

  #loop { padding: 120px 0; background: var(--bg-2); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); overflow: hidden; }
  .loop-header { text-align: center; max-width: 640px; margin: 0 auto 80px; }
  .loop-diagram { position: relative; max-width: 840px; margin: 0 auto; }

  #how { padding: 120px 0; border-bottom: 1px solid var(--border); }
  .how-header { text-align: center; max-width: 600px; margin: 0 auto 72px; }

  .steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; }
  .step {
    background: var(--bg-2); border: 1px solid var(--border);
    padding: 32px 28px; position: relative; transition: border-color 0.2s, background 0.2s;
  }
  .step:first-child { border-radius: var(--radius) 0 0 var(--radius); }
  .step:last-child { border-radius: 0 var(--radius) var(--radius) 0; }
  .step:hover { background: var(--surface); border-color: var(--border-bright); z-index: 1; }
  .step-num { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--text-3); letter-spacing: 0.1em; margin-bottom: 20px; display: block; }
  .step-icon { font-size: 24px; margin-bottom: 16px; display: block; }
  .step h3 { font-size: 16px; font-weight: 600; margin-bottom: 10px; color: var(--text); }
  .step p { font-size: 13px; color: var(--text-2); line-height: 1.65; }

  #features { padding: 120px 0; background: var(--bg-2); border-bottom: 1px solid var(--border); }
  .features-header { text-align: center; max-width: 600px; margin: 0 auto 72px; }
  .features-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px;
    background: var(--border); border-radius: var(--radius-lg); overflow: hidden;
  }
  .feature-card { background: var(--bg-2); padding: 36px 32px; position: relative; transition: background 0.2s; }
  .feature-card:hover { background: var(--surface); }
  .feature-card.highlight { background: var(--surface); border: 1px solid var(--accent); z-index: 1; margin: -1px; }
  .feature-card.highlight-green { background: rgba(61,214,140,0.03); border: 1px solid var(--green); z-index: 1; margin: -1px; }
  .feature-badge {
    display: inline-block; font-size: 10px; font-family: 'DM Mono', monospace;
    color: var(--accent-2); background: rgba(79,142,255,0.1); border: 1px solid rgba(79,142,255,0.25);
    padding: 3px 8px; border-radius: 100px; letter-spacing: 0.06em; margin-bottom: 20px;
  }
  .feature-badge.green { color: var(--green); border-color: rgba(61,214,140,0.3); background: rgba(61,214,140,0.08); }
  .feature-icon { font-size: 28px; margin-bottom: 16px; display: block; }
  .feature-card h3 { font-size: 17px; font-weight: 600; margin-bottom: 10px; letter-spacing: -0.01em; }
  .feature-card p { font-size: 14px; color: var(--text-2); line-height: 1.65; }
  .feature-list { margin-top: 14px; display: flex; flex-direction: column; gap: 6px; }
  .feature-list li {
    font-size: 13px; color: var(--text-2); list-style: none;
    display: flex; align-items: flex-start; gap: 8px; line-height: 1.5;
  }
  .feature-list li::before { content: '↗'; color: var(--accent); font-size: 11px; flex-shrink: 0; padding-top: 2px; }

  #diff { padding: 120px 0; border-bottom: 1px solid var(--border); }
  .diff-header { text-align: center; max-width: 600px; margin: 0 auto 72px; }

  .compare-table { width: 100%; border-collapse: collapse; border-radius: var(--radius-lg); overflow: hidden; border: 1px solid var(--border); }
  .compare-table thead tr { background: var(--surface); }
  .compare-table th { padding: 16px 24px; font-size: 13px; font-weight: 500; color: var(--text-2); text-align: left; border-bottom: 1px solid var(--border); }
  .compare-table th:first-child { color: var(--text-3); font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; }
  .compare-table th.delta-col { color: var(--accent-2); font-family: 'DM Mono', monospace; }
  .compare-table td { padding: 16px 24px; font-size: 14px; border-bottom: 1px solid var(--border); background: var(--bg-2); color: var(--text-2); }
  .compare-table td:first-child { font-weight: 500; color: var(--text); }
  .compare-table td.delta-col { background: rgba(79,142,255,0.04); color: var(--text); font-weight: 500; }
  .compare-table tr:last-child td { border-bottom: none; }
  .check { color: var(--green); }
  .cross { color: var(--text-3); }

  #proof { padding: 120px 0; background: var(--bg-2); border-bottom: 1px solid var(--border); }
  .proof-inner { text-align: center; max-width: 780px; margin: 0 auto; }
  .proof-quote {
    font-family: 'DM Serif Display', serif; font-size: clamp(28px, 3.5vw, 48px);
    line-height: 1.2; letter-spacing: -0.025em; margin-bottom: 48px; color: var(--text);
  }
  .proof-quote em { font-style: italic; color: var(--accent-2); }
  .proof-metrics { display: flex; justify-content: center; gap: 60px; flex-wrap: wrap; }
  .proof-metric-value { font-family: 'DM Serif Display', serif; font-size: 40px; letter-spacing: -0.03em; color: var(--text); line-height: 1; margin-bottom: 6px; }
  .proof-metric-label { font-size: 13px; color: var(--text-2); font-weight: 300; }

  #cta { padding: 140px 0; text-align: center; position: relative; overflow: hidden; }
  .cta-glow {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
    width: 600px; height: 400px;
    background: radial-gradient(ellipse, rgba(79,142,255,0.1) 0%, transparent 70%);
    pointer-events: none;
  }
  .cta-actions { display: flex; justify-content: center; align-items: center; gap: 16px; flex-wrap: wrap; }
  .cta-note { font-size: 13px; color: var(--text-3); margin-top: 20px; font-family: 'DM Mono', monospace; letter-spacing: 0.04em; }

  footer {
    padding: 48px 32px; border-top: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .footer-logo { font-family: 'DM Mono', monospace; font-size: 15px; font-weight: 500; color: var(--text-2); letter-spacing: 0.08em; }
  .footer-right { font-size: 13px; color: var(--text-3); }

  .fade-up { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .fade-up.visible { opacity: 1; transform: translateY(0); }

  @media (max-width: 900px) {
    .hero-grid { grid-template-columns: 1fr; gap: 48px; }
    .problem-grid { grid-template-columns: 1fr; }
    .steps { grid-template-columns: 1fr 1fr; }
    .features-grid { grid-template-columns: 1fr 1fr; }
    .proof-metrics { gap: 36px; }
    nav .nav-links { display: none; }
  }
  @media (max-width: 600px) {
    .container { padding: 0 20px; }
    .steps { grid-template-columns: 1fr; }
    .step { border-radius: 0 !important; }
    .step:first-child { border-radius: var(--radius) var(--radius) 0 0 !important; }
    .step:last-child { border-radius: 0 0 var(--radius) var(--radius) !important; }
    .features-grid { grid-template-columns: 1fr; }
    footer { flex-direction: column; gap: 16px; text-align: center; }
  }
`;

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LogoMark = () => (
  <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 28, height: 28 }}>
    <polygon points="14,2 26,24 2,24" fill="none" stroke="#4f8eff" strokeWidth="2" strokeLinejoin="round" />
    <polygon points="14,10 20,22 8,22" fill="#4f8eff" opacity="0.3" />
  </svg>
);

const LoopSVG = () => (
  <svg viewBox="0 0 840 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto" }}>
    <defs>
      <radialGradient id="loopGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#4f8eff" stopOpacity="0.08" />
        <stop offset="100%" stopColor="#4f8eff" stopOpacity="0" />
      </radialGradient>
      <marker id="arrowBlue" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#4f8eff" opacity="0.7" />
      </marker>
      <marker id="arrowGreen" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#3dd68c" opacity="0.7" />
      </marker>
      <filter id="nodeGlow">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <ellipse cx="420" cy="200" rx="300" ry="150" fill="url(#loopGlow)" />
    <path d="M 155 170 Q 220 100 285 155" stroke="#4f8eff" strokeWidth="1.5" strokeOpacity="0.5" fill="none" markerEnd="url(#arrowBlue)" strokeDasharray="4,3" />
    <path d="M 345 155 Q 390 120 435 155" stroke="#4f8eff" strokeWidth="1.5" strokeOpacity="0.5" fill="none" markerEnd="url(#arrowBlue)" strokeDasharray="4,3" />
    <path d="M 495 155 Q 540 120 585 155" stroke="#4f8eff" strokeWidth="1.5" strokeOpacity="0.5" fill="none" markerEnd="url(#arrowBlue)" strokeDasharray="4,3" />
    <path d="M 645 170 Q 710 120 755 170" stroke="#4f8eff" strokeWidth="1.5" strokeOpacity="0.5" fill="none" markerEnd="url(#arrowBlue)" strokeDasharray="4,3" />
    <path d="M 770 215 Q 760 290 700 280" stroke="#3dd68c" strokeWidth="1.5" strokeOpacity="0.5" fill="none" markerEnd="url(#arrowGreen)" strokeDasharray="4,3" />
    <path d="M 630 280 Q 570 310 510 280" stroke="#3dd68c" strokeWidth="1.5" strokeOpacity="0.5" fill="none" markerEnd="url(#arrowGreen)" strokeDasharray="4,3" />
    <path d="M 390 275 Q 260 310 145 240" stroke="#3dd68c" strokeWidth="1.5" strokeOpacity="0.5" fill="none" markerEnd="url(#arrowGreen)" strokeDasharray="4,3" />
    <rect x="70" y="140" width="110" height="54" rx="10" fill="#161b2e" stroke="#4f8eff" strokeOpacity="0.4" strokeWidth="1" />
    <text x="125" y="161" fontFamily="DM Mono, monospace" fontSize="10" fill="#4f8eff" textAnchor="middle" letterSpacing="0.08em">CRM</text>
    <text x="125" y="177" fontFamily="DM Mono, monospace" fontSize="10" fill="#8b93a8" textAnchor="middle">+ Real-world</text>
    <text x="125" y="191" fontFamily="DM Mono, monospace" fontSize="10" fill="#8b93a8" textAnchor="middle">inputs</text>
    <rect x="285" y="140" width="90" height="54" rx="10" fill="#161b2e" stroke="#4f8eff" strokeOpacity="0.4" strokeWidth="1" />
    <text x="330" y="161" fontFamily="DM Mono, monospace" fontSize="10" fill="#4f8eff" textAnchor="middle" letterSpacing="0.08em">CAPTURE</text>
    <text x="330" y="177" fontFamily="DM Mono, monospace" fontSize="10" fill="#8b93a8" textAnchor="middle">+ Enrich</text>
    <rect x="435" y="140" width="90" height="54" rx="10" fill="#1e2540" stroke="#4f8eff" strokeOpacity="0.8" strokeWidth="1.5" />
    <text x="480" y="161" fontFamily="DM Mono, monospace" fontSize="10" fill="#7eb3ff" textAnchor="middle" letterSpacing="0.08em">DETECT</text>
    <text x="480" y="177" fontFamily="DM Mono, monospace" fontSize="10" fill="#8b93a8" textAnchor="middle">Intent signal</text>
    <rect x="583" y="140" width="90" height="54" rx="10" fill="#1e2540" stroke="#4f8eff" strokeOpacity="0.8" strokeWidth="1.5" />
    <text x="628" y="161" fontFamily="DM Mono, monospace" fontSize="10" fill="#7eb3ff" textAnchor="middle" letterSpacing="0.08em">DECIDE</text>
    <text x="628" y="177" fontFamily="DM Mono, monospace" fontSize="10" fill="#8b93a8" textAnchor="middle">Best action</text>
    <rect x="710" y="140" width="90" height="54" rx="10" fill="#161b2e" stroke="#4f8eff" strokeOpacity="0.4" strokeWidth="1" />
    <text x="755" y="161" fontFamily="DM Mono, monospace" fontSize="10" fill="#4f8eff" textAnchor="middle" letterSpacing="0.08em">ACT</text>
    <text x="755" y="177" fontFamily="DM Mono, monospace" fontSize="10" fill="#8b93a8" textAnchor="middle">Execute</text>
    <rect x="390" y="248" width="100" height="54" rx="10" fill="#0f2318" stroke="#3dd68c" strokeOpacity="0.5" strokeWidth="1" />
    <text x="440" y="269" fontFamily="DM Mono, monospace" fontSize="10" fill="#3dd68c" textAnchor="middle" letterSpacing="0.06em">NEW LEADS</text>
    <text x="440" y="285" fontFamily="DM Mono, monospace" fontSize="10" fill="#8b93a8" textAnchor="middle">Captured</text>
    <rect x="580" y="248" width="100" height="54" rx="10" fill="#0f2318" stroke="#3dd68c" strokeOpacity="0.5" strokeWidth="1" />
    <text x="630" y="269" fontFamily="DM Mono, monospace" fontSize="10" fill="#3dd68c" textAnchor="middle" letterSpacing="0.06em">ENGAGE</text>
    <text x="630" y="285" fontFamily="DM Mono, monospace" fontSize="10" fill="#8b93a8" textAnchor="middle">Tracked</text>
    <text x="420" y="206" fontFamily="DM Serif Display, serif" fontSize="14" fill="#4f8eff" textAnchor="middle" opacity="0.5">∆ Delta Loop</text>
  </svg>
);

export default function App() {
  const fadeRefs = useRef([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    fadeRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addFadeRef = (el) => {
    if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el);
  };

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setMessage("Please enter your email.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("waitlist").insert([{ email: cleanEmail }]);

    if (error) {
      if (error.code === "23505") {
        setMessage("You're already on the waitlist.");
      } else {
        console.error(error);
        setMessage("Something went wrong. Please try again.");
      }
    } else {
      setMessage("You're on the waitlist 🚀");
      setEmail("");
    }

    setLoading(false);
  };

  const compareRows = [
    ["Stores contact data", "✓ Passive storage", "✓ + live enrichment"],
    ["Sends campaigns", "✓ Scheduled broadcasts", "✓ + intent-triggered only"],
    ["Detects real-time intent", "✗", "✓ Core function"],
    ["Makes autonomous decisions", "✗ Rule-based workflows", "✓ AI-driven decisions"],
    ["Captures social engagement as leads", "✗", "✓ Automatic lead capture"],
    ["Learns and improves automatically", "✗ Manual A/B tests", "✓ Continuous loop"],
    ["Acts on CRM contacts proactively", "✗ Waits for trigger setup", "✓ Monitors 24/7"],
  ];

  return (
    <>
      <style>{styles}</style>

      <nav>
        <a href="#" className="nav-logo">
          <span style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LogoMark />
          </span>
          DELTA
        </a>
        <ul className="nav-links">
          <li><a href="#how">How it works</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#diff">vs. CRM tools</a></li>
        </ul>
        <a href="#cta" className="nav-cta" style={{ textDecoration: "none" }}>Request access</a>
      </nav>

      <section id="hero">
        <div className="hero-glow" />
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="hero-tag">
                <span className="dot" />
                Real-time intent engine
              </div>
              <h1 className="hero-title display">
                Your next deal<br />is already in<br /><em>your CRM.</em>
              </h1>
              <p className="hero-sub">
                The problem isn't leads — it's <strong>timing</strong>.<br />
                Delta detects intent the moment it happens, decides the best action, and executes it. Automatically.
              </p>
              <div className="hero-actions">
                <a href="#cta" className="btn-primary">
                  See it in action <ArrowIcon />
                </a>
                <a href="#how" className="btn-ghost">How it works</a>
              </div>
            </div>
            <div className="hero-visual fade-up" ref={addFadeRef}>
              <div className="signal-card">
                <div className="signal-header">
                  <span className="signal-title">Live intent signals</span>
                  <span className="live-badge"><span className="live-dot" />LIVE</span>
                </div>
                <div className="signal-list">
                  {[
                    { icon: "🎯", iconClass: "green", name: "Sarah Chen — Enterprise Lead", detail: "Opened pricing email 3× in 40 min", time: "2m ago", action: "Act now", actionClass: "act" },
                    { icon: "👁", iconClass: "blue", name: "James Okafor — Warm Lead", detail: "Clicked Instagram ad twice + viewed profile", time: "8m ago", action: "Watching", actionClass: "watch" },
                    { icon: "⚡", iconClass: "amber", name: "New lead captured", detail: "Engaged with post → added to CRM", time: "14m ago", action: "Outreach sent", actionClass: "sent" },
                    { icon: "✉️", iconClass: "blue", name: "Maria Santos — Cold contact", detail: "Dormant 6 months → reactivated by post", time: "31m ago", action: "Follow-up sent", actionClass: "sent" },
                  ].map((s, i) => (
                    <div className="signal-item" key={i}>
                      <div className={`signal-icon ${s.iconClass}`}>{s.icon}</div>
                      <div className="signal-text">
                        <div className="signal-name">{s.name}</div>
                        <div className="signal-detail">{s.detail}</div>
                      </div>
                      <div>
                        <div className="signal-time">{s.time}</div>
                        <div className={`signal-action ${s.actionClass}`}>{s.action}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="problem">
        <div className="container">
          <div className="fade-up" ref={addFadeRef}>
            <span className="section-tag">The problem</span>
            <h2 className="section-title display">
              Timing is everything.<br />Right now, you're always late.
            </h2>
            <p className="section-sub">
              Most businesses have more data than they can act on. The issue isn't volume — it's that intent signals disappear faster than teams can respond.
            </p>
          </div>
          <div className="problem-grid">
            <div className="problem-items fade-up" ref={addFadeRef}>
              {[
                ["01", "Thousands of contacts sit dormant", "Your CRM is full of people who were once interested. Without live signals, you don't know who's ready today."],
                ["02", "Real conversations never get captured", "A meeting happens, a note is scribbled, nothing makes it back to the system. Intent evaporates."],
                ["03", "Social engagement is invisible to your CRM", "Someone clicks your ad, watches your reel, replies to your story. Your CRM sees nothing."],
                ["04", "Follow-ups rely on human memory", "Manual workflows break down under volume. High-intent moments get missed because no one was watching at the right second."],
              ].map(([num, title, desc]) => (
                <div className="problem-item" key={num}>
                  <span className="problem-num">{num}</span>
                  <div className="problem-text">
                    <h4>{title}</h4>
                    <p>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="fade-up" ref={addFadeRef}>
              <div className="problem-stat-block">
                <div className="stat-header">The cost of bad timing</div>
                <div className="stat-items">
                  <div>
                    <div className="stat-value blue">73%</div>
                    <div className="stat-label">of CRM contacts receive zero outreach after initial capture</div>
                  </div>
                  <div>
                    <div className="stat-value green">5×</div>
                    <div className="stat-label">higher conversion when you respond within the first hour of intent</div>
                  </div>
                  <div>
                    <div className="stat-value red">$0</div>
                    <div className="stat-label">revenue generated from engagement that never makes it back to your pipeline</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="loop">
        <div className="container">
          <div className="loop-header fade-up" ref={addFadeRef}>
            <span className="section-tag">The Delta loop</span>
            <h2 className="section-title display">Not a campaign.<br />A closed-loop system.</h2>
            <p className="section-sub" style={{ margin: "0 auto", textAlign: "center" }}>
              Every interaction feeds the next decision. Delta doesn't just act — it learns, adapts, and gets sharper over time.
            </p>
          </div>
          <div className="loop-diagram fade-up" ref={addFadeRef}>
            <LoopSVG />
          </div>
          <div className="fade-up" ref={addFadeRef} style={{ textAlign: "center", marginTop: 32 }}>
            <p style={{ fontSize: 14, color: "var(--text-2)", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
              Every cycle improves the next. Better timing, sharper targeting, more revenue — without adding headcount.
            </p>
          </div>
        </div>
      </section>

      <section id="how">
        <div className="container">
          <div className="how-header fade-up" ref={addFadeRef}>
            <span className="section-tag">How it works</span>
            <h2 className="section-title display">Four steps.<br />Zero guesswork.</h2>
          </div>
          <div className="steps fade-up" ref={addFadeRef}>
            {[
              ["01", "🔌", "Capture", "Connect your CRM, emails, meeting notes, and social channels. Delta structures everything automatically — no manual data entry."],
              ["02", "📡", "Detect", "Live signal monitoring across all inputs. Delta builds real-time intent profiles — identifying who's ready to act before they raise their hand."],
              ["03", "🧠", "Decide", "Not just detection — decision. Delta determines who to contact, exactly when, and through which channel. No workflows. No rules to write."],
              ["04", "⚡", "Execute", "Personalised outreach, social content, and follow-ups deployed automatically. Engagement captured. New leads logged. Loop repeats."],
            ].map(([num, icon, title, desc]) => (
              <div className="step" key={num}>
                <span className="step-num">{num}</span>
                <span className="step-icon">{icon}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features">
        <div className="container">
          <div className="features-header fade-up" ref={addFadeRef}>
            <span className="section-tag">Features</span>
            <h2 className="section-title display">Built for revenue.<br />Not for reporting.</h2>
            <p className="section-sub" style={{ margin: "12px auto 0", textAlign: "center" }}>
              Every feature drives toward one outcome: deals closed faster, with less effort.
            </p>
          </div>
          <div className="features-grid fade-up" ref={addFadeRef}>
            <div className="feature-card">
              <div className="feature-badge">Data layer</div>
              <span className="feature-icon">🗂</span>
              <h3>Structured data capture</h3>
              <p>Turns messy inputs into clean CRM records automatically.</p>
              <ul className="feature-list">
                <li>Meeting notes → structured fields</li>
                <li>Email threads → contact timeline</li>
                <li>Manual inputs → enriched profiles</li>
              </ul>
            </div>
            <div className="feature-card highlight">
              <div className="feature-badge green">Core differentiator</div>
              <span className="feature-icon">🎯</span>
              <h3>Decision engine</h3>
              <p>Not content generation. Not scheduling. Actual decisions about <em>who, when, and how</em> — made in real time.</p>
              <ul className="feature-list">
                <li>Intent-ranked contact prioritisation</li>
                <li>Channel and timing selection</li>
                <li>Campaign-aware segmentation</li>
              </ul>
            </div>
            <div className="feature-card">
              <div className="feature-badge">Signal engine</div>
              <span className="feature-icon">📡</span>
              <h3>Live intent detection</h3>
              <p>Monitors every touchpoint and scores contacts in real time.</p>
              <ul className="feature-list">
                <li>CRM activity + behavioural patterns</li>
                <li>Instagram, ads, and social engagement</li>
                <li>Online profile scraping per contact</li>
              </ul>
            </div>
            <div className="feature-card">
              <div className="feature-badge">Execution</div>
              <span className="feature-icon">🚀</span>
              <h3>Autonomous outreach</h3>
              <p>Personalised messages and content deployed the moment intent is detected — across every channel you use.</p>
              <ul className="feature-list">
                <li>Instagram, TikTok, email</li>
                <li>Personalised per contact</li>
                <li>Zero manual setup per send</li>
              </ul>
            </div>
            <div className="feature-card highlight-green">
              <div className="feature-badge green">Key differentiator</div>
              <span className="feature-icon">🔁</span>
              <h3>Engagement capture</h3>
              <p>Tracks who engages with your content and turns anonymous interaction into new, qualified leads.</p>
              <ul className="feature-list">
                <li>Views, clicks, replies all tracked</li>
                <li>New leads generated from engagement</li>
                <li>Everything logged back to CRM</li>
              </ul>
            </div>
            <div className="feature-card">
              <div className="feature-badge">Learning</div>
              <span className="feature-icon">📈</span>
              <h3>Continuous improvement</h3>
              <p>Every outcome — sent, opened, converted, ignored — trains the system to get sharper over time.</p>
              <ul className="feature-list">
                <li>Timing optimisation per segment</li>
                <li>Channel preference learning</li>
                <li>Conversion-driven prioritisation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="diff">
        <div className="container">
          <div className="diff-header fade-up" ref={addFadeRef}>
            <span className="section-tag">vs. Traditional tools</span>
            <h2 className="section-title display">HubSpot stores data.<br />Delta activates it.</h2>
            <p className="section-sub" style={{ margin: "12px auto 0", textAlign: "center", maxWidth: 520 }}>
              Your CRM is a database. Delta is a revenue engine. They're not the same thing.
            </p>
          </div>
          <div className="fade-up" ref={addFadeRef} style={{ marginTop: 56, overflowX: "auto" }}>
            <table className="compare-table">
              <thead>
                <tr>
                  <th>Capability</th>
                  <th>CRM / Marketing tools</th>
                  <th className="delta-col">∆ Delta</th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map(([cap, crm, delta], i) => (
                  <tr key={i}>
                    <td>{cap}</td>
                    <td>
                      <span className={crm.startsWith("✓") ? "check" : "cross"}>{crm.charAt(0)}</span>
                      {crm.slice(1)}
                    </td>
                    <td className="delta-col">
                      <span className="check">✓</span>
                      {delta.slice(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="proof">
        <div className="container">
          <div className="proof-inner fade-up" ref={addFadeRef}>
            <p className="proof-quote display">
              "Every interaction is a signal.<br />
              Most teams never <em>act on them.</em>"
            </p>
            <div className="proof-metrics">
              {[
                ["10×", "faster response to high-intent signals"],
                ["0", "manual workflows required"],
                ["100%", "of engagement captured back to CRM"],
              ].map(([val, label]) => (
                <div key={val}>
                  <div className="proof-metric-value">{val}</div>
                  <div className="proof-metric-label">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="cta">
        <div className="cta-glow" />
        <div className="container">
          <div className="fade-up" ref={addFadeRef}>
            <span className="section-tag" style={{ display: "block", textAlign: "center" }}>Get started</span>
            <h2 className="section-title display" style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 24px" }}>
              Turn your CRM into a<br /><em style={{ fontStyle: "italic", color: "var(--accent-2)" }}>real-time revenue engine.</em>
            </h2>
            <p className="section-sub" style={{ textAlign: "center", maxWidth: 480, margin: "0 auto 48px" }}>
              Your next deals are already in your CRM. Delta finds them, times the outreach perfectly, and executes — before your competitors even notice.
            </p>

            <form onSubmit={handleWaitlistSubmit}>
              <div className="cta-actions" style={{ gap: 12 }}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    minWidth: 280,
                    background: "var(--bg-2)",
                    color: "var(--text)",
                    border: "1px solid var(--border-bright)",
                    borderRadius: 10,
                    padding: "16px 18px",
                    fontSize: 15,
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ fontSize: 16, padding: "16px 32px" }}
                  disabled={loading}
                >
                  {loading ? "Joining..." : "Request early access"}
                  {!loading && (
                    <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </div>

              {message && (
                <p
                  style={{
                    marginTop: 16,
                    color: message.includes("wrong") ? "var(--red)" : "var(--accent-2)",
                    fontSize: 14,
                  }}
                >
                  {message}
                </p>
              )}

              <p className="cta-note">No setup fee. Connects to your existing CRM in minutes.</p>
            </form>
          </div>
        </div>
      </section>

      <footer>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className="footer-logo">∆ DELTA</span>
        </div>
        <div className="footer-right">© 2025 Delta. All rights reserved.</div>
      </footer>
    </>
  );
}