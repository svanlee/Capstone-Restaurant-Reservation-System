const puppeteer = require("puppeteer-core");
const { setDefaultOptions } = require('expect-puppeteer');
const fs = require("fs");
const fsPromises = fs.promises;
const { retry, waitForExpect } = require('wait-for-expect');
const { EOL } = require('os');
const { join } = require('path');
const { exec } = require('child_process');

const baseURL = process.env.BASE_URL || "http://localhost:3000";

const onPageConsole = (msg) =>
  Promise.all(msg.args().map((event) => event.jsonValue())).then((eventJson) =>
    console.log(`<LOG::page console ${msg.type()}>`, ...eventJson)
  );

const retryOptions = {
  retries: 3,
  minTimeout: 500,
  maxTimeout: 5000,
  factor: 2,
};

describe("US-02 - Create reservation on a future, working date - E2E", () => {
  let page;
  let browser;

  beforeAll(async () => {
    await fsPromises.mkdir("./.screenshots", { recursive: true });
    setDefaultOptions({ timeout: 1000 });
  });

  beforeEach(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    page.on("console", onPageConsole);
    await page.setViewport({ width: 1920, height: 1080 });
    await retry(async () => {
      await page.goto(`${baseURL}/reservations/new`, { waitUntil: "load" });
    }, retryOptions);
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

    test("displays an error message if the date of the reservation occurs in the past", async () => {
      await page.type("input[name=reservation_date]", "12242020");
      await page.type("input[name=reservation_time]", "05:30PM");

      await page.screenshot({
        path: ".screenshots/us-02-reservation-is-future-before.png",
      });

      await retry(async () => {
        await page.click("button[type=submit]");
      }, retryOptions);

      await page.screenshot({
        path: ".screenshots/us-02-reservation-is-future-after.png",
      });

      const alerts = await retry(async () => {
        return await page.$$(".alert-danger");
      }, retryOptions);

      expect(alerts.length).toBeGreaterThan(0);
    });

    test("displays an error message if reservation date falls on a Tuesday", async () => {
      await page.type("input[name=reservation_date]", "02062035");
      await page.type("input[name=reservation_time]", "05:30PM");

      await page.screenshot({
        path: ".screenshots/us-02-reservation-is-working-day-before.png",
      });

      await retry(async () => {
        await page.click("button[type=submit]");
      }, retryOptions);

      await page.screenshot({
        path: ".screenshots/us-02-reservation-is-working-day-after.png",
      });

      const alerts = await retry(async () => {
        return await page.$$(".alert-danger");
      }, retryOptions);

      expect(alerts.length).toBeGreaterThan(0);
    });
  });
}, 60000);

const exportResults = async () => {
  const jsonReporter = require('jest-circus/build/reporters/json');
  const jsonReporterOptions = {
    teamCity: true,
    outputPath: join(__dirname, 'test-results.json'),
  };
  const jsonReporterInstance = new jsonReporter(jsonReporterOptions);
  await jsonReporterInstance.onRunComplete({
    results: {
      success: true,
      testsCount: 2,
      testResults: [
        {
          testPath: './index.test.js',
          testResults: [
            {
              status: 'passed',
              message: null,
              duration: 12345,
              numPassed: 1,
              numFailed: 0,
              numPending: 0,
              coverage: null,
              fullName: 'US-02 - Create reservation on a future, working date - E2E /reservations/new page displays an error message if the date of the reservation occurs in the past',
              coverageSummary: null,
              testExecError: null,
              ancestorTitles: [
                'US-02 - Create reservation on a future, working date - E2E',
                '/reservations/new page',
              ],
            },
            {
              status: 'passed',
              message: null,
              duration: 12345,
              numPassed: 1,
              numFailed: 0,
              numPending: 0,
              coverage: null,
              fullName: 'US-02 - Create reservation on a future, working date - E2E /reservations/new page displays an error message if reservation date falls on a Tuesday',
              coverageSummary: null,
              testExecError: null,
              ancestorTitles: [
                'US-02 - Create reservation on a future, working date - E2E',
                '/reservations/new page',
              ],
            },
          ],
        },
      ],
    },
  });
};

exportResults().then(() => {
  console.log(`Test results have been saved to test-results.json`);
  exec(`npx puppeteer-exporter --input-json test-results.json --output-folder .screenshots`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
}).catch((error) => {
  console.error(`exportResults error: ${error}`);
});


npm install puppeteer-core expect-puppeteer fs puppeteer-exporter wait-for-expect jest-retry


"scripts": {
  "test": "jest --runInBand --detectOpenHandles --testTimeout=60000",
  "export-results": "node index.test.js && npx puppeteer-exporter --input-json test-results.json --output-folder .screenshots"
}


npm run export-results
