import bodyParser from 'body-parser';
import { Picker } from 'meteor/meteorhacks:picker';

Picker.middleware(bodyParser.json());

Picker.route('/webhooks/:service', (params, request, response) => {
  const service = handleWebhook[params.service];
  if (service) service(request);
  response.writeHead(200);
  response.end('[200] Webhook received.');
});
