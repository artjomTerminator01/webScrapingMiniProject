const jmvMotors = require("./jmv-scraping");
const sirrentScrapper = require("./sirrent-scraper");

async function scrapper() {
  let scrapperData = [];
  scrapperData.push.apply(scrapperData, await sirrentScrapper.scrape());
  scrapperData.push.apply(scrapperData, await jmvMotors.scrape());
  console.log(scrapperData);
}

scrapper();
