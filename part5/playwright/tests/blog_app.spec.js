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
    await request.post('/api/users', {
      data: {
        name: 'Lina',
        username: 'secondary',
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
      await loginWith(page, 'Root', '1234');
      await expect(page.getByText('Caro logged-in')).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'Root', 'wrong');
      await expect(page.getByText('Caro logged-in')).not.toBeVisible();
    });
  });

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'Root', '1234');
    });

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, {
        title: 'first blog',
        author: 'Caro',
        url: 'bla',
      });
      
    });

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, {
          title: 'first blog',
          author: 'Caro',
          url: 'bla',
        });
      });

      test('a blog can be updated', async ({ page }) => {
        const blog = await page.getByTestId('blog');
        await blog.nth(0).getByRole('button', { name: 'view' }).click();
        await blog.nth(0).getByRole('button', { name: 'like' }).click();
        await expect(blog.nth(0).getByText('1')).toBeVisible();
      });

      test('or removed', async ({ page }) => {
        const blog = await page.getByTestId('blog');
        page.once('dialog', (dialog) => dialog.accept());
        await blog.nth(0).getByRole('button', { name: 'remove' }).click();

        await expect(page.getByTestId('blog')).toHaveCount(0);
      });

      test('and only creator user can see remove button', async ({ page }) => {
        await page.getByRole('button', { name: 'logout' }).click();
        await loginWith(page, 'secondary', '1234');
        await createBlog(page, {
          title: 'second blog',
          author: 'Caro',
          url: 'bla',
        });
        await expect(page.getByText('second blog')).toBeVisible();
        const firstBlog = page.getByText('first blog');
        await expect(firstBlog.getByText('remove')).not.toBeVisible();
      });
    });
  });
});
