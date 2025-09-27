import { ChatInputCommandInteraction } from "discord.js";
import { ArgsOf, Discord, Slash } from "discordx";

@Discord()
export class PingCommand {
  @Slash({
    name: "tak",
    description: "Potwierdza",
  })
  private async ping(
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
    await interaction.reply("Tak");
  }
}
