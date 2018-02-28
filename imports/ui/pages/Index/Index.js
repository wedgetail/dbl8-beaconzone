import React from 'react';
import ReactSpeedometer from 'react-d3-speedometer';
import { Button } from 'react-bootstrap';
import Recharts from 'recharts';
import { Counts } from 'meteor/tmeasday:publish-counts';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import './Index.scss';
const { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } = Recharts;

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = { lineChartData: [] };
    // this.method = this.method.bind(this);
  }

  componentWillMount() {
    Meteor.call('dashboard.lineChart', (error, lineChartData) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        this.setState({ lineChartData: lineChartData });
      }
    });
  }

  render() {
    const { eventsPerHour, maxEvents } = this.props; // Destructuring

    return (
      <div className="Index">
        { /* Beacon events per hour */ }
        <ReactSpeedometer value={eventsPerHour} maxValue={maxEvents} />
        <ResponsiveContainer width="100%" height={360}>
          <LineChart
            data={this.state.lineChartData}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" />
            <Line type="monotone" dataKey="readers" stroke="#00D490" activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="events" stroke="#aaaaaa" activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
        <footer>
          <p>Alert!  XX readers have not reported in the last hour!</p>
        </footer>
      </div>
    );
  }
}

export default withTracker(() => {
  const subscription = Meteor.subscribe('dashboard');
  return {
    loading: !subscription.ready(),
    maxEvents: 1000, // TODO: Make this dynamic based on customer data (readers/beacons).
    eventsPerHour: Counts.get('dashboard_events-per-hour'),
  };
})(Index);
