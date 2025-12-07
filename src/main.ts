import "./style.css";

import imageData from "../src/imageDataSmall.json";

const animationId = "animationId";
const width = 256;
const height = 256;

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <canvas id="${animationId}" height="${height}" width="${width}"></canvas>
`;

const canvas = document.getElementById(animationId) as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

function getAllBitsFast(x: bigint) {
  let s = x.toString(2).padStart(64, "0");
  return Array.from(s, (c) => Number(c));
}

ctx.strokeStyle = "black";

// nothing special, justv ignore 1 bits that are on there own,
const cleanBits = (line: number[]) => {
  return line.map((isEmbossed, i) => {
    const prevEmbossed = line[i - 1];
    const nextIsEmbossed = line[i + 1];
    if (prevEmbossed === 0 && nextIsEmbossed === 0) {
      return 0;
    }
    if (prevEmbossed === 0 && nextIsEmbossed === undefined) {
      return 0;
    }
    if (nextIsEmbossed === 0 && prevEmbossed === undefined) {
      return 0;
    }
    return isEmbossed;
  });
};

// convert: string => bigint => [1,0,0,0,..1]
const images = imageData.map((value) =>
  value.map((bigIntString) => cleanBits(getAllBitsFast(BigInt(bigIntString))))
);

const run = () => {
  let imageIndex = 0;
  const lineInterval = height / 32;
  // how many pixels across we test
  const colInterval = 4;

  setInterval(() => {
    ctx.clearRect(0, 0, width, height);

    const image = images[imageIndex];

    image.forEach((lines, imageI) => {
      ctx.beginPath();
      const lineHeight = imageI * lineInterval + lineInterval * 0.5;
      ctx.moveTo(0, lineHeight);
      lines.forEach((isEmbossed, i) => {
        const col = i * colInterval + colInterval;
        if (!isEmbossed) {
          ctx.lineTo(col, lineHeight);
        } else {
          ctx.lineTo(col, lineHeight - lineInterval * 0.75);
        }
      });
      ctx.stroke();
    });

    if (imageIndex < images.length - 1) {
      imageIndex++;
    } else {
      imageIndex = 0;
    }
  }, 160);
};

run();
