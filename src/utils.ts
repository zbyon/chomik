/*
 * Copyright (C) 2025 Piecuuu

 * This file is part of Chomik.
 * Chomik is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * Chomik is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with Chomik. If not, see <https://www.gnu.org/licenses/>. 
 */

import { GuildMember, GuildMemberManager, User } from "discord.js";

export class CommonUtils {
  public static escapeMarkdown(input: string): string {
    return input.replaceAll("`", "\\`")
                .replaceAll("-", "\\-")
                .replaceAll("#", "\\#")
                .replaceAll("*", "\\*")
                .replaceAll("\\", "\\\\")
                .replaceAll(">", "\\>")
                .replaceAll("|", "\\|")
                .replaceAll("~", "\\~")
                .replaceAll("_", "\\_");
  }

  public static escapeOnlyBackticks(input: string): string {
    return input.replaceAll("`", "\\`");
  }

  public static async getGuildMemberFromUserID(user: string, guildMembers: GuildMemberManager): Promise<GuildMember> {
    return guildMembers.cache.get(user) ?? await guildMembers.fetch(user)
  }

  public static checkIfUserIsInGuild(user: User, guildMembers: GuildMemberManager): boolean {
    return guildMembers.cache.find(u => u.id === user.id) !instanceof GuildMember;
  }

  public static parseEnvBoolean(env_var: string | undefined, default_value: boolean = false): boolean {
    switch((env_var ?? "").toLowerCase()) {
      case "1":
      case "true":
      case "yes":
      case "y":
        return true;

      case "0":
      case "false":
      case "no":
      case "n":
        return false;

      default:
        return default_value
    }
  }
}