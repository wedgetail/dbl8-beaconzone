import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
import Events from '../Events/Events';
import Readers from '../Readers/Readers';
import Beacons from '../Beacons/Beacons';

Meteor.methods({
  'dashboard.lineChart': function dashboardLineChart() {
    // [
    //           { name: '8:30', readers: 15, events: 350 },
    //         ]

    // let currentHour = moment().hour();
    // const lineChartData = [];

    // while (currentHour >= 0) {
    //   console.log(currentHour);
    //   const lineChartData.push({
    //     name: currentHour,
    //     events: Events.find({ createdAt: { $gte: moment()., $lte: } }).count(),
    //   });
    //   currentHour -= 1;
    // }

    const events = Events.find({ createdAt: { $gte: moment().startOf('day').toDate().toString(), $lte: moment().toDate().toString() } }, { fields: { _id: 1, 'message.rdr': 1, createdAt: 1, 'message.mac': 1 } }).fetch();
    // TODO: Loop over events and convert createdAt to be the current 24 hour time period (e.g., if 9am we'd want 09:00).
    // const readers = Readers.find({ serialNumber: { $in: events.map(({ message }) => message.rdr) } }, { fields: { serialNumber: 1 } }).fetch();
    // const beacons = Beacons.find({ macAddress: { $in: events.map(({ message }) => message.mac) } }, { fields: { macAddress: 1 } }).fetch();

    // const eventsByDate = _.groupBy(events, (event) => {
    //   const startOfHour = ;
    //   const endOfHour =;
    //   return 
    // });

    // console.log(eventsByDate);
  },
});
