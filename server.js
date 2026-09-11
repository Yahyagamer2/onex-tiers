const express = require('express');
const app = express();
app.use(express.json());

const tierPoints = {
    "HT1": 150, "LT1": 135, "HT2": 120, "LT2": 105, "HT3": 90,
    "LT3": 75, "HT4": 60, "LT4": 45, "HT5": 30, "LT5": 15
};

const validCategories = ["axe", "sword", "mace", "vanilla", "smp"];

app.get('/', (req, res) => {
    res.json({ status: "Online", categories: validCategories, points_system: tierPoints });
});

app.get('/api/tier/:category/:tier', (req, res) => {
    const category = req.params.category.toLowerCase();
    const tier = req.params.tier.toUpperCase();

    if (!validCategories.includes(category) || !tierPoints[tier]) {
        return res.status(400).json({ error: "Invalid category or tier" });
    }

    res.json({ category, tier, points: tierPoints[tier] });
});

app.listen(process.env.PORT || 3000);
