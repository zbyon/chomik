import { ChatInputCommandInteraction } from "discord.js";
import { ArgsOf, Discord, Slash } from "discordx";

@Discord()
export class PingCommand {
  @Slash({
    name: "ping",
    description: "Odpowiada pąg",
  })
  private async ping(
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
    await interaction.reply("Pong");
  }
}
