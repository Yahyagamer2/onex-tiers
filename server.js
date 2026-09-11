const express = require('express');
const app = express();
app.use(express.json());

const tierPoints = {
    "HT1": 150, "LT1": 135, "HT2": 120, "LT2": 105, "HT3": 90,
    "LT3": 75, "HT4": 60, "LT4": 45, "HT5": 30, "LT5": 15
};

const categories = [
    { id: "vanilla", name: "Vanilla", icon: "🟣" },
    { id: "smp", name: "SMP", icon: "🟢" },
    { id: "sword", name: "Sword", icon: "🗡️" },
    { id: "axe", name: "Axe", icon: "🪓" },
    { id: "mace", name: "Mace", icon: "🔨" }
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
                .logo { color: #facc15; font-size: 24px; font-weight: 900; letter-spacing: 1px; font-style: italic; text-shadow: 0 0 10px rgba(250, 204, 21, 0.3); }
                .discord-btn { background: #5865F2; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; transition: 0.2s; display: flex; align-items: center; gap: 8px; }
                .discord-btn:hover { background: #4752C4; }
                .container { max-width: 1100px; margin: 30px auto; padding: 0 20px; }
                .categories { display: flex; justify-content: center; gap: 12px; margin-bottom: 35px; flex-wrap: wrap; }
                .cat-btn { background: #1f2937; color: #9ca3af; border: 1px solid #374151; padding: 12px 22px; border-radius: 10px; cursor: pointer; font-weight: bold; font-size: 14px; transition: 0.2s; display: flex; align-items: center; gap: 8px; }
                .cat-btn:hover { background: #374151; color: #ffffff; }
                .cat-btn.active { background: #1f2937; border-color: #facc15; color: #facc15; box-shadow: 0 0 12px rgba(250, 204, 21, 0.15); }
                table { width: 100%; border-collapse: collapse; background: #111827; border-radius: 12px; overflow: hidden; border: 1px solid #1f2937; }
                th, td { padding: 16px 20px; text-align: left; border-bottom: 1px solid #1f2937; }
                th { background: #161e2e; color: #9ca3af; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
                tr:hover { background: #1a2234; }
                .empty-msg { text-align: center; color: #6b7280; padding: 40px !important; font-size: 15px; }
            </style>
        </head>
        <body>
            <header>
                <div class="logo">ONEX TIERS</div>
                <a href="https://discord.gg/gJXmrr7vbk" target="_blank" class="discord-btn">
                    <span>Discord</span>
                </a>
            </header>
            <div class="container">
                <div class="categories">
                    ${categories.map(cat => `
                        <button class="cat-btn" onclick="selectCategory('${cat.id}')">
                            <span>${cat.icon}</span>
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
                        <tr><td colspan="5" class="empty-msg">اختر قيم مود من فوق عشان تطلع النتائج</td></tr>
                    </tbody>
                </table>
            </div>
            <script>
                const supabaseUrl = "https://pbillbuujrlfeunrhezz.supabase.co";
                const supabaseKey = "sb_publishable_l4UgB7Co6s7W54C0sNykaw_N8Cv0D";

                async function selectCategory(category) {
                    document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
                    event.currentTarget.classList.add('active');
                    
                    const tbody = document.getElementById('leaderboard');
                    tbody.innerHTML = '<tr><td colspan="5" class="empty-msg">جاري تحميل البيانات...</td></tr>';

                    try {
                        const res = await fetch(\`\${supabaseUrl}/rest/v1/results?gamemode=eq.\${category}&select=*\`, {
                            headers: {
                                'apikey': supabaseKey,
                                'Authorization': 'Bearer ' + supabaseKey
                            }
                        });
                        const data = await res.json();
                        
                        if (!data || data.length === 0) {
                            tbody.innerHTML = '<tr><td colspan="5" class="empty-msg">مافي أي لاعبين مسجلين بهذا القسم حتى الآن.</td></tr>';
                            return;
                        }

                        tbody.innerHTML = data.map((row, index) => \`
                            <tr>
                                <td>\${index + 1}</td>
                                <td style="font-weight: bold; color: #ffffff;">\${row.username || row.player || 'Unknown'}</td>
                                <td>\${category.toUpperCase()}</td>
                                <td><span style="color: #facc15; font-weight: bold;">\${row.rank_earned || row.tier || 'N/A'}</span></td>
                                <td>\${row.points || '0'}</td>
                            </tr>
                        \`).join('');
                    } catch (err) {
                        tbody.innerHTML = '<tr><td colspan="5" class="empty-msg" style="color: #f87171;">صار فيه مشكلة أثناء جلب البيانات من القاعدة.</td></tr>';
                    }
                }
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
