/*
 * Copyright (C) 2025 Piecuuu

 * This file is part of Chomik.
 * Chomik is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * Chomik is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with Chomik. If not, see <https://www.gnu.org/licenses/>. 
 */

import { ApplicationCommandOptionType, ChatInputCommandInteraction, GuildMember, User } from "discord.js";
import { Discord, Guard, Slash, SlashOption } from "discordx";
import { isModerator } from "../../guards/isModerator.js";
import { Infraction, InfractionOption, InfractionType } from "../../infraction.js";
import { Permission } from "../../permission.js";
import { Format } from "../../format.js";

@Discord()
export class MuteModerationCommand {
  @Slash({
    name: "mute",
    description: "Mute",
  })
  @Guard(isModerator)
  private async mute (
    @SlashOption({
      name: "user",
      description: "User",
      type: ApplicationCommandOptionType.User,
      required: true,
    })
    target: User,
    @SlashOption({
      name: "reason",
      description: "Reason",
      type: ApplicationCommandOptionType.String,
      required: false,
    })
    reason: string,
    @SlashOption({
      name: "time",
      description: "example: 2d12h",
      type: ApplicationCommandOptionType.String,
      required: false,
    })
    time: string,
    interaction: ChatInputCommandInteraction,
  ) {
    if(!interaction.guildId) return;
    await interaction.deferReply();

    if(!interaction.guild?.members.cache.find(u => u.id === target.id)) {
      await interaction.editReply({
        content: "gosciu on nie jest na tym serwerze"
      })
      return;
    }

    const target_member: GuildMember = interaction.guild.members.cache.get(target.id) ?? await interaction.guild.members.fetch(target.id);
    if(!(await Permission.canMemberPunishOtherMember(interaction.member as GuildMember, target_member)) || !target_member.moderatable) {
      await interaction.editReply({
        content: "jestes bottomem nie mozesz mu nic zrobic (albo ja)"
      })
      return;
    }

    if(reason && (reason.length > 400 || reason.length <= 0)) {
      await interaction.editReply({
        content: "mickiewicz ten powod jest za dlugi max to 400"
      })
      return;
    }
    
    if(time.length > 12) {
      await interaction.editReply({
        content: "czlowieku co ty wpisujesz w czas??"
      })
      return;
    }

    const parsed_time: number = Math.floor(Format.convertWHMSToMillis(time) / 1000);
    if(parsed_time > 2419200) {
      await interaction.editReply({
        content: "max czasu to 28 dni"
      })
      return;
    }

    const infraction_draft: Infraction = {
      type: InfractionType.MUTE,
      author: interaction.user,
      target: target,
      reason: reason!,
      guild: interaction.guild!,
      punishmentTime: parsed_time,
    };

    const infraction = await Infraction.new({
      options: InfractionOption.NotifyAdmins |
               InfractionOption.NotifyPublic |
               InfractionOption.NotifyTarget,
      infraction: infraction_draft,
    })

    await target_member.timeout(parsed_time * 1000)

    await interaction.editReply(infraction.id!)
  }
}