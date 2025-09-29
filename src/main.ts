import { Client } from "discordx"
import { ActivityType, IntentsBitField } from "discord.js"
import { dirname, importx } from "@discordx/importer";

export class Main {
  private static _client: Client

  static get Client(): Client {
    return this._client;
  }

  static async start(): Promise<void> {
    this._client = new Client({
      botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMembers,
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

    await importx(`${dirname(import.meta.url)}/{events,commands}/**/*.{js,ts}`);

    if (!process.env.BOT_TOKEN) {
      throw Error("zapomniałes o BOT_TOKEN");
    }
    await this._client.login(process.env.BOT_TOKEN);
  }
}

void Main.start();
