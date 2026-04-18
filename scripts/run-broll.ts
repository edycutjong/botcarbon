import { test, expect } from '@playwright/test';

test('capture b-roll footage', async ({ page }) => {
  // Increase test timeout to ensure the full sequence runs
  test.setTimeout(60000);

  console.log('🎬 Starting B-Roll Sequence...');
  
  // 1. Load the page
  console.log('Loading dashboard...');
  await page.goto('http://localhost:3000');
  
  // Wait for the main elements to load
  await expect(page.locator('h1')).toContainText('BOTCARBON');
  
  // Scene 1: Initial Load & Panning (5s)
  console.log('Scene 1: Introduction (5s pause) - Capturing initial load and Attack Map pings...');
  await page.waitForTimeout(5000);

  // Scene 2: Carbon Formula Tooltip Hover (5s)
  console.log('Scene 2: Core Value Prop (5s pause) - Hovering over CARBON FORMULA tooltip...');
  await page.hover('#formula-tooltip-trigger');
  
  // Hold hover state for 5 seconds
  await page.waitForTimeout(5000);
  
  // Unhover to clean up UI for the next scene
  await page.mouse.move(0, 0);
  await page.waitForTimeout(1000); // brief pause after unhover

  // Scene 3: Shield Activation (5s)
  console.log('Scene 3: Shield Activation (5s pause) - Clicking SHIELD ON...');
  await page.click('#shield-toggle');
  
  // Hold to observe the green particle mode and threat level update
  await page.waitForTimeout(5000);

  // Scene 4: Dynamic Threat Changes (10s sequence)
  // Transition from Elevated (Attack ON, Shield ON) to Nominal (Attack OFF)
  console.log('Scene 4: Dynamic Threat Changes (10s sequence) - Toggling Attack to Idle to demonstrate particle response...');
  await page.click('#attack-toggle');
  
  // Hold for an extended time to show the relaxing of the particle field and metrics
  await page.waitForTimeout(10000);

  console.log('✅ B-roll sequence complete!');
});
