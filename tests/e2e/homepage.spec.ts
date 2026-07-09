import { expect, test } from "@playwright/test";

test.describe("homepage", () => {
  test("loads the landing page and exposes the enquiry form", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Gephyra Markets/);
    await expect(page.getByText("Gephyra Markets").first()).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: /unlocking secondary-market value from surplus energy infrastructure/i,
      }),
    ).toBeVisible();

    await expect(page.getByRole("link", { name: "Discuss an asset" }).first()).toBeVisible();

    const form = page.locator("form").filter({ has: page.getByRole("button", { name: /send enquiry/i }) });
    await expect(form).toBeVisible();
    await expect(form.getByRole("radio", { name: /buy equipment/i })).toBeVisible();
    await expect(form.getByRole("radio", { name: /sell equipment/i })).toBeVisible();
    await expect(form.getByLabel(/equipment type/i)).toBeVisible();
    await expect(form.getByLabel(/^name$/i)).toBeVisible();
    await expect(form.getByLabel(/^email$/i)).toBeVisible();
    await expect(form.getByLabel(/tell us about the requirement or asset/i)).toBeVisible();

    await expect(form.getByRole("radio", { name: /buy equipment/i })).toHaveAttribute("required", "");
    await expect(form.getByLabel(/equipment type/i)).toHaveAttribute("required", "");
    await expect(form.getByLabel(/^name$/i)).toHaveAttribute("required", "");
    await expect(form.getByLabel(/^email$/i)).toHaveAttribute("required", "");
    await expect(form.getByLabel(/tell us about the requirement or asset/i)).toHaveAttribute("required", "");
  });
});
