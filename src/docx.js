import { TEMPLATE } from './template.js';

/* ---------- .docx oxuma ---------- */
export async function unzip(buf) {
  const dv = new DataView(buf), u8 = new Uint8Array(buf);
  let eocd = -1;
  for (let i = u8.length - 22; i >= Math.max(0, u8.length - 65557); i--) {
    if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('zip');
  const n = dv.getUint16(eocd + 10, true);
  let p = dv.getUint32(eocd + 16, true);
  const files = {}, td = new TextDecoder();
  for (let i = 0; i < n; i++) {
    const method = dv.getUint16(p + 10, true), csize = dv.getUint32(p + 20, true);
    const nlen = dv.getUint16(p + 28, true), elen = dv.getUint16(p + 30, true), clen = dv.getUint16(p + 32, true);
    const off = dv.getUint32(p + 42, true);
    const name = td.decode(u8.subarray(p + 46, p + 46 + nlen));
    p += 46 + nlen + elen + clen;
    files[name] = { method, csize, off };
  }
  return async name => {
    const f = files[name];
    if (!f) return null;
    const lnl = dv.getUint16(f.off + 26, true), lel = dv.getUint16(f.off + 28, true);
    const start = f.off + 30 + lnl + lel;
    const data = u8.subarray(start, start + f.csize);
    if (f.method === 0) return td.decode(data);
    const ds = new DecompressionStream('deflate-raw');
    const out = await new Response(new Blob([data]).stream().pipeThrough(ds)).arrayBuffer();
    return td.decode(out);
  };
}

export function paragraphsFromXml(xml) {
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  const W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
  const out = [];
  for (const p of doc.getElementsByTagNameNS(W, 'p')) {
    let text = '';
    const walk = node => {
      for (const c of node.childNodes) {
        const isW = c.namespaceURI === W;
        if (isW && c.localName === 't') text += c.textContent;
        else if (isW && (c.localName === 'tab' || c.localName === 'br')) text += ' ';
        else if (c.nodeType === 1 && !(isW && c.localName === 'pPr')) walk(c);
      }
    };
    walk(p);
    const numbered = p.getElementsByTagNameNS(W, 'numPr').length > 0;
    out.push({ text: text.replace(/\s+/g, ' ').trim(), numbered });
  }
  return out.filter(x => x.text);
}

/* ---------- .docx yaratma ---------- */
const NS = 'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"';
const x = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const RA = (sz, lang) => `<w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/><w:b/><w:bCs/><w:sz w:val="${sz}"/><w:szCs w:val="${sz}"/><w:lang w:val="${lang}"/></w:rPr>`;
const LANG = { az: 'az-Latn-AZ', ru: 'ru-RU', en: 'en-US' };
const TABS_CLR = '<w:tab w:val="clear" w:pos="4677"/><w:tab w:val="clear" w:pos="9355"/>';

function headerXml(I, L, lang) {
  const line = (t, last) => `<w:p><w:pPr><w:pStyle w:val="Header"/><w:tabs>${TABS_CLR}</w:tabs><w:spacing w:lineRule="auto" w:line="240"${last ? ' w:before="0" w:after="200"' : ''}/><w:ind w:end="-510"/></w:pPr><w:r>${RA(24, lang)}<w:t xml:space="preserve">${x(t)}</w:t></w:r></w:p>`;
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:hdr ${NS}>` +
    `<w:p><w:pPr><w:pStyle w:val="Header"/><w:tabs>${TABS_CLR}</w:tabs><w:spacing w:lineRule="auto" w:line="240"/><w:jc w:val="center"/></w:pPr><w:r>${RA(28, lang)}<w:t>${x(I.uni)}</w:t></w:r></w:p>` +
    `<w:p><w:pPr><w:pStyle w:val="Header"/><w:tabs>${TABS_CLR}</w:tabs><w:spacing w:lineRule="auto" w:line="240"/></w:pPr></w:p>` +
    line(`${L.fac}: ${I.fac}`) + line(`${L.dep}: ${I.dep}`) + line(`${L.spec}: ${I.spec}`) +
    line(`${L.course}: ${I.course}`) + line(`${L.group}: ${I.group}`) + line(`${L.subject}: ${I.subject}`, true) +
    `</w:hdr>`;
}

function footerXml(I, L, lang) {
  // Altlıq abzası sol sahədən 720 twip kənara çıxır; sağ kənar = 8391 − 1530 − 850 + 720 = 6731 twip
  const R = 6731;
  const p = (tabs, inner) => `<w:p><w:pPr><w:pStyle w:val="Footer"/><w:tabs>${TABS_CLR}${tabs}</w:tabs><w:spacing w:lineRule="auto" w:line="240" w:before="0" w:after="200"/><w:ind w:start="-720" w:end="0"/></w:pPr><w:r>${RA(24, lang)}${inner}</w:r></w:p>`;
  const lead = `<w:tab w:val="right" w:pos="${R}" w:leader="underscore"/>`;
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:ftr ${NS}>` +
    p(lead, `<w:t xml:space="preserve">${x(L.head)}</w:t><w:tab/><w:t xml:space="preserve">${x(I.head)}</w:t>`) +
    p(lead, `<w:t xml:space="preserve">${x(L.teacher)} </w:t><w:tab/><w:t xml:space="preserve"> ${x(I.teacher)}</w:t>`) +
    p(`<w:tab w:val="right" w:pos="${R}"/>`, `<w:t xml:space="preserve">${x(L.seal)}</w:t><w:tab/><w:t xml:space="preserve">${x(L.date(I.year))}</w:t>`) +
    `</w:ftr>`;
}

function documentXml(tickets, Q, L) {
  const rq = '<w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/></w:rPr>';
  let body = '';
  tickets.forEach((tk, i) => {
    // "Bilet №" başlığından sonra 10 pt boşluq — birinci sualla yapışmasın
    body += `<w:p><w:pPr><w:pStyle w:val="Heading1"/>${i ? '<w:pageBreakBefore/>' : ''}<w:spacing w:before="0" w:after="200"/><w:ind w:hanging="0" w:start="0"/><w:jc w:val="center"/></w:pPr>` +
      `<w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/><w:color w:val="000000"/></w:rPr><w:t>${x(L.ticket)}${i + 1}</w:t></w:r></w:p>`;
    tk.forEach((q, j) => {
      body += `<w:p><w:pPr><w:pStyle w:val="NormalWeb"/><w:tabs><w:tab w:val="left" w:pos="708"/></w:tabs><w:spacing w:lineRule="auto" w:line="276" w:before="0" w:after="0"/><w:ind w:start="0" w:end="0" w:firstLine="0"/><w:jc w:val="both"/></w:pPr>` +
        `<w:r>${rq}<w:t>${j + 1}.</w:t></w:r><w:r>${rq}<w:tab/><w:t xml:space="preserve">${x(Q[q])}</w:t></w:r></w:p>`;
    });
  });
  const sect = '<w:sectPr><w:headerReference w:type="default" r:id="rId2"/><w:footerReference w:type="default" r:id="rId3"/><w:type w:val="nextPage"/><w:pgSz w:w="8391" w:h="11906"/><w:pgMar w:left="1530" w:right="850" w:gutter="0" w:header="708" w:top="764" w:footer="341" w:bottom="1134"/><w:pgNumType w:fmt="decimal"/><w:formProt w:val="false"/><w:textDirection w:val="lrTb"/><w:docGrid w:type="default" w:linePitch="360" w:charSpace="0"/></w:sectPr>';
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document ${NS}><w:body>${body}${sect}</w:body></w:document>`;
}

const CRC_T = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(b) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < b.length; i++) c = CRC_T[(c ^ b[i]) & 255] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

// Sıxılmasız ZIP (Word bunu normal açır)
function zip(files) {
  const te = new TextEncoder();
  const parts = [], central = [];
  let off = 0;
  for (const [name, content] of files) {
    const nb = te.encode(name), data = te.encode(content), crc = crc32(data);
    const h = new DataView(new ArrayBuffer(30));
    h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true);
    h.setUint16(12, 0x21, true); h.setUint32(14, crc, true); h.setUint32(18, data.length, true);
    h.setUint32(22, data.length, true); h.setUint16(26, nb.length, true);
    parts.push(new Uint8Array(h.buffer), nb, data);
    const c = new DataView(new ArrayBuffer(46));
    c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true);
    c.setUint16(14, 0x21, true); c.setUint32(16, crc, true); c.setUint32(20, data.length, true);
    c.setUint32(24, data.length, true); c.setUint16(28, nb.length, true); c.setUint32(42, off, true);
    central.push(new Uint8Array(c.buffer), nb);
    off += 30 + nb.length + data.length;
  }
  const csize = central.reduce((s, a) => s + a.length, 0);
  const e = new DataView(new ArrayBuffer(22));
  e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true);
  e.setUint32(12, csize, true); e.setUint32(16, off, true);
  return new Blob([...parts, ...central, new Uint8Array(e.buffer)], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
}

export function buildDocx({ tickets, questions, info, labels, sector }) {
  const lang = LANG[sector] || LANG.az;
  const files = Object.entries(TEMPLATE);
  files.push(
    ['word/document.xml', documentXml(tickets, questions, labels)],
    ['word/header1.xml', headerXml(info, labels, lang)],
    ['word/footer1.xml', footerXml(info, labels, lang)],
  );
  return zip(files);
}
