import "./style.css";

import appleImage from "../images/apple_pad.png?url";
import imgSrcs from "./images";
import imageData from "./imageData";

function preloadImages() {
  const promises = [];
  const images: HTMLImageElement[] = [];
  const number_of_urls = imgSrcs.length;

  for (let i = 0; i < number_of_urls; i++) {
    const img = new Image();
    images.push(img);
    promises.push(
      new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      })
    );
    img.src = imgSrcs[i];
  }
  return Promise.all(promises).then(() => images);
}

const width = 256;
const height = 256;

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <canvas id="canvas" height="${height}" width="${width}"></canvas>
`;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

function bitsToBigInt(bits: number[]) {
  let value = 0n;
  for (const bit of bits) {
    value = (value << 1n) | BigInt(bit);
  }
  return value; // stores all 64 bits
}

function getAllBitsFast(x: bigint) {
  let s = x.toString(2).padStart(64, "0");
  return Array.from(s, (c) => Number(c));
}

if (!ctx) {
  throw new Error("No canvas element found");
}

ctx.strokeStyle = "black";

const offscreen = new OffscreenCanvas(width, height);
const offscreenCtx = offscreen.getContext("2d")!;

preloadImages().then((images) => {
  let index = 0;
  const imageLinesData = [];
  console.log(images.length);
  for (let index = 0; index < images.length; index++) {
    // const element = array[index];

    // setInterval(() => {
    ctx.clearRect(0, 0, width, height);
    offscreenCtx.clearRect(0, 0, width, height);
    offscreenCtx.drawImage(images[index], 0, 0, width, height);
    const imageData = offscreenCtx.getImageData(0, 0, width, height);
    const lineData = renderToCanvas(imageData);
    console.log(index);
    imageLinesData.push(lineData.map((lines) => bitsToBigInt(lines)));
    if (index < images.length - 1) {
      // index++;
    } else {
      // index = 0;
    }
    // }, 120);
  }

  console.log(imageLinesData.length);
});

const renderToCanvas = (imageData: ImageData) => {
  // how many lines
  const lineInterval = height / 32;
  // how many pixels across we test
  const colInterval = 4;
  // we are checking pixels in the image to see if they are transparent or not
  let data = [];
  for (let row = 0; row < height; row++) {
    if (row % lineInterval === 0) {
      const rowData = [];
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
