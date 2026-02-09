const { updateLevel, checkLevelUp } = require('../utils/levelHelper');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;
        
        const levels = updateLevel(message.author.id);
        checkLevelUp(message, levels);
    }
};
