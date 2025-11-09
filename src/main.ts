import "./style.css";

import appleImage from "./apple_pad.png?url";

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
// for (let i = 0; i < 24; i++) {
//   const y = (i + 0.5) * (height / 24);
//   ctx.beginPath();
//   ctx.moveTo(0, y);
//   ctx.lineTo(width, y);
//   ctx.stroke();
// }

const offscreen = new OffscreenCanvas(width, height);
const offscreenCtx = offscreen.getContext("2d")!;

// lets get the ./apple_pad.png imagedata
const img = new Image();
img.src = appleImage;
img.onload = () => {
  setInterval(() => {
    ctx.clearRect(0, 0, width, height);
    offscreenCtx.translate(128, 128);
    offscreenCtx.rotate((2 * Math.PI) / 180);
    offscreenCtx.translate(-128, -128);

    offscreenCtx.drawImage(img, 0, 0, width, height);

    const imageData = offscreenCtx.getImageData(0, 0, width, height);
    renderToCanvas(imageData);
  }, 16);
};

const renderToCanvas = (imageData: ImageData) => {
  const lineInterval = height / 32;
  const colInterval = 4;
  let data = [];
  for (let row = 0; row < height; row++) {
    if (row % lineInterval === 0) {
      const rowData = [];
      let col = 0;
      let setInside = false;
      while (col < width) {
        col += colInterval;
        const pixel = (row * width + col) * 4;
        // rowData.push(imageData.data[pixel]);
        const isPixelBlack = imageData.data[pixel] < 250; // is "R" white, not very resiliant
        if (isPixelBlack && !setInside) {
          setInside = true;
        } else if (!isPixelBlack && setInside) {
          setInside = false;
        }

        rowData.push(setInside ? 1 : 0);
      }
      data.push(rowData);
    }
  }

  data.forEach((rowData, i) => {
    ctx.beginPath();
    const lineHeight = i * lineInterval + lineInterval * 0.5;
    ctx.moveTo(0, lineHeight);
    rowData.forEach((isEmbossed, i) => {
      const col = i * colInterval + 4;
      if (!isEmbossed) {
        ctx.lineTo(col, lineHeight);
      } else {
        ctx.lineTo(col, lineHeight - lineInterval * 0.75);
      }
    });
    ctx.stroke();
  });
};
