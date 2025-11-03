import "./style.css";

const width = 248;
const height = 248;

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <canvas id="canvas" height="${height}" width="${width}"></canvas>
`;

// first lets draw a canvas with 24 horizontal lines
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
ctx.strokeStyle = "black";
for (let i = 0; i < 24; i++) {
  const y = (i + 0.5) * (height / 24);
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(width, y);
  ctx.stroke();
}
