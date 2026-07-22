import { expect, test, type Page } from "@playwright/test";

test.describe("homepage", () => {
  const validEnquiryPayload = {
    enquiry_type: "buyer",
    asset_category: "bess",
    approximate_value: "50k_250k",
    name: "Test User",
    company: "Test Company",
    email: "test@example.com",
    phone: "+44 20 7946 0018",
    message: "We are looking for BESS equipment.",
  };

  async function fillValidEnquiryForm(
    page: Page,
    message: string,
    email = "test@example.com",
    assetCategory = "bess",
  ) {
    const form = page.locator('form[action="/api/enquiries"]');
    await form.getByRole("radio", { name: /buy equipment/i }).check();
    await form.getByLabel(/equipment type/i).selectOption(assetCategory);
    await form.getByLabel(/approximate deal value/i).selectOption("50k_250k");
    await form.getByLabel(/^name$/i).fill("Test User");
    await form.getByLabel(/company/i).fill("Test Company");
    await form.getByLabel(/^email$/i).fill(email);
    await form.getByLabel(/phone/i).fill("+44 20 7946 0018");
    await form.getByLabel(/tell us about the requirement or asset/i).fill(message);

    return form;
  }

  async function getMockSendCount(contains: string) {
    const response = await fetch(
      `http://127.0.0.1:3101/__resend-mock/count?contains=${encodeURIComponent(contains)}`,
    );
    const body = (await response.json()) as { count: number };
    return body.count;
  }

  test("loads the landing page and exposes the enquiry form", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Gephyra Markets/);
    await expect(page.getByText("Gephyra Markets").first()).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: /unlocking secondary-market value from surplus energy infrastructure/i,
      }),
    ).toBeVisible();
    await expect(page.getByText("Current market focus", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Used and surplus generators" })).toBeVisible();
    await expect(
      page.getByText(
        /used, ex-rental and surplus diesel generators, with an initial focus on 400–550 kVA equipment for UK and export markets/i,
      ),
    ).toBeVisible();

    const marketFocus = page.locator("section").filter({
      has: page.getByRole("heading", { name: "Used and surplus generators" }),
    });
    await expect(marketFocus.getByRole("link", { name: "Discuss an asset" })).toHaveAttribute(
      "href",
      "#contact",
    );

    await expect(page.getByRole("link", { name: "Discuss an asset" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "deal@gephyramarkets.com" })).toHaveAttribute(
      "href",
      "mailto:deal@gephyramarkets.com",
    );

    const form = page.locator('form[action="/api/enquiries"]');
    await expect(form).toBeVisible();
    await expect(form).toHaveAttribute("action", "/api/enquiries");
    await expect(form).toHaveAttribute("method", "post");
    await expect(form.getByRole("radio", { name: /buy equipment/i })).toBeVisible();
    await expect(form.getByRole("radio", { name: /sell equipment/i })).toBeVisible();
    await expect(form.getByLabel(/equipment type/i)).toBeVisible();
    await expect(
      form.getByLabel(/equipment type/i).getByRole("option", { name: "Generators" }),
    ).toHaveAttribute("value", "generators");
    await expect(form.getByLabel(/^name$/i)).toBeVisible();
    await expect(form.getByLabel(/^email$/i)).toBeVisible();
    await expect(form.getByLabel(/tell us about the requirement or asset/i)).toBeVisible();

    await expect(form.getByRole("radio", { name: /buy equipment/i })).toHaveAttribute("required", "");
    await expect(form.getByLabel(/equipment type/i)).toHaveAttribute("required", "");
    await expect(form.getByLabel(/^name$/i)).toHaveAttribute("required", "");
    await expect(form.getByLabel(/^email$/i)).toHaveAttribute("required", "");
    await expect(form.getByLabel(/tell us about the requirement or asset/i)).toHaveAttribute("required", "");
  });

  test("validates enquiry submissions server-side", async ({ request }) => {
    const missingRequiredResponse = await request.post("/api/enquiries", {
      data: {
        enquiry_type: "buyer",
        asset_category: "bess",
        email: "not-an-email",
      },
    });

    expect(missingRequiredResponse.status()).toBe(400);
    expect(await missingRequiredResponse.json()).toEqual({
      ok: false,
      message: "Please complete all required fields.",
    });

    const malformedResponse = await request.post("/api/enquiries", {
      data: {
        enquiry_type: "buyer",
        asset_category: "bess",
        name: "Test User",
        email: "not-an-email",
        message: "We have a BESS asset available.",
      },
    });

    expect(malformedResponse.status()).toBe(400);
    expect(await malformedResponse.json()).toEqual({
      ok: false,
      message: "Please enter a valid email address.",
    });
  });

  test("rejects unsupported content types", async ({ request }) => {
    const response = await request.post("/api/enquiries", {
      multipart: validEnquiryPayload,
    });

    expect(response.status()).toBe(415);
    expect(await response.json()).toEqual({
      ok: false,
      message: "Please submit the enquiry form again.",
    });
  });

  test("rejects oversized requests before normal parsing", async ({ request }) => {
    const response = await request.post("/api/enquiries", {
      data: JSON.stringify({
        ...validEnquiryPayload,
        message: "x".repeat(20_000),
      }),
      headers: {
        "content-type": "application/json",
      },
    });

    expect(response.status()).toBe(413);
    expect(await response.json()).toEqual({
      ok: false,
      message: "Please shorten the enquiry details and try again.",
    });
  });

  test("rejects clearly cross-origin browser submissions", async ({ request }) => {
    const response = await request.post("/api/enquiries", {
      data: validEnquiryPayload,
      headers: {
        origin: "https://attacker.example",
      },
    });

    expect(response.status()).toBe(403);
    expect(await response.json()).toEqual({
      ok: false,
      message: "Please submit the enquiry form again.",
    });
  });

  test("rejects honeypot submissions", async ({ request }) => {
    const response = await request.post("/api/enquiries", {
      data: {
        ...validEnquiryPayload,
        website: "https://spam.example",
      },
    });

    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({
      ok: false,
      message: "We could not submit this enquiry. Please try again.",
    });
  });

  test("shows genuine success after the provider confirms delivery", async ({ page }) => {
    const email = "confirmation-count@example.com";
    const countMarker = `Contact email: ${email}`;
    const beforeConfirmationCount = await getMockSendCount(countMarker);

    await page.goto("/");

    const form = await fillValidEnquiryForm(
      page,
      "We have a used 500 kVA generator available.",
      email,
      "generators",
    );
    await form.getByRole("button", { name: /send enquiry/i }).click();

    await expect(form.getByText("Thanks. Your enquiry has been submitted.")).toBeVisible();
    expect(await getMockSendCount(countMarker)).toBe(beforeConfirmationCount + 1);
  });

  test("still shows success when confirmation delivery fails after internal delivery", async ({ page }) => {
    await page.goto("/");

    const form = await fillValidEnquiryForm(
      page,
      "We are looking for BESS equipment.",
      "confirmation-failure@example.com",
    );
    await form.getByRole("button", { name: /send enquiry/i }).click();

    await expect(form.getByText("Thanks. Your enquiry has been submitted.")).toBeVisible();
    await expect(form.getByText("We could not submit this enquiry. Please try again.")).toHaveCount(0);
  });

  test("shows a clear error when the provider rejects delivery", async ({ page }) => {
    await page.goto("/");

    const form = await fillValidEnquiryForm(page, "Provider failure: We are looking for BESS equipment.");
    await form.getByRole("button", { name: /send enquiry/i }).click();

    await expect(form.getByText("We could not submit this enquiry. Please try again.")).toBeVisible();
    await expect(form.getByText(/Mock provider rejected send/i)).toHaveCount(0);
  });

  test("does not count provider responses without an id as success", async ({ page }) => {
    await page.goto("/");

    const form = await fillValidEnquiryForm(page, "No id response: We are looking for BESS equipment.");
    await form.getByRole("button", { name: /send enquiry/i }).click();

    await expect(form.getByText("We could not submit this enquiry. Please try again.")).toBeVisible();
    await expect(form.getByText("Thanks. Your enquiry has been submitted.")).toHaveCount(0);
  });

  test("does not show success from a query string alone", async ({ page }) => {
    await page.goto("/?enquiry=success#contact");

    const form = page.locator('form[action="/api/enquiries"]');
    await expect(form.getByText("Thanks. Your enquiry has been submitted.")).toHaveCount(0);
  });

  test("guards against rapid double submission in the browser", async ({ page }) => {
    const marker = "Rapid double submit marker";
    const email = "rapid-double-submit@example.com";
    const beforeCount = await getMockSendCount(marker);

    await page.goto("/");

    const form = await fillValidEnquiryForm(page, `${marker}: We are looking for BESS equipment.`, email);
    await form.getByRole("button", { name: /send enquiry/i }).dblclick();

    await expect(form.getByText("Thanks. Your enquiry has been submitted.")).toBeVisible();
    expect(await getMockSendCount(marker)).toBe(beforeCount + 1);
  });
});
