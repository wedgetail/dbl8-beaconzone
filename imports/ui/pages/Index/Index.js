import React from 'react';
import ReactSpeedometer from 'react-d3-speedometer';
import { Row, Col, Button } from 'react-bootstrap';
import Recharts from 'recharts';
import { Counts } from 'meteor/tmeasday:publish-counts';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import './Index.scss';

const { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } = Recharts;

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.fetchDashboardData = this.fetchDashboardData.bind(this);
  }

  componentWillMount() {
    this.fetchDashboardData();

    setInterval(() => {
      this.fetchDashboardData();
    }, 5000); // Fetch every five seconds.
  }

  fetchDashboardData() {
    Meteor.call('dashboard', (error, dashboardData) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        this.setState(dashboardData);
      }
    });
  }

  render() {
    const { eventsPerHour, maxEvents } = this.props; // Destructuring
    // { /* Active readers, active beacons, readers not reporting */ }
    return (
      <div className="Index">
        { /* Beacon events per hour */ }
        {/* <div className="DashboardWidget">
          <header>
            <p>Events Per Hour</p>
          </header>
          <ReactSpeedometer fluidWidth value={eventsPerHour} maxValue={maxEvents} />
        </div>*/}
        <Row>
          <Col xs={12} sm={4}>
            <div className="DashboardWidget">
              <header>
                <p>Readers Reporting Beacon Data</p>
              </header>
              <div>
                <h1>{this.state.readersReporting || 0}</h1>
              </div>
            </div>
          </Col>
          <Col xs={12} sm={4}>
            <div className="DashboardWidget">
              <header>
                <p>Active Beacons</p>
              </header>
              <div>
                <h1>{this.state.activeBeacons || 0}</h1>
              </div>
            </div>
          </Col>
          <Col xs={12} sm={4}>
            <div className="DashboardWidget">
              <header>
                <p>Readers Not Reporting Beacons</p>
              </header>
              <div>
                <h1>{this.state.readersNotReporting || 0}</h1>
              </div>
            </div>
          </Col>
        </Row>
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
