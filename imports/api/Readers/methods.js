import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Readers from './Readers';

Meteor.methods({
  'readers.updateStatus': function readersUpdateStatus(status) {
    check(status, Object);

    try {
      return Readers.update({ _id: status._id }, { $set: { readerActive: status.readerActive } });
    } catch (exception) {
      console.warn(exception);
      throw new Meteor.Error('500', exception);
    }
  },
});
