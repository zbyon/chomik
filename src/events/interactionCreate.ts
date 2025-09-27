/*
 * Copyright (C) 2025 Piecuuu

 * This file is part of Chomik.
 * Chomik is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * Chomik is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with Chomik. If not, see <https://www.gnu.org/licenses/>. 
 */

import { ArgsOf, Discord, On } from "discordx";
import { Main } from "../main.js";
import { Interaction } from "discord.js";

@Discord()
export class InteractionCreateEvent {
  @On({ event: "interactionCreate" })
  async interactionCreate(
    [interaction]: ArgsOf<"interactionCreate">
  ): Promise<void> {
    Main.Client.executeInteraction(interaction);
  }
}