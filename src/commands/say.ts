/*
 * Copyright (C) 2025 zbyon
 * Copyright (C) 2025 Piecuuu
 * 
 * This file is part of Chomik.
 * Chomik is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * Chomik is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with Chomik. If not, see <https://www.gnu.org/licenses/>. 
 */

import { ApplicationCommandOptionType, ChatInputCommandInteraction, BaseGuildTextChannel, Message, ReplyOptions, MessageFlags } from "discord.js";
import { Discord, Once, Slash, SlashOption } from "discordx";

@Discord()
export class SayCommand {
  protected static _echoUsers: string[] = ["828959544226742282", "633313654283960330", "678191118063632388"];
  protected static _lures: string[] = [
    "https://media.discordapp.net/attachments/1121866604431540274/1136089357598605393/attachment.gif?ex=68e503ea&is=68e3b26a&hm=6f7a4c5f19a52bad90c6ae48f1047d03033a1f4c5d2a71cb9eebadbec8dc4ad8&",
    "https://media.discordapp.net/attachments/834183600282665041/1105496890654588940/attachment-19-1.gif?ex=68e51f35&is=68e3cdb5&hm=73d8637ef94bd56c7f25ad50dd35a3cbb45a3bda1ce2cc0d52c7cdac29a91c14&",
    "https://cdn.discordapp.com/attachments/438496576944472075/1272677715715035157/ezgif-6-f11b581713.gif?ex=68e4e63c&is=68e394bc&hm=80f74647c114549ed40a5c36ec98bbd6f2bb63f4ef1ace97e8eb5884bb3d01ca&",
    "https://tenor.com/view/onimai-mahiro-oyama-pout-speech-bubble-gif-27577074",
    "https://tenor.com/view/your-package-came-in-the-mail-euphemism-homophones-pun-boykisser-gif-4464700753050259448",
    "https://cdn.discordapp.com/attachments/849236767999787039/1302718778945306734/New_Element_14_Copy_Copy.gif?ex=68e56c68&is=68e41ae8&hm=7431a274a16e096ee5112ebff01b515da8b5a763a2ce7e4bfe2adb0d490833de&",
    "https://media.discordapp.net/attachments/954046292584194081/1190295605893922867/RDT_20231121_1847487338397723261121471.gif?ex=68e51f2b&is=68e3cdab&hm=98eb5cbaceea966b31b1a055cff8230c4efd3011d8f5eb66c08bbb4e20373b62&",
    "https://tenor.com/view/femboy-thighs-gif-24834955",
    "https://tenor.com/view/boykisser-gif-17337070286879071820",
    "https://cdn.discordapp.com/attachments/1295466439280431225/1322389172170002442/attachment.gif?ex=68e52223&is=68e3d0a3&hm=b566cac719df6e9598911651d5c4b18b276f0f58bf9598663f4cc3ed02a097ac&",
    "https://tenor.com/view/furry-femboy-speechbubble-gif-2755355702946194600",
    "https://tenor.com/view/femboy-opsoncelulmeu-dav6e-shanemills-katze-gif-1277417407165987518",
  ];

  private static _recentUsers: Map<string, string> = new Map<string, string>() // userid, guildid
  private static _lastUser: { uid: string, gid: string };

  @Slash({
    name: "say",
    description: "Wypowiedź"
  })
  private async say (
    @SlashOption({
      name: "message",
      description: "message",
      type: ApplicationCommandOptionType.String,
      required: true
    })
    message: string,
    @SlashOption({
      name: "reference",
      description: "referenced message",
      type: ApplicationCommandOptionType.String,
      required: false
    })
    reference: string,
    interaction: ChatInputCommandInteraction
  ) {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral
    })
    let should_pass: boolean = false;

    if((Math.floor(Math.random()*100) % 3) === 0) should_pass = true

    if(SayCommand._lastUser.gid === interaction.guildId && SayCommand._lastUser.uid === interaction.user.id) should_pass = false;
    if(SayCommand._recentUsers.get(interaction.user.id) === interaction.guildId) should_pass = false;

    const forced_pass: boolean = SayCommand._echoUsers.includes(interaction.member?.user.id!);

    if(!(should_pass || forced_pass)) {
      await interaction.editReply({
        content: SayCommand._lures[Math.floor(Math.random()*100) % SayCommand._lures.length]
      })
      return
    }

    // wasnt forced by echousers
    if(!forced_pass) {
      SayCommand._lastUser = { gid: interaction.guildId!, uid: interaction.user.id };
      SayCommand._recentUsers.set(interaction.user.id, interaction.guildId!);
    }

    if (interaction.isCommand()) {
      await interaction.editReply({
        content: "ok"
      })
    }

    let reply: ReplyOptions | undefined = undefined;
    if(reference) {
      let referenced_message_obj: Message | undefined;
      try {
        referenced_message_obj = interaction.channel?.messages.cache.get(reference) ?? await interaction.channel?.messages.fetch(reference)
      } catch(err) {
        console.error(err)
        return;
      }

      reply = {
        messageReference: referenced_message_obj!
      }
    }

    await (interaction.channel! as BaseGuildTextChannel).send({
      content: message,
      reply
    })
  }

  @Once({
    event: "clientReady"
  })
  private clearRecordsTimeoutIgniter() {
    setInterval(() => {
      SayCommand._recentUsers.clear();
    }, 3*60*1000)
  }
}
