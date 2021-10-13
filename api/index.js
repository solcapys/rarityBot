const {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} = require('discord-interactions');
const getRawBody = require('raw-body');
var fs = require('fs');

const path = require("path");

var obj = JSON.parse(fs.readFileSync(path.resolve(__dirname, '/csvjson.json'), 'utf8'));

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

var found = 0; 
const INVITE_URL = `https://discord.com/oauth2/authorize?client_id=${process.env.APPLICATION_ID}&scope=applications.commands`;
/**
 * Gotta see someone 'bout a trout
 * @param {VercelRequest} request
 * @param {VercelResponse} response
 */
module.exports = async (request, response) => {
  if (request.method === 'POST') {
    const signature = request.headers['x-signature-ed25519'];
    const timestamp = request.headers['x-signature-timestamp'];
    const rawBody = await getRawBody(request);

    const isValidRequest = verifyKey(
      rawBody,
      signature,
      timestamp,
      process.env.PUBLIC_KEY
    );

    if (!isValidRequest) {
      console.error('Invalid Request');
      return response.status(401).send({ error: 'Bad request signature ' });
    }

    const message = request.body;

    if (message.type === InteractionType.PING) {
      console.log('Handling Ping request');
      response.send({
        type: InteractionResponseType.PONG,
      });
    } else if (message.type === InteractionType.APPLICATION_COMMAND) {
      switch (message.data.name.toLowerCase()) {
        case RARITYCAPY_COMMAND.name.toLowerCase():

        found = obj.findIndex(element => element.capy == `capys ${message.data.options[0].value}`);

        var salida='';
        if(found<0)
        {
            salida = "not found";
        }
        else{
            salida = `capy rank ${(found+1)}`;
        }

        response.status(200).send({
          type: 4,
          data: {
            content: salida,
          },
        });
        
        server.log.info('rarity Request');
        break;
        default:
          console.error('Unknown Command');
          response.status(400).send({ error: 'Unknown Type' });
          break;
      }
    } else {
      console.error('Unknown Type');
      response.status(400).send({ error: 'Unknown Type' });
    }
  }
};


