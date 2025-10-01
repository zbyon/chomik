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
import { Infraction, InfractionCommonUtils, InfractionOption, InfractionType } from "../../infraction.js";
import { Permission } from "../../permission.js";
import { Format } from "../../format.js";
import { CommonUtils } from "../../utils.js";

@Discord()
export class BanModerationCommand {
  protected static maxBanDeleteMessagesTimeSeconds = 604800;
  protected static maxTimeStringLength = 12;

  @Slash({
    name: "ban",
    description: "Ban",
  })
  @Guard(isModerator)
  private async ban (
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
      name: "remove_messages",
      description: "example: 2d12h",
      type: ApplicationCommandOptionType.String,
      required: false,
    })
    remove_messages_time: string,
    interaction: ChatInputCommandInteraction,
  ) {
    if(!interaction.guildId) return;
    await interaction.deferReply();
    
    if(InfractionCommonUtils.checkIfReasonLengthIsWithinLimits(reason)) {
      await interaction.editReply({
        content: "mickiewicz ten powod jest za dlugi max to 400"
      })
      return;
    }
    
    if((remove_messages_time ?? "").length > BanModerationCommand.maxTimeStringLength) {
      await interaction.editReply({
        content: "czlowieku co ty wpisujesz w czas??"
      })
      return;
    }

    const parsed_time: number = remove_messages_time ? Math.floor(Format.convertWHMSToMillis(remove_messages_time) / 1000) : 0;
    if(parsed_time > BanModerationCommand.maxBanDeleteMessagesTimeSeconds) {
      await interaction.editReply({
        content: "max czasu to 7 dni"
      })
      return;
    }

    if(!CommonUtils.checkIfUserIsInGuild(target, interaction.guild?.members!)) {
      const infraction_draft: Infraction = {
        type: InfractionType.BAN,
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

      await interaction.guild?.bans.create(target, {
        deleteMessageSeconds: parsed_time,
        reason: InfractionCommonUtils.makeAPIReasonString(infraction.id!, reason),
      })
      await interaction.editReply({
        content: `nie ma go na serwerze ale spoko | ${infraction.id}`
      })
      return;
    }
    
    const target_member: GuildMember = await CommonUtils.getGuildMemberFromUserID(target.id, interaction.guild?.members!);
    if(!(await Permission.canMemberPunishOtherMember(interaction.member as GuildMember, target_member)) || !target_member.bannable) {
      await interaction.editReply({
        content: "jestes bottomem nie mozesz mu nic zrobic (albo ja)"
      })
      return;
    }

    const infraction_draft: Infraction = {
      type: InfractionType.BAN,
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

    await target_member.ban({
      deleteMessageSeconds: parsed_time,
      reason: InfractionCommonUtils.makeAPIReasonString(infraction.id!, reason),
    })

    await interaction.editReply(infraction.id!)
  }
}