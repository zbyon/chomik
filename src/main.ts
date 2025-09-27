/*
 * Copyright (C) 2025 Piecuuu

 * This file is part of Chomik.
 * Chomik is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * Chomik is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with Chomik. If not, see <https://www.gnu.org/licenses/>. 
 */

import "dotenv/config"
import { Client } from "discordx"
import { IntentsBitField } from "discord.js"
import { dirname, importx } from "@discordx/importer";
import { Database } from "./database.js";

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
    })

    await importx(`${dirname(import.meta.url)}/{events,commands,handlers}/**/*.{js,ts}`);

    if (!process.env.BOT_TOKEN) {
      throw Error("zapomniałes o BOT_TOKEN");
    }
    await this._client.login(process.env.BOT_TOKEN);
  }
}

void Main.start();
