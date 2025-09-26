import { Discord, Once } from "discordx";
import { Main } from "../main.js";

@Discord()
export class ReadyEvent {
  @Once({ event: "clientReady" })
  private async ready() {
    await Main.Client.initApplicationCommands().then(() => {
      console.log("komendy sie zrobiły")
    })

    console.log("spoko ziom wszystko gra")
  }
}