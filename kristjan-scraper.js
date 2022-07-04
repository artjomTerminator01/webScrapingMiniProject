const puppeteer = require("puppeteer");

const goToPage = "https://sirrent.ee/vehicles/";

async function scrape(goToPage) {
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

        carsArr.push({
          car: car.innerText,
          price: Number(rentalPrice.innerText),
          price_period: pricePeriod.innerText,
          currency: "EUR",
          fuel: carInfo[1].innerText,
          transmission: carInfo[2].innerText,
          seats: carInfo[3].innerText,
          body: carInfo[4].innerText,
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
    nextPage == null ? (goNextPage = false) : await page.goto(nextPage);
  }

  await browser.close();
  console.log(carsData);
  return carsData;
}
const data = scrape(goToPage);
