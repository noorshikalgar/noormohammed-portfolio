import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:5173/";
const outDir = new URL("../test-artifacts/", import.meta.url).pathname;

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
await page.waitForSelector(".hero-terminal", { state: "visible" });
await page.waitForTimeout(2600);
await page.screenshot({ path: `${outDir}/home-desktop.png`, fullPage: true });
await page.locator(".hero-terminal").screenshot({ path: `${outDir}/hero-terminal.png` });

const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
});
await mobile.goto(baseUrl, { waitUntil: "domcontentloaded" });
await mobile.waitForSelector(".hero-terminal", { state: "visible" });
await mobile.waitForTimeout(2600);
await mobile.screenshot({ path: `${outDir}/home-mobile.png`, fullPage: true });

const terminalText = await page.locator(".terminal-screen").innerText();
if (!terminalText.includes("Noor Mohammed") || !terminalText.includes("Senior Engineer")) {
  throw new Error("Hero terminal did not render animated intro text.");
}

await browser.close();

console.log("Visual smoke passed: desktop, mobile, and terminal hero rendered.");
