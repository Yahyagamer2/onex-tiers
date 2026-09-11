const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Tier List Server is running successfully!');
});

app.post('/api/save-tier', (req, res) => {
    const tierData = req.body;
    console.log('Received Tier Data:', tierData);
    res.json({ success: true, message: 'Data received successfully!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});