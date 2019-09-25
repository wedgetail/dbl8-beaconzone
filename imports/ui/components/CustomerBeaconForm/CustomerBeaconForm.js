import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, ControlLabel, Table, Nav, NavItem, Button, FormGroup, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import { ReactiveVar } from 'meteor/reactive-var';
import Beacons from '../../../api/Beacons/Beacons';
import BeaconTypes from '../../../api/BeaconTypes/BeaconTypes';
import Events from '../../../api/Events/Events';
import Customers from '../../../api/Customers/Customers';
import delay from '../../../modules/delay';

import './CustomerBeaconForm.scss';

const currentBeaconType = new ReactiveVar(null);
const currentBeaconSearch = new ReactiveVar(null);

class CustomerBeaconForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tab: 1, searchType: 'beaconType', data: { customer: null, beacons: [], beaconTypes: [] } };
    this.handleAddUUID = this.handleAddUUID.bind(this);
    this.handleDeleteUUID = this.handleDeleteUUID.bind(this);
    this.renderUUIDs = this.renderUUIDs.bind(this);
    this.fetchBeaconData = this.fetchBeaconData.bind(this);
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
        this.fetchBeaconData(); // Data is not reactive, this gets us an update.
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
        this.fetchBeaconData(); // Data is not reactive, this gets us an update.
        Bert.alert('UUID deleted!', 'success');
      }
    });
  }

  renderBeacons(beacons) {
    const { searchType, data: { beaconTypes } } = this.state;

    return (
      <div>
        <header className="clearfix">
          <select name="searchType" className="form-control" value={searchType} onChange={(event) => {
            this.setState({ searchType: event.target.value }, () => {
              if (this.beaconSearch) {
                this.beaconSearch.value = '';
                this.beaconSearch.focus();
                currentBeaconSearch.set(null);
              }
            });
          }}>
            <option value="beaconType">Beacon Type</option>
            <option value="macAddress">MAC Address</option>
          </select>
          {searchType === 'beaconType' ? <div>
            <select name="beaconType" className="form-control" onChange={(event) => { currentBeaconType.set(event.target.value); this.fetchBeaconData(); }}>
              <option value="all">All Types</option>
              {beaconTypes.map(({ _id, title, beaconTypeCode }) => (
                <option value={beaconTypeCode}>{title} ({beaconTypeCode})</option>
              ))}
            </select>
          </div> : ''}
          {searchType === 'macAddress' ? <div>
            <input
              type="search"
              name="beaconSearch"
              className="form-control"
              ref={beaconSearch => (this.beaconSearch = beaconSearch)}
              placeholder="MAC Address"
              onChange={(event) => {
                event.persist(); // Keeps event around for use within delay function below.
                delay(() => {
                  currentBeaconSearch.set({ type: searchType, value: event.target.value });
                  this.fetchBeaconData();
                }, 500);
              }}
            />
          </div> : ''}
        </header>
        {beacons.length > 0 ? <Table>
          <thead>
            <tr>
              <th>Type</th>
              <th>MAC Address</th>
              <th>Last Seen Date/Time</th>
              <th>Reader MAC Address</th>
            </tr>
          </thead>
          <tbody>
            {console.log('BEACONS', beacons)}
            {beacons.map(({ _id, beaconType, macAddress, mostRecentEvent }) => (
              <tr key={_id}>
                <td>{beaconType}</td>
                <td>{macAddress}</td>
                <td>{mostRecentEvent && mostRecentEvent.createdAt && moment.unix(mostRecentEvent.createdAt).format('MMMM Do, YYYY [at] hh:mm:ss a')}</td>
                {/* <td>{mostRecentEvent && mostRecentEvent.createdAt && moment.unix(mostRecentEvent.createdAt / 1000).format('MM/DD/YYYY [at] hh:mm a')}</td> */}
                <td>{mostRecentEvent && mostRecentEvent.message.rdr}</td>
              </tr>
            ))}
          </tbody>
        </Table> : <Alert style={{ marginTop: '20px' }} bsStyle="warning">No beacons found. Make sure you've defined beacon types <Link to="/admin/beaconTypes">here</Link>.</Alert>}
      </div>
    );
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
      {uuids && uuids.length > 0 ? <Table>
        <tbody>
          {uuids.map((uuid) => (
            <tr key={uuid}>
              <td>{uuid}</td>
              <td className="text-right"><Button bsStyle="danger" onClick={(event) => this.handleDeleteUUID(event, uuid)}>Delete</Button></td>
            </tr>
          ))}
        </tbody>
      </Table> : <Alert style={{ marginTop: '20px' }} bsStyle="warning"><p>No UUIDs found. Add the customer's UUIDs above.</p><p>Once added, beacons assigned a UUID will be associated with the customer.</p></Alert>}
    </div>);
  }

  fetchBeaconData() {
    Meteor.call('customers.fetchLatestBeaconData', this.props.customerId, currentBeaconType.get(), currentBeaconSearch.get(), (error, data) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        this.setState({ data: data });
      }
    });
  }

  componentWillMount() {
    this.fetchBeaconData();
  }

  render() {
    const { data: { beacons, customer } } = this.state;
    return (<div className="CustomerBeaconForm">
    	<Row>
        <Col xs={12} sm={2}>
          <Nav bsStyle="pills" stacked activeKey={this.state.tab} onSelect={(tab) => this.setState({ tab })}>
            <NavItem eventKey={1}>Beacons <label className="badge pull-right">{beacons && beacons.length}</label></NavItem>
            <NavItem eventKey={2}>UUIDs</NavItem>
          </Nav>
        </Col>
        <Col xs={12} sm={10}>
          {this.state.tab === 1 ? this.renderBeacons(beacons) : this.renderUUIDs(customer && customer.beaconUUIDs)}
        </Col>
      </Row>
    </div>);
  }
}

CustomerBeaconForm.propTypes = {
  // prop: PropTypes.string.isRequired,
};

export default CustomerBeaconForm;
