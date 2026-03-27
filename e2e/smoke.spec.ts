import { expect, test } from "@playwright/test";

test.describe("Smoke e2e", () => {
  test("article page has inline exercise and global navigation", async ({ page }) => {
    await page.goto("/articles/js-core");

    await expect(page.getByRole("heading", { name: "JavaScript Core" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Проверить ответ" }).first()).toBeVisible();

    await page.getByRole("link", { name: "Главная" }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("heading", { name: "Frontend Interview Portal" })).toBeVisible();
  });

  test("test flow with skip reaches results page", async ({ page }) => {
    await page.goto("/test");
    await expect(page.getByRole("heading", { name: "Test-режим" })).toBeVisible();

    for (let index = 0; index < 20; index += 1) {
      const completedHeading = page.getByRole("heading", { name: "Тест завершен" });
      if (await completedHeading.isVisible()) {
        break;
      }

      const skipButton = page.getByRole("button", {
        name: "Пропустить текущий вопрос и перейти к следующему",
      });
      await expect(skipButton).toBeVisible();
      await skipButton.click();
    }

    await expect(page.getByRole("heading", { name: "Тест завершен" })).toBeVisible();
    await page.getByRole("link", { name: "Открыть результаты" }).click();

    await expect(page).toHaveURL(/\/results$/);
    await expect(page.getByRole("heading", { name: "Результаты теста" })).toBeVisible();
    await expect(page.getByText("Пропущено").first()).toBeVisible();
  });
});
