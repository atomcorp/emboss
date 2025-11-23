import { createCanvas, loadImage, ImageData, Image } from "canvas";

import { readdir } from "node:fs/promises";

const width = 512;
const height = 512;

const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");

const images = await readdir("output");

const imgSrcs = images.sort();

const offscreen = createCanvas(width, height);
const offscreenCtx = offscreen.getContext("2d")!;

function preloadImages() {
  const promises: Promise<Image>[] = [];
  const number_of_urls = imgSrcs.length;

  for (let i = 0; i < number_of_urls; i++) {
    promises.push(loadImage(`output/${imgSrcs[0]}`));
  }
  return Promise.all(promises);
}

const main = async () => {
  preloadImages().then(async (images) => {
    const imageLinesData: (0 | 1)[][][] = [];
    images.forEach((image) => {
      offscreenCtx.clearRect(0, 0, width, height);
      offscreenCtx.drawImage(image, 0, 0, width, height);
      const imageData = offscreenCtx.getImageData(0, 0, width, height);
      const lineData = renderToCanvas(imageData);
      imageLinesData.push(lineData);
    });
    await Bun.write(
      "scripts/test.json",
      JSON.stringify(imageLinesData, null, 2)
    );
  });
};
main();
// loadImage(`output/${sortedImages[0]}`).then((image) => {
//   //   console.log(image);
//   offscreenCtx.clearRect(0, 0, width, height);
//   offscreenCtx.drawImage(image, 0, 0, width, height);
//   const imageData = offscreenCtx.getImageData(0, 0, width, height);
//   const lineData = renderToCanvas(imageData);
// });

const renderToCanvas = (imageData: ImageData) => {
  // how many lines
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

  data.forEach((rowData, i) => {
    ctx.beginPath();
    const lineHeight = i * lineInterval + lineInterval * 0.5;
    ctx.moveTo(0, lineHeight);
    rowData.forEach((isEmbossed, i) => {
      const col = i * colInterval + colInterval;
      if (!isEmbossed) {
        ctx.lineTo(col, lineHeight);
      } else {
        ctx.lineTo(col, lineHeight - lineInterval * 0.75);
      }
    });
    ctx.stroke();
  });

  return data;
};
