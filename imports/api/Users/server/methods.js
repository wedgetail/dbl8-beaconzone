import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import editProfile from './edit-profile';
import rateLimit from '../../../modules/rate-limit';

Meteor.methods({
  'users.sendVerificationEmail': function usersSendVerificationEmail() {
    return Accounts.sendVerificationEmail(this.userId);
  },
  'users.editProfile': function usersEditProfile(profile) {
    check(profile, {
      emailAddress: String,
      profile: {
        name: {
          first: String,
          last: String,
        },
      },
    });

    return editProfile({ userId: this.userId, profile })
      .then(response => response)
      .catch((exception) => {
        throw new Meteor.Error('500', exception);
      });
  },
  'users.update': function usersEditProfile(update) {
    check(update, {
      userId: String,
      updateParams: Object,
    });

    try {
      /*
        TODO:

        We're working on updating users in the Event Viewer at /admin/users

        1. Update user on customer (keeping track of admin status via isAdmin).
        2. Update user in localDB.
      */
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
});

rateLimit({
  methods: [
    'users.sendVerificationEmail',
    'users.editProfile',
  ],
  limit: 5,
  timeRange: 1000,
});
