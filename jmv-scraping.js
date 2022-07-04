const puppeteer = require("puppeteer");

async function scrape() {
  const browser = await puppeteer.launch({});
  const page = await browser.newPage();

  let cars = [];
  await page.goto("https://jmvmotors.ee/rent/");
  let pageNumbers = await page.$$("a.page-numbers");

  for (let j = 2; j <= pageNumbers.length + 1; j++) {
    //page loop
    if (j > 2) {
      //page number button clicking
      await page.goto("https://jmvmotors.ee/rent/");
      await page.waitForSelector("#cars-pagination > a:nth-child(" + j + ")");
      await page.click("#cars-pagination > a:nth-child(" + j + ")");
    }
    const carsAmount = await page.$$("div.row.mt-3.cars-list-item");

    for (i = 1; i < carsAmount.length + 1; i++) {
      //cars loop
      const nameElement = await page.waitForSelector(
        "#cars-list > div:nth-child(" +
          i +
          ") > div.col-12.col-lg-6.py-3 > div.d-flex.has-border-bottom.pb-2.mb-4 > h5"
      );
      const bodyTypeElement = await page.waitForSelector(
        "#cars-list > div:nth-child(" +
          i +
          ") > div.col-12.col-lg-6.py-3 > div.row > div:nth-child(1) > div.row.equipment > div:nth-child(1) > b"
      );
      const transmissionElement = await page.waitForSelector(
        "#cars-list > div:nth-child(" +
          i +
          ") > div.col-12.col-lg-6.py-3 > div.row > div:nth-child(1) > div.row.equipment > div:nth-child(2) > b"
      );
      const fuelElement = await page.waitForSelector(
        "#cars-list > div:nth-child(" +
          i +
          ") > div.col-12.col-lg-6.py-3 > div.row > div:nth-child(1) > div.row.equipment > div:nth-child(3) > b"
      );
      const priceElement = await page.waitForSelector(
        "#cars-list > div:nth-child(" +
          i +
          ") > div.col-12.col-lg-6.py-3 > div.row > div:nth-child(1) > div.my-4 > b"
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
      const car = {};
      car.name = carName;
      car.body_type = carBodyType;
      car.transmission = carTransmission;
      car.fuel = carFuel;
      car.price = parseInt(/[0-9]*/.exec(carPrice)[0]);

      const currency = /[$€]/.exec(carPrice)[0];
      if (currency === "€") {
        car.currency = "EUR";
      } else {
        car.currency = "USD";
      }

      car.price_period = "1 " + /\b(\w+)$/.exec(carPrice)[0];
      car.site = "https://jmvmotors.ee/rent/";
      cars.push(car);
    }
  }
  browser.close();
  return cars;
}
module.exports = { scrape };
