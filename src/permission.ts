/*
 * Copyright (C) 2025 Piecuuu

 * This file is part of Chomik.
 * Chomik is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * Chomik is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with Chomik. If not, see <https://www.gnu.org/licenses/>. 
 */

import { GuildMember, PermissionsBitField, Permissions } from "discord.js";
import { Database } from "./database.js";
import { guildsTable } from "./db/schema.js";
import { eq } from "drizzle-orm";
import { Main } from "./main.js";


export class Permission {
  public static async isAdmin(member: GuildMember) {
    if(member.guild.ownerId === member.user.id) return true;
    if(this.hasDiscordPermission(member, PermissionsBitField.Flags.Administrator)) return true;

    const [db_guild] = await Database.DB
      .select().from(guildsTable)
      .where(eq(guildsTable.guild, member.guild.id))

    if(!db_guild) {
      await Database.DB
        .insert(guildsTable)
        .values({
          guild: member.guild.id
        });
      return this.hasDiscordPermission(member, PermissionsBitField.Flags.Administrator);
    }
    const roles = db_guild.moderatorRoles;
    if(roles.length <= 0 || !roles) return false;

    return roles.some(id => member.roles.cache.has(id));
  }

  public static fetchForAdminPermission(member: GuildMember) {
    return this.hasDiscordPermission(member, PermissionsBitField.Flags.Administrator);
  }

  public static hasDiscordPermission(member: GuildMember, perm: bigint) {
    return member.permissions.has(perm)
  }

  public static getPermissionName(perm: bigint): Permissions | null {
    for (const [name, value] of Object.entries(PermissionsBitField.Flags)) {
      if ((perm & value) === value) {
        return name;
      }
    }
    return null;
  }

  public static getMemberWithHighestRoleFromList(members: GuildMember[]): GuildMember {
    const highest = members.reduce((a, b) => {
      return a.roles.highest.position > b.roles.highest.position ? a : b
    })

    return highest
  }

  public static isPermissionValid(perm: Permissions): boolean {
    return PermissionsBitField.Flags.hasOwnProperty(perm)
  }

  static async canMemberPunishOtherMember(executor: GuildMember, target: GuildMember): Promise<boolean> {
    if(this.getMemberWithHighestRoleFromList([executor, target]).id == executor.id || executor.guild.ownerId == executor.id)
      return true;

    return false;
  }
}