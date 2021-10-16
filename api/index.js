const {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} = require("discord-interactions");
const { Client, CategoryChannel, MessageEmbed } = require("discord.js")
const getRawBody = require("raw-body");
const client = new Client();

client.on('ready', () => {
  console.log('I am ready!');
});

client.login(process.env.TOKEN);

var fs = require('fs');

const path = require("path");

var obj = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../csv_full_traits.json'), 'utf8'));
var found = 0; 

const RARITYCAPY_COMMAND = {
  name: "rarity",
  description: "check the raity rank of your capy",
  options: [
    {
      name: "raritycapys",
      description: "The capy to check",
      type: 3,
      required: true,
    },
  ],
};

const INVITE_URL = `https://discord.com/oauth2/authorize?client_id=${process.env.APPLICATION_ID}&scope=applications.commands`;

/**
 * Gotta see someone 'bout a trout
 * @param {VercelRequest} request
 * @param {VercelResponse} response
 */
module.exports = async (request, response) => {
  // Only respond to POST requests
  if (request.method === "POST") {
    // Verify the request
    const signature = request.headers["x-signature-ed25519"];
    const timestamp = request.headers["x-signature-timestamp"];
    const rawBody = await getRawBody(request);

    const isValidRequest = verifyKey(
      rawBody,
      signature,
      timestamp,
      process.env.PUBLIC_KEY
    );

    if (!isValidRequest) {
      console.error("Invalid Request");
      return response.status(401).send({ error: "Bad request signature " });
    }

    // Handle the request
    const message = request.body;

    // Handle PINGs from Discord
    if (message.type === InteractionType.PING) {
      console.log("Handling Ping request");
      response.send({
        type: InteractionResponseType.PONG,
      });
    } else if (message.type === InteractionType.APPLICATION_COMMAND) {
      // Handle our Slash Commands
      switch (message.data.name.toLowerCase()) {
        case RARITYCAPY_COMMAND.name.toLowerCase():

        found = obj.findIndex(element => element.Capys == `capys ${message.data.options[0].value}`);

        var salida='';
        if(found<0)
        {
            salida = "not found";

            response.status(200).send({
              type: 4,
              data: {
                content: salida,
              },
            });
        }
        else{     

          client.on('message', message => {

           /* const exampleEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`capy ${message.data.options[0].value} Rank ${(found+1)}/3333`)
                .addFields(
                { name: `boca:${obj[found].boca}`, value:  `count:${obj[found].boca_count} (${obj[found].boca_percentage}%)`, inline: true },
                { name: `cig:${obj[found].cig}`, value: `count:${obj[found].cig_count} (${obj[found].cig_percentage}%)`, inline: true },
                { name: `cuerpo:${obj[found].cuerpo}`,value: `count:${obj[found].cuerpo_count} (${obj[found].cuerpo_percentage}%)`, inline: true },
                { name: `ear:${obj[found].ear}`, value: `count:${obj[found].ear_count} (${obj[found].ear_percentage}%)`, inline: true },
                { name: `gorro:${obj[found].gorro}`, value: `count:${obj[found].gorro_count} (${obj[found].gorro_percentage}%)`, inline: true },
                { name: `lentes:${obj[found].lentes}`, value: `count:${obj[found].lentes_count} (${obj[found].lentes_percentage}%)`, inline: true },
                { name: `ojos:${obj[found].ojos}`, value:  `count:${obj[found].ojos_count} (${obj[found].ojos_percentage}%)`, inline: true },
                { name: `ropa:${obj[found].ropa}`, value: `count:${obj[found].ropa_count} (${obj[found].ropa_percentage}%)`, inline: true },
                )
              //  .setImage('https://i.imgur.com/AfFp7pu.png')
                .setTimestamp()
                .setFooter('by Luis Mata');

                message.channel.send(exampleEmbed);   */

            const embed = new MessageEmbed()
                // Set the title of the field
                .setTitle('A slick little embed')
                // Set the color of the embed
                .setColor(0xff0000)
                // Set the main content of the embed
                .setDescription('Hello, this is a slick embed!');
              // Send the embed to the same channel as the message
              //message.channel.send(embed);

              response.status(200).send({
                type: 4,
                data: {
                  content: embed,
                },
              });
                
          });

          

          }
          console.log("Rarity Request");
          break;
        default:
          console.error("Unknown Command");
          response.status(400).send({ error: "Unknown Type" });
          break;
      }
    } else {
      console.error("Unknown Type");
      response.status(400).send({ error: "Unknown Type" });
    }
  }
};


