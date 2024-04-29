const puppeteer = require("puppeteer");
const { setDefaultOptions } = require('expect-puppeteer');
const fs = require("fs");
const fsPromises = fs.promises;

const baseURL = process.env.BASE_URL || "http://localhost:3000";

const onPageConsole = (msg) =>
  Promise.all(msg.args().map((event) => event.jsonValue())).then((eventJson) =>
    console.log(`<LOG::page console ${msg.type()}>`, ...eventJson)
  );

setDefaultOptions({
  timeout: 1000,
  puppeteerLaunchOptions: {
    slowMo: 50,
    args: [
      '--window-size=1920,1080',
      '--disable-dev-shm-usage',
      '--no-sandbox',
      '--single-process'
    ]
  }
});

describe("Reservation E2E tests", () => {
  let page;
  let browser;

  beforeAll(async () => {
    await fsPromises.mkdir("./.screenshots", { recursive: true });
  });

  beforeEach(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    page.on("console", onPageConsole);
    await page.goto(`${baseURL}/reservations/new`, { waitUntil: "load" });
  });

  afterEach(async () => {
    await browser.close();
  });

  describe("/reservations/new page", () => {
    beforeEach(async () => {
      await page.type("input[name=first_name]", "John");
      await page.type("input[name=last_name]", "Doe");
      await page.type("input[name=mobile_number]", "1234567890");
      await page.type("input[name=people]", "3");
    });

    it("displays an error message if reservation time is before 10:30 AM", async () => {
      await page.type("input[name=reservation_date]", "02022035");
      await page.type("input[name=reservation_time]", "10:15AM");

      await expect(page).toMatchElement("h1", { text: "Make A Reservation" });

      await page.screenshot({
        path: ".screenshots/us-02-reservation-too-early-before.png",
      });

      await page.click("button[type=submit]");

      await page.waitForSelector(".alert-danger");

      await page.screenshot({
        path: ".screenshots/us-02-reservation-too-early-after.png",
      });

      expect(await page.$(".alert-danger")).toBeTruthy();
      expect(await page.evaluate(() => document.querySelector("body").textContent)).toContain("Reservation time must be after 10:30 AM");
    });

    it("displays an error message if reservation time is too close to close time", async () => {
      await page.type("input[name=reservation_date]", "02022035");
      await page.type("input[name=reservation_time]", "1005PM");

      await expect(page).toMatchElement("h1", { text: "Make A Reservation" });

      await page.screenshot({
        path: ".screenshots/us-02-reservation-almost-closing-before.png",
      });

      expect(await page.$(".alert-danger")).toBeFalsy();

      await page.click("button[type=submit]");

      await page.waitForSelector(".alert-danger");

      await page.screenshot({
        path: ".screenshots/us-02-reservation-almost-closing-after.png",
      });

      expect(await page.$(".alert-danger")).toBeTruthy();
      expect(await page.evaluate(() => document.querySelector("body").textContent)).toContain("Reservation time must be at least 30 minutes before closing");
    });

    it("displays an error message if reservation time is after the close time", async () => {
      await page.type("input[name=reservation_date]", "02022035");
      await page.type("input[name=reservation_time]", "1045PM");

      await expect(page).toMatchElement("h1", { text: "Make A Reservation" });

      await page.screenshot({
        path: ".screenshots/us-02-reservation-too-late-before.png",
      });

      expect(await page.$(".alert-danger")).toBeFalsy();

      await page.click("button[type=submit]");

      await page.waitForSelector(".alert-danger");

      await page.screenshot({
        path: ".screenshots/us-02-reservation-too-late-after.png",
      });

      expect(await page.$(".alert-danger")).toBeTruthy();
      expect(await page.evaluate(() => document.querySelector("body").textContent)).toContain("Reservation time must be at least 30 minutes before closing");
    });
  });
});
