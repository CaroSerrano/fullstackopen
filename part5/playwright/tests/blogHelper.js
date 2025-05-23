

const loginWith = async (page, username, password) => {
  await page.getByTestId('username').fill(username);
  await page.getByTestId('password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
};

const createBlog = async (page, content) => {
  await page.getByRole('button', { name: 'create blog' }).click();
  const textboxes = await page.getByRole('textbox').all();

  await textboxes[0].fill(content.title);
  await textboxes[1].fill(content.author);
  await textboxes[2].fill(content.url);
  await page.getByRole('button', { name: 'Create Blog' }).click();
};


export { loginWith, createBlog };
