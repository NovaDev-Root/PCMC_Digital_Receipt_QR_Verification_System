const { Jimp } = require("jimp");

async function main() {
  const image = await Jimp.read("public/signature.png");
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
    const red = this.bitmap.data[idx + 0];
    const green = this.bitmap.data[idx + 1];
    const blue = this.bitmap.data[idx + 2];
    
    if (red > 180 && green > 180 && blue > 180) {
      this.bitmap.data[idx + 3] = 0; // Alpha
    } else {
      this.bitmap.data[idx + 0] = Math.max(0, red - 40);
      this.bitmap.data[idx + 1] = Math.max(0, green - 40);
      this.bitmap.data[idx + 2] = Math.max(0, blue - 40);
    }
  });
  await image.write("public/signature.png");
  console.log("Background removed successfully!");
}
main().catch(console.error);
