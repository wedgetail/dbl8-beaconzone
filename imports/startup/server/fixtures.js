import seeder from '@cleverbeagle/seeder';
import { Meteor } from 'meteor/meteor';
import Customers from '../../api/Customers/Customers';

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
