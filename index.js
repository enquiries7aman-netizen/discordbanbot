require("dotenv").config();

const express = require("express");
const {
    Client,
    GatewayIntentBits,
    PermissionsBitField
} = require("discord.js");

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/health", (req, res) => {
    res.status(200).send("OK");
});

app.listen(PORT, () => {
    console.log(`Health server running on port ${PORT}`);
});

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
    if (!message.guild || message.author.bot) return;

    if (message.channel.id !== process.env.CHANNEL_ID) return;

    const member = message.member;

    if (message.guild.ownerId === member.id) return;

    if (member.permissions.has(PermissionsBitField.Flags.Administrator)) return;

    try {
        await message.delete().catch(() => {});

        await member.ban({
            deleteMessageSeconds: 60,
            reason: "Posted in a restricted channel."
        });

        console.log(`Banned ${member.user.tag}`);
    } catch (err) {
        console.error(err);
    }
});

client.login(process.env.TOKEN);
