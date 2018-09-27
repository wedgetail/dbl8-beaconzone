/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';

class BeaconTypeEditor extends React.Component {
  componentDidMount() {
    const component = this;
    validate(component.form, {
      rules: {
        title: {
          required: true,
        },
        beaconTypeCode: {
          required: true,
        },
        description: {
          required: true,
        },
      },
      messages: {
        title: {
          required: 'Need a title in here, Seuss.',
        },
        beaconTypeCode: {
          required: 'Need a beacon type code in here, Seuss.',
        },
        description: {
          required: 'This thneeds a description, please.',
        },
      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  handleSubmit() {
    const { history } = this.props;
    const existingBeaconType = this.props.beaconType && this.props.beaconType._id;
    const methodToCall = existingBeaconType ? 'beaconTypes.update' : 'beaconTypes.insert';
    const beaconType = {
      title: this.title.value.trim(),
      description: this.description.value.trim(),
      beaconTypeCode: this.beaconTypeCode.value.trim(),
    };

    if (existingBeaconType) beaconType._id = existingBeaconType;

    Meteor.call(methodToCall, beaconType, (error, beaconTypeId) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        const confirmation = existingBeaconType ? 'Beacon type updated!' : 'Beacon type added!';
        this.form.reset();
        Bert.alert(confirmation, 'success');
        history.push(`/admin/beaconTypes/${beaconTypeId}`);
      }
    });
  }

  render() {
    const { beaconType } = this.props;
    return (
      <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
        <Row>
          <Col xs={12} sm={8}>
            <FormGroup>
              <ControlLabel>Title</ControlLabel>
              <input
                type="text"
                className="form-control"
                name="title"
                ref={title => (this.title = title)}
                defaultValue={beaconType && beaconType.title}
                placeholder="Proximity beacon"
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={4}>
            <FormGroup>
              <ControlLabel>Beacon Type Code</ControlLabel>
              <input
                type="text"
                className="form-control"
                name="beaconTypeCode"
                ref={beaconTypeCode => (this.beaconTypeCode = beaconTypeCode)}
                defaultValue={beaconType && beaconType.beaconTypeCode}
                placeholder="8899"
              />
            </FormGroup>
          </Col>
        </Row>
        <FormGroup>
          <ControlLabel>Description</ControlLabel>
          <textarea
            className="form-control"
            name="description"
            ref={description => (this.description = description)}
            defaultValue={beaconType && beaconType.description}
            placeholder="Basic beacon to measure proximity."
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Parse Map</ControlLabel>
          <textarea
            className="form-control"
            name="parseMap"
            ref={description => (this.parseMap = parseMap)}
            defaultValue={beaconType && beaconType.parseMap}
            placeholder={`{ "major": { "thisMajor": { start: 36, end: 40 }, "thisOtherMajorField": { start: 0, end: 0 }, }, "minor": { "thisMinor": { start: 40, end: 44 }, "temperature": { start: , end, parseInt: 16, modifier: convertCtoF } } }`}
          />
        </FormGroup>
        <Button type="submit" bsStyle="success">
          {beaconType && beaconType._id ? 'Save Changes' : 'Add Beacon Type'}
        </Button>
      </form>
    );
  }
}

BeaconTypeEditor.defaultProps = {
  beaconType: { title: '', description: '' },
};

BeaconTypeEditor.propTypes = {
  beaconType: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default BeaconTypeEditor;
