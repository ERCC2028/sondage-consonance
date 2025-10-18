// @ts-check
const express = require("express");
const cors = require("cors");
const path = require("path");
const sequelize = require("./sequelize");
const Answer = require("./models/Answer");
const checkProfile = require("./public/check_profile");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

sequelize.sync();

app.get("/presurvey", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "presurvey.html"));
});

app.get("/survey", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "survey.html"));
});

app.post("/survey", async (req, res) => {
    const { sound1, sound2, mostConsonant, profile } = req.body;

    if (!checkProfile(profile)) 
        return res.status(400).json({ error: "Invalid profile" });

    if (!Array.isArray(sound1) || sound1.length !== 2 || !Array.isArray(sound2) || sound2.length !== 2)
        return res.status(400).json({ error: "Invalid sound frequencies" });

    if (mostConsonant !== 0 && mostConsonant !== 1 && mostConsonant !== 2)
        return res.status(400).json({ error: "Invalid mostConsonant value" });

    try {
        await Answer.create({
            sound1Left: sound1[0],
            sound1Right: sound1[1],
            sound2Left: sound2[0],
            sound2Right: sound2[1],
            mostConsonant,
            profile,
        });
        res.json({message: "Data received successfully", });
    } catch (err) {
        // @ts-ignore
        res.status(500).json({ error: "Database error", details: err.message });
    }
});

app.get("/data", async (req, res) => {
    try {
        const answers = await Answer.findAll();
        res.json(answers);
    } catch (err) {
        // @ts-ignore
        res.status(500).json({ error: "Database error", details: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});