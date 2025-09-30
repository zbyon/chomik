/*
 * Copyright (C) 2025 Piecuuu

 * This file is part of Chomik.
 * Chomik is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * Chomik is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with Chomik. If not, see <https://www.gnu.org/licenses/>. 
 */

import { Guild, GuildTextBasedChannel, User } from "discord.js";
import { Database } from "./database.js";
import { infractionTable } from "./db/schema.js";
import { UniqueID } from "./uid.js";
import { CommonUtils } from "./utils.js";

export class Infraction {
  public static async new(
    { options, infraction, adminChannel, publicChannel }: InfractionConstructor
  ): Promise<Infraction> {
    infraction.id = new UniqueID().id;

    const notify_admins = options & InfractionOption.NotifyAdmins;
    const notify_public = options & InfractionOption.NotifyPublic;
    const notify_target = options & InfractionOption.NotifyTarget;

    const partial_infraction = await this.addToDB(infraction);
    const infraction_with_date = {...infraction, ...partial_infraction};

    if(notify_admins && adminChannel) await Infraction.notifyAdmins(infraction_with_date, adminChannel!);
    if(notify_target) await Infraction.tryNotifyTarget(infraction_with_date);
    if(notify_public && publicChannel) await Infraction.notifyPublic(infraction_with_date, publicChannel!);

    return infraction_with_date;
  }

  public static async addToDB(infraction: Infraction): Promise<{ time: Date }> {
    const [res] = await Database.DB
      .insert(infractionTable)
      .values({
        id: infraction.id!,
        type: infraction.type,
        author: infraction.author.id,
        target: infraction.target.id,
        guild: infraction.guild.id,
        reason: infraction.reason,
        punishmentTime: infraction.punishmentTime,
      })
      .returning({ time: infractionTable.time });
    return {...res!};
  }

  public static infractionTypeToHumanReadable(type: InfractionType): string {
    switch(type) {
      case InfractionType.WARN: return "warn";
      case InfractionType.BAN: return "ban";
      case InfractionType.KICK: return "kick";
      case InfractionType.MUTE: return "mute";
      default: throw new Error("nieznany InfractionType");
    }
  }

  public static async tryNotifyTarget(infraction: Infraction) {
    await infraction.target.send({
      content: 
      `joł zostałeś ${this.infractionTypeToHumanReadable(infraction.type!)}a ` +
      `${infraction.reason ? `za \`\`\`${CommonUtils.escapeOnlyBackticks(infraction.reason!)}\`\`\`` : ""} ` +
      `(${infraction.id})`
    }).catch(()=>{})
  }

  public static async notifyAdmins(infraction: Infraction, channel: GuildTextBasedChannel) {
    await channel.send({
      content: 
        `moj ziom <@${infraction.target.id}> dostal ` +
        `${this.infractionTypeToHumanReadable(infraction.type!)}a ` +
        `od <@${infraction.author.id}> ` +
        `${infraction.reason ? `za \`\`\`${CommonUtils.escapeOnlyBackticks(infraction.reason!)}\`\`\`` : ""} ` +
        `(${infraction.id})`
    }).catch(console.error)
  }

  public static async notifyPublic(infraction: Infraction, channel: GuildTextBasedChannel) {
    await channel.send({
      content: `<@${infraction.target.id}> dostal ` +
        `${this.infractionTypeToHumanReadable(infraction.type!)}a ` +
        `${infraction.reason ? `za \`\`\`${CommonUtils.escapeOnlyBackticks(infraction.reason!)}\`\`\`` : ""} ` +
        `(${infraction.id})`
    }).catch(console.error)
  }
}

export type InfractionOptionBitfield = number;
export enum InfractionOption {
  NotifyPublic = 0b1,
  NotifyAdmins = 0b01,
  NotifyTarget = 0b001,
}
export interface InfractionConstructor {
  infraction: Infraction;
  options: InfractionOption;
  publicChannel?: GuildTextBasedChannel;
  adminChannel?: GuildTextBasedChannel;
} 

export interface Infraction {
  id?: string;
  type: InfractionType;
  target: User;
  author: User;
  guild: Guild;
  reason?: string;
  time?: Date;
  punishmentTime?: number; // in seconds
}

export enum InfractionType {
  WARN = 0,
  MUTE = 1,
  KICK = 2,
  BAN  = 3,
}