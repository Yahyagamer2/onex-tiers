const express = require('express');
const app = express();
app.use(express.json());

const categories = [
    { id: "overall", name: "Overall", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 5H15V3C15 2.45 14.55 2 14 2H10C9.45 2 9 2.45 9 3V5H5C3.9 5 3 5.9 3 7V10C3 12.21 4.79 14 7 14H7.29C8.1 15.89 10 17.22 12 17.45V20H9V22H15V20H12V17.45C14 17.22 15.9 15.89 16.71 14H17C19.21 14 21 12.21 21 10V7C21 5.9 20.1 5 19 5ZM5 10V7H9V12C7.34 12 5.97 10.74 5.03 9.14C5.01 9.42 5 9.71 5 10ZM19 10C19 10.74 18.99 9.42 18.97 9.14C18.03 10.74 16.66 12 15 12V7H19V10Z"/></svg>' },
    { id: "vanilla", name: "Vanilla", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" stroke="currentColor" stroke-width="2"/></svg>' },
    { id: "crystal", name: "Crystal", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>' },
    { id: "mace", name: "Mace", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M15 2h4v4h-4V2zM13 4H7v4h6V4zM9 8H5v4h4V8zM6 14l-4 8h4l6-6H6z"/></svg>' },
    { id: "pot", name: "Pot", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 2h6v3H9V2zm1 5h4v2h-4V7zM6 10h12v11a2 2 0 01-2 2H8a2 2 0 01-2-2V10z"/></svg>' },
    { id: "sword", name: "Sword", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M14.5 3.5L20.5 9.5L9 21H3V15L14.5 3.5Z"/></svg>' },
    { id: "nethop", name: "NethOP", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>' },
    { id: "axe", name: "Axe", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3L11 11L8 8L3 13L6 16L4 18L6 20L8 18L11 21L16 16L13 13L21 5L19 3Z"/></svg>' },
    { id: "smp", name: "SMP", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>' }
];

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>ONEX TIERS | Leaderboard</title>
            <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
            <style>
                :root {
                    --bg-main: #07090e;
                    --bg-card: #0d121f;
                    --bg-hover: #131b2e;
                    --border-color: #1e293b;
                    --accent-gold: #f59e0b;
                    --accent-glow: rgba(245, 158, 11, 0.15);
                    --text-main: #f8fafc;
                    --text-muted: #64748b;
                }
                * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Outfit', sans-serif; }
                body { background-color: var(--bg-main); color: var(--text-main); min-height: 100vh; background-image: radial-gradient(circle at 50% 0%, #111827 0%, var(--bg-main) 70%); }
                header { background: rgba(13, 18, 31, 0.8); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border-color); padding: 18px 40px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100; }
                .logo { color: var(--text-main); font-size: 24px; font-weight: 900; letter-spacing: 1.5px; text-decoration: none; display: flex; align-items: center; gap: 10px; }
                .logo span { color: var(--accent-gold); text-shadow: 0 0 20px rgba(245, 158, 11, 0.4); }
                .discord-btn { background: linear-gradient(135deg, #5865F2, #4752C4); color: white; padding: 10px 22px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 13px; letter-spacing: 0.5px; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(88, 101, 242, 0.3); display: flex; align-items: center; gap: 8px; }
                .discord-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(88, 101, 242, 0.5); }
                .container { max-width: 1100px; margin: 40px auto; padding: 0 20px; }
                .hero-section { text-align: center; margin-bottom: 40px; }
                .hero-section h1 { font-size: 36px; font-weight: 800; margin-bottom: 8px; background: linear-gradient(to right, #fff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .hero-section p { color: var(--text-muted); font-size: 15px; }
                .categories { display: flex; justify-content: center; gap: 10px; margin-bottom: 35px; flex-wrap: wrap; }
                .cat-btn { background: var(--bg-card); color: var(--text-muted); border: 1px solid var(--border-color); padding: 10px 18px; border-radius: 12px; cursor: pointer; font-weight: 600; font-size: 13px; transition: all 0.25s ease; display: flex; align-items: center; gap: 8px; }
                .cat-btn:hover { background: var(--bg-hover); color: var(--text-main); border-color: #334155; transform: translateY(-1px); }
                .cat-btn.active { background: var(--bg-hover); border-color: var(--accent-gold); color: var(--accent-gold); box-shadow: 0 0 20px var(--accent-glow); }
                .table-container { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
                table { width: 100%; border-collapse: collapse; text-align: left; }
                th { background: rgba(255,255,255,0.02); color: var(--text-muted); padding: 16px 24px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid var(--border-color); }
                td { padding: 18px 24px; border-bottom: 1px solid var(--border-color); font-size: 14px; font-weight: 500; }
                tr:last-child td { border-bottom: none; }
                tr:hover td { background: var(--bg-hover); }
                .rank-badge { font-weight: 800; font-size: 14px; }
                .rank-1 { color: #facc15; text-shadow: 0 0 10px rgba(250, 204, 21, 0.4); }
                .rank-2 { color: #e2e8f0; }
                .rank-3 { color: #b45309; }
                .player-cell { display: flex; align-items: center; gap: 14px; }
                .player-avatar { width: 34px; height: 34px; border-radius: 8px; background: var(--border-color); box-shadow: 0 2px 8px rgba(0,0,0,0.3); }
                .player-name { font-weight: 700; color: var(--text-main); }
                .tier-tag { background: rgba(245, 158, 11, 0.1); color: var(--accent-gold); border: 1px solid rgba(245, 158, 11, 0.3); padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 12px; display: inline-block; }
                .gamemode-tag { text-transform: uppercase; font-size: 11px; font-weight: 700; color: var(--text-muted); background: rgba(255,255,255,0.04); padding: 4px 8px; border-radius: 4px; }
                .empty-msg { text-align: center; color: var(--text-muted); padding: 60px !important; font-size: 15px; font-weight: 500; }
            </style>
        </head>
        <body>
            <header>
                <a href="/" class="logo">ONEX <span>TIERS</span></a>
                <a href="https://discord.gg/gJXmrr7vbk" target="_blank" class="discord-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
                    <span>Discord Server</span>
                </a>
            </header>
            <div class="container">
                <div class="hero-section">
                    <h1>Official Leaderboard</h1>
                    <p>Discover the top ranked players across all competitive categories.</p>
                </div>
                <div class="categories">
                    ${categories.map(cat => `
                        <button class="cat-btn ${cat.id === 'overall' ? 'active' : ''}" onclick="selectCategory('${cat.id}', event)">
                            ${cat.icon}
                            <span>${cat.name}</span>
                        </button>
                    `).join('')}
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th style="width: 80px;">Rank</th>
                                <th>Player</th>
                                <th>Gamemode</th>
                                <th>Tier</th>
                                <th style="text-align: right;">Points</th>
                            </tr>
                        </thead>
                        <tbody id="leaderboard">
                            <tr><td colspan="5" class="empty-msg">Loading leaderboard data...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <script>
                const supabaseUrl = "https://amdasdkbckgyktwnyffu.supabase.co";
                const supabaseKey = "sb_publishable_YSy03s9xgaK1YJiA01PKmA_HhGdVyUB";

                const tierPointsMap = {
                    "HT1": 200, "LT1": 180, 
                    "HT2": 160, "LT2": 140, 
                    "HT3": 120, "LT3": 100, 
                    "HT4": 80,  "LT4": 60, 
                    "HT5": 40
                };

                async function loadLeaderboard(category = 'overall') {
                    const tbody = document.getElementById('leaderboard');
                    tbody.innerHTML = '<tr><td colspan="5" class="empty-msg">Fetching rankings...</td></tr>';

                    try {
                        const res = await fetch(\`\${supabaseUrl}/rest/v1/results?select=*\`, {
                            headers: {
                                'apikey': supabaseKey,
                                'Authorization': 'Bearer ' + supabaseKey
                            }
                        });
                        
                        if (!res.ok) throw new Error('Database response failed');

                        const data = await res.json();
                        
                        if (!data || data.length === 0) {
                            tbody.innerHTML = '<tr><td colspan="5" class="empty-msg">No players found in database yet.</td></tr>';
                            return;
                        }

                        let processedData = data.map(row => {
                            const playerName = row.ign || row.username || row.player || 'Unknown';
                            const playerTier = row.tier || row.tier_earned || 'N/A';
                            const playerGamemode = (row.gamemode || 'vanilla').toLowerCase();
                            const tierUpper = String(playerTier).toUpperCase();
                            const points = row.points || tierPointsMap[tierUpper] || 40;
                            
                            return { playerName, playerTier, playerGamemode, points };
                        });

                        if (category !== 'overall') {
                            processedData = processedData.filter(row => row.playerGamemode === category.toLowerCase());
                        }

                        processedData.sort((a, b) => b.points - a.points);

                        if (processedData.length === 0) {
                            tbody.innerHTML = '<tr><td colspan="5" class="empty-msg">No records found for this category.</td></tr>';
                            return;
                        }

                        tbody.innerHTML = processedData.map((row, index) => {
                            const skinUrl = \`https://minotar.net/avatar/\${row.playerName}/34.png\`;
                            const steveUrl = "https://minotar.net/avatar/MHF_Steve/34.png";
                            
                            let rankClass = "";
                            if (index === 0) rankClass = "rank-1";
                            else if (index === 1) rankClass = "rank-2";
                            else if (index === 2) rankClass = "rank-3";

                            return \`
                                <tr>
                                    <td><span class="rank-badge \${rankClass}">#\${index + 1}</span></td>
                                    <td>
                                        <div class="player-cell">
                                            <img class="player-avatar" src="\${skinUrl}" onerror="this.src='\${steveUrl}'" alt="\${row.playerName}">
                                            <span class="player-name">\${row.playerName}</span>
                                        </div>
                                    </td>
                                    <td><span class="gamemode-tag">\${row.playerGamemode}</span></td>
                                    <td><span class="tier-tag">\${row.playerTier}</span></td>
                                    <td style="text-align: right; font-weight: 700; color: var(--text-main);">\${row.points} pts</td>
                                </tr>
                            \`;
                        }).join('');
                    } catch (err) {
                        console.error(err);
                        tbody.innerHTML = '<tr><td colspan="5" class="empty-msg" style="color: #f87171;">Failed to connect to database. Please check RLS policies.</td></tr>';
                    }
                }

                function selectCategory(category, event) {
                    document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
                    event.currentTarget.classList.add('active');
                    loadLeaderboard(category);
                }

                loadLeaderboard('overall');
            </script>
        </body>
        </html>
    `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
