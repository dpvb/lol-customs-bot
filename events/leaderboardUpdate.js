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

    stats.forEach(player => {
        player.stats.eliminations = player.stats.kills + player.stats.assists;
    });

    const sortedByWins = [...stats].sort((a, b) => b.stats.wins - a.stats.wins).slice(0, 25);
    const sortedByEliminations = [...stats].sort((a, b) => b.stats.eliminations - a.stats.eliminations).slice(0, 25);

    const winsText = sortedByWins.map(formatPlayerWins).join('\n');
    const eliminationsText = sortedByEliminations.map(formatPlayerEliminations).join('\n');
    
    const winsEmbed = createEmbed('Top Wins', winsText);
    const eliminationsEmbed = createEmbed('Top Eliminations', eliminationsText);

    channel.messages.fetch({ limit: 2 }).then(messages => {
        const winsMessage = messages.last();
        const elimsMessage = messages.first();

        // If the last message is the wins leaderboard, edit it. If not, send a new message.
        if (winsMessage && winsMessage.embeds[0] && winsMessage.embeds[0].title === 'Top Wins') {
            winsMessage.edit({ embeds: [winsEmbed] });
        } else {
            channel.send({ embeds: [winsEmbed] });
        }

        // If the second last message is the eliminations leaderboard, edit it. If not, send a new message.
        if (elimsMessage && elimsMessage.embeds[0] && elimsMessage.embeds[0].title === 'Top Eliminations') {
            elimsMessage.edit({ embeds: [eliminationsEmbed] });
        } else {
            channel.send({ embeds: [eliminationsEmbed] });
        }
    });
}

function formatPlayerWins(player, index) {
    const rank = index + 1;
    const playerName = player.username.split('#')[0];
    const wins = player.stats.wins;
    return `**${rank}) ${playerName}**: ${wins} :trophy:`
}

function formatPlayerEliminations(player, index) {
    const rank = index + 1;
    const playerName = player.username.split('#')[0];
    const eliminations = player.stats.eliminations;
    return `**${rank}) ${playerName}**: ${eliminations} :crossed_swords:`
}

function createEmbed(title, desc) {
    return {
        title: title,
        color: 0x0099ff,
        description: desc,
        fields: [],
        timestamp: new Date().toISOString(),
    };
}