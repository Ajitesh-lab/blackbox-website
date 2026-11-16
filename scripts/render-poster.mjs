// Run a local dev server first. Requires Playwright and its Chromium browser:
// node scripts/render-poster.mjs [http://localhost:3000] [public/images/recorder-poster.png]
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";
const url = process.argv[2] || "http://localhost:3000";
const output = process.argv[3] || "public/images/recorder-poster.png";
const browser = await chromium.launch({ headless: true, args: ["--enable-webgl", "--use-gl=angle", "--use-angle=swiftshader"] });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(`${url}/?poster=1`, { waitUntil: "networkidle" });
  await page.waitForSelector(".flight-webgl .flight-canvas canvas", { timeout: 60000 });
  await page.waitForTimeout(3000);
  if (errors.length) throw new Error(errors.join("\n"));
  await page.addStyleTag({ content: ".site-nav,.flight-section > :not(.model-slot),.site-footer{visibility:hidden!important}.recorder-poster{visibility:hidden!important}" });
  const slot = await page.locator(".flight-hero .model-slot").boundingBox();
  if (!slot) throw new Error("Missing recorder slot");
  await mkdir(dirname(output), { recursive: true });
  await page.screenshot({ path: output, clip: slot });
  console.log(`Rendered ${output}`);
} finally { await browser.close(); }
