import { mkdir } from "node:fs/promises";
import { PNG } from "pngjs";
import { chromium } from "playwright";

const baseUrl = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:5173/";
const outDir = new URL("../test-artifacts/", import.meta.url).pathname;

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
await page.waitForSelector("canvas", { state: "visible" });
await page.waitForTimeout(1200);
await page.screenshot({ path: `${outDir}/home-desktop.png`, fullPage: true });
const canvasScreenshot = await page.locator("canvas").screenshot({ path: `${outDir}/keyboard-canvas.png` });

const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
});
await mobile.goto(baseUrl, { waitUntil: "domcontentloaded" });
await mobile.waitForSelector("canvas", { state: "visible" });
await mobile.waitForTimeout(1200);
await mobile.screenshot({ path: `${outDir}/home-mobile.png`, fullPage: true });

const canvasPng = PNG.sync.read(canvasScreenshot);
let nonBackgroundPixels = 0;
for (let y = 0; y < canvasPng.height; y += 12) {
  for (let x = 0; x < canvasPng.width; x += 12) {
    const index = (canvasPng.width * y + x) << 2;
    const r = canvasPng.data[index];
    const g = canvasPng.data[index + 1];
    const b = canvasPng.data[index + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    if (max > 35 && max - min > 8) {
      nonBackgroundPixels += 1;
    }
  }
}

await browser.close();

if (nonBackgroundPixels < 20) {
  throw new Error("3D keyboard canvas rendered blank pixels.");
}

console.log("Visual smoke passed: desktop, mobile, and 3D canvas rendered.");
