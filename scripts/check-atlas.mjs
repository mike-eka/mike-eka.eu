// Prüfung vor dem Merge nach main: `npm run check:atlas`
//
// 1. Build (frisch, _site wird vorher gelöscht) – ohne Warnungen außer dem
//    bekannten Platzhalter-Hinweis für Impressum/Datenschutz
// 2. Alle internen Links (href/src, auch #Anker) lösen auf
// 3. Keine externen Requests (Skripte, Styles, Bilder, iframes, CSS url(), …)
// 4. Keine TODO, keine PRÜFEN und keine [PLATZHALTER] auf veröffentlichten
//    Seiten und in den JSON-Ausgaben; keine TODO/PRÜFEN in den Daten
//    veröffentlichter Karten und in src/_data/atlas/
//
// Exit-Code 0 nur, wenn alles bestanden ist. Läuft ohne zusätzliche Pakete.
// Hinweis: Den Dev-Server (`npm start`) vorher beenden – unter Windows kann er
// Dateien in _site sperren.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = path.join(ROOT, "_site");
const ERLAUBTE_WARNUNG = /^\[mike-eka\] Platzhalter vor dem Merge/;

const befunde = { build: [], links: [], extern: [], inhalt: [], quellen: [] };
const rel = (p) => path.relative(ROOT, p).split(path.sep).join("/");

// ---------------------------------------------------------------- 1. Build
const hinweise = [];
try {
  fs.rmSync(SITE, { recursive: true, force: true });
} catch (e) {
  console.error(`_site ließ sich nicht löschen (${e.code}). Läuft noch der Dev-Server?`);
  process.exit(2);
}
// one fresh build; warnings come via console.warn (stderr) or stdout
const lauf = spawnSync(process.execPath, [path.join(ROOT, "node_modules/@11ty/eleventy/cmd.cjs")], {
  cwd: ROOT, encoding: "utf8",
});
if (lauf.status !== 0) {
  befunde.build.push(`Build fehlgeschlagen (Status ${lauf.status}): ${String(lauf.stderr || lauf.stdout).trim()}`);
}
(String(lauf.stdout) + "\n" + String(lauf.stderr)).split(/\r?\n/).map((z) => z.trim()).filter(Boolean).forEach((z) => {
  if (ERLAUBTE_WARNUNG.test(z)) hinweise.push(z);
  else if (/warn|error|fehler|\[atlas\]|problem/i.test(z)) befunde.build.push(z);
});

// ---------------------------------------------------------------- files
const dateien = [];
(function gehe(d) {
  if (!fs.existsSync(d)) return;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) gehe(p); else dateien.push(p);
  }
})(SITE);
const html = dateien.filter((p) => p.endsWith(".html"));
const css = dateien.filter((p) => p.endsWith(".css"));
const json = dateien.filter((p) => /\.(json|jsonld)$/.test(p));
const eigeneJs = dateien.filter((p) => p.endsWith(".js") && !p.includes(`${path.sep}vendor${path.sep}`));

const idsCache = new Map();
function ids(datei) {
  if (!idsCache.has(datei)) {
    const t = fs.readFileSync(datei, "utf8");
    idsCache.set(datei, new Set([...t.matchAll(/\s(?:id|name)="([^"]+)"/g)].map((m) => m[1])));
  }
  return idsCache.get(datei);
}

function zielDatei(von, url) {
  const [pfadTeil] = url.split(/[?#]/);
  let p = pfadTeil === "" ? von : pfadTeil.startsWith("/")
    ? path.join(SITE, decodeURIComponent(pfadTeil))
    : path.join(path.dirname(von), decodeURIComponent(pfadTeil));
  if (pfadTeil === "") return von;
  if (pfadTeil.endsWith("/")) p = path.join(p, "index.html");
  if (fs.existsSync(p) && fs.statSync(p).isFile()) return p;
  if (fs.existsSync(path.join(p, "index.html"))) return path.join(p, "index.html");
  return null;
}

const EXTERN = /^(?:[a-z][a-z0-9+.-]*:)?\/\//i;
const IGNORIEREN = /^(?:mailto:|tel:|javascript:|data:)/i;

// ---------------------------------------------------------------- 2./3. HTML
for (const datei of html) {
  const t = fs.readFileSync(datei, "utf8").replace(/<!--[\s\S]*?-->/g, "");
  const name = rel(datei);

  // external requests: anything the browser loads by itself
  const laden = [
    ...t.matchAll(/<(script|img|iframe|source|video|audio|embed|track|input)\b[^>]*\ssrc="([^"]+)"/gi),
    ...t.matchAll(/<(object)\b[^>]*\sdata="([^"]+)"/gi),
    ...t.matchAll(/<(link)\b[^>]*\shref="([^"]+)"/gi),
    ...t.matchAll(/<(img|source)\b[^>]*\ssrcset="([^"]+)"/gi),
    ...t.matchAll(/(style)="[^"]*url\(\s*['"]?([^'")]+)/gi),
    ...t.matchAll(/<(style)\b[^>]*>[\s\S]*?url\(\s*['"]?([^'")]+)/gi),
  ];
  for (const m of laden) {
    if (EXTERN.test(m[2].trim())) befunde.extern.push(`${name}: <${m[1]}> lädt ${m[2]}`);
  }

  // internal links and resources
  for (const m of t.matchAll(/\s(href|src)="([^"]*)"/g)) {
    const url = m[2].trim();
    if (!url || EXTERN.test(url) || IGNORIEREN.test(url)) continue;
    const ziel = zielDatei(datei, url);
    if (!ziel) { befunde.links.push(`${name}: ${url} → nicht gefunden`); continue; }
    const anker = url.includes("#") ? url.slice(url.indexOf("#") + 1) : "";
    if (anker && ziel.endsWith(".html") && !ids(ziel).has(decodeURIComponent(anker))) {
      befunde.links.push(`${name}: ${url} → Anker #${anker} fehlt in ${rel(ziel)}`);
    }
  }
}
for (const datei of css) {
  const t = fs.readFileSync(datei, "utf8");
  for (const m of t.matchAll(/url\(\s*['"]?([^'")]+)/g)) {
    if (EXTERN.test(m[1])) befunde.extern.push(`${rel(datei)}: url(${m[1]})`);
    else if (!m[1].startsWith("data:") && !m[1].startsWith("#") && !zielDatei(datei, m[1])) befunde.links.push(`${rel(datei)}: url(${m[1]}) → nicht gefunden`);
  }
  for (const m of t.matchAll(/@import\s+(?:url\()?['"]?([^'");]+)/g)) {
    if (EXTERN.test(m[1])) befunde.extern.push(`${rel(datei)}: @import ${m[1]}`);
  }
}
for (const datei of eigeneJs) {
  const t = fs.readFileSync(datei, "utf8");
  for (const m of t.matchAll(/(fetch|import|XMLHttpRequest|\.src\s*=)[^\n;]*?(https?:\/\/[^\s'"`)]+)/g)) {
    befunde.extern.push(`${rel(datei)}: ${m[1]} → ${m[2]}`);
  }
}

// ---------------------------------------------------------------- 4. content
const MARKEN = [
  { name: "TODO", re: /\bTODO\b/g },
  { name: "PRÜFEN", re: /PRÜFEN/g },
  // e.g. [E-MAIL-ADRESSE], [OPTIONAL: Telefon], [PRÜFEN: …]
  { name: "Platzhalter", re: /\[[A-ZÄÖÜ][A-ZÄÖÜ-]*[A-ZÄÖÜ][^\][<>]*\]/g },
];
function suche(datei, text, ziel) {
  for (const { name, re } of MARKEN) {
    const treffer = [...text.matchAll(re)];
    if (!treffer.length) continue;
    const beispiel = text.slice(Math.max(0, treffer[0].index - 30), treffer[0].index + 50).replace(/\s+/g, " ").replace(/<[^>]+>/g, "");
    ziel.push(`${datei}: ${treffer.length}× ${name} – z. B. „…${beispiel.trim()}…“`);
  }
}
for (const datei of [...html, ...json]) {
  const t = fs.readFileSync(datei, "utf8").replace(/<!--[\s\S]*?-->/g, "");
  suche(rel(datei), t, befunde.inhalt);
}

// sources: Atlas data and published cards (drafts may still contain TODO)
const quellen = [];
const datenDir = path.join(ROOT, "src/_data/atlas");
fs.readdirSync(datenDir).filter((f) => /\.ya?ml$/.test(f)).forEach((f) => quellen.push(path.join(datenDir, f)));
const musterDir = path.join(ROOT, "src/atlas/muster");
fs.readdirSync(musterDir).filter((f) => f.endsWith(".md")).forEach((f) => {
  const p = path.join(musterDir, f);
  if (/^veroeffentlicht:\s*true\b/m.test(fs.readFileSync(p, "utf8"))) quellen.push(p);
});
for (const p of quellen) {
  const t = fs.readFileSync(p, "utf8");
  for (const { name, re } of MARKEN.slice(0, 2)) {
    const zeilen = t.split(/\r?\n/).map((z, i) => [i + 1, z]).filter(([, z]) => new RegExp(re.source).test(z));
    if (zeilen.length) befunde.quellen.push(`${rel(p)}: ${name} in Zeile ${zeilen.map(([n]) => n).join(", ")}`);
  }
}

// ---------------------------------------------------------------- report
const TITEL = {
  build: "Build ohne Warnungen (außer Platzhalter-Hinweis)",
  links: "Interne Links und Anker lösen auf",
  extern: "Keine externen Requests",
  inhalt: "Keine TODO / PRÜFEN / [Platzhalter] auf veröffentlichten Seiten",
  quellen: "Keine TODO / PRÜFEN in Atlas-Daten und veröffentlichten Karten",
};
let ok = true;
console.log(`\ncheck:atlas – ${html.length} Seiten, ${css.length} CSS, ${json.length} JSON geprüft\n`);
for (const [k, titel] of Object.entries(TITEL)) {
  const liste = befunde[k];
  ok = ok && liste.length === 0;
  console.log(`${liste.length ? "✗" : "✓"} ${titel}${liste.length ? ` (${liste.length})` : ""}`);
  liste.forEach((b) => console.log(`    - ${b}`));
}
hinweise.forEach((h) => console.log(`\nHinweis: ${h}`));
console.log(ok ? "\nAlles bestanden." : "\nNicht bestanden – vor dem Merge nach main beheben.");
process.exit(ok ? 0 : 1);
