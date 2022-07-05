const jmvMotors = require("./jmv-scraping");
const sirrentScrapper = require("./sirrent-scraper");
const mobireScraper = require("./mobire-scraper");

async function scrapper() {
  let scrapperData = [];
  scrapperData.push.apply(scrapperData, await sirrentScrapper.scrape());
  scrapperData.push.apply(scrapperData, await jmvMotors.scrape());
  scrapperData.push.apply(scrapperData, await mobireScraper.scrape());
  console.log(scrapperData);
}

scrapper();
