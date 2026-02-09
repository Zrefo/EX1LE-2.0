module.exports = {
  name: "ready",
  execute(client) {
    console.log(`🔥 Bot zalogowany jako ${client.user.tag}`);
  }
};
