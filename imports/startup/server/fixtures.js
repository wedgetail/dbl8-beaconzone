import seeder from '@cleverbeagle/seeder';
import { Meteor } from 'meteor/meteor';
import Customers from '../../api/Customers/Customers';
import Dashboard from '../../api/Dashboard/Dashboard';

const customersSeed = userId => ({
  collection: Customers,
  environments: ['development', 'staging'],
  noLimit: true,
  modelCount: 5,
  model(dataIndex, faker) {
    return {
      users: [{
        userId,
        isAdmin: true,
      }],
      name: faker.company.companyName(),
      contact: faker.name.findName(),
      address: faker.address.streetName(),
      city: faker.address.city(),
      state: faker.address.stateAbbr(),
      zip: faker.address.zipCode(),
      mobile: faker.phone.phoneNumber(),
      telephone: faker.phone.phoneNumber(),
      email: faker.internet.email(),
      ssIds: {
        one: {
          ssid: 'Test Net',
          securityKey: '123',
        },
      },
    };
  },
});

seeder(Meteor.users, {
  environments: ['development', 'staging'],
  noLimit: true,
  data: [{
    email: 'admin@admin.com',
    password: 'password',
    profile: {
      name: {
        first: 'Andy',
        last: 'Warhol',
      },
    },
    roles: ['admin'],
    data(userId) {
      return customersSeed(userId);
    },
  }],
  modelCount: 5,
  model(index, faker) {
    const userCount = index + 1;
    return {
      email: `user+${userCount}@test.com`,
      password: 'password',
      profile: {
        name: {
          first: faker.name.firstName(),
          last: faker.name.lastName(),
        },
      },
      roles: ['user'],
      data(userId) {
        // return documentsSeed(userId);
      },
    };
  },
});

seeder(Meteor.users, {
  environments: ['development', 'staging', 'production'],
  noLimit: true,
  data: [{
    email: 'admin@dbl8.com',
    password: 'aceisdeaf4073',
    profile: {
      name: {
        first: 'Marvin',
        last: 'Percival',
      },
    },
    roles: ['admin'],
  }],
});

if (Dashboard.find().count() === 0) {
  Dashboard.insert({
    "name": "dashboard",
    "activeReaders": 10,
    "activeBeacons": 259,
    "readersNotReporting": 5,
    "trafficPerHour": [
      {
        "name": "8:30",
        "readers": 15,
        "events": 350,
      },
      {
        "name": "8:35",
        "readers": 25,
        "events": 150,
      },
      {
        "name": "8:40",
        "readers": 35,
        "events": 1250,
      },
      {
        "name": "8:45",
        "readers": 45,
        "events": 35,
      },
      {
        "name": "8:50",
        "readers": 55,
        "events": 78,
      },
    ],
  });
}
