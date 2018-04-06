import bodyParser from 'body-parser';
import { Picker } from 'meteor/meteorhacks:picker';
import Events from '../Events/Events';
import Customers from '../Customers/Customers';
import Readers from '../Readers/Readers';
import Beacons from '../Beacons/Beacons';
import BeaconTypes from '../BeaconTypes/BeaconTypes';

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

Picker.route('/api/readers/config', (params, request, response) => {
  // TODO: Wire this up to the actual params/data from readers.
  // console.log(params);
  // if (!params.query.apiKey) handleError(response, 403, 'Please pass an apiKey param with your request.');
  // if (!params.query.reader) handleError(response, 403, 'Please pass a reader param with your request.');
  // if (!params.query.maxEvents) handleError(response, 403, 'Please pass a maxEvents param as a number with your request.');

  // const maxEvents = parseInt(params.query.maxEvents, 10);

  // const events = Events.find({ 'message.rdr': params.query.reader }, { fields: { _id: 0 }, limit: maxEvents <= 999 ? maxEvents : 999 }).fetch();
  // response.writeHead(200);
  // response.end(JSON.stringify(events));
});

Picker.route('/api/customers/setup', (params, request, response) => {

  /*
    TODO:

    1. Write a path for a GET request to validate their CC and email.
    2. Write a path for a POST request to add their new userId to the users array.
  */

  if (request.method === 'GET') {
    if (!params.query.customerCode) handleError(response, 403, 'Please pass a customerCode param with your request.');
    if (!params.query.emailAddress) handleError(response, 403, 'Please pass an emailAddress param with your request.');

    const customerIsValid = !!Customers.findOne({
      topicCode: params.query.customerCode,
      email: params.query.emailAddress,
    });

    if (customerIsValid) {
      response.writeHead(200);
      response.end(JSON.stringify({ customerIsValid }));
    } else {
      // https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
      response.writeHead(401); // 401 === HTTP unauthorized.
      response.end('Sorry, we couldn\'t find a customer with that code and email address.');
    }
  }

  if (request.method === 'POST') {
    if (!request.body.customerCode) handleError(response, 403, 'Please pass a customerCode param with your request.');
    if (!request.body.userId) handleError(response, 403, 'Please pass a userId param with your request.');
    
    Customers.update({
      topicCode: request.body.customerCode,
    }, {
      $addToSet: {
        users: { userId: request.body.userId, isAdmin: true },
      },
    });

    response.writeHead(200);
    response.end('Customer successfully setup.');
  }

  // if (!params.query.apiKey) handleError(response, 403, 'Please pass an apiKey param with your request.');
  // if (!params.query.reader) handleError(response, 403, 'Please pass a reader param with your request.');
  // if (!params.query.maxEvents) handleError(response, 403, 'Please pass a maxEvents param as a number with your request.');

  // const maxEvents = parseInt(params.query.maxEvents, 10);

  // const events = Events.find({ 'message.rdr': params.query.reader }, { limit: maxEvents <= 999 ? maxEvents : 999 }).fetch();
});

Picker.route('/api/customers/readers', (params, request, response) => {
  if (request.method === 'GET') {
    const customer = Customers.findOne({ 'users.userId': params.query.userId }, { fields: { _id: 1 } });

    if (customer) {
      const readers = Readers.find({ customer: customer._id }).fetch();
      console.log(readers);
      response.writeHead(200);
      response.end(JSON.stringify({ readers: readers }));
    } else {
      handleError(response, 404, 'No readers found.');
    }
  }
});

Picker.route('/api/customers/beacons', (params, request, response) => {
  if (request.method === 'GET') {
    const customer = Customers.findOne({ 'users.userId': params.query.userId }, { fields: { _id: 1 } });

    if (customer) {
      const beacons = Beacons.find({ customer: customer._id }, { fields: { whitelisted: 0 } }).fetch()
        .map((beacon) => {
          const beaconType = BeaconTypes.findOne({ beaconTypeCode: beacon.beaconType }, { fields: { title: 1 } });
          const lastEvent = Events.findOne({ 'message.mac': beacon.macAddress }, { limit: 1, sort: { createdAt: -1 } });
          return {
            ...beacon,
            beaconType: beaconType.title,
            currentReader: lastEvent.message.rdr, // The serial number of the reader that last saw this beacon.
            lastSeen: lastEvent.createdAt,
          };
        });
      console.log(beacons);
      response.writeHead(200);
      response.end(JSON.stringify({ beacons: beacons }));
    } else {
      handleError(response, 404, 'No beacons found.');
    }
  }
});
