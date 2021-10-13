import fastify from "fastify";
import rawBody from 'fastify-raw-body';
import { InteractionResponseType, InteractionType,verifyKey, } from "discord-interactions";
import fs from 'fs';
var obj = JSON.parse(fs.readFileSync('///var/task/api/csvjson.json', 'utf8'));

export const RARITYCAPY_COMMAND = {
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

var found = 0; 

const server = fastify({
  logger: true,
});

server.register(rawBody, {
  runFirst: true,
});

server.get("/", (request, response) => {
  server.log.info("Handling GET request");
});

server.addHook('preHandler', async (request, response) => {
  // We don't want to check GET requests to our root url
  if (request.method === 'POST') {
    const signature = request.headers['x-signature-ed25519'];
    const timestamp = request.headers['x-signature-timestamp'];
    const isValidRequest = verifyKey(
      request.rawBody,
      signature,
      timestamp,
      process.env.PUBLIC_KEY
    );
    if (!isValidRequest) {
      server.log.info('Invalid Request');
      return response.status(401).send({ error: 'Bad request signature ' });
    }
  }
});

server.post("/", async (request, response) => {
  const message = request.body;
  if (message.type === InteractionType.PING) {
    server.log.info("Handling Ping request");
    response.send({
      type: InteractionResponseType.PONG,
    });
} else if (message.type === InteractionType.APPLICATION_COMMAND) {
    console.log(message.data.name.toLowerCase());
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
        server.log.error('Unknown Command');
        response.status(400).send({ error: 'Unknown Type' });
        break;
    }
  } else {
    server.log.error("Unknown Type");
    response.status(400).send({ error: "Unknown Type" });
  }
});

server.listen(3000, async (error, address) => {
  if (error) {
    server.log.error(error);
    process.exit(1);
  }
  server.log.info(`server listening on ${address}`);
});

