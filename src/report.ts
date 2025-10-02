import { InferSelectModel, eq } from "drizzle-orm";
import { guildsTable, reportTable } from "./db/schema";
import { Database } from "./database.js";
import { Main } from "./main";
import { CommonUtils } from "./utils";

export class Report {
  private _flags: ReportFlagsBitfield = 0;
  public set setFlags(flags: ReportFlagsBitfield) {
    this._flags = flags;
  }
  public get flags(): ReportFlagsBitfield {
    return this._flags;
  }

  public async create() {
    const mentionEveryone = this.flags & ReportFlags.MentionEveryone;
    const tellAdmins = this.flags & ReportFlags.TellAdmins;
    const keepAuthorAnonymous = this.flags & ReportFlags.KeepAuthorAnonymous;
    
    this.addToDB()

    if(tellAdmins) {
      const [partial_guild] = await Database.DB
        .select({
          reportChannel: guildsTable.reportChannel
        }).from(guildsTable)
        .where(eq(guildsTable.guild, this.guild))
        .limit(1)
      if(!partial_guild?.reportChannel) return;

      const report_channel = Main.Client.channels.cache.get(partial_guild?.reportChannel)
      if(report_channel?.isSendable()) 
        report_channel.send({
          content: 
            `kolezka <@${this.target}> sie zle zachowuje i dostal reporta ` +
            keepAuthorAnonymous ? `od <@${this.author}> ` : '' +
            typeof this.reason === "string" ? `za \`\`\`${CommonUtils.escapeOnlyBackticks(this.reason!)}\`\`\`` : '' +
            typeof this.context === "string" ? `kontekst: ${this.context}` : (this.attachments?.length > 0 ? )

        })
    }
  }

  private async addToDB(): Promise<void> {
    const [res] = await Database.DB
      .insert(reportTable)
      .values({
        author: this.author,
        guild: this.guild,
        target: this.target,
        attachments: this.attachments,
        context: this.context,
        reason: this.reason,
        status: this.status,
      })
      .returning({ time: reportTable.time, id: reportTable.id })
    this.id = res?.id!;
    this.time = res?.time!;
  }
}

type ReportType = InferSelectModel<typeof reportTable>;
export interface Report extends ReportType {}

export type ReportFlagsBitfield = number;
export enum ReportFlags {
  MentionEveryone = 0b1,
  TellAdmins = 0b01,
  KeepAuthorAnonymous = 0b001,
}