require("dotenv").config();

const {
    Client,
    GatewayIntentBits,
    PermissionsBitField
} = require("discord.js");

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

    // Allow owner
    if (message.guild.ownerId === member.id) return;

    // Allow admins
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
