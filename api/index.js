const {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} = require("discord-interactions");
const getRawBody = require("raw-body");

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
        }
        else{
            salida = `capy ${message.data.options[0].value} rank ${(found+1)}/3333\nbackground:${obj[found].background} count:${obj[found].background_count} (${obj[found].background_percentage}%)\nboca:${obj[found].boca} count:${obj[found].boca_count} (${obj[found].boca_percentage}%)\ncig:${obj[found].cig} count:${obj[found].cig_count} (${obj[found].cig_percentage}%)\ncuerpo:${obj[found].cuerpo} count:${obj[found].cuerpo_count} (${obj[found].cuerpo_percentage}%)\near:${obj[found].ear} count:${obj[found].ear_count} (${obj[found].ear_percentage}%)\ngorro:${obj[found].gorro} count:${obj[found].gorro_count} (${obj[found].gorro_percentage}%)\nlentes:${obj[found].lentes} count:${obj[found].lentes_count} (${obj[found].lentes_percentage}%)\nojos:${obj[found].ojos} count:${obj[found].ojos_count} (${obj[found].ojos_percentage}%)\nropa:${obj[found].ropa} count:${obj[found].ropa_count} (${obj[found].ropa_percentage}%)\n`;
        }

          response.status(200).send({
            type: 4,
            data: {
              content: salida,
            },
          });
          console.log("Slap Request");
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