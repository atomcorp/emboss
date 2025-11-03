import "./style.css";

import appleImage from "./apple_pad.png?url";

const width = 248;
const height = 248;

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <canvas id="canvas" height="${height}" width="${width}"></canvas>
`;

// first lets draw a canvas with 24 horizontal lines
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
ctx.strokeStyle = "black";
// for (let i = 0; i < 24; i++) {
//   const y = (i + 0.5) * (height / 24);
//   ctx.beginPath();
//   ctx.moveTo(0, y);
//   ctx.lineTo(width, y);
//   ctx.stroke();
// }

const offscreen = new OffscreenCanvas(248, 248);
const offscreenCtx = offscreen.getContext("2d")!;

// lets get the ./apple_pad.png imagedata
const img = new Image();
img.src = appleImage;
img.onload = () => {
  offscreenCtx.drawImage(img, 0, 0, width, height);

  const imageData = offscreenCtx.getImageData(0, 0, width, height);

  const rowLength = imageData.width * 4; // 4 bytes per pixel (RGBA)
  // now we will loop every 24 lines, settings every pixel to black unless it is already no white
  let isUp = false;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      const indexRow = Math.floor(index / rowLength);

      if (indexRow % 24 === 0) {
        // is pixel not white?
        const r = imageData.data[index];
        const g = imageData.data[index + 1];
        const b = imageData.data[index + 2];
        const a = imageData.data[index + 3];

        if (r !== 255 || g !== 255 || b !== 255) {
          isUp = isUp;
        } else {
          isUp = false;
        }

        if (!isUp) {
          // make the pixel red
          imageData.data[index] = 255;
          imageData.data[index + 1] = 0;
          imageData.data[index + 2] = 0;
          imageData.data[index + 3] = 255; // fully opaque
        } else {
          // make the pixel black
          imageData.data[index] = 0;
          imageData.data[index + 1] = 0;
          imageData.data[index + 2] = 0;
          imageData.data[index + 3] = 0; // fully opaque
        }
      } else {
        isUp = false;
        imageData.data[index] = 255;
        imageData.data[index + 1] = 255;
        imageData.data[index + 2] = 255;
        imageData.data[index + 3] = 255;
      }
    }
  }
  // and put the image data back to the canvas
  ctx.putImageData(imageData, 0, 0);
};
