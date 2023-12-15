const { SlashCommandBuilder } = require('discord.js');
const { addPlayer } = require('../api/apiService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Register the player!')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('The username of the player you want to register')
                .setRequired(true)),
    async execute(interaction) {
        const member = interaction.member;
        if (!member.roles.cache.some(role => role.name === 'admin')) {
            return await interaction.reply({ content: 'You do not have permission to perform this command!', ephemeral: true });
        }

        const username = interaction.options.getString('username');

        try {
            await addPlayer(username);
            await interaction.reply(`${username} has been registered!`);
        } catch (error) {
            return await interaction.reply({ content: error.message, ephemeral: true });
        }
    },
};