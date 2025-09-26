import { ArgsOf, Discord, On } from "discordx";
import { Main } from "../main.js";
import { Interaction } from "discord.js";

@Discord()
export class InteractionCreateEvent {
  @On({ event: "interactionCreate" })
  async interactionCreate(
    [interaction]: ArgsOf<"interactionCreate">
  ): Promise<void> {
    Main.Client.executeInteraction(interaction);
  }
}