const express = require('express');
const app = express();
app.use(express.json());

const tierPoints = {
    "HT1": 150, "LT1": 135, "HT2": 120, "LT2": 105, "HT3": 90,
    "LT3": 75, "HT4": 60, "LT4": 45, "HT5": 30, "LT5": 15
};

const categories = [
    { id: "overall", name: "Overall", icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="#facc15"><path d="M19 5H15V3C15 2.45 14.55 2 14 2H10C9.45 2 9 2.45 9 3V5H5C3.9 5 3 5.9 3 7V10C3 12.21 4.79 14 7 14H7.29C8.1 15.89 10 17.22 12 17.45V20H9V22H15V20H12V17.45C14 17.22 15.9 15.89 16.71 14H17C19.21 14 21 12.21 21 10V7C21 5.9 20.1 5 19 5ZM5 10V7H9V12C7.34 12 5.97 10.74 5.03 9.14C5.01 9.42 5 9.71 5 10ZM19 10C19 10.74 18.99 9.42 18.97 9.14C18.03 10.74 16.66 12 15 12V7H19V10Z"/></svg>' },
    { id: "vanilla", name: "Vanilla", icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#c084fc"/><path d="M2 17L12 22L22 17" stroke="#c084fc" stroke-width="2"/><path d="M2 12L12 17L22 12" stroke="#c084fc" stroke-width="2"/></svg>' },
    { id: "uhc", name: "UHC", icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="#f87171"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>' },
    { id: "pot", name: "Pot", icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="#f472b6"><path d="M9 2H15V5H9V2ZM10 6H14V8H10V6ZM6 10H18V21C18 21.55 17.55 22 17 22H7C6.45 22 6 21.55 6 21V10Z"/></svg>' },
    { id: "nethop", name: "NethOP", icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="#a78bfa"><path d="M12 2C8 2 5 5 5 9v3c0 3 2 5.5 5 6.5V21h4v-2.5c3-1 5-3.5 5-6.5V9c0-4-3-7-7-7z"/></svg>' },
    { id: "smp", name: "SMP", icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="#34d399"><circle cx="12" cy="12" r="9" stroke="#34d399" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="4" fill="#34d399"/></svg>' },
    { id: "sword", name: "Sword", icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="#60a5fa"><path d="M14.5 3.5L20.5 9.5L9 21H3V15L14.5 3.5Z"/></svg>' },
    { id: "axe", name: "Axe", icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="#38bdf8"><path d="M19 3L11 11L8 8L3 13L6 16L4 18L6 20L8 18L11 21L16 16L13 13L21 5L19 3Z"/></svg>' },
    { id: "mace", name: "Mace", icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="#94a3b8"><path d="M17 2H21V6H17V2ZM15 4H9V8H15V4ZM11 10H7V14H11V10ZM8 16L2 22H6L12 16H8Z"/></svg>' }
];

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>ONEX TIERS</title>
            <style>
                body { background-color: #0b0f19; color: #e6edf3; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; }
                header { background: #111827; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #1f2937; }
                .logo { color: #facc15; font-size: 26px; font-weight: 900; letter-spacing: 1px; font-style: italic; text-shadow: 0 0 12px rgba(250, 204, 21, 0.4); text-decoration: none; cursor: pointer; }
                .discord-btn { background: #5865F2; color: white; padding: 8px 18px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; transition: 0.2s; display: flex; align-items: center; gap: 8px; }
                .discord-btn:hover { background: #4752C4; }
                .container { max-width: 1200px; margin: 30px auto; padding: 0 20px; }
                .categories { display: flex; justify-content: center; gap: 10px; margin-bottom: 35px; flex-wrap: wrap; }
                .cat-btn { background: #111827; color: #9ca3af; border: 1px solid #1f2937; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 13px; transition: 0.2s; display: flex; align-items: center; gap: 8px; }
                .cat-btn:hover { background: #1f2937; color: #ffffff; border-color: #374151; }
                .cat-btn.active { background: #161e2e; border-color: #facc15; color: #facc15; box-shadow: 0 0 10px rgba(250, 204, 21, 0.15); }
                table { width: 100%; border-collapse: collapse; background: #111827; border-radius: 12px; overflow: hidden; border: 1px solid #1f2937; }
                th, td { padding: 16px 20px; text-align: left; border-bottom: 1px solid #1f2937; }
                th { background: #161e2e; color: #9ca3af; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
                tr:hover { background: #1a2234; }
                .empty-msg { text-align: center; color: #6b7280; padding: 40px !important; font-size: 15px; }
            </style>
        </head>
        <body>
            <header>
                <a href="/" class="logo">ONEX TIERS</a>
                <a href="https://discord.gg/gJXmrr7vbk" target="_blank" class="discord-btn">
                    <span>Discord</span>
                </a>
            </header>
            <div class="container">
                <div class="categories">
                    ${categories.map(cat => `
                        <button class="cat-btn ${cat.id === 'overall' ? 'active' : ''}" onclick="selectCategory('${cat.id}')">
                            ${cat.icon}
                            <span>${cat.name}</span>
                        </button>
                    `).join('')}
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Player</th>
                            <th>Category</th>
                            <th>Tier</th>
                            <th>Points</th>
                        </tr>
                    </thead>
                    <tbody id="leaderboard">
                        <tr><td colspan="5" class="empty-msg">Loading overall leaderboard...</td></tr>
                    </tbody>
                </table>
            </div>
            <script>
                const supabaseUrl = "https://pbillbuujrlfeunrhezz.supabase.co";
                const supabaseKey = "sb_publishable_l4UgB7Co6s7W54C0sNykaw_N8Cv0D";

                async function loadLeaderboard(category = 'overall') {
                    const tbody = document.getElementById('leaderboard');
                    tbody.innerHTML = '<tr><td colspan="5" class="empty-msg">Loading data...</td></tr>';

                    try {
                        let queryUrl = \`\${supabaseUrl}/rest/v1/results?select=*\`;
                        if (category !== 'overall') {
                            queryUrl += \`&gamemode=eq.\${category}\`;
                        }

                        const res = await fetch(queryUrl, {
                            headers: {
                                'apikey': supabaseKey,
                                'Authorization': 'Bearer ' + supabaseKey
                            }
                        });
                        const data = await res.json();
                        
                        if (!data || data.length === 0) {
                            tbody.innerHTML = '<tr><td colspan="5" class="empty-msg">No players found yet.</td></tr>';
                            return;
                        }

                        // ترتيب اللاعبين تنازلياً حسب النقاط لو كان Overall أو حسب القائمة
                        data.sort((a, b) => (b.points || 0) - (a.points || 0));

                        tbody.innerHTML = data.map((row, index) => \`
                            <tr>
                                <td>\${index + 1}</td>
                                <td style="font-weight: bold; color: #ffffff;">\${row.username || row.player || 'Unknown'}</td>
                                <td style="text-transform: uppercase;">\${row.gamemode || category}</td>
                                <td><span style="color: #facc15; font-weight: bold;">\${row.rank_earned || row.tier || 'N/A'}</span></td>
                                <td>\${row.points || '0'}</td>
                            </tr>
                        \`).join('');
                    } catch (err) {
                        tbody.innerHTML = '<tr><td colspan="5" class="empty-msg" style="color: #f87171;">Failed to fetch data from database.</td></tr>';
                    }
                }

                function selectCategory(category) {
                    document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
                    event.currentTarget.classList.add('active');
                    loadLeaderboard(category);
                }

                // تحميل الـ Overall أول ما تفتح الصفحة
                loadLeaderboard('overall');
            </script>
        </body>
        </html>
    `);
});

app.get('/api/tier/:category/:tier', (req, res) => {
    const category = req.params.category.toLowerCase();
    const tier = req.params.tier.toUpperCase();
    const validCats = categories.map(c => c.id);

    if (!validCats.includes(category) || !tierPoints[tier]) {
        return res.status(400).json({ error: "Invalid category or tier" });
    }

    res.json({ category, tier, points: tierPoints[tier] });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
