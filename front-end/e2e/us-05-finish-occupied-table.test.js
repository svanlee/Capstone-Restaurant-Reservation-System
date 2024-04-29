const puppeteer = require("puppeteer");
const { setDefaultOptions } = require('expect-puppeteer');
const fs = require("fs");
const fsPromises = fs.promises;
const { expect } = require('@testing-library/puppeteer');
const { createReservation, createTable } = require("./api");
const { ReportGenerator } = require('puppeteer-report');

const baseURL = process.env.BASE_URL || "http://localhost:3000";

const report = new ReportGenerator({
  path: './report',
  open: true,
});

describe("US-05 - Finish an occupied table - E2E", () => {
  let page;
  let browser;
  let reservation;
  let table;

  beforeAll(async () => {
    await fsPromises.mkdir("./.screenshots", { recursive: true });
    setDefaultOptions({ timeout: 1000 });
    browser = await puppeteer.launch();
    report.on('page', (page) => {
      page.on('console', (msg) => {
        report.addConsole(msg);
      });
      page.on('dialog', async (dialog) => {
        report.addDialog(dialog);
        await expect(dialog.message()).resolves.toContain(
          "Is this table ready to seat new guests?"
        );
        await dialog.accept();
      });
      page.on('response', (response) => {
        report.addResponse(response);
      });
    });
  });

  afterAll(async () => {
    await browser.close();
    report.generate();
  });

  beforeEach(async () => {
    reservation = await createReservation({
      first_name: "Finish",
      last_name: Date.now().toString(10),
      mobile_number: "800-555-1313",
      reservation_date: "2035-01-01",
      reservation_time: "13:45",
      people: 4,
    });

    table = await createTable({
      table_name: `#${Date.now().toString(10)}`,
      capacity: 99,
      reservation_id: reservation.reservation_id,
    });

    page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(`${baseURL}/dashboard?date=2035-01-01`, {
      waitUntil: "networkidle0",
    });
    await page.reload({ waitUntil: "networkidle0" });
  });

  test("clicking finish button and then clicking OK makes that table available", async () => {
    await page.screenshot({
      path: ".screenshots/us-05-dashboard-finish-button-before.png",
      fullPage: true,
    });

    await expect(page).toMatchElement(`[data-table-id-status="${table.table_id}"]:has-text("occupied")`);

    const finishButtonSelector = `[data-table-id-finish="${table.table_id}"]`;
    await page.waitForSelector(finishButtonSelector);

    await page.click(finishButtonSelector);

    await page.waitForResponse((response) => {
      return response.url().endsWith(`/tables`);
    });

    await page.screenshot({
      path: ".screenshots/us-05-dashboard-finish-button-after.png",
      fullPage: true,
    });

    await expect(page).toMatchElement(`[data-table-id-status="${table.table_id}"]:has-text("free")`);
  });

  test("clicking finish button and then clicking CANCEL does nothing", async () => {
    await page.screenshot({
      path: ".screenshots/us-05-dashboard-finish-button-cancel-before.png",
      fullPage: true,
    });

    await expect(page).toMatchElement(`[data-table-id-status="${table.table_id}"]:has-text("occupied")`);

    const finishButtonSelector = `[data-table-id-finish="${table.table_id}"]`;
    await page.waitForSelector(finishButtonSelector);

    await page.click(finishButtonSelector);

    await page.waitForTimeout(1000);

    await page.screenshot({
      path: ".screenshots/us-05-dashboard-finish-button-cancel-after.png",
      fullPage: true,
    });

    await expect(page).not.toMatchElement(`[data-table-id-status="${table.table_id}"]:has-text("free")`);
  });
});


npm install @testing-library/puppeteer puppeteer-report
