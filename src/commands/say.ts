/*
 * Copyright (C) 2025 zbyon
 * Copyright (C) 2025 Piecuu
 * 
 * This file is part of Chomik.
 * Chomik is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * Chomik is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with Chomik. If not, see <https://www.gnu.org/licenses/>. 
 */

import { ApplicationCommandOptionType, ChatInputCommandInteraction, BaseGuildTextChannel } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { EchoUsers } from "../config.js";

@Discord()
class Echo {
  @Slash({
    name: "say",
    description: "Wypowiedź"
  })
  async echo (
    @SlashOption({
      name: "message",
      description: "message",
      type: ApplicationCommandOptionType.String,
      required: true
    })
    message: string,
    interaction: ChatInputCommandInteraction
  ) {
    await interaction.deferReply({
      ephemeral: true
    })

    const echo_users = ["828959544226742282", "1421490724301574315"];
if(!echo_users.includes(interaction.member?.user.id!)) {
      return await interaction.editReply({
        content: "ez masz bana"
      })
    }
    if (interaction.isCommand()) {
      await interaction.editReply({
        content: "ok"
      })
    }

    (interaction.channel! as BaseGuildTextChannel).send({
      content: message
    })
  }
}
