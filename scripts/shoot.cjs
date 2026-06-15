// Local preview tool — renders each track surface to /tmp/shots/*.png.
// Uses playwright-core (no bundled browser) + a Chrome you point it at via
// CHROME_PATH, e.g. a Chrome-for-Testing build. Not part of the app runtime.
//
//   CHROME_PATH=/path/to/chrome npm run shots   # server must be running
const { chromium } = require("playwright-core");

const BASE = process.env.PREVIEW_BASE || "http://localhost:3000";
const CHROME =
  process.env.CHROME_PATH || "/opt/cft/chrome-linux64/chrome";
const shots = [
  { name: "1-ecfs-events", url: `${BASE}/events?track=ecfs`, full: true },
  { name: "2-alpha-events", url: `${BASE}/events?track=alpha`, full: true },
  { name: "3-epig-events", url: `${BASE}/events?track=epig`, full: true },
  {
    name: "4-ecfs-detail",
    url: `${BASE}/events/cash-flow-machine-rules-based-futures?track=ecfs`,
    full: true,
  },
  {
    name: "5-epig-detail-gated-form",
    url: `${BASE}/events/an-invitation-inside-the-ekantik-500?track=epig`,
    full: true,
  },
  {
    name: "6-ecfs-mobile",
    url: `${BASE}/events?track=ecfs`,
    full: true,
    viewport: { width: 390, height: 844 },
  },
];

(async () => {
  const browser = await chromium.launch({
    executablePath: CHROME,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });
  for (const s of shots) {
    const page = await browser.newPage({
      viewport: s.viewport ?? { width: 1366, height: 900 },
      deviceScaleFactor: 2,
    });
    await page.goto(s.url, { waitUntil: "networkidle", timeout: 30000 });
    // let fonts + countdown settle
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `/tmp/shots/${s.name}.png`, fullPage: !!s.full });
    console.log("captured", s.name);
    await page.close();
  }
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
