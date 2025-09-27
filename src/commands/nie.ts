import { ChatInputCommandInteraction } from "discord.js";
import { ArgsOf, Discord, Slash } from "discordx";

@Discord()
export class PingCommand {
  @Slash({
    name: "nie",
    description: "Zaprzeczenie",
  })
  private async ping(
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
    await interaction.reply("Nie");
  }
}
