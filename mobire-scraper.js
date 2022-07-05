const puppeteer = require("puppeteer");

async function scrape() {
  const browser = await puppeteer.launch({});
  const page = await browser.newPage();
  await page.goto("https://mobire.ee/en/rental-cars/");

  const hrefs = 8;
  let carArray = [];

  for (let i = 1; i < hrefs; i++) {
    // changes page to individual car page
    await page.waitForSelector(
      "#load-car-cards > div:nth-child(" + i + ") > div > a"
    );
    await page.click("#load-car-cards > div:nth-child(" + i + ") > div > a");

    const nameElement = await page.waitForSelector(
      "body > section.detailedRentalCarHead > div > div.row.mb-5 > div > div.d-flex.flex-column.flex-xl-row.align-items-start > div.flex-fill > h3"
    );
    const carName = await page.evaluate(
      (element) => element.textContent,
      nameElement
    );

    const priceElement = await page.waitForSelector(
      "#standard_plan > div > div > span.plan-offer-price"
    );
    const carPrice = await page.evaluate(
      (element) => element.textContent,
      priceElement
    );

    const rentalPeriodElement = await page.waitForSelector(
      "#monthly_period > li.attribute.active > span"
    );
    const carRentalPeriod = await page.evaluate(
      (element) => element.textContent,
      rentalPeriodElement
    );

    const typeElement = await page.waitForSelector(
      "#technical_info > ul > li:nth-child(2) > div.value.flex-grow-1.text-left.text-lg-right"
    );
    const carType = await page.evaluate(
      (element) => element.textContent,
      typeElement
    );

    const fuelElement = await page.waitForSelector(
      "#technical_info > ul > li:nth-child(7) > div.value.flex-grow-1.text-left.text-lg-right"
    );
    const carFuel = await page.evaluate(
      (element) => element.textContent,
      fuelElement
    );

    const transmissionElement = await page.waitForSelector(
      "#technical_info > ul > li:nth-child(3) > div.value.flex-grow-1.text-left.text-lg-right"
    );
    const carTransmission = await page.evaluate(
      (element) => element.textContent,
      transmissionElement
    );

    const url = await page.url();

    carArray.push({
      name: carName,
      body_type: carType,
      transmission: carTransmission,
      fuel: carFuel,
      price: Number(carPrice.slice(0, -1)),
      currency: "€",
      price_period: carRentalPeriod,
      site: url,
    });

    // back to home page
    await page.waitForSelector(
      "body > section.navbar-main.front-page.bg-white > div.nav-main-mobile.d-block.d-xl-none.h-100 > ul > li.nav-item.flex-even.text-left > a"
    );
    await page.click(
      "body > section.navbar-main.front-page.bg-white > div.nav-main-mobile.d-block.d-xl-none.h-100 > ul > li.nav-item.flex-even.text-left > a"
    );
  }

  await browser.close();
  return carArray;
}

module.exports = { scrape };
