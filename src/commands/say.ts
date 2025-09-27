/*
 * Copyright (C) 2025 zbyon
 * Copyright (C) 2025 Piecuu
 * 
 * This file is part of Chomik.
 * Chomik is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * Chomik is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with Chomik. If not, see <https://www.gnu.org/licenses/>. 
 */

import { ApplicationCommandOptionType, ChatInputCommandInteraction, Message } from "discord.js";
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
      type: ApplicationCommandOptionType.String,
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
