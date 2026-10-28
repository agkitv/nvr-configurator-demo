/**
 * TZ screenshots for wizard search tab.
 *   cd docs/tz/wizard-search && npm install && node capture-screenshots.mjs
 */
import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.join(__dirname, "img");
const indexUrl = "file:///" + path.resolve(__dirname, "../../../index.html").replace(/\\/g, "/");

const clipWizard = async (page) => {
  const box = await page.$eval("#wizDr", (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });
  return { type: "png", clip: { ...box, scale: 1 } };
};

async function setupSearchDone(page) {
  await page.evaluate(() => {
    pick("s1");
    openW();
    wizd.devState = "done";
    wizd.devSearchProgress = 100;
    wizd.devFiltPop = false;
    wizd.devFieldsPop = false;
    wizd.modePop = false;
    wizd.devFilter = "";
    wizd.devSelected.clear();
    wizd.bulkEditOpen = false;
    wizd.devSelectedOnly = false;
    wizd.devViewMode = "standard";
    renderDeviceWizard();
    const sc = document.querySelector(".dev-results-scroll");
    if (sc) sc.scrollTop = 0;
  });
}

async function shotWizard(page, name, mutate) {
  if (mutate) await page.evaluate(mutate);
  await page.evaluate((fileName) => {
    const foot = document.getElementById("wizFoot")?.innerText || "";
    if (!foot.includes("Добавить вручную") && !foot.includes("Добавить выбранные")) {
      throw new Error("Footer missing before " + fileName);
    }
  }, name);
  const opts = await clipWizard(page);
  await page.screenshot({ path: path.join(imgDir, name), ...opts });
}

async function shotConfirm(page, name, bulk) {
  await page.evaluate((isBulk) => {
    skipCredentialsWarn = false;
    askAddWithoutCredentials(() => {}, isBulk);
  }, bulk);
  await page.waitForSelector("#confirm.open");
  await page.screenshot({ path: path.join(imgDir, name) });
  await page.evaluate(() => closeConfirm());
}

const browser = await puppeteer.launch({ headless: true, defaultViewport: { width: 1920, height: 1080 } });
const page = await browser.newPage();
await page.goto(indexUrl, { waitUntil: "networkidle0" });
await setupSearchDone(page);
await new Promise((r) => setTimeout(r, 300));

await shotWizard(page, "01-search-list.png");
await shotWizard(page, "02-status-filters.png", () => {
  wizd.devFiltPop = true;
  renderDeviceWizard();
});
await shotWizard(page, "03-local-filter.png", () => {
  wizd.devFiltPop = false;
  wizd.devFieldsPop = false;
  wizd.devFilter = "172.19";
  wizd.devSelectedOnly = false;
  wizd.devSelected.clear();
  renderDeviceWizard();
});
await shotWizard(page, "03-selected-only.png", () => {
  wizd.devFilter = "";
  const sel = selectableDeviceResults().slice(0, 3);
  wizd.devSelected = new Set(sel.map((r) => r.id));
  setDeviceSelectedOnly(true);
  renderDeviceWizard();
});
await shotWizard(page, "04-view-compact.png", () => {
  setDeviceSelectedOnly(false);
  wizd.devSelected.clear();
  setDeviceViewMode("compact");
  renderDeviceWizard();
  const sc = document.querySelector(".dev-results-scroll");
  if (sc) sc.scrollTop = 0;
});
await shotWizard(page, "04-view-standard.png", () => {
  setDeviceViewMode("standard");
  renderDeviceWizard();
  const sc = document.querySelector(".dev-results-scroll");
  if (sc) sc.scrollTop = 0;
});
await shotWizard(page, "04-view-extended.png", () => {
  setDeviceViewMode("extended");
  renderDeviceWizard();
  const sc = document.querySelector(".dev-results-scroll");
  if (sc) sc.scrollTop = 0;
});
await shotWizard(page, "05-card-conflict.png", () => {
  setDeviceViewMode("standard");
  renderDeviceWizard();
  const sc = document.querySelector(".dev-results-scroll");
  if (sc) sc.scrollTop = 0;
});
await shotWizard(page, "06-add-selected.png", () => {
  const sel = selectableDeviceResults().slice(0, 3);
  wizd.devSelected = new Set(sel.map((r) => r.id));
  wizd.bulkEditOpen = false;
  renderDeviceWizard();
});
await shotWizard(page, "07-bulk-edit.png", () => {
  toggleBulkEdit(true);
  wizd.bulkEdit.vendor = "Axis";
  renderDeviceWizard();
});

await setupSearchDone(page);
await shotConfirm(page, "08-credentials-single.png", false);
await setupSearchDone(page);
await shotConfirm(page, "08-credentials-bulk.png", true);

await browser.close();
console.log("Saved PNG to", imgDir);
