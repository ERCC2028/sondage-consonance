// @ts-check
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const sequelize = require("./sequelize");
const Answer = require("./models/Answer");
const { checkProfile, MIN_FREQ, MAX_FREQ } = require("./public/util");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

sequelize.sync();

app.get("/presurvey", (_req, res) => {
    res.sendFile(path.join(__dirname, "public", "presurvey.html"));
});

app.get("/survey", (_req, res) => {
    res.sendFile(path.join(__dirname, "public", "survey.html"));
});

app.post("/survey", async (req, res) => {
    const body = req.body;

    if (!checkBody(body, res))
        return;

    try {
        await Answer.create(body);
        res.json({ message: "Data received successfully", });
    } catch (err) {
        // @ts-ignore
        res.status(500).json({ error: "Database error", details: err.message, });
    }
});

app.get("/data", async (_req, res) => {
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

/**
 * @param {*} body
 * @param {import("express").Response} res
 * @returns {undefined | true}
 */
function checkBody(body, res) {
    if (typeof body !== "object")
        return void res.status(400).json({ error: "Invalid JSON structure" });

    if (!checkProfile(body.profile))
        return void res.status(400).json({ error: "Invalid 'profile' value" });

    if (
        typeof body.left1 !== "number" ||
        body.left1 < MIN_FREQ ||
        body.left1 > MAX_FREQ)
        return void res.status(400).json({ error: "Invalid 'left1' value" });

        if (
        typeof body.right1 !== "number" ||
        body.right1 < MIN_FREQ ||
        body.right1 > MAX_FREQ)
        return void res.status(400).json({ error: "Invalid 'right1' value" });

        if (
        typeof body.left2 !== "number" ||
        body.left2 < MIN_FREQ ||
        body.left2 > MAX_FREQ)
        return void res.status(400).json({ error: "Invalid 'left2' value" });

        if (
        typeof body.right2 !== "number" ||
        body.right2 < MIN_FREQ ||
        body.right2 > MAX_FREQ)
        return void res.status(400).json({ error: "Invalid 'right2' value" });

        if (
        body.mostConsonant !== 0 &&
        body.mostConsonant !== 1 &&
        body.mostConsonant !== 2
    )
        return void res.status(400).json({ error: "Invalid 'mostConsonant' value" });

        return true;
}