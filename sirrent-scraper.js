const puppeteer = require("puppeteer");

async function scrape() {
  const goToPage = "https://sirrent.ee/vehicles/";
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(goToPage);

  let goNextPage = true;
  let carsData = [];
  let currentUrl = page.url();
  while (goNextPage) {
    const grabCars = await page.evaluate((currentUrl) => {
      const cars = document.querySelectorAll(".smt-cr-list-loop-wrap");
      const carsArr = [];
      cars.forEach((carTag) => {
        const car = carTag.querySelector(".car-data h3");
        const carInfo = carTag.querySelectorAll(".attr-value");
        const rentalPrice = carTag.querySelector(".price-big");
        const pricePeriod = carTag.querySelector(".total_days");
        let currency = carTag.querySelector(".stm-mcr-price-view").innerText;
        currency =
          currency.charAt(currency.length - 1) === "€"
            ? (currency = "EUR")
            : (currency = "USD");

        carsArr.push({
          name: car.innerText,
          body_type: carInfo[4].innerText,
          transmission: carInfo[2].innerText,
          fuel: carInfo[1].innerText,
          price: Number(rentalPrice.innerText),
          currency: currency,
          price_period: pricePeriod.innerText,
          site: currentUrl,
        });
      });
      return carsArr;
    }, currentUrl);

    const nextPage = await page.evaluate(() => {
      return document.querySelector(".next") == null
        ? null
        : document.querySelector(".next").getAttribute("href");
    });

    carsData.push.apply(carsData, grabCars);
    // If next page exists then go next page, if not then stop while loop
    nextPage == null ? (goNextPage = false) : await page.goto(nextPage);
  }

  await browser.close();
  return carsData;
}

module.exports = { scrape };
