import _ from 'lodash';
import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import Events from '../Events/Events';
import Readers from '../Readers/Readers'
import Beacons from '../Beacons/Beacons'

Meteor.methods({
  'dashboard': function dashboardLineChart() {
    const eventsInLastMinute = Events.find({
      createdAt: {
        $gte: moment().subtract(1, 'minute').unix() * 1000,
      },
    }, {
      fields: {
        createdAt: 1,
        'message.rdr': 1,
        'message.mac': 1,
      },
    }).fetch();

    const readersFromEvents = _.uniq(eventsInLastMinute.map((event) => event.message.rdr));
    const beaconMacAddressesFromEvents = _.uniq(eventsInLastMinute.map((event) => event.message.mac));


    console.log('aaa', eventsInLastMinute);
    console.log('bbb', readersFromEvents);
    console.log('ccc', beaconMacAddressesFromEvents);
    console.log('time', moment().subtract(1, 'minute').unix());

    console.log({
      createdAt: moment().subtract(1, 'minute').unix() * 1000,
      readersNotReporting: Readers.find({ macAddress: { $nin: readersFromEvents } }).count(),
      readersReporting: Readers.find({ macAddress: { $in: readersFromEvents } }).count(),
      activeBeacons: Beacons.find({ macAddress: { $in: _.uniq(beaconMacAddressesFromEvents) } }).count(),
    });

    return {
      readersNotReporting: Readers.find({ macAddress: { $nin: readersFromEvents } }).count(),
      readersReporting: Readers.find({ macAddress: { $in: readersFromEvents } }).count(),
      activeBeacons: Beacons.find({ macAddress: { $in: _.uniq(beaconMacAddressesFromEvents) } }).count(),
    }
  },
});
