const puppeteer = require("puppeteer");

async function scrape() {
  const goToPage = "https://sirrent.ee/vehicles/";
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(goToPage);

  let goNextPage = true;
  let carsData = [];
  while (goNextPage) {
    const carsAmount = await page.$$(".smt-cr-list-loop-wrap");
    for (i = 3; i < carsAmount.length + 3; i++) {
      const nameElement = await page.waitForSelector(
        ".col-md-9.col-sm-12.col-xs-12 > div:nth-child(" +
          i +
          ") > div.reserv-visible-block > div.reserv-car-info-wrap > div.car-info-top > div.car-data > h3"
      );
      const bodyTypeElement = await page.waitForSelector(
        ".col-md-9.col-sm-12.col-xs-12 > div:nth-child(" +
          i +
          ") > div.reserv-visible-block > div.reserv-car-info-wrap > div.car-info-bottom > ul > li:nth-child(5) > div.attr-value > p"
      );
      const transmissionElement = await page.waitForSelector(
        ".col-md-9.col-sm-12.col-xs-12 > div:nth-child(" +
          i +
          ") > div.reserv-visible-block > div.reserv-car-info-wrap > div.car-info-bottom > ul > li:nth-child(3) > div.attr-value > p"
      );
      const fuelElement = await page.waitForSelector(
        ".col-md-9.col-sm-12.col-xs-12 > div:nth-child(" +
          i +
          ") > div.reserv-visible-block > div.reserv-car-info-wrap > div.car-info-bottom > ul > li:nth-child(2) > div.attr-value > p"
      );
      const priceElement = await page.waitForSelector(
        ".col-md-9.col-sm-12.col-xs-12 > div:nth-child(" +
          i +
          ") > div.reserv-visible-block > div.reserv-price-wrap > div.stm_price_info > div.daily_price > div > span.price-big"
      );

      const currencyElement = await page.waitForSelector(
        ".col-md-9.col-sm-12.col-xs-12 > div:nth-child(" +
          i +
          ") > div.reserv-visible-block > div.reserv-price-wrap > div.stm_price_info > div.daily_price > div > span.currency"
      );

      const pricePeriodElement = await page.waitForSelector(
        ".col-md-9.col-sm-12.col-xs-12 > div:nth-child(" +
          i +
          ") > div.reserv-visible-block > div.reserv-price-wrap > div.stm_price_info > div.total_days"
      );

      const carName = await page.evaluate(
        (element) => element.textContent,
        nameElement
      );
      const carBodyType = await page.evaluate(
        (element) => element.textContent,
        bodyTypeElement
      );
      const carTransmission = await page.evaluate(
        (element) => element.textContent,
        transmissionElement
      );
      const carFuel = await page.evaluate(
        (element) => element.textContent,
        fuelElement
      );
      const carPrice = await page.evaluate(
        (element) => element.textContent,
        priceElement
      );
      const pricePeriod = await page.evaluate(
        (element) => element.innerText,
        pricePeriodElement
      );

      let currency = await page.evaluate(
        (element) => element.textContent,
        currencyElement
      );

      currency =
        currency.charAt(currency.length - 1) === "€"
          ? (currency = "EUR")
          : (currency = "USD");

      const car = {
        name: carName,
        body_type: carBodyType,
        transmission: carTransmission,
        fuel: carFuel,
        price: Number(carPrice),
        currency: currency,
        price_period: pricePeriod,
        site: page.url(),
      };
      carsData.push(car);
    }

    const nextPage = await page.evaluate(() => {
      return document.querySelector(".next") == null
        ? null
        : document.querySelector(".next").getAttribute("href");
    });
    // If next page exists then go next page, if not then stop while loop
    nextPage == null ? (goNextPage = false) : await page.goto(nextPage);
  }

  await browser.close();
  return carsData;
}

module.exports = { scrape };
