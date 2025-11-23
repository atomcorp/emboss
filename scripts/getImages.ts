import { readdir } from "node:fs/promises";

const images = await readdir("output");

const sortedImages = images.sort();

let imageModuleData = "";

sortedImages.forEach((filename, i) => {
  imageModuleData += `import img${i} from "../output/${filename}";
    `;
});

imageModuleData += `
    export default [
        ${sortedImages.map((_, i) => `img${i}`).join(", ")}
    ];
`;

await Bun.write("src/images.ts", imageModuleData);
