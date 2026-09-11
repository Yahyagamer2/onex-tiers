const express = require('express');
const app = express();
app.use(express.json());

// نظام النقاط والأقسام
const tierPoints = {
    "HT1": 150, "LT1": 135, "HT2": 120, "LT2": 105, "HT3": 90,
    "LT3": 75, "HT4": 60, "LT4": 45, "HT5": 30, "LT5": 15
};

const validCategories = ["axe", "sword", "mace", "vanilla", "smp"];

// صفحة الموقع الرئيسية (واجهة تشبه MCTiers)
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>ONEX Tiers</title>
            <style>
                body { background-color: #0d1117; color: #c9d1d9; font-family: Arial, sans-serif; margin: 0; padding: 0; }
                header { background: #161b22; padding: 20px; text-align: center; border-bottom: 1px solid #30363d; }
                h1 { color: #58a6ff; margin: 0; font-size: 28px; }
                .container { max-width: 1000px; margin: 30px auto; padding: 20px; }
                .categories { display: flex; justify-content: center; gap: 10px; margin-bottom: 30px; flex-wrap: wrap; }
                .cat-btn { background: #21262d; color: #c9d1d9; border: 1px solid #30363d; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold; transition: 0.2s; }
                .cat-btn:hover, .cat-btn.active { background: #30363d; border-color: #58a6ff; color: #58a6ff; }
                table { width: 100%; border-collapse: collapse; background: #161b22; border-radius: 8px; overflow: hidden; border: 1px solid #30363d; }
                th, td { padding: 15px; text-align: left; border-bottom: 1px solid #30363d; }
                th { background: #21262d; color: #8b949e; }
                tr:hover { background: #1f242c; }
            </style>
        </head>
        <body>
            <header>
                <h1>ONEX TIERS</h1>
            </header>
            <div class="container">
                <div class="categories">
                    ${validCategories.map(cat => `<button class="cat-btn" onclick="selectCategory('${cat}')">${cat.toUpperCase()}</button>`).join('')}
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
                        <tr><td colspan="5" style="text-align:center;">Select a category to view players</td></tr>
                    </tbody>
                </table>
            </div>
            <script>
                const supabaseUrl = "https://pbillbuujrlfeunrhezz.supabase.co";
                const supabaseKey = "sb_publishable_l4UgB7Co6s7W54C0sNykaw_N8Cv0D";

                async function selectCategory(category) {
                    document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
                    event.target.classList.add('active');
                    
                    const tbody = document.getElementById('leaderboard');
                    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Loading...</td></tr>';

                    try {
                        // جلب البيانات من سوبابيس (يفترض الجدول اسمه results أو تيرات)
                        const res = await fetch(\`\${supabaseUrl}/rest/v1/results?gamemode=eq.\${category}&select=*\`, {
                            headers: {
                                'apikey': supabaseKey,
                                'Authorization': 'Bearer ' + supabaseKey
                            }
                        });
                        const data = await res.json();
                        
                        if (!data || data.length === 0) {
                            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No players found in this category yet.</td></tr>';
                            return;
                        }

                        tbody.innerHTML = data.map((row, index) => \`
                            <tr>
                                <td>\${index + 1}</td>
                                <td>\${row.username || row.player || 'Unknown'}</td>
                                <td>\${category.toUpperCase()}</td>
                                <td><span style="color: #58a6ff; font-weight: bold;">\${row.rank_earned || row.tier || 'N/A'}</span></td>
                                <td>\${row.points || '0'}</td>
                            </tr>
                        \`).join('');
                    } catch (err) {
                        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color: #f85149;">Failed to load data from database.</td></tr>';
                    }
                }
            </script>
        </body>
        </html>
    `);
});

// مسار الـ API لجلب النقاط للبوت أو الاستعلام الخارجي
app.get('/api/tier/:category/:tier', (req, res) => {
    const category = req.params.category.toLowerCase();
    const tier = req.params.tier.toUpperCase();

    if (!validCategories.includes(category) || !tierPoints[tier]) {
        return res.status(400).json({ error: "Invalid category or tier" });
    }

    res.json({ category, tier, points: tierPoints[tier] });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
