import React from 'react';
import PropTypes from 'prop-types';
import { Modal, FormGroup, ControlLabel, Button } from 'react-bootstrap';

class EditJSONModal extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {};
    // this.thing = this.thing.bind(this);
  }



  render() {
    const { json, context, show, onHide, onSubmit } = this.props;
    return (<div className="EditJSONModal">
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Edit {context === 'default' ? 'Default' : 'Custom'} JSON</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ControlLabel>{context === 'default' ? 'Default JSON' : 'Custom JSON (this reader only)'}</ControlLabel>
          <textarea
            className="form-control"
            name="json"
            placeholder="Type your JSON here..."
            defaultValue={json}
            ref={jsonText => (this.jsonText = jsonText)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="default" onClick={onHide}>Cancel</Button>
          <Button bsStyle="success" onClick={() => onSubmit(this.jsonText.value)}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>);
  }
}

EditJSONModal.propTypes = {
  // prop: PropTypes.string.isRequired,
};

export default EditJSONModal;
