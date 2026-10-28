import '@fontsource/onest/400.css';
import '@fontsource/onest/600.css';
import '@fontsource/onest/700.css';
import '@fontsource/onest/800.css';
import './style.css';
import { UI, TICKET, DEFAULTS, fmt, azToRu, hasLatin } from './i18n.js';
import { unzip, paragraphsFromXml, buildDocx } from './docx.js';
import { buildTickets, blockOf, PER_TICKET, EXTRA } from './tickets.js';
import { installGuard } from './guard.js';

installGuard();

const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------- yaddaş (brauzer) ---------- */
const store = {
  get(k, d) { try { const v = localStorage.getItem('bilet.' + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem('bilet.' + k, JSON.stringify(v)); } catch { /* yaddaş əlçatan deyil */ } },
};

/* ---------- vəziyyət ---------- */
let lang = store.get('lang', 'az');
let allQuestions = [];
let tickets = [];
let lastSource = '';
const SECTOR_FIELDS = ['uni', 'fac', 'dep', 'spec', 'course', 'head', 'teacher'];
const t = (key, p) => fmt(UI[lang][key] ?? UI.az[key], p);
const sector = () => $('sector').value;

/* ---------- interfeys dili ---------- */
function applyLang() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  document.querySelectorAll('#hours option').forEach(o => { o.textContent = `${o.value} ${t('hoursUnit')}`; });
  document.querySelectorAll('#langs button').forEach(b => b.classList.toggle('on', b.dataset.lang === lang));
  document.title = t('title');
  if (tickets.length) $('gen').textContent = t('regen');
  if (allQuestions.length) showFound();
  refresh();
  renderPreview();
}
$('langs').addEventListener('click', e => {
  const b = e.target.closest('button[data-lang]');
  if (!b) return;
  lang = b.dataset.lang;
  store.set('lang', lang);
  applyLang();
});

/* ---------- sahələr ---------- */
function loadSectorFields() {
  const s = sector();
  const prevTeacher = $('teacher').value; // yeni sektorda müəllim hələ yazılmayıbsa, əvvəlki ad saxlanılır
  SECTOR_FIELDS.forEach(k => { $(k).value = store.get(`f.${s}.${k}`, k === 'teacher' ? prevTeacher : DEFAULTS[s][k]); });
}
$('sector').value = store.get('sector', 'az');
loadSectorFields();
['q45', 'q60', 'q75'].forEach(k => { $(k).value = store.get(k, k === 'q45' ? 65 : ''); });
$('year').value = new Date().getFullYear();

$('sector').addEventListener('change', () => { store.set('sector', sector()); loadSectorFields(); localizeNames(); renderPreview(); });
// ad yazılıb sahədən çıxanda (rus sektorunda) dərhal rusca yazıya keçir
['teacher', 'head'].forEach(k => $(k).addEventListener('change', () => { localizeNames(); renderPreview(); }));
SECTOR_FIELDS.forEach(k => $(k).addEventListener('input', () => { store.set(`f.${sector()}.${k}`, $(k).value); renderPreview(); }));
['q45', 'q60', 'q75'].forEach(k => $(k).addEventListener('input', () => store.set(k, $(k).value)));
['group', 'subject', 'year'].forEach(k => $(k).addEventListener('input', renderPreview));
['hours', 'students', 'q45', 'q60', 'q75'].forEach(k => $(k).addEventListener('input', () => {
  refresh();
  if (tickets.length) {
    tickets = [];
    renderPreview();
    $('dl').disabled = $('print').disabled = true;
    $('gen').textContent = t('gen');
    $('genMsg').innerHTML = `<div class="hint">${t('m_changed')}</div>`;
  }
}));

/* ---------- suallar faylını oxuma ---------- */
const NUM_RE = /^\s*(\d{1,3})\s*[.)]\s+/;
const META = [
  ['fac', /^(Fakültə|Faculty|Факультет)\s*:\s*(.+)$/i],
  ['dep', /^(Kafedra|Department|Кафедра)\s*:\s*(.+)$/i],
  ['spec', /^(İxtisas|Ixtisas|Specialty|Speciality|Специальность)\s*:\s*(.+)$/i],
  ['course', /^(Kurs|Course|Year|Курс)\s*:\s*(.+)$/i],
  ['group', /^(Qrup|Group|Группа)\s*:\s*(.+)$/i],
  ['subject', /^(Fənn|Subject|Discipline|Дисциплина|Предмет)\s*:\s*(.+)$/i],
  ['teacher', /^(Müəllim|Teacher|Lecturer|Instructor|Преподаватель)\s*:\s*(.+)$/i],
];
const TITLE_RE = /^(Suallar|Questions|Вопросы)\s*:?\s*$/i;
const HOURS_RE = /\(\s*(\d{2})\s*(saat|hours?|час\S*)\s*\)/i;

function parseLines(paras, plainAreQuestions = false) {
  const meta = {}, qs = [];
  for (const { text, numbered } of paras) {
    if (!numbered && !NUM_RE.test(text)) {
      const hit = META.find(([, re]) => re.test(text));
      if (hit) { meta[hit[0]] = text.match(hit[1])[2].trim(); continue; }
      if (TITLE_RE.test(text)) continue;
      if (plainAreQuestions) qs.push(text);
      continue;
    }
    qs.push(text.replace(NUM_RE, ''));
  }
  return { meta, qs };
}

function detectSector(qs) {
  const sample = qs.slice(0, 15).join(' ');
  if (/[а-яё]/i.test(sample)) return 'ru';
  if (/[əğıöüçşİ]/i.test(sample)) return 'az';
  return 'en';
}

// "Rəfizadə Ülvi" → "Rəfizadə Ü."
function shortName(full) {
  const parts = full.trim().split(/\s+/);
  if (parts.length < 2) return full;
  return parts[0] + ' ' + parts.slice(1).map(s => s[0].toLocaleUpperCase() + '.').join('');
}

function applyMeta(meta) {
  if (meta.subject) {
    const h = meta.subject.match(HOURS_RE);
    if (h && ['45', '60', '75'].includes(h[1])) $('hours').value = h[1];
    $('subject').value = meta.subject.replace(HOURS_RE, '').trim();
  }
  if (meta.group) $('group').value = meta.group;
  if (meta.teacher) { $('teacher').value = shortName(meta.teacher); store.set(`f.${sector()}.teacher`, $('teacher').value); }
  ['fac', 'dep', 'spec', 'course'].forEach(k => { if (meta[k]) $(k).value = meta[k]; });
}

function showFound() {
  $('fileMsg').innerHTML = `<div class="msg ok">${t('m_found', { src: esc(lastSource), n: allQuestions.length })}</div>`;
}

function setQuestions(qs, source) {
  allQuestions = qs.filter(Boolean);
  lastSource = source;
  tickets = [];
  $('gen').textContent = t('gen');
  $('dl').disabled = $('print').disabled = true;
  $('genMsg').innerHTML = '';
  if (!allQuestions.length) {
    $('fileMsg').innerHTML = `<div class="msg err">${t('m_none')}</div>`;
    $('qdetails').hidden = true;
  } else {
    const s = detectSector(allQuestions);
    if (s !== sector()) { $('sector').value = s; store.set('sector', s); loadSectorFields(); }
    showFound();
    $('qdetails').hidden = false;
  }
  refresh();
  renderPreview();
}

async function handleFile(file) {
  if (!file) return;
  if (/\.doc$/i.test(file.name)) { $('fileMsg').innerHTML = `<div class="msg err">${t('m_doc')}</div>`; return; }
  try {
    const read = await unzip(await file.arrayBuffer());
    const xml = await read('word/document.xml');
    if (!xml) throw new Error('docx');
    const { meta, qs } = parseLines(paragraphsFromXml(xml));
    setQuestions(qs, file.name);
    applyMeta(meta);
    localizeNames();
    renderPreview();
  } catch {
    $('fileMsg').innerHTML = `<div class="msg err">${t('m_bad')}</div>`;
  }
}

const drop = $('drop');
drop.addEventListener('click', () => $('file').click());
drop.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); $('file').click(); } });
$('file').addEventListener('change', e => { handleFile(e.target.files[0]); e.target.value = ''; });
['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('over'); }));
['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('over'); }));
drop.addEventListener('drop', e => handleFile(e.dataTransfer.files[0]));
$('usePaste').addEventListener('click', () => {
  const lines = $('paste').value.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  const { meta, qs } = parseLines(lines.map(text => ({ text, numbered: false })), true);
  setQuestions(qs, t('m_pasted'));
  applyMeta(meta);
  localizeNames();
  renderPreview();
});

/* ---------- saylar ---------- */
function expectedCount() { const v = parseInt($('q' + $('hours').value).value, 10); return v > 0 ? v : null; }
function activeQuestions() {
  const exp = expectedCount();
  return exp && allQuestions.length > exp ? allQuestions.slice(0, exp) : allQuestions;
}
function studentCount() { const s = parseInt($('students').value, 10); return s > 0 ? s : 0; }
const ticketCount = () => studentCount() + EXTRA;

function refresh() {
  $('ticketCount').textContent = studentCount() ? ticketCount() : '–';
  const act = activeQuestions();
  $('useCount').textContent = allQuestions.length ? act.length : '–';
  const exp = expectedCount(), h = $('hours').value, n = allQuestions.length;
  let m = '';
  if (n) {
    if (!exp) m = `<div class="msg warn">${t('m_noExp', { h, n })}</div>`;
    else if (n < exp) m = `<div class="msg warn">${t('m_less', { h, exp, n })}</div>`;
    else if (n > exp) m = `<div class="msg warn">${t('m_more', { h, exp, n })}</div>`;
    if (act.length >= PER_TICKET) {
      const need = ticketCount() * PER_TICKET;
      m += `<div class="hint">${t(need <= act.length ? 'm_enough' : 'm_cycle', { t: ticketCount(), need, n: act.length })}</div>`;
    } else m += `<div class="msg err">${t('m_min', { k: PER_TICKET })}</div>`;
  }
  $('countMsg').innerHTML = m;
  $('gen').disabled = act.length < PER_TICKET || !studentCount();
  $('qlist').innerHTML = act.map((q, i) =>
    `<li class="${i && blockOf(i, act.length) !== blockOf(i - 1, act.length) ? 'blk' : ''}">${esc(q)}</li>`).join('');
}

/* ---------- önbaxış ---------- */
function info() {
  const g = k => $(k).value.trim();
  return {
    uni: g('uni'), fac: g('fac'), dep: g('dep'), spec: g('spec'), course: g('course'), group: g('group'),
    subject: g('subject'),
    // rus sektorunda ad hələ də Azərbaycan hərfləri ilədirsə, biletə rusca yazılır
    head: sector() === 'ru' && hasLatin(g('head')) ? azToRu(g('head')) : g('head'),
    teacher: sector() === 'ru' && hasLatin(g('teacher')) ? azToRu(g('teacher')) : g('teacher'),
    year: parseInt(g('year'), 10) || new Date().getFullYear(),
  };
}

function renderPreview() {
  const I = info(), L = TICKET[sector()], Q = activeQuestions();
  $('empty').style.display = tickets.length ? 'none' : '';
  document.body.classList.toggle('ready', tickets.length > 0);
  $('pvTitle').textContent = tickets.length ? t('previewN', { n: tickets.length }) : t('preview');
  $('sheets').innerHTML = tickets.map((tk, i) => `
    <div class="sheet">
      <div class="in">
        <div class="uni">${esc(I.uni)}</div>
        <p class="hf">${L.fac}: ${esc(I.fac)}</p>
        <p class="hf">${L.dep}: ${esc(I.dep)}</p>
        <p class="hf">${L.spec}: ${esc(I.spec)}</p>
        <p class="hf">${L.course}: ${esc(I.course)}</p>
        <p class="hf">${L.group}: ${esc(I.group)}</p>
        <p class="hf">${L.subject}: ${esc(I.subject)}</p>
        <div class="no">${L.ticket}${i + 1}</div>
        <ol>${tk.map((q, j) => `<li><span class="n">${j + 1}.</span>${esc(Q[q])}<span class="qnum">[${q + 1}]</span></li>`).join('')}</ol>
      </div>
      <div class="ft">
        <p><span>${L.head}</span><span class="fill"></span><span>${esc(I.head)}</span></p>
        <p><span>${L.teacher}&nbsp;</span><span class="fill"></span><span>&nbsp;${esc(I.teacher)}</span></p>
        <p><span>${L.seal}</span><span class="gap"></span><span>${esc(L.date(I.year))}</span></p>
      </div>
    </div>`).join('');
}
$('showNums').addEventListener('change', e => document.body.classList.toggle('hide-nums', !e.target.checked));

/* ---------- yaratma və yükləmə ---------- */
// Fayl adı bütün brauzerlərdə düzgün çıxsın deyə latın hərflərinə çevrilir
const TR = { ə:'e', Ə:'E', ğ:'g', Ğ:'G', ı:'i', İ:'I', ö:'o', Ö:'O', ü:'u', Ü:'U', ç:'c', Ç:'C', ş:'s', Ş:'S',
  а:'a', б:'b', в:'v', г:'g', д:'d', е:'e', ё:'e', ж:'zh', з:'z', и:'i', й:'y', к:'k', л:'l', м:'m', н:'n', о:'o',
  п:'p', р:'r', с:'s', т:'t', у:'u', ф:'f', х:'kh', ц:'ts', ч:'ch', ш:'sh', щ:'shch', ъ:'', ы:'y', ь:'', э:'e', ю:'yu', я:'ya' };
function toAscii(v) {
  return [...v].map(c => TR[c] ?? (TR[c.toLowerCase()] !== undefined ? TR[c.toLowerCase()].toUpperCase() : c)).join('')
    .normalize('NFKD').replace(/[^\x20-\x7E]/g, '').replace(/[\\/:*?"<>|]+/g, '').replace(/\s+/g, ' ').trim();
}

// Rus sektorunda Azərbaycan hərfləri ilə yazılmış adlar rusca yazıya çevrilir
function localizeNames() {
  if (sector() !== 'ru') return;
  ['teacher', 'head'].forEach(k => {
    const v = $(k).value;
    if (v && hasLatin(v)) { $(k).value = azToRu(v); store.set(`f.ru.${k}`, $(k).value); }
  });
}

$('gen').addEventListener('click', () => {
  localizeNames();
  const Q = activeQuestions(), n = ticketCount();
  tickets = buildTickets(Q.length, n);
  const uses = new Array(Q.length).fill(0);
  tickets.flat().forEach(q => uses[q]++);
  const unused = uses.filter(u => u === 0).length;
  renderPreview();
  const st = $('stamp'); st.classList.remove('press'); void st.offsetWidth; st.classList.add('press');
  // kiçik ekranda biletlər formanın altında qalır — ora keçirik
  if (window.matchMedia('(max-width: 900px)').matches) document.querySelector('.board').scrollIntoView({ behavior: 'smooth', block: 'start' });
  $('dl').disabled = $('print').disabled = false;
  $('gen').textContent = t('regen');
  $('genMsg').innerHTML = `<div class="msg ok">${t('m_done', { t: n, s: n - EXTRA, e: EXTRA })}` +
    (unused ? t('m_doneUnused', { u: Q.length - unused }) : t('m_doneAll', { n: Q.length, m: Math.max(...uses) })) + `</div>`;
});

$('print').addEventListener('click', () => window.print());

$('dl').addEventListener('click', () => {
  localizeNames();
  const s = sector(), I = info(), L = TICKET[s];
  const blob = buildDocx({ tickets, questions: activeQuestions(), info: I, labels: L, sector: s });
  const name = `${toAscii(L.file)} - ${toAscii(I.subject || 'fenn')}${I.group ? ' - ' + toAscii(I.group) : ''}.docx`;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
});

applyLang();
