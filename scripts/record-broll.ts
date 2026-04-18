import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const OUT_DIR = path.join(process.cwd(), 'docs', 'assets');

async function recordScene(browser: any, sceneName: string, action: (page: any) => Promise<void>) {
  console.log(`\n🎬 Preparing scene: ${sceneName}...`);
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: {
      dir: OUT_DIR,
      size: { width: 1440, height: 900 },
    },
  });

  const page = await context.newPage();
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(2000); // let initial animations settle

  console.log(`🎥 Recording: ${sceneName}...`);
  await action(page);

  const videoPath = await page.video()?.path();
  await context.close(); // finalizes the video file

  if (videoPath && fs.existsSync(videoPath)) {
    const finalPath = path.join(OUT_DIR, `${sceneName}.webm`);
    fs.renameSync(videoPath, finalPath);
    console.log(`✅ Saved ${sceneName}.webm`);
  }
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  console.log('Launching browser for B-Roll video segments...');
  const browser = await chromium.launch({ headless: true });

  // Scene 1: Initial Attack
  await recordScene(browser, 'broll-active-attack', async (page) => {
    await page.waitForTimeout(5000);
  });

  // Scene 2: Formula Tooltip Hover
  await recordScene(browser, 'broll-formula-hover', async (page) => {
    await page.hover('#formula-tooltip-trigger');
    await page.waitForTimeout(4000);
    await page.mouse.move(0, 0); // Unhover gap
    await page.waitForTimeout(1000);
  });

  // Scene 3: Idle State
  await recordScene(browser, 'broll-idle', async (page) => {
    const attackBtn = page.locator('#attack-toggle');
    if (await attackBtn.count() > 0) {
      await attackBtn.click();
      await page.waitForTimeout(4000);
    }
  });

  // Scene 4: Shield OFF
  await recordScene(browser, 'broll-shield-off', async (page) => {
    const shieldBtn = page.locator('#shield-toggle');
    if (await shieldBtn.count() > 0) {
      await shieldBtn.click();
      await page.waitForTimeout(4000);
    }
  });

  // Scene 5: Attack Origins Map (scroll into view)
  await recordScene(browser, 'broll-attack-origins', async (page) => {
    await page.locator('#attack-map-section').scrollIntoViewIfNeeded();
    await page.waitForTimeout(4000);
  });

  // Scene 6: Threat Log (scroll into view)
  await recordScene(browser, 'broll-threat-log', async (page) => {
    await page.locator('#attack-log-section').scrollIntoViewIfNeeded();
    await page.waitForTimeout(4000);
  });

  await browser.close();
  console.log('\n🎉 All separated B-Roll webm clips have been saved to docs/assets/');
}

main().catch((err) => {
  console.error("Error running script:", err);
  process.exit(1);
});
export {};
