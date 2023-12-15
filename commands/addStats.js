const { SlashCommandBuilder } = require('discord.js');
const { addStats } = require('../api/apiService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addstats')
        .setDescription('Update a player\'s Stats!')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('The username of the player to get the stats of')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('outcome')
                .setDescription('Whether the player won or lost the game')
                .setRequired(true)
                .addChoices(
                    { name: 'Win', value: 'win' },
                    { name: 'Lose', value: 'lose' },
                ))
        .addNumberOption(option =>
            option.setName('kills')
                .setDescription('The number of kills the player got')
                .setRequired(true))
        .addNumberOption(option =>
            option.setName('deaths')
                .setDescription('The number of deaths the player got')
                .setRequired(true))
        .addNumberOption(option =>
            option.setName('assists')
                .setDescription('The number of assists the player got')
                .setRequired(true)),
    async execute(interaction) {
        const member = interaction.member;
        if (!member.roles.cache.some(role => role.name === 'admin')) {
            return await interaction.reply({ content: 'You do not have permission to perform this command!', ephemeral: true });
        }

        const username = interaction.options.getString('username');
        const outcome = interaction.options.getString('outcome');
        const kills = interaction.options.getNumber('kills');
        const deaths = interaction.options.getNumber('deaths');
        const assists = interaction.options.getNumber('assists');

        const wins = outcome === 'win' ? 1 : 0;
        const losses = outcome === 'lose' ? 1 : 0;

        const statsToAdd = {
            wins,
            losses,
            kills,
            deaths,
            assists,
        };

        const result = await addStats(username, statsToAdd);

        if (result.error) {
            return await interaction.reply({ content: result.error, ephemeral: true });
        }

        const embed = {
            color: 0x00ffff,
            title: `Stat Update for ${username}`,
            fields: [
                {
                    name: '\u200B',
                    value: `**Wins:** ${result.stats.wins} (+${wins})\n**Losses:** ${result.stats.losses} (+${losses})\n**Kills:** ${result.stats.kills} (+${kills})\n**Deaths:** ${result.stats.deaths} (+${deaths})\n**Assists:** ${result.stats.assists} (+${assists})`,
                },
            ],
            footer: {
                text: `Recorded by ${member.user.username}`,
            },
        };

        await interaction.reply({ embeds: [embed] });
    },
};