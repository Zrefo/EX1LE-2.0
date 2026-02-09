const { createCanvas, loadImage, registerFont } = require("canvas");
const { load } = require("../utils/levels");

registerFont("./assets/fonts/blood.ttf", { family: "Blood" });

module.exports = {
  name: "rank",
  async execute(message) {
    const data = load();
    const userData = data[message.author.id];
    if (!userData) return message.reply("Brak danych.");

    const canvas = createCanvas(800, 350);
    const ctx = canvas.getContext("2d");

    const bg = await loadImage("./assets/backgrounds/rank.png");
    ctx.drawImage(bg, 0, 0, 800, 350);

    const avatar = await loadImage(
      message.author.displayAvatarURL({ extension: "png" })
    );
    ctx.drawImage(avatar, 325, 75, 150, 150);

    ctx.shadowColor = "#FFD700";
    ctx.shadowBlur = 10;

    ctx.font = "bold 32px Blood";
    ctx.fillStyle = "#8e44ad";
    ctx.fillText(`RANK: ${userData.level}`, 40, 180);

    const barX = 250;
    const barY = 260;
    const barW = 300;
    const progress = (userData.xp / (userData.level * 100)) * barW;

    ctx.shadowBlur = 0;
    ctx.fillStyle = "#6a0dad";
    ctx.fillRect(barX, barY, progress, 20);

    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 3;
    ctx.strokeRect(barX, barY, barW, 20);

    message.reply({
      files: [{ attachment: canvas.toBuffer(), name: "rank.png" }]
    });
  }
};
