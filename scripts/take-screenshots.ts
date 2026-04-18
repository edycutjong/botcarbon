import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const OUT_DIR = path.join(process.cwd(), 'docs', 'assets');

async function main() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  console.log('Launching browser for screenshots...');
  const browser = await chromium.launch({ headless: true });
  
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  console.log('Navigating to dashboard (ensure Next.js is running on :3000)...');
  await page.goto('http://localhost:3000/');

  // Wait for initial animations to settle
  await page.waitForTimeout(4000);

  // 1. Snapshot: Default State
  console.log('Taking screenshot: Shield ON, Attack Active');
  await page.screenshot({ path: path.join(OUT_DIR, 'dashboard-shield-on.png') });

  // 2. Snapshot: Formula Tooltip Hover
  console.log('Hovering over Formula Tooltip...');
  await page.hover('#formula-tooltip-trigger');
  await page.waitForTimeout(1000);
  console.log('Taking screenshot: Formula Tooltip');
  await page.screenshot({ path: path.join(OUT_DIR, 'dashboard-formula-tooltip.png') });
  await page.mouse.move(0, 0); // Unhover

  // 3. Snapshot: Idle State
  console.log('Toggling Attack OFF...');
  const attackBtn = page.locator('#attack-toggle');
  if (await attackBtn.count() > 0) {
    await attackBtn.click();
    await page.waitForTimeout(2000);
    console.log('Taking screenshot: Idle State');
    await page.screenshot({ path: path.join(OUT_DIR, 'dashboard-idle.png') });
  }

  // 4. Snapshot: Shield OFF
  console.log('Toggling Shield OFF...');
  const shieldBtn = page.locator('#shield-toggle');
  if (await shieldBtn.count() > 0) {
    await shieldBtn.click();
    await page.waitForTimeout(1500);
    console.log('Taking screenshot: Shield OFF');
    await page.screenshot({ path: path.join(OUT_DIR, 'dashboard-shield-off.png') });
  }

  // 5. Snapshot: Attack Origins Map (scrolled into view)
  console.log('Scrolling to Attack Origins Map...');
  await page.locator('#attack-map-section').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  console.log('Taking screenshot: Attack Origins');
  await page.screenshot({ path: path.join(OUT_DIR, 'dashboard-attack-origins.png') });

  // 6. Snapshot: Threat Log (scrolled into view)
  console.log('Scrolling to Threat Log...');
  await page.locator('#attack-log-section').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  console.log('Taking screenshot: Threat Log');
  await page.screenshot({ path: path.join(OUT_DIR, 'dashboard-threat-log.png') });

  await context.close();
  await browser.close();

  console.log('📸 All screenshots saved to docs/assets/');
}

main().catch((err) => {
  console.error("Error running script:", err);
  process.exit(1);
});
export {};
