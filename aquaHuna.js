import fetch from "node-fetch";
import cheerio from "cheerio";

const baseURL = "https://aquahuna.com";

const getAquaHunaURLData = async () => {
  const aquaHunaFishUrlArr = [];
  const response = await fetch(baseURL);
  const body = await response.text();
  const $ = cheerio.load(body);
  const fishUrl = $(".collection-grid-item").each((index, element) => {
    const a = $(element).find("a").attr("href");
    aquaHunaFishUrlArr.push(baseURL + a);
  });
  await getFishURLData(aquaHunaFishUrlArr);
};

const getFishURLData = async (arr) => {
  const fishURLData = [];
  for (let i = 0; i < arr.length; i++) {
    const response = await fetch(arr[i]);
    const body = await response.text();
    const $ = cheerio.load(body);
    const fishData = $(".product.grid__item").each((index, element) => {
      const regExPrice = "Regular price";
      const regExpSoldOut = /sold out/i;
      const a = $(element).find("a").text().trim().replace(/\n/g, "");
      const soldOut = $(element).find("strong").text();
      const price = $(element)
        .find(".product__price")
        .text()
        .replace(regExPrice || /\n/g, "")
        .trim();
      fishURLData.push({
        name: a,
        price: price,
        soldOut: regExpSoldOut.test(soldOut),
      });
    });
    console.log("fishURL", fishURLData);
  }
};
getAquaHunaURLData();
