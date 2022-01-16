const {
  SlashCommandBuilder
} = require('@discordjs/builders');
const { getPasteUrl, PrivateBinClient } = require('@agc93/privatebin');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('delete')
    .setDescription('Deletes Ticket'),
  async execute(interaction, client) {
    const chan = client.channels.cache.get(interaction.channelId);
    const user = interaction.options.getUser('target');
    if (!interaction.member.roles.cache.find(r => r.id === client.config.roleSupport)) return interaction.reply({ content: "You need to have the <@&" + client.config.roleSupport + "> role.", ephemeral: true })
    else {
      interaction.reply({
        content: 'Saving Messages...'
      });
      chan.messages.fetch().then(async (messages) => {
        let a = messages.filter(m => m.author.bot !== true).map(m =>
          `${new Date(m.createdTimestamp).toLocaleString('en-EN')} - ${m.author.username}#${m.author.discriminator}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`
        ).reverse().join('\n');
        if (a.length < 1) a = "Nothing"
        var paste = new PrivateBinClient("https://privatebin.net/");
        var result = await paste.uploadContent(a, {uploadFormat: 'markdown'})
            const embed = new client.discord.MessageEmbed()
              .setAuthor('Ticket Logs', 'https://i.imgur.com/oO5ZSRK.png')
              .setDescription(`📰 Logs for ticket \`${chan.id}\` | created by <@!${chan.topic}> | closed by <@!${interaction.user.id}>\n\nLogs: [**Click here to see the logs**](${getPasteUrl(result)})`)
              .setColor('2f3136')
              .setFooter("This log will be deleted in 24 hrs!")
              .setTimestamp();

            const embed2 = new client.discord.MessageEmbed()
              .setAuthor('Ticket Logs', 'https://i.imgur.com/oO5ZSRK.png')
              .setDescription(`📰 Logs for ticket \`${chan.id}\`: [**Click here to see the logs**](${getPasteUrl(result)})`)
              .setColor('2f3136')
              .setFooter("This log will be deleted in 24 hrs!")
              .setTimestamp();

            client.channels.cache.get(client.config.logsTicket).send({
              embeds: [embed]
            }).catch(() => console.log("Ticket log channel not found."));
            chan.send('Deleting channel...');

            setTimeout(() => {
              chan.delete();
            }, 5000);
          });
    };
  },
};
