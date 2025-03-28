const express = require('express');
const app = express();

// API details
const apiurl = 'https://youtube-mp310.p.rapidapi.com/download/mp3';
const RAPID_API_KEY = process.env.RAPID_API_KEY; 

// Corrected PORT assignment
const PORT = process.env.PORT || 3030;

app.use(express.json());

// Route to receive the URL and log it
app.get('/convert', async (req, res) => {
    try {
        const { url } = req.query;

        // Validate URL
        if (!url) {
            return res.status(400).json({ error: "URL is required" });
        }

        console.log("Received URL:", url);

        // Clean the URL (remove unnecessary query parameters)
        const cleanUrl = url.split('?')[0]; // Keeps only the main video URL

        // Make request to RapidAPI
        const response = await fetch(`${apiurl}?url=${encodeURIComponent(cleanUrl)}`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'ce00b38f94msha34f8edfeda71a1p1cb3d2jsn0f9593e8def6',
                'x-rapidapi-host': 'youtube-mp310.p.rapidapi.com'
            }
        });

        if (!response.ok) {
            throw new Error(`External API error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        // Send API response back to the client
        res.json({
            success: true,
            downloadLink: data.link || "Link not available",
            details: data
        });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});

