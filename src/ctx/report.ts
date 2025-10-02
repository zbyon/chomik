import { ApplicationCommandType, MessageContextMenuCommandInteraction, MessageFlags } from "discord.js";
import { ArgsOf, ContextMenu, Discord } from "discordx";

@Discord()
export class ReportCtx {
  @ContextMenu({
    name: "Report",
    type: ApplicationCommandType.Message,
  })
  private async reportCtx (
    interaction: MessageContextMenuCommandInteraction
  ): Promise<void> {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral
    })
    
    await interaction.editReply({
      content: interaction.targetMessage.content
    })
  }
}