import { createCanvas, loadImage, ImageData, Image } from "canvas";

import { readdir } from "node:fs/promises";

const width = 256;
const height = 256;

const images = await readdir("final");

const imgSrcs = images.sort();

const offscreen = createCanvas(width, height);
const offscreenCtx = offscreen.getContext("2d")!;

function preloadImages() {
  const promises: Promise<Image>[] = [];
  const number_of_urls = imgSrcs.length;

  for (let i = 0; i < number_of_urls; i++) {
    promises.push(loadImage(`final/${imgSrcs[i]}`));
  }
  return Promise.all(promises);
}

const main = async () => {
  preloadImages().then(async (images) => {
    const imageLinesData: bigint[][] = [];
    images.forEach((image) => {
      offscreenCtx.clearRect(0, 0, width, height);
      offscreenCtx.drawImage(image, 0, 0, width, height);
      const imageData = offscreenCtx.getImageData(0, 0, width, height);
      const lineData = renderToCanvas(imageData);
      imageLinesData.push(lineData.map((lines) => bitsToBigInt(lines)));
    });

    await Bun.write(
      "public/imageDataSmall.json",
      JSON.stringify(imageLinesData, replacer)
    );
  });
};

main();

const replacer = (key, value) =>
  typeof value === "bigint" ? value.toString() : value;

function bitsToBigInt(bits: (1 | 0)[]) {
  let value = 0n;
  for (const bit of bits) {
    value = (value << 1n) | BigInt(bit);
  }
  return value; // stores all 64 bits
}

const renderToCanvas = (imageData: ImageData) => {
  // how many lines - IMPORTANT this locks what the FE can produce
  const lineInterval = height / 32;
  // how many pixels across we test
  const colInterval = 4;
  // we are checking pixels in the image to see if they are transparent or not
  let data: (1 | 0)[][] = [];
  for (let row = 0; row < height; row++) {
    if (row % lineInterval === 0) {
      const rowData: (1 | 0)[] = [];
      let col = 0;
      while (col < width) {
        col += colInterval;
        const pixel = (row * width + col) * 4;

        const isPixelBlack = imageData.data[pixel + 3] === 255;

        rowData.push(isPixelBlack ? 1 : 0);
      }
      data.push(rowData);
    }
  }

  return data;
};
