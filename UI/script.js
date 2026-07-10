// mobile nav
const navToggle = document.getElementById('navToggle');
if (navToggle) {
  navToggle.addEventListener('click', () =>
    document.getElementById('navLinks').classList.toggle('open'));
}

// panel switching (sidebar links + suggestion chips on prompting.html)
document.querySelectorAll('[data-panel]').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.panel;
    document.querySelectorAll('.panel').forEach(p =>
      p.classList.toggle('active', p.id === 'panel-' + id));
    document.querySelectorAll('.side-link[data-panel]').forEach(l =>
      l.classList.toggle('active', l.dataset.panel === id));
    document.querySelector('.main').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// template tabs (Full / Lite)
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b =>
      b.classList.toggle('active', b === btn));
    document.querySelectorAll('.tab-pane').forEach(p =>
      p.classList.toggle('active', p.id === 'tab-' + btn.dataset.tab));
  });
});

// converter (prompting.html)
const convertBtn = document.getElementById('convertBtn');
if (convertBtn) {
  const rawPrompt = document.getElementById('rawPrompt');
  const keyRow = document.getElementById('keyRow');
  const resultCard = document.getElementById('convertResult');
  const resultPre = document.getElementById('resultPre');
  const resultEdit = document.getElementById('resultEdit');
  const errorCard = document.getElementById('convertError');
  const editBtn = document.getElementById('editBtn');

  const getKey = () => window.GROQ_API_KEY || localStorage.getItem('groqKey') || '';
  document.getElementById('keySave').addEventListener('click', () => {
    const k = document.getElementById('keyInput').value.trim();
    if (!k) return;
    localStorage.setItem('groqKey', k);
    keyRow.hidden = true;
  });

  const SYSTEM = `You convert raw prompts into the ISATVON prompting framework.
Rewrite the user's raw prompt as a complete ISATVON prompt in markdown with these sections:
## I — Instructions (role, one imperative task sentence, hard rules)
## S — Source (context/inputs to use, an explicit "do not assume" boundary; keep the user's pasted material as a placeholder like [PASTE ...] if they reference material not included)
## A — Automation (numbered work steps, then a "Before answering, verify:" self-check tied to S and V; on failure revise once, then report in N)
## T — Tech stack (allowed and forbidden capabilities; always forbid fabricating facts/citations)
## V — Variables (measurable limits: length, tone, audience, format; a fallback line: if a constraint cannot be met, say which and why, ask at most 1 clarifying question)
## O — Outcome (require the entire response in ISATVON format: I task-as-understood, S sources used, A verification done, V constraints honored, O the deliverable with its exact shape, N assumptions and confidence)
## N — Notification (require stating every assumption, confidence high/medium/low, anything undeliverable)
Exception: if the raw prompt is a fully self-contained one-shot question with no constraints or sources, output only the Lite form: I, O, N.
Invent sensible concrete defaults for details the raw prompt leaves out (word counts, tone, audience) rather than leaving sections vague.
Output ONLY the converted prompt markdown. No commentary, no code fences.`;

  // prefer the same-origin serverless proxy (Vercel, key stays server-side);
  // fall back to a direct Groq call with a local key for dev servers without /api
  async function requestConversion(raw) {
    let res = null;
    try {
      res = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw })
      });
    } catch { /* network failure: treat as no proxy */ }
    if (res && ![404, 405, 501].includes(res.status)) {
      let data = null;
      try { data = await res.json(); } catch { /* non-JSON: not our proxy */ }
      if (data && (data.choices || data.error)) {
        if (!res.ok) throw new Error(data.error?.message || res.status + ' ' + res.statusText);
        return data;
      }
    }
    const key = getKey();
    if (!key) {
      const e = new Error('No conversion endpoint here. Paste a Groq API key above to convert locally.');
      e.needKey = true;
      throw e;
    }
    const direct = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        temperature: 0.3,
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content: 'Raw prompt:\n' + raw }
        ]
      })
    });
    const data = await direct.json();
    if (!direct.ok) throw new Error(data.error?.message || direct.status + ' ' + direct.statusText);
    return data;
  }

  async function convert() {
    const raw = rawPrompt.value.trim();
    if (!raw) return;
    convertBtn.disabled = true;
    const label = convertBtn.textContent;
    convertBtn.textContent = 'Converting...';
    errorCard.hidden = true;
    try {
      const data = await requestConversion(raw);
      resultPre.textContent = data.choices[0].message.content.trim();
      resultEdit.hidden = true;
      resultPre.hidden = false;
      editBtn.textContent = 'Edit';
      resultCard.hidden = false;
      resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (e) {
      if (e.needKey) keyRow.hidden = false;
      document.getElementById('convertErrorMsg').textContent = e.message;
      errorCard.hidden = false;
    }
    convertBtn.disabled = false;
    convertBtn.textContent = label;
  }

  rawPrompt.addEventListener('input', () => { convertBtn.disabled = !rawPrompt.value.trim(); });
  convertBtn.addEventListener('click', convert);
  document.getElementById('regenBtn').addEventListener('click', convert);

  editBtn.addEventListener('click', () => {
    const editing = !resultEdit.hidden;
    if (editing) {
      resultEdit.hidden = true;
      resultPre.hidden = false;
      editBtn.textContent = 'Edit';
    } else {
      resultEdit.value = resultPre.textContent;
      resultEdit.hidden = false;
      resultPre.hidden = true;
      editBtn.textContent = 'Done';
      resultEdit.focus();
    }
  });
  // keep the <pre> in sync so the shared Copy handler always copies the edited text
  resultEdit.addEventListener('input', () => { resultPre.textContent = resultEdit.value; });
}

// copy buttons — copy the sibling <pre> content (Edit/Regenerate share the style via an id, skip them)
document.querySelectorAll('.copy-btn:not([id])').forEach(btn => {
  btn.addEventListener('click', async () => {
    const pre = btn.closest('.code-card').querySelector('pre');
    try {
      await navigator.clipboard.writeText(pre.textContent);
      btn.textContent = 'Copied!';
    } catch {
      // ponytail: clipboard API needs a secure context; fall back to selecting the text
      window.getSelection().selectAllChildren(pre);
      btn.textContent = 'Select + Ctrl+C';
    }
    setTimeout(() => { btn.textContent = 'Copy'; }, 1600);
  });
});
