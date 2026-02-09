const { createCanvas, loadImage, registerFont } = require("canvas");
const { load } = require("../utils/levels");

registerFont("./assets/fonts/blood.ttf", { family: "Blood" });

module.exports = {
  name: "top",
  async execute(message) {
    const data = load();

    const sorted = Object.entries(data)
      .sort((a, b) => b[1].level - a[1].level)
      .slice(0, 10);

    const canvas = createCanvas(450, 800);
    const ctx = canvas.getContext("2d");

    const bg = await loadImage("./assets/backgrounds/top.png");
    ctx.drawImage(bg, 0, 0, 450, 800);

    ctx.font = "bold 20px Blood";
    ctx.fillStyle = "#8e44ad";
    ctx.shadowColor = "#FFD700";
    ctx.shadowBlur = 8;

    let y = 100;
    for (let i = 0; i < sorted.length; i++) {
      const user = await message.client.users.fetch(sorted[i][0]);
      ctx.fillText(
        `${i + 1}. ${user.username} [${sorted[i][1].level}]`,
        40,
        y
      );
      y += 55;
    }

    message.reply({
      files: [{ attachment: canvas.toBuffer(), name: "top.png" }]
    });
  }
};
