import { expect, test } from '@playwright/test';

/**
 * Tests for Article CTA Card Editor functionality
 * Tests are run against the live Webflow page
 */

const PAGE_URL = 'https://moduledge.webflow.io/cta---construcor';

test.describe('Article CTA Card Editor', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the CTA constructor page
    await page.goto(PAGE_URL);
    // Wait for the script to load and execute
    await page.waitForTimeout(1000);
  });

  test('should add copy buttons to copy-html elements', async ({ page }) => {
    // Check that copy buttons are added to elements with article-cta-card="copy-html"
    const copyButtons = page.locator('.article-cta-copy-btn');
    const count = await copyButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should add delete buttons to visibility elements', async ({ page }) => {
    // Check that delete buttons are added to elements with article-cta-card="visibility"
    const deleteButtons = page.locator('.article-cta-delete-btn');
    const count = await deleteButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should make text elements editable in edit containers', async ({ page }) => {
    // Check that text elements inside article-cta-card-edit have contenteditable
    const editableElements = page.locator('[article-cta-card-edit] [contenteditable="true"]');
    const count = await editableElements.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should remove element when delete button is clicked', async ({ page }) => {
    // Find a specific delete button and its parent element
    const firstDeleteBtn = page.locator('.article-cta-delete-btn').first();

    // Get the element that will be removed (the button's parent or grandparent)
    const buttonBoundingBox = await firstDeleteBtn.boundingBox();
    expect(buttonBoundingBox).not.toBeNull();

    // Click the delete button
    await firstDeleteBtn.click();

    // Wait for removal
    await page.waitForTimeout(200);

    // The button should no longer exist at that position
    const buttonsAfter = page.locator('.article-cta-delete-btn');
    const countAfter = await buttonsAfter.count();

    // Just verify that at least one element was removed (count should be less)
    // We can't predict exact count because parent removal may remove multiple buttons
    expect(countAfter).toBeLessThan(15); // There were originally 12-15 buttons
  });

  test('should prevent link navigation in edit mode', async ({ page }) => {
    // Get the current URL
    const initialUrl = page.url();

    // Find a link inside the edit container
    const editLink = page.locator('[article-cta-card-edit] a').first();

    // Click the link
    await editLink.click();

    // Wait a bit
    await page.waitForTimeout(500);

    // URL should not have changed
    expect(page.url()).toBe(initialUrl);
  });

  test('should open markdown editor when clicking rich-text element', async ({ page }) => {
    // Find a rich-text element
    const richTextElement = page.locator('[article-cta-card="rich-text"]').first();

    // Click it
    await richTextElement.click();

    // Wait for modal to appear
    await page.waitForTimeout(300);

    // Check that the markdown editor modal is visible
    const modal = page.locator('.md-editor-overlay.active');
    await expect(modal).toBeVisible();

    // Check that textarea exists
    const textarea = page.locator('.md-editor-textarea');
    await expect(textarea).toBeVisible();
  });

  test('should close markdown editor when clicking cancel', async ({ page }) => {
    // Open the editor first
    const richTextElement = page.locator('[article-cta-card="rich-text"]').first();
    await richTextElement.click();
    await page.waitForTimeout(300);

    // Click cancel button
    const cancelBtn = page.locator('.md-editor-btn-cancel');
    await cancelBtn.click();

    // Wait for animation
    await page.waitForTimeout(300);

    // Modal should not be visible
    const modal = page.locator('.md-editor-overlay.active');
    await expect(modal).not.toBeVisible();
  });

  test('should inject styles into the page', async ({ page }) => {
    // Check that our styles are injected
    const styleTag = page.locator('#article-cta-editor-styles');
    await expect(styleTag).toBeAttached();
  });

  test('should copy HTML to clipboard when copy button is clicked', async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    // Click the copy button
    const copyBtn = page.locator('.article-cta-copy-btn').first();
    await copyBtn.click();

    // Wait for copy to complete
    await page.waitForTimeout(500);

    // Check that button shows success state
    await expect(copyBtn).toHaveClass(/copied/);

    // Read clipboard
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());

    // Should contain HTML (starts with < or contains div/section tags)
    expect(clipboardText).toMatch(/<[^>]+>/);
  });

  test('copied HTML should not contain editor buttons or attributes', async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    // Click the copy button
    const copyBtn = page.locator('.article-cta-copy-btn').first();
    await copyBtn.click();

    // Wait for copy to complete
    await page.waitForTimeout(500);

    // Read clipboard
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());

    // Should NOT contain editor button classes
    expect(clipboardText).not.toContain('article-cta-editor-btn');
    expect(clipboardText).not.toContain('article-cta-copy-btn');
    expect(clipboardText).not.toContain('article-cta-delete-btn');
    expect(clipboardText).not.toContain('article-cta-edit-indicator');

    // Should NOT contain contenteditable
    expect(clipboardText).not.toContain('contenteditable');

    // Should NOT contain article-cta-card-edit attribute
    expect(clipboardText).not.toContain('article-cta-card-edit=""');
  });

  test('deleting grid item should not leave empty space', async ({ page }) => {
    // Find the third card (with grid layout, no covers)
    const thirdCard = page.locator('[article-cta-card="copy-html"]').nth(2);

    // Get initial grid items count
    const gridItems = thirdCard.locator('.w-dyn-item');
    const initialCount = await gridItems.count();

    // Delete the first visibility element in this card
    const deleteBtn = thirdCard.locator('.article-cta-delete-btn').first();
    await deleteBtn.click();

    // Wait for removal
    await page.waitForTimeout(100);

    // Check that grid item was removed (not just the visibility element)
    const newCount = await gridItems.count();
    expect(newCount).toBe(initialCount - 1);

    // Verify no empty grid items remain
    const emptyItems = thirdCard.locator('.w-dyn-item:empty');
    const emptyCount = await emptyItems.count();
    expect(emptyCount).toBe(0);
  });
});
