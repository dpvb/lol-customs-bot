const { Events } = require('discord.js');
const { allStats } = require('../api/apiService');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        await updateLeaderboard(client);
        setInterval(() => updateLeaderboard(client), 3600000);
    },
};

async function updateLeaderboard(client) {
    const channel = client.channels.cache.get('1186129187975737404');

    const stats = await allStats();

    const sorted = stats.sort((a, b) => b.stats.wins - a.stats.wins);

    const text = sorted.map((player, index) => {
        const rank = index + 1;
        const playerName = player.username.split('#')[0];
        const wins = player.stats.wins;
        const losses = player.stats.losses;
        const kills = player.stats.kills;
        const deaths = player.stats.deaths;
        const assists = player.stats.assists;
        // return `${rank}) \`${playerName}\` >> **${wins}** Wins **${kills}** Kills **${deaths}** Deaths **${assists}** Assists`;
        // return `**${rank}) ${playerName}**: ${wins} Wins :trophy: ${losses} Losses :flag_white: ${kills} Kills :dagger: ${deaths} Deaths :skull:  ${assists} Assists :crossed_swords:`;
        return `**${rank}) ${playerName}**: \`${wins}W/${losses}L\` ${kills} Kills :dagger: ${deaths} Deaths :skull:  ${assists} Assists :crossed_swords:`;
    }).join('\n');

    const embed = {
        title: 'Leaderboards',
        color: 0x0099ff,
        description: text,
        fields: [],
        timestamp: new Date().toISOString(),
    };


    channel.messages.fetch({ limit: 1 }).then(messages => {
        const message = messages.first();

        if (message) {
            message.edit({ embeds: [embed] });
        } else {
            channel.send({ embeds: [embed] });
        }
    });
}