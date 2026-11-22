/**
 * Re-sube a Cloudinary las imagenes de mocks/images y actualiza las URLs
 * muertas de product_images y review_images en PostgreSQL.
 *
 * Uso:
 *   cd pawify-back
 *   node scripts/reupload-seed-images.mjs              # sube y actualiza DB + seed
 *   node scripts/reupload-seed-images.mjs --seed-only  # solo sincroniza el seed
 *
 * Requiere:
 *   - Docker con el servicio `db` levantado.
 *   - pawify-back/.env con CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY,
 *     CLOUDINARY_API_SECRET, POSTGRES_USER, POSTGRES_DB.
 *
 * Es seguro volver a ejecutarlo: sube archivos nuevos y vuelve a apuntar
 * las filas a las URLs nuevas. Tambien reescribe las URLs dentro de
 * database/init/backup_data.sql para que un volumen nuevo de Postgres no
 * vuelva a cargar las imagenes muertas.
 */
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const imagesDir = resolve(root, "..", "mocks", "images");

// Nombre del producto en la DB -> prefijo del archivo en mocks/images.
const productPrefixes = {
  "Croquetas": "croquetas",
  "Dispensador de comida": "dispensador",
  "Collar ajustable": "collar_ajustable",
  "Correa retráctil": "correa_retractil",
  "Juguete mordedor": "juguete_mordedor",
  "Cama para perro mediano": "cama_para_perro",
  "Shampoo antipulgas": "shampoo_antipulgas",
  "Comedero doble acero inoxidable": "comedero_acero",
  "Transportadora para mascotas": "transportadora",
  "Snack natural de pollo": "snack_pollo",
  "Collar LED luminoso": "collar_led",
  "Plato antivoracidad": "plato_antivoracidad",
  "Cepillo quitapelo": "cepillo_quitapelo",
  "Arena para gatos": "arena_gato",
  "Rascador para gatos": "rascador_gatos",
  "Pelota interactiva": "pelota_interactiva",
  "Vitaminas para perros": "vitaminas_perros",
  "Correa doble para paseo": "correa_doble",
  "Casita para perros pequeños": "casa_perro",
  "Bolsas biodegradables": "bolsa_biodegradable",
  "Arnés ajustable": "arnes_ajustable",
  "Snack dental": "snack_dental",
  "Fuente de agua automática": "fuente_agua",
};

const env = Object.fromEntries(
  readFileSync(join(root, ".env"), "utf8")
    .split(/\r?\n/)
    .map((line) => line.match(/^([A-Z0-9_]+)=(.*)$/))
    .filter(Boolean)
    .map(([, key, value]) => [key, value.trim()]),
);

const cloud = env.CLOUDINARY_CLOUD_NAME;
const apiKey = env.CLOUDINARY_API_KEY;
const apiSecret = env.CLOUDINARY_API_SECRET;
const dbUser = env.POSTGRES_USER;
const dbName = env.POSTGRES_DB;

if (!cloud || !apiKey || !apiSecret) {
  throw new Error("Faltan CLOUDINARY_* en pawify-back/.env");
}

const psql = (sql) =>
  execFileSync(
    "docker",
    ["compose", "exec", "-T", "db", "psql", "-U", dbUser, "-d", dbName, "-t", "-A", "-F", "|", "-c", sql],
    { cwd: root, encoding: "utf8" },
  )
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

const filesIn = (dir) =>
  readdirSync(dir)
    .filter((name) => /\.(jpe?g|png|webp)$/i.test(name))
    .sort();

const productFiles = filesIn(imagesDir);
const reviewFiles = filesIn(join(imagesDir, "review"));

const mimeByExt = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

let uploaded = 0;

async function upload(filePath, folder) {
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");

  const bytes = readFileSync(filePath);
  const form = new FormData();
  form.append(
    "file",
    new Blob([bytes], { type: mimeByExt[extname(filePath).toLowerCase()] ?? "application/octet-stream" }),
    basename(filePath),
  );
  form.append("api_key", apiKey);
  form.append("timestamp", String(timestamp));
  form.append("folder", folder);
  form.append("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
    method: "POST",
    body: form,
  });
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(`Cloudinary ${response.status} subiendo ${basename(filePath)}: ${JSON.stringify(body)}`);
  }

  uploaded += 1;
  console.log(`  ok ${basename(filePath)} -> ${body.secure_url}`);
  return { url: body.secure_url, publicId: body.public_id };
}

async function runLimited(items, limit, worker) {
  const results = new Array(items.length);
  let next = 0;

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const index = next++;
        results[index] = await worker(items[index], index);
      }
    }),
  );

  return results;
}

const quote = (value) => `'${String(value).replaceAll("'", "''")}'`;

/**
 * Actualiza las URLs dentro del seed (database/init/backup_data.sql) para que
 * un `docker compose down -v` no vuelva a dejar imagenes muertas.
 */
function patchSeed(productUrls, reviewUrls) {
  const seedPath = join(root, "database", "init", "backup_data.sql");
  const raw = readFileSync(seedPath, "utf8");
  const eol = raw.includes("\r\n") ? "\r\n" : "\n";
  const lines = raw.split(eol);

  let table = null;
  let changed = 0;

  const patched = lines.map((line) => {
    const copy = line.match(/^COPY public\.(product_images|review_images) \(id, url,/);
    if (copy) {
      table = copy[1];
      return line;
    }
    if (line === "\\.") {
      table = null;
      return line;
    }
    if (!table) {
      return line;
    }

    const urls = table === "product_images" ? productUrls : reviewUrls;
    const parts = line.split("\t");
    const url = urls.get(Number(parts[0]));
    if (!url || parts.length < 2) {
      return line;
    }

    parts[1] = url;
    changed += 1;
    return parts.join("\t");
  });

  writeFileSync(seedPath, patched.join(eol), "utf8");
  console.log(`Seed actualizado: ${changed} URLs en database/init/backup_data.sql`);
}

async function main() {
  const seedOnly = process.argv.includes("--seed-only");

  if (seedOnly) {
    const toMap = (sql) =>
      new Map(
        psql(sql).map((line) => {
          const [id, url] = line.split("|");
          return [Number(id), url];
        }),
      );

    patchSeed(
      toMap("SELECT id, url FROM product_images ORDER BY id;"),
      toMap("SELECT id, url FROM review_images ORDER BY id;"),
    );
    return;
  }

  console.log(`Cloudinary: cloud=${cloud} key=...${apiKey.slice(-3)}`);
  console.log(`Imagenes: ${productFiles.length} de productos, ${reviewFiles.length} de reviews\n`);

  // --- Productos ---
  const productRows = psql(
    "SELECT pi.id, p.name FROM product_images pi JOIN products p ON p.id = pi.product_id ORDER BY pi.id;",
  ).map((line) => {
    const [id, name] = line.split("|");
    return { id: Number(id), name };
  });

  const rowsByName = new Map();
  for (const row of productRows) {
    rowsByName.set(row.name, [...(rowsByName.get(row.name) ?? []), row]);
  }

  const productUpdates = [];

  for (const [productName, rows] of rowsByName) {
    const prefix = productPrefixes[productName];
    if (!prefix) {
      console.warn(`  ! Sin prefijo para "${productName}", se omite`);
      continue;
    }

    const files = productFiles
      .filter((name) => name.toLowerCase().startsWith(`${prefix}_`))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    if (files.length < rows.length) {
      console.warn(`  ! "${productName}" tiene ${rows.length} filas y solo ${files.length} archivos`);
    }

    console.log(`${productName} (${rows.length} filas)`);
    const uploads = await runLimited(files.slice(0, rows.length), 4, (file) =>
      upload(join(imagesDir, file), "pawify/seed/products"),
    );

    rows.forEach((row, index) => {
      if (uploads[index]) {
        productUpdates.push({ id: row.id, ...uploads[index] });
      }
    });
  }

  // --- Reviews ---
  const reviewRows = psql("SELECT id FROM review_images ORDER BY id;").map((line) => ({
    id: Number(line),
  }));

  const reviewUpdates = [];
  if (reviewRows.length) {
    console.log(`\nReviews (${reviewRows.length} filas, ${reviewFiles.length} archivos)`);
    const reviewUploads = await runLimited(reviewFiles, 4, (file) =>
      upload(join(imagesDir, "review", file), "pawify/seed/reviews"),
    );

    reviewRows.forEach((row, index) => {
      reviewUpdates.push({ id: row.id, ...reviewUploads[index % reviewUploads.length] });
    });
  }

  // --- Update en una sola transaccion ---
  const statements = [
    "BEGIN;",
    ...productUpdates.map(
      ({ id, url, publicId }) =>
        `UPDATE product_images SET url = ${quote(url)}, public_id = ${quote(publicId)} WHERE id = ${id};`,
    ),
    ...reviewUpdates.map(
      ({ id, url, publicId }) =>
        `UPDATE review_images SET url = ${quote(url)}, public_id = ${quote(publicId)} WHERE id = ${id};`,
    ),
    "COMMIT;",
  ].join("\n");

  execFileSync(
    "docker",
    ["compose", "exec", "-T", "db", "psql", "-v", "ON_ERROR_STOP=1", "-U", dbUser, "-d", dbName],
    { cwd: root, input: statements, encoding: "utf8" },
  );

  patchSeed(
    new Map(productUpdates.map(({ id, url }) => [id, url])),
    new Map(reviewUpdates.map(({ id, url }) => [id, url])),
  );

  console.log(
    `\nListo: ${uploaded} archivos subidos, ${productUpdates.length} filas de product_images y ${reviewUpdates.length} de review_images actualizadas.`,
  );
}

main().catch((error) => {
  console.error(`\nError: ${error.message}`);
  process.exitCode = 1;
});
