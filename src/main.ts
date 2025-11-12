import "./style.css";

import appleImage from "../images/apple_pad.png?url";
import img1 from "../output/foo-031.png";
import img2 from "../output/foo-032.png";
import img3 from "../output/foo-033.png";
import img4 from "../output/foo-034.png";
import img5 from "../output/foo-035.png";
import img6 from "../output/foo-036.png";
import img7 from "../output/foo-037.png";
import img8 from "../output/foo-038.png";
import img9 from "../output/foo-039.png";
import img10 from "../output/foo-040.png";
import img11 from "../output/foo-041.png";
import img12 from "../output/foo-042.png";
import img13 from "../output/foo-043.png";
import img14 from "../output/foo-044.png";
import img15 from "../output/foo-045.png";
import img16 from "../output/foo-046.png";
import img17 from "../output/foo-047.png";

const imgSrcs = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10,
  img11,
  img12,
  img13,
  img14,
  img15,
  img16,
  img17,
];
const promises = [];
const imgs = imgSrcs.map((imgsrc) => {
  const img = new Image();
  img.src = imgsrc;
  return img;
});

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
if (!ctx) {
  throw new Error("No canvas element found");
}

ctx.strokeStyle = "black";

const offscreen = new OffscreenCanvas(width, height);
const offscreenCtx = offscreen.getContext("2d")!;

preloadImages().then((images) => {
  let index = 0;
  console.log(images);
  setInterval(() => {
    ctx.clearRect(0, 0, width, height);
    offscreenCtx.clearRect(0, 0, width, height);
    offscreenCtx.drawImage(images[index], 0, 0, width, height);
    const imageData = offscreenCtx.getImageData(0, 0, width, height);
    renderToCanvas(imageData);
    if (index < images.length - 1) {
      index++;
    } else {
      index = 0;
    }
  }, 200);
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
};
