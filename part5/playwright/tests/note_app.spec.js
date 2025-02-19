const { test, expect, describe, beforeEach } = require('@playwright/test');
const { loginWith, createNote } = require('./helper');

describe('Note app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset');
    await request.post('/api/users', {
      data: {
        name: 'Caro',
        username: 'Root',
        password: '123456',
      },
    });

    await page.goto('/');
  });
  test('front page can be opened', async ({ page }) => {
    const locator = await page.getByText('Notes');
    await expect(locator).toBeVisible();
    await expect(
      page.getByText(
        'Note app, Department of Computer Science, University of Helsinki 2024'
      )
    ).toBeVisible();
  });
  test('login fails with wrong password', async ({ page }) => {
    await page.getByRole('button', { name: 'login' }).click();
    await page.getByTestId('username').fill('Root');
    await page.getByTestId('password').fill('wrong');
    await page.getByRole('button', { name: 'log in' }).click();
    const errorDiv = await page.locator('.error');
    await expect(errorDiv).toContainText('Wrong credentials');
    await expect(errorDiv).toHaveCSS('border-style', 'solid');
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)');
    await expect(page.getByText('Caro logged-in')).not.toBeVisible();
  });

  test('user can login', async ({ page }) => {
    await loginWith(page, 'Root', '123456');
    await expect(page.getByText('Caro logged-in')).toBeVisible();
  });

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'Root', '123456');
    });

    test('a new note can be created', async ({ page }) => {
      await createNote(page, 'a note created by playwrigth');
      await expect(
        page.getByText('a note created by playwrigth')
      ).toBeVisible();
    });

    describe('and several notes exists', () => {
      beforeEach(async ({ page }) => {
        await createNote(page, 'first note', true);
        await createNote(page, 'second note', true);
        await createNote(page, 'third note', true);
      });

      test('importance can be changed', async ({ page }) => {
        const otherNoteText = await page.getByText('second note');
        const otherdNoteElement = await otherNoteText.locator('..');

        await otherdNoteElement
          .getByRole('button', { name: 'make not important' })
          .click();
        await expect(
          otherdNoteElement.getByText('make important')
        ).toBeVisible();
      });
    });
  });
});
