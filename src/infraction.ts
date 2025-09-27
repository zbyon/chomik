import { Guild, GuildTextBasedChannel, User } from "discord.js";
import { Database } from "./database";
import { infractionTable } from "./db/schema";
import { UniqueID } from "./uid";
import { CommonUtils } from "./utils";

export class Infraction {
  public static async new(
    { options, infraction, adminChannel, publicChannel }: InfractionConstructor
  ) {
    infraction.id = new UniqueID().id;

    const notify_admins = options & InfractionOption.NotifyAdmins;
    const notify_public = options & InfractionOption.NotifyPublic;
    const notify_target = options & InfractionOption.NotifyTarget;

    await this.addToDB(infraction);

    if(notify_admins) await Infraction.notifyAdmins(infraction, adminChannel!);
    if(notify_target) await Infraction.tryNotifyTarget(infraction);
    if(notify_public) await Infraction.notifyPublic(infraction, publicChannel!);
  }

  public static async addToDB(infraction: Infraction): Promise<void> {
    await Database.DB
      .insert(infractionTable)
      .values({
        id: infraction.id,
        author: infraction.author.id,
        target: infraction.target.id,
        guild: infraction.guild.id,
        reason: infraction.reason,
        time: infraction.time,
      })
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
      content: `
        joł zostałeś 
        ${this.infractionTypeToHumanReadable(infraction.type)}a 
        ${infraction.reason ? `za \`\`\`${CommonUtils.escapeOnlyBackticks(infraction.reason!)}\`\`\`` : ""} 
        (${infraction.id})
      `
    }).catch(()=>{})
  }

  public static async notifyAdmins(infraction: Infraction, channel: GuildTextBasedChannel) {
    await channel.send({
      content: `
        moj ziom <@${infraction.target.id}> dostal 
        ${this.infractionTypeToHumanReadable(infraction.type)}a 
        od <@${infraction.author.id}> 
        ${infraction.reason ? `za \`\`\`${CommonUtils.escapeOnlyBackticks(infraction.reason!)}\`\`\`` : ""} 
        (${infraction.id})
      `
    }).catch(console.error)
  }

  public static async notifyPublic(infraction: Infraction, channel: GuildTextBasedChannel) {
    await channel.send({
      content: `
        <@${infraction.target.id}> dostal 
        ${this.infractionTypeToHumanReadable(infraction.type)}a 
        ${infraction.reason ? `za \`\`\`${CommonUtils.escapeOnlyBackticks(infraction.reason!)}\`\`\`` : ""} 
        (${infraction.id})
      `
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
  publicChannel: GuildTextBasedChannel | undefined;
  adminChannel: GuildTextBasedChannel | undefined;
} 

export interface Infraction {
  id: string;
  type: InfractionType;
  target: User;
  author: User;
  guild: Guild;
  reason: string | null;
  time: Date;
}

export enum InfractionType {
  WARN = 0,
  MUTE = 1,
  KICK = 2,
  BAN  = 3,
}