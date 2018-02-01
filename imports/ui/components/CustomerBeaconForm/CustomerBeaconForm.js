import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, ControlLabel, Table, Nav, NavItem, Button, FormGroup } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import Beacons from '../../../api/Beacons/Beacons';
import Events from '../../../api/Events/Events';
import Customers from '../../../api/Customers/Customers';

import './CustomerBeaconForm.scss';

class CustomerBeaconForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tab: 1 };
    this.handleAddUUID = this.handleAddUUID.bind(this);
    this.handleDeleteUUID = this.handleDeleteUUID.bind(this);
    this.renderUUIDs = this.renderUUIDs.bind(this);
  }

  renderBeacons(beacons) {
    return (
      <Table>
        <thead>
          <tr>
            <th>Type</th>
            <th>MAC Address</th>
            <th>Last Seen Date/Time</th>
            <th>Reader Serial Number</th>
          </tr>
        </thead>
        <tbody>
          {beacons.map(({ _id, beaconType, macAddress, mostRecentEvent }) => (
            <tr key={_id}>
              <td>{beaconType}</td>
              <td>{macAddress}</td>
              <td>{mostRecentEvent.createdAt}</td>
              <td>{mostRecentEvent.message.rdr}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }

  handleAddUUID(event) {
    event.preventDefault();
    Meteor.call('customers.addBeaconUUID', {
      customer: this.props.customerId,
      uuid: this.uuid.value,
    }, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        this.uuid.value = '';
        Bert.alert('UUID added!', 'success');
      }
    });
  }

  handleDeleteUUID(event, uuid) {
    event.preventDefault();
    Meteor.call('customers.deleteBeaconUUID', {
      customer: this.props.customerId,
      uuid,
    }, (error) => {
      if (error) {
        Bert.alert(error.reason.reason ? error.reason.reason : error.reason, 'danger');
      } else {
        Bert.alert('UUID deleted!', 'success');
      }
    });
  }

  renderUUIDs(uuids) {
    return (<div>
      <form ref={addUUIDForm => (this.addUUIDForm = addUUIDForm)} onSubmit={this.handleAddUUID}>
        <Row>
          <Col xs={8} sm={10}>
            <FormGroup>
              <input
                type="text"
                className="form-control"
                name="UUID"
                ref={uuid => (this.uuid = uuid)}
                placeholder="UUID"
              />
            </FormGroup>
          </Col>
          <Col xs={4} sm={2}>
            <Button type="submit" bsStyle="success" block>Add UUID</Button>
          </Col>
        </Row>
      </form>
      <Table>
        <tbody>
          {uuids.map((uuid) => (
            <tr key={uuid}>
              <td>{uuid}</td>
              <td className="text-right"><Button bsStyle="danger" onClick={(event) => this.handleDeleteUUID(event, uuid)}>Delete</Button></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>);
  }

  render() {
    const { beacons, uuids } = this.props;
    return (<div className="CustomerBeaconForm">
    	<Row>
        <Col xs={12} sm={2}>
          <Nav bsStyle="pills" stacked activeKey={this.state.tab} onSelect={(tab) => this.setState({ tab })}>
            <NavItem eventKey={1}>Beacons <label className="badge pull-right">{beacons && beacons.length}</label></NavItem>
            <NavItem eventKey={2}>UUIDs</NavItem>
          </Nav>
        </Col>
        <Col xs={12} sm={10}>
          {this.state.tab === 1 ? this.renderBeacons(beacons) : this.renderUUIDs(uuids)}
        </Col>
      </Row>
    </div>);
  }
}

CustomerBeaconForm.propTypes = {
  // prop: PropTypes.string.isRequired,
};

export default withTracker((props) => {
  const subscription = Meteor.subscribe('customers.beacons', props.customerId);
  const customer = Customers.findOne({ _id: props.customerId });

  return {
    loading: !subscription.ready(),
    beacons: Beacons.find().fetch().map((beacon) => {
      const mostRecentEvent = Events.findOne({ 'message.mac': beacon.macAddress }, { limit: 1, sort: { createdAt: -1 } });
      return {
        ...beacon,
        mostRecentEvent,
      };
    }),
    uuids: customer && customer.beaconUUIDs,
  };
})(CustomerBeaconForm);
