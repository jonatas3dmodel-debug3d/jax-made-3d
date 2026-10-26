// Gera as versões otimizadas (WebP, 640 / 1280 / 1920 px) de uma imagem da galeria e registra no manifesto.
//
//   npm install --no-save sharp          (uma vez; não faz parte do site)
//   node scripts/optimize-image.mjs <arquivo> <pasta/nome> [--crop esquerda,topo,largura,altura]
//
// Exemplo:  node scripts/optimize-image.mjs "D:/Projetos/render.png" meu-projeto/01-capa
// Gera public/work/meu-projeto/01-capa-640.webp, -1280.webp, -1920.webp (só os tamanhos que existem na origem)
// e atualiza src/work-manifest.json. Depois use "meu-projeto/01-capa" em `images` (src/data.js).
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const [, , source, base, ...flags] = process.argv;
if (!source || !base) {
  console.error("Uso: node scripts/optimize-image.mjs <arquivo> <pasta/nome> [--crop l,t,w,h]");
  process.exit(1);
}
const { default: sharp } = await import("sharp").catch(() => {
  console.error("Instale o sharp antes: npm install --no-save sharp");
  process.exit(1);
});

const cropArg = flags[flags.indexOf("--crop") + 1];
const crop = flags.includes("--crop") && cropArg ? (([left, top, width, height]) => ({ left, top, width, height }))(cropArg.split(",").map(Number)) : null;
const out = fileURLToPath(new URL("../public/work/", import.meta.url));
const manifestFile = new URL("../src/work-manifest.json", import.meta.url);

const meta = await sharp(source).metadata();
const srcW = crop ? crop.width : meta.width;
const srcH = crop ? crop.height : meta.height;
const widths = [640, 1280, 1920].filter((w) => w < srcW);
if (srcW <= 1920) widths.push(srcW);
else if (!widths.includes(1920)) widths.push(1920);

await mkdir(`${out}${base.split("/").slice(0, -1).join("/")}`, { recursive: true });
for (const width of widths) {
  const file = `${out}${base}-${width}.webp`;
  let pipe = sharp(source);
  if (crop) pipe = pipe.extract(crop);
  await pipe.resize({ width, withoutEnlargement: true }).webp({ quality: width <= 640 ? 76 : 80, effort: 5 }).toFile(file);
  console.log(`${base}-${width}.webp  ${Math.round((await stat(file)).size / 1024)} KB`);
}

const manifest = JSON.parse(await readFile(manifestFile, "utf8"));
const largest = Math.max(...widths);
manifest[base] = { widths, w: largest, h: Math.round((largest * srcH) / srcW) };
await writeFile(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`manifesto atualizado: "${base}" (${largest}x${manifest[base].h})`);
