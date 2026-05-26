import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

const root = process.cwd();
const assetsDir = path.join(root, "assets");
const productDataPath = path.join(assetsDir, "js", "products-data.js");
const reportPath = path.join(root, "image-path-report.md");
const imageExts = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".jfif", ".svg", ".ico"]);

const toPosix = (value) => value.split(path.sep).join("/");
const rel = (filePath) => toPosix(path.relative(root, filePath));
const stripDiacritics = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const slugPart = (value, fallback = "item") => {
  const slug = stripDiacritics(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || fallback;
};
const slugFile = (fileName) => {
  const ext = path.extname(fileName).toLowerCase();
  const base = path.basename(fileName, path.extname(fileName));
  return `${slugPart(base, "image")}${ext}`;
};

const walk = (dir, predicate = () => true) => {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const results = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walk(fullPath, predicate));
    } else if (predicate(fullPath)) {
      results.push(fullPath);
    }
  }
  return results;
};

const imageFiles = walk(assetsDir, (filePath) => imageExts.has(path.extname(filePath).toLowerCase()));
const targetUse = new Set();
const mapping = new Map();

for (const filePath of imageFiles) {
  const parts = rel(filePath).split("/");
  const targetParts = parts.slice(0, -1).map((part) => {
    if (part === "assets" || part === "css" || part === "js") return part;
    return slugPart(part, "folder");
  });
  const cleanFile = slugFile(parts.at(-1));
  const ext = path.extname(cleanFile);
  const base = path.basename(cleanFile, ext);
  let candidate = [...targetParts, cleanFile].join("/");
  let count = 2;
  while (targetUse.has(candidate.toLowerCase())) {
    candidate = [...targetParts, `${base}-${count}${ext}`].join("/");
    count += 1;
  }
  targetUse.add(candidate.toLowerCase());
  mapping.set(rel(filePath), candidate);
}

const tempMoves = [];
for (const filePath of imageFiles) {
  const oldRel = rel(filePath);
  const tempPath = path.join(path.dirname(filePath), `codex-tmp-${randomUUID()}${path.extname(filePath)}`);
  fs.renameSync(filePath, tempPath);
  tempMoves.push({ oldRel, tempPath, targetRel: mapping.get(oldRel) });
}

for (const move of tempMoves) {
  const targetPath = path.join(root, ...move.targetRel.split("/"));
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.renameSync(move.tempPath, targetPath);
}

const removeEmptyDirs = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) removeEmptyDirs(path.join(dir, entry.name));
  }
  if (dir !== assetsDir && fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
};
removeEmptyDirs(assetsDir);

const normalizeDirectoryNames = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) normalizeDirectoryNames(path.join(dir, entry.name));
  }

  const currentName = path.basename(dir);
  if (dir === assetsDir || currentName === "css" || currentName === "js") return;
  const targetName = slugPart(currentName, "folder");
  if (currentName === targetName) return;

  const parent = path.dirname(dir);
  const tempPath = path.join(parent, `codex-dir-tmp-${randomUUID()}`);
  const targetPath = path.join(parent, targetName);
  try {
    fs.renameSync(dir, tempPath);
    fs.renameSync(tempPath, targetPath);
  } catch {
    const copyTemp = path.join(parent, `${targetName}-clean-${randomUUID()}`);
    fs.cpSync(dir, copyTemp, { recursive: true });
    const copiedFiles = walk(copyTemp, () => true).length;
    if (copiedFiles < 1) throw new Error(`Directory copy failed for ${dir}`);
    fs.rmSync(dir, { recursive: true, force: true });
    try {
      fs.renameSync(copyTemp, targetPath);
    } catch {
      fs.cpSync(copyTemp, targetPath, { recursive: true });
      fs.rmSync(copyTemp, { recursive: true, force: true });
    }
  }
};
normalizeDirectoryNames(assetsDir);

const textFiles = walk(root, (filePath) =>
  !filePath.includes(`${path.sep}.git${path.sep}`) &&
  [".html", ".css", ".js"].includes(path.extname(filePath).toLowerCase())
);

for (const filePath of textFiles) {
  let content = fs.readFileSync(filePath, "utf8");
  let updated = content;
  const sorted = [...mapping.entries()].sort((a, b) => b[0].length - a[0].length);
  for (const [oldRel, newRel] of sorted) {
    const escapedOld = oldRel.replace(/ /g, "%20");
    const escapedNew = newRel.replace(/ /g, "%20");
    updated = updated.split(oldRel).join(newRel);
    updated = updated.split(`../${oldRel}`).join(`../${newRel}`);
    updated = updated.split(escapedOld).join(escapedNew);
    updated = updated.split(`../${escapedOld}`).join(`../${escapedNew}`);
  }
  updated = updated
    .split("assets/img/proyectos/panel/papel.jpg").join("assets/productos/papel/papel.jpg")
    .split("../assets/img/proyectos/panel/papel.jpg").join("../assets/productos/papel/papel.jpg");

  updated = updated.replace(/(?:\.\.\/)?assets\/[A-Za-z0-9_./%() -]+\.(?:jpg|jpeg|png|gif|webp|jfif|svg|ico)/gi, (match) => {
    const prefix = match.startsWith("../") ? "../" : "";
    const clean = match.slice(prefix.length).replaceAll("%20", " ");
    const parts = clean.split("/");
    if (parts[0] !== "assets") return match;
    const normalizedParts = parts.map((part, index) => {
      if (index === 0 || part === "css" || part === "js") return part;
      if (index === parts.length - 1) return slugFile(part);
      return slugPart(part, "folder");
    });
    return `${prefix}${normalizedParts.join("/")}`;
  });

  if (updated !== content) fs.writeFileSync(filePath, updated);
}

const productRoot = path.join(assetsDir, "productos");
const productImages = walk(productRoot, (filePath) => imageExts.has(path.extname(filePath).toLowerCase()))
  .sort((a, b) => rel(a).localeCompare(rel(b)));
const productPath = (filePath) => rel(filePath).replace(/^assets\//, "");
const imagesWhere = (predicate) => productImages.filter(predicate).map(productPath);
const isIn = (filePath, folder) => rel(filePath).includes(`/productos/${folder}/`);
const name = (filePath) => path.basename(filePath).toLowerCase();

const defs = [
  ["pisos-deck", "pisos", "Deck", "Pisos y Revestimientos - Deck", "Opciones resistentes para interior y exterior.", (f) => isIn(f, "pisos") && name(f).includes("deck")],
  ["pisos-gimnasio", "pisos", "Gimnasio", "Pisos y Revestimientos - Gimnasio", "Opciones resistentes para interior y exterior.", (f) => isIn(f, "pisos") && name(f).includes("gim")],
  ["pisos-grama-artificial", "pisos", "Grama Artificial", "Pisos y Revestimientos - Grama Artificial", "Opciones resistentes para interior y exterior.", (f) => isIn(f, "grama")],
  ["pisos-infantil", "pisos", "Infantil", "Pisos y Revestimientos - Infantil", "Opciones resistentes para interior y exterior.", (f) => isIn(f, "pisos") && name(f).includes("infantil")],
  ["pisos-laminados", "pisos", "Laminados", "Pisos y Revestimientos - Laminados", "Opciones resistentes para interior y exterior.", (f) => isIn(f, "pisos") && name(f).includes("laminado")],
  ["pisos-pisos", "pisos", "Pisos", "Pisos y Revestimientos - Pisos", "Opciones resistentes para interior y exterior.", (f) => isIn(f, "pisos") && !/(deck|gim|infantil|laminado|spc|alfombra-modular)/.test(name(f))],
  ["pisos-spc", "pisos", "SPC", "Pisos y Revestimientos - SPC", "Opciones resistentes para interior y exterior.", (f) => isIn(f, "pisos") && name(f).includes("spc")],
  ["cojines-sala-decorativa", "cojines", "Sala Decorativa", "Cojines y Decoracion - Sala Decorativa", "Detalles decorativos para complementar tus espacios.", (f) => isIn(f, "sala") || isIn(f, "daybed")],
  ["cojines-sillas-y-cojines", "cojines", "Sillas y Cojines", "Cojines y Decoracion - Sillas y Cojines", "Detalles decorativos para complementar tus espacios.", (f) => isIn(f, "silla")],
  ["muebles-exterior-asoleadoras", "muebles-exterior", "Asoleadoras", "Muebles de Exterior - Asoleadoras", "Colecciones para terrazas, balcones y zonas sociales.", (f) => isIn(f, "asoleadora")],
  ["muebles-exterior-balcones", "muebles-exterior", "Balcones", "Muebles de Exterior - Balcones", "Colecciones para terrazas, balcones y zonas sociales.", (f) => isIn(f, "balcon")],
  ["muebles-exterior-comedores", "muebles-exterior", "Comedores", "Muebles de Exterior - Comedores", "Colecciones para terrazas, balcones y zonas sociales.", (f) => isIn(f, "comedor")],
  ["muebles-exterior-materas", "muebles-exterior", "Materas", "Muebles de Exterior - Materas", "Colecciones para terrazas, balcones y zonas sociales.", (f) => isIn(f, "matera")],
  ["muebles-exterior-mesas", "muebles-exterior", "Mesas", "Muebles de Exterior - Mesas", "Colecciones para terrazas, balcones y zonas sociales.", (f) => isIn(f, "mesa")],
  ["muebles-exterior-salas", "muebles-exterior", "Salas", "Muebles de Exterior - Salas", "Colecciones para terrazas, balcones y zonas sociales.", (f) => isIn(f, "sala") || isIn(f, "daybed")],
  ["muebles-exterior-sillas", "muebles-exterior", "Sillas", "Muebles de Exterior - Sillas", "Colecciones para terrazas, balcones y zonas sociales.", (f) => isIn(f, "silla")],
  ["productos-sombra-asoleadoras", "productos-sombra", "Asoleadoras", "Productos para Dar Sombra - Asoleadoras", "Alternativas para proteger tus espacios del sol.", (f) => isIn(f, "asoleadora")],
  ["productos-sombra-grama-artificial", "productos-sombra", "Grama Artificial", "Productos para Dar Sombra - Grama Artificial", "Alternativas para proteger tus espacios del sol.", (f) => isIn(f, "grama")],
  ["productos-sombra-pergolas", "productos-sombra", "Pergolas", "Productos para Dar Sombra - Pergolas", "Alternativas para proteger tus espacios del sol.", (f) => isIn(f, "pergola-romana")],
  ["productos-sombra-sets-de-balcon", "productos-sombra", "Sets de Balcon", "Productos para Dar Sombra - Sets de Balcon", "Alternativas para proteger tus espacios del sol.", (f) => isIn(f, "balcon")],
  ["productos-sombra-sombrillas", "productos-sombra", "Sombrillas", "Productos para Dar Sombra - Sombrillas", "Alternativas para proteger tus espacios del sol.", (f) => isIn(f, "sombrillas")],
  ["productos-sombra-toldos", "productos-sombra", "Toldos", "Productos para Dar Sombra - Toldos", "Alternativas para proteger tus espacios del sol.", (f) => isIn(f, "toldos-atos")],
  ["cortinas-celulares", "cortinas", "Celulares", "Cortinas y Persianas - Celulares", "Disenos para controlar luz y privacidad con estilo.", (f) => isIn(f, "cortinas/celulare") || isIn(f, "cortinas/duette")],
  ["cortinas-enrollables", "cortinas", "Enrollables", "Cortinas y Persianas - Enrollables", "Disenos para controlar luz y privacidad con estilo.", (f) => isIn(f, "cortinas/enrollables")],
  ["cortinas-macromadera", "cortinas", "Macromadera", "Cortinas y Persianas - Macromadera", "Disenos para controlar luz y privacidad con estilo.", (f) => isIn(f, "cortinas/macromadera")],
  ["cortinas-onda-serena", "cortinas", "Onda Serena", "Cortinas y Persianas - Onda Serena", "Disenos para controlar luz y privacidad con estilo.", (f) => isIn(f, "cortinas/ondaserena")],
  ["cortinas-panel-japones", "cortinas", "Panel Japones", "Cortinas y Persianas - Panel Japones", "Disenos para controlar luz y privacidad con estilo.", (f) => isIn(f, "cortinas/panel")],
  ["cortinas-romanas", "cortinas", "Romanas", "Cortinas y Persianas - Romanas", "Disenos para controlar luz y privacidad con estilo.", (f) => isIn(f, "cortinas/romana")],
  ["cortinas-sheer", "cortinas", "Sheer", "Cortinas y Persianas - Sheer", "Disenos para controlar luz y privacidad con estilo.", (f) => isIn(f, "cortinas/sheer")],
  ["cortinas-verticales", "cortinas", "Verticales", "Cortinas y Persianas - Verticales", "Disenos para controlar luz y privacidad con estilo.", (f) => isIn(f, "cortinas/vertical")],
  ["papel-colgadura-papel-decorativo", "papel-colgadura", "Papel Decorativo", "Papel de Colgadura - Papel Decorativo", "Acabados decorativos para transformar tus paredes.", (f) => isIn(f, "papel")],
  ["peliculas-control-solar", "peliculas", "Control Solar", "Peliculas de Seguridad y Control Solar - Control Solar", "Soluciones para seguridad, confort termico y control UV.", (f) => isIn(f, "cortinas/duette") || isIn(f, "cortinas/enrollables")],
  ["peliculas-seguridad", "peliculas", "Seguridad", "Peliculas de Seguridad y Control Solar - Seguridad", "Soluciones para seguridad, confort termico y control UV.", (f) => isIn(f, "cortinas/enrollables") || isIn(f, "cortinas/sheer")],
  ["tapetes-alfombra-modular", "tapetes", "Alfombra Modular", "Alfombras y Tapetes - Alfombra Modular", "Texturas y confort para cada ambiente.", (f) => isIn(f, "alfombra-modular") || (isIn(f, "pisos") && name(f).includes("alfombra-modular"))],
  ["tapetes-tapetes", "tapetes", "Tapetes", "Alfombras y Tapetes - Tapetes", "Texturas y confort para cada ambiente.", (f) => isIn(f, "tapetes") && !name(f).includes("atrapa")],
  ["tapetes-tapetes-especiales", "tapetes", "Tapetes Especiales", "Alfombras y Tapetes - Tapetes Especiales", "Texturas y confort para cada ambiente.", (f) => isIn(f, "tapetes") && name(f).includes("atrapa")]
];

const products = defs
  .map(([id, category, type, productName, description, predicate]) => ({
    id,
    category,
    type,
    name: productName,
    description,
    images: imagesWhere(predicate)
  }))
  .filter((product) => product.images.length > 0);

const allProductPaths = productImages.map(productPath);
const productData = `window.SHOWROOM_CONFIG = {
  whatsappNumber: "573104692399",
  fallbackImage: "img/hero-carousel/img4.png"
};

(function () {
  "use strict";

  const IMAGE_PATHS = ${JSON.stringify(allProductPaths, null, 4)};

  window.AVAILABLE_IMAGE_PATHS = new Set(
    IMAGE_PATHS.map((imagePath) => imagePath.toLowerCase())
  );

  window.PRODUCTS_DATA = ${JSON.stringify(products, null, 4)};
})();
`;
fs.writeFileSync(productDataPath, productData);

const currentImages = new Set(walk(assetsDir, (filePath) => imageExts.has(path.extname(filePath).toLowerCase())).map((filePath) => rel(filePath).toLowerCase()));
const missing = [];
const refRegex = /(?:\.\.\/)?assets\/[A-Za-z0-9_./%() -]+\.(?:jpg|jpeg|png|gif|webp|jfif|svg|ico)/gi;
for (const filePath of textFiles) {
  const content = fs.readFileSync(filePath, "utf8");
  for (const match of content.matchAll(refRegex)) {
    let refPath = match[0].replaceAll("%20", " ");
    while (refPath.startsWith("../")) refPath = refPath.slice(3);
    refPath = refPath.replace(/['")\s]+$/g, "");
    if (!currentImages.has(refPath.toLowerCase())) missing.push(`${rel(filePath)}: ${match[0]}`);
  }
}

const report = [
  "# Image Path Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  "## Summary",
  `- Normalized image files: ${mapping.size}`,
  `- Physical product images indexed: ${allProductPaths.length}`,
  `- Product groups generated: ${products.length}`,
  "",
  "## Missing Image References",
  ...(missing.length ? [...new Set(missing)].sort().map((item) => `- ${item}`) : ["- Ninguna referencia faltante detectada en HTML/CSS/JS."]),
  "",
  "## Renamed Paths",
  ...[...mapping.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([from, to]) => `- ${from} -> ${to}`)
].join("\n");
fs.writeFileSync(reportPath, report);

console.log(`Normalized image files: ${mapping.size}`);
console.log(`Physical product images indexed: ${allProductPaths.length}`);
console.log(`Product groups generated: ${products.length}`);
console.log(`Report: ${rel(reportPath)}`);
