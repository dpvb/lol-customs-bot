const { SlashCommandBuilder } = require('discord.js');
const { fetchStats } = require('../api/apiService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Get the stats of a Player!')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('The username of the player to get the stats of')
                .setRequired(true)),
    async execute(interaction) {
        const username = interaction.options.getString('username');
        try {
            const data = await fetchStats(username);

            let winrate = 0;
            if (data.stats.wins + data.stats.losses > 0) winrate = ((data.stats.wins / (data.stats.wins + data.stats.losses)) * 100).toFixed(2);

            const statsEmbed = {
                color: 0x00ffff,
                title: `${username}'s Stats`,
                description: 'View all of your stats!',
                fields: [
                    {
                        name: 'Wins',
                        value: data.stats.wins,
                        inline: true,
                    },
                    {
                        name: 'Losses',
                        value: data.stats.losses,
                        inline: true,
                    },
                    {
                        name: 'Winrate',
                        value: `${winrate}%`,
                        inline: true,
                    },
                    {
                        name: 'Kills',
                        value: data.stats.kills,
                        inline: true,
                    },
                    {
                        name: 'Deaths',
                        value: data.stats.deaths,
                        inline: true,
                    },
                    {
                        name: 'Assists',
                        value: data.stats.assists,
                        inline: true,
                    },
                ],
            };

            await interaction.reply({ embeds: [statsEmbed] });
        } catch (error) {
            await interaction.reply({ content: error.message, ephemeral: true });
        }
    },
};