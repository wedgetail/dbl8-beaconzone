import React from 'react';
import PropTypes from 'prop-types';
import { ControlLabel, Table, Button } from 'react-bootstrap';
import Papa from 'papaparse';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import Readers from '../../../api/Readers/Readers';
import Events from '../../../api/Events/Events';
import InputHint from '../InputHint/InputHint';
import ToggleSwitch from '../ToggleSwitch/ToggleSwitch';
import EditJSONModal from '../EditJSONModal/EditJSONModal';
import { monthDayYearAtTime } from '../../../modules/dates';

import './CustomerReaderForm.scss';

class CustomerReaderForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { uploading: false, readers: [], showEditJSONModal: null };
    this.handleUploadCSV = this.handleUploadCSV.bind(this);
    this.fetchReaderData = this.fetchReaderData.bind(this);
    this.handleEditJSON = this.handleEditJSON.bind(this);
  }

  handleUploadCSV(event) {
    if (event.target.files.length > 0) {
      const component = this;
      component.setState({ uploading: true });
      Papa.parse(event.target.files[0], {
        header: true,
        complete(results, file) {
          if (results && results.data.length) {
            const customerReaders = results.data.map((reader) => ({
              ...reader,
              customer: component.props.customerId,
              active: true,
            }));

            Meteor.call('customers.uploadReadersCSV', customerReaders, (error, readersAdded) => {
              if (error) {
                Bert.alert(error.reason, 'danger');
              } else {
                Bert.alert(`${readersAdded} readers uploaded!`, 'success');
                component.setState({ uploading: false });
              }
            });
          }
        },
      });
    }
  }

  fetchReaderData() {
    Meteor.call('customers.fetchLatestReaderData', this.props.customerId, (error, readers) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        this.setState({ readers: readers });
      }
    });
  }

  componentWillMount() {
    this.fetchReaderData();
  }

  handleUpdateReaderStatus(status) {
    Meteor.call('readers.updateStatus', status, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Status updated!', 'success');
      }
    });
  }

  handleEditJSON(json) {
    const isDefault = this.state.showEditJSONModal === 'default';
    const method = isDefault ? 'customers.editDefaultJSON' : 'readers.editReaderJSON';
    const update = { json };

    if (isDefault) update.customerId = this.state.customerId;
    if (!isDefault) update.readerId = this.state.readerId;

    Meteor.call(method, update, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert(`${isDefault ? 'Default JSON saved!' : 'Custom JSON saved!'}`, 'success');
        this.fetchReaderData();
      }
    });
  }

  render() {
    return (<div className="CustomerReaderForm">
    	<div className="CustomerReaderForm__upload">
    	  <ControlLabel>Upload a CSV</ControlLabel>
		    {this.state.uploading ? <p>Uploading...</p> : <input
    	    type="file"
    	    className="form-control"
            onChange={this.handleUploadCSV}
    	  />}
    	  <InputHint>Upload .csv list of readers for this customer.</InputHint>
    	</div>
      <div className="CustomerReaderForm__options">
        <Button onClick={this.fetchReaderData} bsStyle="success">Fetch Latest Data</Button>
        <Button bsStyle="primary" onClick={() => this.setState({ showEditJSONModal: 'default', jsonToEdit: this.props.defaultJSON, customerId: this.props.customerId })}>Edit Default JSON</Button>
      </div>
    	<Table responsive bordered>
    		<thead>
    			<tr>
            <th>Active?</th>
    				<th>Custom JSON</th>
    				<th>Serial Number</th>
    				<th>MAC Address</th>
    				<th>Last Event Received</th>
    			</tr>
    		</thead>
    		<tbody>
          {this.state.readers.map(({ _id, active, customJSON, serialNumber, macAddress, mostRecentEvent }) => (
            <tr>
              <td><ToggleSwitch id={_id} toggled={active} onLabel="Yes" offLabel="No" onToggle={(readerId, isReaderActive) => this.handleUpdateReaderStatus({ _id: readerId, active: isReaderActive })} /></td>
              <td><a href="#">{customJSON ? <Button bsStyle="info" onClick={() => this.setState({ showEditJSONModal: 'custom', jsonToEdit: customJSON, readerId: _id })}>Edit Custom JSON</Button> : <Button bsStyle="success" onClick={() => this.setState({ showEditJSONModal: 'custom', jsonToEdit: '', readerId: _id })}>Add Custom JSON</Button>}</a></td>
              <td>{serialNumber}</td>
              <td>{macAddress}</td>
              <td>{monthDayYearAtTime(mostRecentEvent)}</td>
            </tr>
          ))}
    		</tbody>
    	</Table>
      <EditJSONModal
        json={this.state.jsonToEdit}
        context={this.state.showEditJSONModal}
        show={this.state.showEditJSONModal}
        onHide={() => this.setState({ showEditJSONModal: null })}
        onSubmit={this.handleEditJSON}
      />
    </div>);
  }
}

CustomerReaderForm.propTypes = {
  // prop: PropTypes.string.isRequired,
};

export default CustomerReaderForm;
