const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder } = require('discord.js');
require('dotenv').config();

const Intents = GatewayIntentBits;
const allIntents = [
    Intents.Guilds,
    Intents.GuildMessages,
    Intents.GuildMembers,
    Intents.GuildPresences,
    Intents.GuildVoiceStates,
    Intents.GuildBans,
    Intents.GuildInvites,
    Intents.GuildWebhooks,
    Intents.GuildScheduledEvents,
    Intents.GuildMessageReactions,
    Intents.DirectMessages,
    Intents.DirectMessageTyping,
    Intents.DirectMessageReactions,
    Intents.GuildMessageTyping,
    Intents.MessageContent
];

const client = new Client({
    intents: allIntents
});

const prefix = '-';

client.once('ready', () => {
    console.log("Discord bot is on!");
});

client.on('messageCreate', message => {
    if (message.content === prefix + 'button') { // Check if message is '-button'
        // Create a new action row with a button
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('button_click') // Set a custom ID for the button
                    .setLabel('Click me!') // Set the label displayed on the button
                    .setStyle(1) // Set the style of the button (1 for PRIMARY)
            );

        // Send a message with the button attached
        message.channel.send({ content: 'Hello, world!', components: [row] });
    }
});

// Listen for button interactions
client.on('interactionCreate', interaction => {
    if (!interaction.isButton()) return;

    // Respond to button clicks
    if (interaction.customId === 'button_click') {
        interaction.reply('Button clicked!');
    }
});

const apiToken = process.env.API_TOKEN;
client.login(apiToken);
