import React from 'react';
import PropTypes from 'prop-types';
import { ControlLabel, Table } from 'react-bootstrap';
import Papa from 'papaparse';
import { withTracker } from 'meteor/react-meteor-data';
import Readers from '../../../api/Readers/Readers';
import InputHint from '../InputHint/InputHint';

import './CustomerReaderForm.scss';

class CustomerReaderForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { uploading: false };
    this.handleUploadCSV = this.handleUploadCSV.bind(this);
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
              readerActive: true,
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

  render() {
    const { readers } = this.props;
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
          {readers.map(({ readerActive, customJSON, serialNumber, macAddress }) => (
            <tr>
              <td><label className="label label-success">{readerActive}</label></td>
              <td><a href="#">{customJSON}</a></td>
              <td>{serialNumber}</td>
              <td>{macAddress}</td>
              <td>N/A</td>
            </tr>
          ))}
    		</tbody>
    	</Table>
			<h4 className="page-header">Readers Details</h4>
		  <p>Need a way to add readers manually, one at a time would be fine.</p>
		  <p>Need to be able to import Readers from a CSV file (select file dialog)</p>
		  <p>-------------------------------------------</p>
		  <p>Serial Number</p>
		  <p>MAC Address</p>
		  <p>Last Event Received</p>
		  <p>-------------------------------------------</p>
		  <p>We already have a collection of all readers, however this view only shows readers owned by the customer </p>
		  <p>Search - Reader Serial Number - auto-filter</p>
    </div>);
  }
}

CustomerReaderForm.propTypes = {
  // prop: PropTypes.string.isRequired,
};

export default withTracker((props) => {
  const subscription = Meteor.subscribe('customers.readers', props.customerId);
  return {
    loading: !subscription.ready(),
    readers: Readers.find({ customer: props.customerId }).fetch(),
  };
})(CustomerReaderForm);

