const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { battle } = require("../../functions.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("battle")
		.setDescription("Simulate a battle between an attacking and defending division.")
        .addIntegerOption(option =>
            option.setName("num_attackers")
                .setDescription("The number of attacking troops")
                .setRequired(true)
                .setMinValue(1)
        )
        .addIntegerOption(option =>
            option.setName("num_defenders")
                .setDescription("The number of defending troops")
                .setRequired(true)
                .setMinValue(1)
        )

        .addIntegerOption(option =>
            option.setName("atk_position")
                .setDescription("The elevation of the attacking division")
                .setRequired(true)
                .addChoices(
                    { name: "Sea level", value: 0 },
                    { name: "Hill", value: 1 },
                    { name: "Mountain", value: 2 },
                    { name: "Peak", value: 3 }
                )
        )
        .addIntegerOption(option =>
            option.setName("def_position")
                .setDescription("The elevation of the defending division")
                .setRequired(true)
                .addChoices(
                    { name: "Sea level", value: 0 },
                    { name: "Hill", value: 1 },
                    { name: "Mountain", value: 2 },
                    { name: "Peak", value: 3 }
                )
        )

        .addNumberOption(option =>
            option.setName("atk_add")
                .setDescription("An additional modifier for the attackers (additive)")
                .setRequired(true)
        )
        .addNumberOption(option =>
            option.setName("def_add")
                .setDescription("An additional modifier for the defenders (additive)")
                .setRequired(true)
        )

        .addBooleanOption(option =>
            option.setName("river")
                .setDescription("Whether or not this attack crosses a river")
                .setRequired(true)
        ),

	async execute(interaction) {
        // defer the reply until computation is done
        await interaction.deferReply();

        // getters (what is this, java?
        const num_attackers = interaction.options.getInteger("num_attackers");
        const num_defenders = interaction.options.getInteger("num_defenders");
        const atk_position  = interaction.options.getInteger("atk_position");
        const def_position  = interaction.options.getInteger("def_position");
        const atk_add       = interaction.options.getNumber("atk_add");
        const def_add       = interaction.options.getNumber("def_add");
        const river         = interaction.options.getBoolean("river");

        const river_text = (river) ? " over a river" : "";

        // battle logic
        const [atkWins, newLoserTroops] = battle(num_attackers, num_defenders, atk_position, def_position, atk_add, def_add, river);

        // buncha logging shite
        // TODO: switch from Date to Temporal
        // this would already be done if the boneheads who maintain Node.JS and
        // Arch Linux would fucking fix it. tbf Temporal is very new
	    const date = new Date();
    	const time = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    	const time_spacer = " ".repeat(time.length + 3);
        console.log(`[${time}] ${interaction.user.tag} ran /battle in ${interaction.guild?.name || 'DM'} #${interaction.channel?.name || 'DM'}`);
        console.log(time_spacer + "Input: " + [num_attackers, num_defenders, atk_position, def_position, atk_add, def_add, river]);
        console.log(time_spacer + "Output: " + [atkWins, newLoserTroops]);

        const loser_troops = (atkWins) ? num_defenders : num_attackers;
        const outcome = (atkWins) ? "Attackers win!" : "Defenders hold!";
        const loser_text = (atkWins) ? "Defender" : "Attacker";

        // set thumbnail
        const thumbnail = (atkWins) ? "https://raw.githubusercontent.com/TheParadoxBox/rotr_bot_v1_redux/refs/heads/main/assets/atkWin.png"
                                    : "https://raw.githubusercontent.com/TheParadoxBox/rotr_bot_v1_redux/refs/heads/main/assets/defWin.png";

        // build the embed with the embed builder (waow)
		const battleEmbed = new EmbedBuilder()
            .setColor(0xce2087)
            .setTitle(`Battle: ${num_attackers} vs. ${num_defenders}${river_text}`)
            .setThumbnail(thumbnail)
            .addFields(
                { name: "Starting attackers", value: `${num_attackers}`, inline: true },
                { name: "Starting defenders", value: `${num_defenders}`, inline: true },
                { name: "\u200B", value: "\u200B" },
                { name: `New ${loser_text.toLowerCase()}s`, value: `${newLoserTroops}`, inline: true },
                { name: `${loser_text} losses`, value: `${loser_troops - newLoserTroops}`, inline: true },
                { name: "\u200B", value: "\u200B" },
                { name: "Result", value: outcome, inline: true }
            )
            .setTimestamp()

        // update reply now that computation is done
        await interaction.editReply({ content: null, embeds: [battleEmbed] });
	},
};
