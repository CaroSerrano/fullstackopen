const { test, expect, beforeEach, describe } = require('@playwright/test');
const { loginWith, createBlog } = require('./blogHelper');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset');
    await request.post('/api/users', {
      data: {
        name: 'Caro',
        username: 'Root',
        password: '1234',
      },
    });
    await page.goto('http://localhost:5173');
  });

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('Log in to application');
    await expect(locator).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'Root', '1234')
      await expect(page.getByText('Caro logged-in')).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
        await loginWith(page, 'Root', 'wrong')
        await expect(page.getByText('Caro logged-in')).not.toBeVisible();
    });
  });
});
