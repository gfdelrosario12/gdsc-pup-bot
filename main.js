const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const Intents = GatewayIntentBits;
const allIntents = [
    Intents.Guilds,
    Intents.GuildMessages,
    Intents.GuildMessageReactions,
    Intents.DirectMessages,
    Intents.DirectMessageReactions,
    Intents.MessageContent
];

const client = new Client({
    intents: allIntents
});

const prefix = '-';

client.once('ready', () => {
    console.log("Discord bot is on!");
});

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(prefix)) return; // Check if the message starts with the prefix
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'sendevent') {
        // Check if the command has enough arguments
        if (args.length < 3 || args.length % 2 !== 1) {
            return message.reply('Invalid command format. Usage: -sendEvent <message> <reaction1> <reaction1message> <reaction2> <reaction2message> ...');
        }

        const eventMessage = args.shift(); // Get the event message
        const reactionMessages = {};

        // Loop through arguments to create reactions and their corresponding messages
        for (let i = 0; i < args.length; i += 2) {
            const reaction = args[i];
            const reactionMessage = args[i + 1];
            reactionMessages[reaction] = reactionMessage;
        }

        // Send message with reactions
        const sentMessage = await message.channel.send(eventMessage);

        // Add reactions to the sent message
        for (const reaction in reactionMessages) {
            await sentMessage.react(reaction);
        }

        // Listen for reaction interactions on the sent message
        const filter = (reaction, user) => !user.bot;
        const collector = sentMessage.createReactionCollector({ filter, time: 15000 });

        collector.on('collect', async (reaction, user) => {
            const reactionMessage = reactionMessages[reaction.emoji.name];
            if (reactionMessage) {
                try {
                    const userDM = await user.createDM();
                    await userDM.send(reactionMessage);
                } catch (error) {
                    console.error(`Failed to send message to user ${user.id}: ${error}`);
                }
            }
        });

        // Delete the command message after successful prompt
        message.delete().catch(console.error);
    }
});

const apiToken = process.env.API_TOKEN;
client.login(apiToken);
