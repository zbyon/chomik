/*
 * Copyright (C) 2025 Piecuuu

 * This file is part of Chomik.
 * Chomik is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * Chomik is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with Chomik. If not, see <https://www.gnu.org/licenses/>. 
 */

import "dotenv/config"
import { Client } from "discordx"
import { ActivityType, IntentsBitField } from "discord.js"
import { dirname, importx } from "@discordx/importer";
import { Database } from "./database.js";
import { CommonUtils } from "./utils.js";
import { importxWithIgnore } from "./importx.js";
import fs from "fs/promises";

export class Main {
  private static _client: Client

  static get Client(): Client {
    return this._client;
  }

  static async start(): Promise<void> {
    Database.connect();

    this._client = new Client({
      botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.MessageContent,
      ],
      silent: false,
      presence: {
        activities: [
          {
            name: "Kalkulator",
            type: ActivityType.Playing
          }
        ]
      }
    })

    const importAllGlob: string = `${dirname(import.meta.url)}/{events,commands,handlers}/**/*.{js,ts}`;

    let importIgnores: string[] = [];
    if(!CommonUtils.parseEnvBoolean(process.env.CONFIG_FEATURE_XP, true)) importIgnores.push(`handlers/xp`);
    if(!CommonUtils.parseEnvBoolean(process.env.CONFIG_FEATURE_MODERATION, true)) importIgnores.push(`commands/moderation`);
    if(!CommonUtils.parseEnvBoolean(process.env.CONFIG_FEATURE_SAY, true)) importIgnores.push(`commands/say`);

    if(CommonUtils.parseEnvBoolean(process.env.CONFIG_FORCE_IMPORT_ALL, false)) {
      await importx(importAllGlob);
    } else {
      await importxWithIgnore(importIgnores, importAllGlob);
    }

    const BOT_TOKEN = process.env.BOT_TOKEN;
    const BOT_TOKEN_PATH = process.env.BOT_TOKEN_PATH;

    if (!(BOT_TOKEN || BOT_TOKEN_PATH)) {
      throw Error("zapomniałes o BOT_TOKEN");
    } else if(BOT_TOKEN) {
      await this._client.login(BOT_TOKEN);
    } else if(BOT_TOKEN_PATH) {
      await fs.access(BOT_TOKEN_PATH, fs.constants.F_OK)
      const raw_content = await fs.readFile(BOT_TOKEN_PATH, { encoding: "utf-8", flag: "r" });
      const first_line = raw_content.split("\n")[0]
      if(first_line?.length! < 64) throw new Error("Invalid token (length), empty file or token not on first line.") // my token is 72 characters so 64 should be enough
      await this._client.login(first_line!);
    }
  }
}

void Main.start();

