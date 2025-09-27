import { ChatInputCommandInteraction, Message } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";

@Discord()
export class SayCommand {
  @Slash({
    name: "say",
    description: "Bot powtórzy to, co wpiszesz",
  })
  private async say(
    @SlashOption({
      name: "tekst",
      description: "Wiadomość, którą bot ma wysłać",
      required: true,
      type: "STRING",
    })
    tekst: string,
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
    // Ukryta odpowiedź tylko dla użytkownika
    await interaction.reply({ content: "✔️ Wysłałem wiadomość!", ephemeral: true });

    const channel = interaction.channel;
    if (!channel) return;

    // Sprawdź czy użytkownik użył komendy jako odpowiedź na wiadomość
    const reference = interaction.options.getMessage("message");

    if (interaction.channel?.isTextBased()) {
      if (interaction.targetId) {
        // Jeżeli slash był użyty w kontekście odpowiedzi na wiadomość
        try {
          const repliedMessage = await channel.messages.fetch(interaction.targetId);
          await repliedMessage.reply(tekst);
        } catch {
          // jeśli się nie uda pobrać wiadomości, wysyłamy normalnie
          await channel.send(tekst);
        }
      } else {
        // Normalne wysłanie na kanał
        await channel.send(tekst);
      }
    }
  }
}
