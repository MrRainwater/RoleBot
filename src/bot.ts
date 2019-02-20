import * as Discord from "discord.js";
import * as dotenv from "dotenv";
dotenv.config();
import * as config from "./vars";
import msg from "../events/message";
import commandHandler from "../commands/commandHandler";
import joinRole from "../events/joinRoles";

interface Command {
  desc: string;
  args: string;
  name: string;
  run: Function;
}

export default class RoleBot extends Discord.Client {
  config: any;
  commands: Discord.Collection<string, Command>;
  constructor() {
    super();
    this.config = config;
    this.commands = new Discord.Collection();

    commandHandler(this);
    this.on("ready", () => {
      console.log(`[Started]: ${new Date()}`);
      this.user.setUsername("RoleBot");
      setInterval(() => this.presence(), 10000);
    });

    this.on("message", message => {
      msg(this, message);
    });
    this.on("guildMemberAdd", member => {
      joinRole(member);
    });
  }

  presence() {
    const presArr = [
      `@${this.user.username} commands`,
      `@${this.user.username}`,
      `Guilds: ${this.guilds.size}`,
      `Ping: ${this.ping}`
    ];

    this.user.setPresence({
      game: { name: presArr[Math.floor(Math.random() * presArr.length)] },
      status: "online"
    });
  }

  async start() {
    await this.login(this.config.TOKEN);
  }
}
