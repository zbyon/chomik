/*
 * Copyright (C) 2025 Piecuuu

 * This file is part of Chomik.
 * Chomik is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * Chomik is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with Chomik. If not, see <https://www.gnu.org/licenses/>. 
 */

import { ArgsOf, Discord, On } from "discordx";
import { Database } from "../database.js";
import { xpTable } from "../db/schema.js";
import { Message, MessageFlags } from "discord.js";
import { and, eq, sql } from "drizzle-orm";

@Discord()
export class XPHandler {
  @On({ event: "messageCreate" })
  private async xp_handler (
    [message]: ArgsOf<"messageCreate">
  ) {
    if (!message.inGuild() || message.author.bot) return;
    const xp = XPHandler.xp_from_msg(message);
    const guild_id = message.guild?.id!;
    const user_id = message.author.id;

    const [res] = await Database.DB
      .insert(xpTable)
      .values({
        user: user_id, guild: guild_id, xp
      })
      .onConflictDoUpdate({
        target: xpTable.user,
        set: {
          xp: sql`${xpTable.xp} + ${xp}`,
        }
      })
      .returning({ xp: xpTable.xp, lvl: xpTable.lvl })
    
    const new_xp = res?.xp!;
    const new_lvl = XPHandler.lvl_calc(new_xp);
    const old_lvl = res?.lvl!;
    
    if(new_lvl <= old_lvl) return;

    await Database.DB
      .update(xpTable)
      .set({
        lvl: new_lvl
      })
      .where(and(eq(xpTable.user, user_id), eq(xpTable.guild, guild_id)))

    message.channel.send({
      content: `<@${message.author.id}> gratulacje nowy lewel ${new_lvl} (stary lvl to ${old_lvl})`
    })
  }

  static lvl_calc(xp: number): number {
    const base = 200;
    const exp = 1.8;
    
    return Math.floor(Math.pow(xp / base, 1/exp)) + 1;
  }

  static xp_from_msg(message: Message): number {
    if(message.member?.user.bot == true && (message.flags.bitfield & MessageFlags.IsCrosspost) !== 0) return 0;
    const base = 100;

    const veryveryshort_multi = 0.1;  // < 10 ch
    const veryshort_multi     = 0.3;  // < 20 ch
    const short_multi         = 0.6;  // < 40 ch
    const medium_multi        = 1;    // < 60 ch
    const long_multi          = 1.4;  // < 100 ch
    const verylong_multi      = 1.5;  // < 250 ch

    let total_multi = 1;
    if      (message.content.length < 10)  total_multi *= veryveryshort_multi;
    else if (message.content.length < 20)  total_multi *= veryshort_multi;
    else if (message.content.length < 40)  total_multi *= short_multi;
    else if (message.content.length < 60)  total_multi *= medium_multi;
    else if (message.content.length < 100) total_multi *= long_multi;
    else if (message.content.length < 250) total_multi *= verylong_multi;

    return Math.floor(base * total_multi);
  }
}