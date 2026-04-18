import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const OUT_DIR = path.join(process.cwd(), 'docs', 'assets');

async function main() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  
  // Create context with video recording enabled
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: {
      dir: OUT_DIR,
      size: { width: 1440, height: 900 },
    },
  });

  const page = await context.newPage();

  console.log('Navigating to dashboard (ensure Next.js is running on :3000)...');
  await page.goto('http://localhost:3000/');

  // Wait for initial animations to settle
  await page.waitForTimeout(4000);

  // Take screenshot with default state (Shield ON, Attack ON)
  console.log('Taking screenshot: Shield ON, Attack Active');
  await page.screenshot({ path: path.join(OUT_DIR, 'dashboard-shield-on.png') });

  // Scene 1: Initial Attack (5s)
  console.log('Recording B-Roll: Active Attack (5s)...');
  await page.waitForTimeout(5000);

  // Scene 2: Formula Tooltip Hover (5s)
  console.log('Hovering over Formula Tooltip...');
  await page.hover('#formula-tooltip-trigger');
  await page.waitForTimeout(2000);
  console.log('Taking screenshot: Formula Tooltip');
  await page.screenshot({ path: path.join(OUT_DIR, 'dashboard-formula-tooltip.png') });
  await page.waitForTimeout(3000);
  await page.mouse.move(0, 0); // Unhover

  // Scene 3: Toggle Attack OFF (Idle state)
  console.log('Toggling Attack OFF...');
  const attackBtn = page.locator('#attack-toggle');
  if (await attackBtn.count() > 0) {
    await attackBtn.click();
    await page.waitForTimeout(3000);
    console.log('Taking screenshot: Idle State');
    await page.screenshot({ path: path.join(OUT_DIR, 'dashboard-idle.png') });
    console.log('Recording B-Roll: Idle State (5s)...');
    await page.waitForTimeout(5000);
  }

  // Scene 4: Toggle Shield OFF
  console.log('Toggling Shield OFF...');
  const shieldBtn = page.locator('#shield-toggle');
  if (await shieldBtn.count() > 0) {
    await shieldBtn.click();
    await page.waitForTimeout(2000);
    console.log('Taking screenshot: Shield OFF');
    await page.screenshot({ path: path.join(OUT_DIR, 'dashboard-shield-off.png') });
    console.log('Recording B-Roll: Shield OFF (5s)...');
    await page.waitForTimeout(5000);
  }

  // Close context (this saves the video)
  console.log('Saving video...');
  await context.close();
  await browser.close();

  console.log('Assets saved to docs/assets/');
}

main().catch((err) => {
  console.error("Error running script:", err);
  process.exit(1);
});
