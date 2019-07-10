import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import BeaconTypes from './BeaconTypes';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
  'beaconTypes.insert': function beaconTypesInsert(beaconType) {
    check(beaconType, {
      title: String,
      description: String,
      beaconTypeCode: String,
      parseMapFields: [Object],
    });

    try {
      return BeaconTypes.insert({ ...beaconType });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'beaconTypes.update': function beaconTypesUpdate(beaconType) {
    check(beaconType, {
      _id: String,
      title: String,
      description: String,
      beaconTypeCode: String,
      parseMapFields: [Object],
    });

    try {
      const beaconTypeId = beaconType._id;
      BeaconTypes.update(beaconTypeId, { $set: beaconType });
      return beaconTypeId; // Return _id so we can redirect to beacon type after update.
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'beaconTypes.remove': function beaconTypesRemove(beaconTypeId) {
    check(beaconTypeId, String);

    try {
      return BeaconTypes.remove(beaconTypeId);
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
});

rateLimit({
  methods: [
    'beaconTypes.insert',
    'beaconTypes.update',
    'beaconTypes.remove',
  ],
  limit: 5,
  timeRange: 1000,
});
