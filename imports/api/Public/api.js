import bodyParser from 'body-parser';
import { Picker } from 'meteor/meteorhacks:picker';
import Events from '../Events/Events';

Picker.middleware(bodyParser.json());

const handleError = (response, code, message) => {
  response.writeHead(code);
  response.end(message);
};

Picker.route('/api/events', (params, request, response) => {
  console.log(params);
  if (!params.query.apiKey) handleError(response, 403, 'Please pass an apiKey param with your request.');
  if (!params.query.reader) handleError(response, 403, 'Please pass a reader param with your request.');
  if (!params.query.maxEvents) handleError(response, 403, 'Please pass a maxEvents param as a number with your request.');

  const maxEvents = parseInt(params.query.maxEvents, 10);

  const events = Events.find({ 'message.rdr': params.query.reader }, { limit: maxEvents <= 999 ? maxEvents : 999 }).fetch();
  response.writeHead(200);
  response.end(JSON.stringify(events));
});

Picker.route('/api/events1', (params, request, response) => {
  console.log(params);
  if (!params.query.apiKey) handleError(response, 403, 'Please pass an apiKey param with your request.');
  if (!params.query.reader) handleError(response, 403, 'Please pass a reader param with your request.');
  if (!params.query.maxEvents) handleError(response, 403, 'Please pass a maxEvents param as a number with your request.');

  const maxEvents = parseInt(params.query.maxEvents, 10);

  const events = Events.find({ 'message.rdr': params.query.reader }, { fields: { _id: 0 }, limit: maxEvents <= 999 ? maxEvents : 999 }).fetch();
  response.writeHead(200);
  response.end(JSON.stringify(events));
});
