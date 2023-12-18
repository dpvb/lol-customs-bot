async function fetchStats(username) {
    const URL = `http://dylanpi:4545/api/user/stats/${encodeURIComponent(username)}`;
    const response = await fetch(URL);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error);
    }
    return data;
}

async function allStats() {
    const URL = 'http://dylanpi:4545/api/user/all';
    const response = await fetch(URL);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error);
    }
    return data;
}

async function addStats(username, stats) {
    const payload = {
        username,
        stats,
    };
    const URL = 'http://dylanpi:4545/api/user/addStats';
    const response = await fetch(URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    const data = await response.json();
    return data;
}

async function addPlayer(username) {
    const payload = {
        username,
    };
    const URL = 'http://dylanpi:4545/api/user/create';
    const response = await fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error('A player with this username already exists!');
    }

    const data = await response.json();
    return data;
}

module.exports = {
    fetchStats,
    addStats,
    addPlayer,
    allStats,
};