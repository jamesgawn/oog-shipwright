import { Env } from "../../types/Env";
import { commands } from "../commands";
import { Command } from "../structures/Command";

export const deploy = async (env: Env) => { 
  
    const commandInstances = Object.values(commands).map(
        (Command) => new Command!(env as unknown as Env),
    ) as Command[];
  
    const globalCommands = commandInstances
  .filter((command) => typeof command.guildIDs === 'undefined')
  .map((command) => Object.values(command.structure))
  .flat(1);

  const response = await fetch(
    `https://discord.com/api/v10/applications/${env.DISCORD_APP_ID}/commands`,
    {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bot ${env.DISCORD_TOKEN}`,
        },
        method: 'PUT',
        body: JSON.stringify(globalCommands),
    },
);

if (response.ok) {
    return new Response("Successfully deployed commands",{
        status: 200
    })
} else {
    return new Response(await response.text(),{
        status: 500,
    })
}
}