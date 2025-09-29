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

@Discord()
export class KickModerationCommand {
  @Slash({
    name: "kick",
    description: "Kick",
  })
  @Guard(isModerator)
  private async kick (
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
    if(!(await Permission.canMemberPunishOtherMember(interaction.member as GuildMember, target_member)) || !target_member.kickable) {
      await interaction.editReply({
        content: "jestes bottomem nie mozesz mu nic zrobic"
      })
      return;
    }

    if(reason && (reason.length > 400 || reason.length <= 0)) {
      await interaction.editReply({
        content: "mickiewicz ten powod jest za dlugi max to 400"
      })
      return;
    } 

    const infraction_draft: Infraction = {
      type: InfractionType.WARN,
      author: interaction.user,
      target: target,
      reason: reason!,
      guild: interaction.guild!,
    };

    const infraction = await Infraction.new({
      options: InfractionOption.NotifyAdmins |
               InfractionOption.NotifyPublic |
               InfractionOption.NotifyTarget,
      infraction: infraction_draft,
    })

    await target_member.kick(reason ? `${reason} | ${infraction.id}` : infraction.id)

    await interaction.editReply(infraction.id!)
  }
}