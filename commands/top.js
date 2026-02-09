const { createCanvas } = require("canvas");
const { getData } = require("../utils/levels");

module.exports = {
  name: "top",
  async execute(message) {
    const data = getData();

    const sorted = Object.entries(data)
      .sort((a, b) => b[1].level - a[1].level)
      .slice(0, 10);

    const canvas = createCanvas(450, 800);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#1e1e2f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "bold 22px Arial";
    ctx.fillStyle = "#9b59b6";

    let y = 80;
    for (let i = 0; i < sorted.length; i++) {
      const user = await message.client.users.fetch(sorted[i][0]);
      ctx.fillText(
        `${i + 1}. ${user.username} [${sorted[i][1].level}]`,
        40,
        y
      );
      y += 60;
    }

    message.reply({
      files: [{ attachment: canvas.toBuffer(), name: "top.png" }]
    });
  }
};
