import { test, expect } from "../playwright-fixture";

const MAP_HASH = "#mapa";

test.describe("Geolocation flow on Centrar en mí", () => {
  test("granted: button switches to 'Centrar en mí' state", async ({ page, context }) => {
    await context.grantPermissions(["geolocation"]);
    await context.setGeolocation({ latitude: 20.1410, longitude: -98.6735 });

    await page.goto("/");
    const btn = page.getByTestId("geo-center-btn");
    await btn.scrollIntoViewIfNeeded();
    await expect(btn).toBeVisible();
    await btn.click();
    await expect(btn).toHaveAttribute("data-geo-status", "granted", { timeout: 10000 });
    await expect(page.getByTestId("geo-banner")).toHaveCount(0);
  });

  test("denied: shows denied banner", async ({ page, context }) => {
    await context.clearPermissions();
    await page.addInitScript(() => {
      // Force PERMISSION_DENIED
      // @ts-expect-error override
      navigator.geolocation.getCurrentPosition = (_s: PositionCallback, e?: PositionErrorCallback) => {
        e?.({ code: 1, message: "denied", PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3 } as GeolocationPositionError);
      };
    });
    await page.goto("/");
    const btn = page.getByTestId("geo-center-btn");
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    const banner = page.getByTestId("geo-banner");
    await expect(banner).toBeVisible({ timeout: 10000 });
    await expect(banner).toHaveAttribute("data-geo-status", "denied");
  });

  test("error/unsupported: shows unsupported banner when geolocation API missing", async ({ page }) => {
    await page.addInitScript(() => {
      // Remove geolocation support
      Object.defineProperty(navigator, "geolocation", { value: undefined, configurable: true });
    });
    await page.goto("/");
    const btn = page.getByTestId("geo-center-btn");
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    const banner = page.getByTestId("geo-banner");
    await expect(banner).toBeVisible({ timeout: 10000 });
    const status = await banner.getAttribute("data-geo-status");
    expect(["unsupported", "error"]).toContain(status);
  });
});
