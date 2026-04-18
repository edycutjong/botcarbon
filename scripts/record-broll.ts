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

  console.log('Navigating to dashboard...');
  await page.goto('http://localhost:3002/');

  // Wait for initial animations to settle
  await page.waitForTimeout(3000);

  // Take screenshot with Shield ON (default)
  console.log('Taking screenshot: Shield ON');
  await page.screenshot({ path: path.join(OUT_DIR, 'dashboard-shield-on.png') });

  // Record 5 seconds of B-roll with Shield ON
  console.log('Recording B-Roll: Shield ON (5s)...');
  await page.waitForTimeout(5000);

  // Toggle Shield off
  console.log('Toggling Shield OFF...');
  const toggleBtn = page.locator('#shield-toggle');
  if (await toggleBtn.count() > 0) {
    await toggleBtn.click();
    
    // Wait for the UI to update to the red state
    await page.waitForTimeout(1000);
    
    // Take screenshot with Shield OFF
    console.log('Taking screenshot: Shield OFF');
    await page.screenshot({ path: path.join(OUT_DIR, 'dashboard-shield-off.png') });

    // Record 5 seconds of B-roll with Shield OFF
    console.log('Recording B-Roll: Shield OFF (5s)...');
    await page.waitForTimeout(5000);
  } else {
    console.warn('Shield toggle button not found. Skipping off state.');
  }

  // Open Formula Tooltip
  console.log('Opening formula tooltip...');
  const tooltipBtn = page.locator('#formula-tooltip-trigger');
  if (await tooltipBtn.count() > 0) {
    await tooltipBtn.click();
    await page.waitForTimeout(1000);
    
    // Take screenshot with tooltip open
    console.log('Taking screenshot: Formula Tooltip');
    await page.screenshot({ path: path.join(OUT_DIR, 'dashboard-formula-tooltip.png') });
  }

  // Close context (this saves the video)
  await context.close();
  await browser.close();

  console.log('Assets saved to docs/assets/');
}

main().catch((err) => {
  console.error("Error running script:", err);
  process.exit(1);
});
