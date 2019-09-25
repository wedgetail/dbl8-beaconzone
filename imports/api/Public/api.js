import bodyParser from 'body-parser';
import moment from 'moment';
import { Picker } from 'meteor/meteorhacks:picker';
import Events from '../Events/Events';
import Customers from '../Customers/Customers';
import Readers from '../Readers/Readers';
import Beacons from '../Beacons/Beacons';
import BeaconTypes from '../BeaconTypes/BeaconTypes';
import readerJSONTemplate from '../../modules/server/readerJSONTemplate';
import Gromit from '../../startup/server/gromit';

const eventViewerDataConnectionString = Meteor.settings.private.eventViewerData.MONGO_URL;

const getCustomerBeacons = (customer) => {
  return Beacons.find({ customer: customer }, { fields: { whitelisted: 0 } }).fetch()
    .map((beacon) => {
      // NOTE: beacon.beaconType is stored as a number (this is correct) but beaconTypeCode stores that same value as a string
      // because it's entered via text input. Cast as string here to avoid false negatives.
      const beaconType = BeaconTypes.findOne({ beaconTypeCode: `${beacon.beaconType}` }, { fields: { title: 1, beaconTypeCode: 1, hasButton: 1 } });
      const lastEvent = Events.findOne({ 'message.mac': beacon.macAddress, 'message.maj': beacon.beaconType }, { limit: 1, sort: { createdAt: -1 } });

      console.log({
        ...beacon,
        beaconTypeText: beaconType ? beaconType.title : 'N/A',
        hasButton: beaconType && beaconType.hasButton,
        currentReader: lastEvent && lastEvent.message && lastEvent.message.rdr || null, // The mac address of the reader that last saw this beacon.
        lastEventId: lastEvent && lastEvent._id,
        lastSeen: lastEvent && lastEvent.createdAt || null,
        packetValues: lastEvent && lastEvent.message,
      });

      return {
        ...beacon,
        beaconTypeText: beaconType ? beaconType.title : 'N/A',
        hasButton: beaconType && beaconType.hasButton,
        currentReader: lastEvent && lastEvent.message && lastEvent.message.rdr || null, // The mac address of the reader that last saw this beacon.
        lastEventId: lastEvent && lastEvent._id,
        lastSeen: lastEvent && lastEvent.createdAt || null,
        packetValues: lastEvent && lastEvent.message,
      };
    });
}

Picker.middleware(bodyParser.json());

const handleError = (response, code, message) => {
  response.writeHead(code);
  response.end(message);
};

const checkApiKey = (apiKey, response) => {
  if (!apiKey) {
    handleError(response, 403, 'Please pass an apiKey param with your request.');
    return;
  }

  const isCustomerKey = Customers.findOne({ apiKey }, { fields: { apiKey: 1 } });
  const isDbl8Key = Meteor.settings.private.view.apiKey === apiKey;
  return isCustomerKey || isDbl8Key ? true : handleError(response, '403', 'Must pass a valid API key with your request.');
};

Picker.route('/api/v1/devices/:macAddress/config', (params, request, response) => {
  console.log(params);
  const reader = Readers.findOne({ macAddress: params.macAddress });
  console.log(reader);
  const customer = reader ? Customers.findOne({ _id: reader.customer }) : null;
  console.log(customer);

  if (!reader || !customer) {
    Gromit.error({
      title: '[Reader Config API]',
      message: 'New config request failed',
      payload: [
        { title: 'Mac Address', value: params.macAddress },
        { title: 'Customer', value: customer && customer.name },
      ],
    });
    response.writeHead(404);
    response.end('Reader or customer could not be found.');
    return false;
  } else {
    Gromit.success({
      title: '[Reader Config API]',
      message: 'New config request',
      payload: [
        { title: 'Mac Address', value: params.macAddress },
        { title: 'Customer', value: customer && customer.name },
      ],
    });

    response.writeHead(200);
    response.end(
      JSON.stringify(
        readerJSONTemplate({
          wifi_configs: Object.keys(customer.ssIds).map((ssIdName) => {
            const ssid = customer.ssIds[ssIdName];
            return {
              ssid: ssid.ssid,
              passkey: ssid.securityKey,
            };
          }),
          min_distance: customer.minReaderDistance,
          beacon_type: customer.beaconPacketType, // All, iBeacon, Eddyston UID, Eddystone URL,
        }),
      )
    );
  }
});

Picker.route('/api/events', (params, request, response) => {
  checkApiKey(params.query.apiKey, response);
  if (!params.query.reader) handleError(response, 403, 'Please pass a reader param with your request.');
  if (!params.query.maxEvents) handleError(response, 403, 'Please pass a maxEvents param as a number with your request.');

  const maxEvents = parseInt(params.query.maxEvents, 10);

  const events = Events.find({ 'message.rdr': params.query.reader }, { limit: maxEvents <= 999 ? maxEvents : 999 }).fetch();
  response.writeHead(200);
  response.end(JSON.stringify(events));
});

Picker.route('/api/events1', (params, request, response) => {
  checkApiKey(params.query.apiKey, response);
  if (!params.query.reader) handleError(response, 403, 'Please pass a reader param with your request.');
  if (!params.query.maxEvents) handleError(response, 403, 'Please pass a maxEvents param as a number with your request.');

  const maxEvents = parseInt(params.query.maxEvents, 10);

  const events = Events.find({ 'message.rdr': params.query.reader }, { fields: { _id: 0 }, limit: maxEvents <= 999 ? maxEvents : 999 }).fetch();
  response.writeHead(200);
  response.end(JSON.stringify(events));
});

Picker.route('/api/customers/setup', (params, request, response) => {
  checkApiKey(params.query.apiKey, response);
  /*
    TODO:

    1. Write a path for a GET request to validate their CC and email.
    2. Write a path for a POST request to add their new userId to the users array.
  */

  if (request.method === 'GET') {
    if (!params.query.customerCode) handleError(response, 403, 'Please pass a customerCode param with your request.');
    if (!params.query.emailAddress) handleError(response, 403, 'Please pass an emailAddress param with your request.');

    console.log('customer setup credentials', {
      topicCode: params.query.customerCode,
      email: params.query.emailAddress,
    });
    //customer setup credentials { topicCode: '61222ad79a', email: 'webbstuff@gmail.com' }


    const customer = Customers.findOne({
      topicCode: params.query.customerCode,
      email: params.query.emailAddress,
    });

    //console.log('customer', customer);

    if (customer) {
      response.writeHead(200);
      response.end(JSON.stringify({ customerIsValid: true, customerId: customer._id, customerName: customer.name, databaseConnectionString: customer.hostedByDlb8 ? dbl8DatabaseConnectionString : customer.databaseConnectionString, eventViewerDashboardTimeout: customer.eventViewerDashboardTimeout || 60 }));
    } else {
      // https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
      Gromit.error({
        title: '[/api/customers/setup]',
        message: 'MAJOR - New customer setup failed',
        payload: [
          { title: 'Error', value: 'Sorry, we couldn\'t find a customer with that code and email address.' },
          { title: 'Customer Code', value: params.query.customerCode },
          { title: 'Email address', value: params.query.emailAddress },
        ],
      });
      response.writeHead(401); // 401 === HTTP unauthorized.
      response.end('Sorry, we couldn\'t find a customer with that code and email address.');
    }
  }

  if (request.method === 'POST') {
    if (!request.body.customerCode) handleError(response, 403, 'Please pass a customerCode param with your request.');
    if (!request.body.userId) handleError(response, 403, 'Please pass a userId param with your request.');

    console.log('request.body', request.body);

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

Picker.route('/api/customers/adduser', (params, request, response) => {
  checkApiKey(params.query.apiKey, response);

  if (request.method === 'POST') {
    if (!request.body.customerId) handleError(response, 403, 'Please pass a customerId param with your request.');
    if (!request.body.userId) handleError(response, 403, 'Please pass a userId param with your request.');
    if (typeof request.body.isAdmin === 'undefined') handleError(response, 403, 'Please pass an isAdmin param with your request.');

    Customers.update({
      _id: request.body.customerId,
    }, {
      $addToSet: {
        users: { userId: request.body.userId, isAdmin: request.body.isAdmin },
      },
    });

    response.writeHead(200);
    response.end('User successfully added to customer.');
  }
});

Picker.route('/api/customers/updateuser', (params, request, response) => {
  checkApiKey(params.query.apiKey, response);

  if (request.method === 'PUT') {
    if (!request.body.customerId) handleError(response, 403, 'Please pass a customerId param with your request.');
    if (!request.body.userId) handleError(response, 403, 'Please pass a userId param with your request.');
    if (typeof request.body.isAdmin === 'undefined') handleError(response, 403, 'Please pass an isAdmin param with your request.');

    const customer = Customers.findOne({ _id: request.body.customerId });
    const userToUpdate = customer.users.find(({ userId }) => userId === request.body.userId);
    userToUpdate.isAdmin = request.body.isAdmin;

    Customers.update({
      _id: request.body.customerId,
    }, {
      $set: {
        users: customer.users,
      },
    });

    response.writeHead(200);
    response.end('User successfully updated on customer.');
  }
});

Picker.route('/api/customers/removeuser', (params, request, response) => {
  checkApiKey(params.query.apiKey, response);

  if (request.method === 'DELETE') {
    if (!request.body.customerId) handleError(response, 403, 'Please pass a customerId param with your request.');
    if (!request.body.userId) handleError(response, 403, 'Please pass a userId param with your request.');

    const customer = Customers.findOne({ _id: request.body.customerId });
    customer.users = customer.users.filter(({ userId }) => userId !== request.body.userId);

    Customers.update({
      _id: request.body.customerId,
    }, {
      $set: {
        users: customer.users,
      },
    });

    response.writeHead(200);
    response.end('User successfully deleted on customer.');
  }
});

Picker.route('/api/customers/login', (params, request, response) => {
  checkApiKey(params.query.apiKey, response);

  if (request.method === 'GET') {
    if (!params.query.userId) handleError(response, 403, 'Please pass a userId param with your request (or else!).');

    const customer = Customers.findOne({ 'users.userId': params.query.userId });

    if (customer) {
      const readers = Readers.find({ customer: customer._id }).fetch();
      const beacons = getCustomerBeacons(customer._id);
      response.writeHead(200);
      response.end(JSON.stringify({ ok: true, userId: params.query.userId, customerId: customer._id, customerName: customer.name, readers: readers, beacons: beacons, eventViewerDashboardTimeout: customer.eventViewerDashboardTimeout || 60 }));
    } else {
      response.writeHead(403);
      response.end(JSON.stringify({ userId: params.query.userId, code: 403, message: 'Authentication error. Check with your administrator to make sure you have access.' }));
    }
  }
});

Picker.route('/api/customers/customerId', (params, request, response) => {
  checkApiKey(params.query.apiKey, response);

  if (request.method === 'GET') {
    if (!params.query.userId) handleError(response, 403, 'Please pass a userId param with your request (or else!).');

    const customer = Customers.findOne({ 'users.userId': params.query.userId });

    if (customer) {
      response.writeHead(200);
      response.end(JSON.stringify({ ok: true, customerId: customer._id }));
    } else {
      response.writeHead(403);
      response.end(JSON.stringify({ userId: params.query.userId, code: 403, message: 'Authentication error. Check with your administrator to make sure you have access.' }));
    }
  }
});

Picker.route('/api/customers/maxusers', (params, request, response) => {
  checkApiKey(params.query.apiKey, response);

  if (request.method === 'GET') {
    if (!params.query.userId) handleError(response, 403, 'Please pass a userId param with your request (or else!).');

    const customer = Customers.findOne({ 'users.userId': params.query.userId });

    if (customer && customer.users.length < customer.numberOfEventViewerUsers) {
      response.writeHead(200);
      response.end(JSON.stringify({ ok: true, customerId: customer._id, customerName: customer.name }));
    } else {
      response.writeHead(403);
      response.end(JSON.stringify({ ok: false, error: 'You\'ve reached your maximum number of users.' }));
    }
  }
});

Picker.route('/api/customers/readers', (params, request, response) => {
  checkApiKey(params.query.apiKey, response);

  if (request.method === 'GET') {
    const customer = Customers.findOne({ 'users.userId': params.query.userId }, { fields: { _id: 1 } });

    if (customer) {
      const readers = Readers.find({ customer: customer._id }).fetch();
      response.writeHead(200);
      response.end(JSON.stringify({ readers: readers }));
    } else {
      handleError(response, 404, 'No readers found.');
    }
  }

  if (request.method === 'PUT') {
    if (!request.body.userId) handleError(response, 403, 'Please pass a userId param with your request (or else!).');
    if (!request.body.readerMacAddress) handleError(response, 403, 'Please pass a readerMacAddress param with your request (or else!).');
    if (!request.body.update) handleError(response, 403, 'Please pass an update param with your request (or else!).');

    const customer = Customers.findOne({ 'users.userId': request.body.userId }, { fields: { _id: 1 } });

    if (customer) {
      Readers.update({ macAddress: request.body.readerMacAddress }, { $set: request.body.update });
      response.writeHead(200);
      response.end('Reader updated');
    } else {
      handleError(response, 404, 'Sorry, we couldn\'t find a customer with your userId.');
    }
  }
});

Picker.route('/api/customers/beacons', (params, request, response) => {
  checkApiKey(params.query.apiKey, response);

  if (request.method === 'GET') {
    const customer = Customers.findOne({ 'users.userId': params.query.userId }, { fields: { _id: 1 } });

    if (customer) {
      const beacons = getCustomerBeacons(customer._id);

      response.writeHead(200);
      response.end(JSON.stringify({ beacons: beacons }));
    } else {
      handleError(response, 404, 'No beacons found.');
    }
  }

  if (request.method === 'PUT') {
    if (!request.body.userId) handleError(response, 403, 'Please pass a userId param with your request (or else!).');
    if (!request.body.beaconMacAddress) handleError(response, 403, 'Please pass a beaconMacAddress param with your request (or else!).');
    if (!request.body.beaconType) handleError(response, 403, 'Please pass a beaconType param with your request (or else!).');
    if (!request.body.update) handleError(response, 403, 'Please pass an update param with your request (or else!).');

    console.log('UPDATE', request.body);

    const customer = Customers.findOne({ 'users.userId': request.body.userId }, { fields: { _id: 1 } });

    if (customer) {
      Beacons.update({ macAddress: request.body.beaconMacAddress, beaconType: request.body.beaconType }, { $set: request.body.update });
      response.writeHead(200);
      response.end('Beacon updated');
    } else {
      handleError(response, 404, 'Sorry, we couldn\'t find a customer with your userId.');
    }
  }
});

Picker.route('/api/customers/beacons/reset', (params, request, response) => {
  // console.log('REQUEST IS HERE (BEFORE AUTH)');
  checkApiKey(params.query.apiKey, response);

  // console.log('REQUEST IS HERE (AFTER AUTH)');
  if (request.method === 'POST') {
    if (!request.body.eventId) handleError(response, 403, 'Please pass an eventId param with your request (or else!).');

    // console.log('UPDATE', request.body);
    // Update all events for this major with 10001.
    Events.update(
      { _id: request.body.eventId },
      {
        $set: {
          'message.min': 10001,
          'message.btn': 10001,
          'message.btnResetAt': Math.round(new Date().getTime()/1000),
        }
      },
    );

    response.writeHead(200);
    response.end('Beacon updated');
  }
});
