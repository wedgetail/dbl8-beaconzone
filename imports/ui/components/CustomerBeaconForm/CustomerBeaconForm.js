import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, ControlLabel, Table, Nav, NavItem } from 'react-bootstrap';
import { withTracker } from 'meteor/react-meteor-data';

import './CustomerBeaconForm.scss';

class CustomerBeaconForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tab: 1 };
  }

  renderBeacons() {
    return (<p>Beacons</p>);
  }

  renderUUIDs() {
    return (<p>UUIDs</p>);
  }

  render() {
    const { readers } = this.props;
    return (<div className="CustomerBeaconForm">
    	<Row>
        <Col xs={12} sm={2}>
          <Nav bsStyle="pills" stacked activeKey={this.state.tab} onSelect={(tab) => this.setState({ tab })}>
            <NavItem eventKey={1}>Beacons</NavItem>
            <NavItem eventKey={2}>UUIDs</NavItem>
          </Nav>
        </Col>
        <Col xs={12} sm={10}>
          {this.state.tab === 1 ? this.renderBeacons() : this.renderUUIDs()}
        </Col>
      </Row>
    </div>);
  }
}

CustomerBeaconForm.propTypes = {
  // prop: PropTypes.string.isRequired,
};

export default withTracker((props) => {
  const subscription = Meteor.subscribe('customers.readers', props.customerId);
  return {
    loading: !subscription.ready(),
    beacons: [],
    uuids: [],
  };
})(CustomerBeaconForm);
