import React from 'react';
import Button from "react-bootstrap/Button";
import * as API_DEVICES from "../api/device-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";
import {Col, Row} from "reactstrap";
import {FormGroup, Input, Label} from 'reactstrap';

class DeviceCRUD extends React.Component {
    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.currentId = window.location.pathname.split('/').at(-1);

        this.state = {

            errorStatus: 0,
            error: null,

            formIsValid: true,

            formControls: {
                description: {
                    value: '',
                    placeholder: 'What is the device\'s description?',
                    touched: false,
                    valid: true,
                },
                address: {
                    value: '',
                    placeholder: 'What is the device\'s address?',
                    touched: false,
                    valid: true,
                },
                max_hourly_energy_consumption: {
                    value: true,
                    placeholder: 'Maximum hourly energy consumption',
                    touched: false,
                    valid: true,
                },
                average_consumption: {
                    value: true,
                    placeholder: 'Average consumption',
                    touched: false,
                    valid: true,
                }

            }


        };

        API_DEVICES.getDeviceById(this.currentId, (result, status, err) => {
            console.log(result);
            if (result !== null && status === 200) {
                const updatedControls = this.state.formControls;
                updatedControls['description'].value = result.description;
                updatedControls['address'].value = result.address;
                updatedControls['max_hourly_energy_consumption'].value = result.max_hourly_energy_consumption;
                updatedControls['average_consumption'].value = result.average_consumption;
                console.log(updatedControls, this.state.formControls);
                this.setState({
                    formControls: updatedControls,
                    isLoaded: true
                });
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        });

        this.handleChange = this.handleChange.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    };


    toggleForm() {
        this.setState({collapseForm: !this.state.collapseForm});
    };

    fetchDevice(id) {
        let _this = this;
        API_DEVICES.getDeviceById(id, (result, status, err) => {
            console.log(result);
            if (result !== null && status === 200) {
                const updatedControls = this.state.formControls;
                updatedControls['description'].value = result.device.description;
                updatedControls['address'].value = result.device.address;
                updatedControls['max_hourly_energy_consumption'].value = result.device.max_hourly_energy_consumption;
                updatedControls['average_consumption'].value = result.device.average_consumption;
                console.log(updatedControls, this.state.formControls);
                _this.setState({
                    formControls: updatedControls,
                    isLoaded: true
                });
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        });
    }

    handleChange = event => {

        const name = event.target.name;

        const updatedControls = this.state.formControls;

        const updatedFormElement = updatedControls[name];
        const value = event.target.value;
        updatedFormElement.value = value;
        updatedFormElement.touched = true;
        updatedControls[name] = updatedFormElement;

        let formIsValid = true;
        for (let updatedFormElementName in updatedControls) {
            formIsValid = updatedControls[updatedFormElementName].valid && formIsValid;
        }
        console.log(name, value);
        this.setState({
            formControls: updatedControls,
            formIsValid: formIsValid
        });

    };


    updateDevice(device) {
        return API_DEVICES.putDevice(device, (result, status, error) => {
            console.log(device);
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully updated device with id: " + result);
            } else {
                this.setState(({
                    errorStatus: status,
                    error: error
                }));
            }
        });
    };

    handleDelete() {
        return API_DEVICES.deleteDevice(this.currentId, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully deleted device with id: " + result);
            } else {
                this.setState(({
                    errorStatus: status,
                    error: error
                }));
            }
        });
    }

    handleUpdate() {
        let device = {
            id: this.currentId,
            address: this.state.formControls.address.value,
            description: this.state.formControls.description.value,
            max_hourly_energy_consumption: this.state.formControls.max_hourly_energy_consumption.value,
            average_consumption: this.state.formControls.average_consumption.value,
        };

        console.log(device);
        this.updateDevice(device);
    };

    render() {

        return (
            <div>

                <FormGroup id='description'>
                    <Label for='descriptionField'> Description: </Label>
                    <Input name='description' id='descriptionField'
                           placeholder={this.state.formControls.description.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.description.value}
                           touched={this.state.formControls.description.touched ? 1 : 0}
                           required
                    />
                </FormGroup>

                <FormGroup id='address'>
                    <Label for='addressField'> Address: </Label>
                    <Input name='address' id='addressField' placeholder={this.state.formControls.address.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.address.value}
                           touched={this.state.formControls.address.touched ? 1 : 0}
                           required
                    />

                </FormGroup>

                <FormGroup id='max_hourly_energy_consumption'>
                    <Label for='max_hourly_energy_consumptionField'> Maximum Hourly Energy Consumption: </Label>
                    <Input type="number" name='max_hourly_energy_consumption' id='max_hourly_energy_consumptionField'
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.max_hourly_energy_consumption.value}
                           touched={this.state.formControls.max_hourly_energy_consumption.touched ? 1 : 0}
                    />
                </FormGroup>

                <FormGroup id='average-consumption'>
                    <Label for='average_consumptionField'> Average Consumption: </Label>
                    <Input type="number" name='average_consumption' id='average_consumptionField'
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.average_consumption.value}
                           touched={this.state.formControls.average_consumption.touched ? 1 : 0}
                    />
                </FormGroup>

                <Row>
                    <Col sm={{size: '4', offset: 8}}>
                        <Button type={"submit"} disabled={!this.state.formIsValid} onClick={this.handleUpdate}> Update
                            Device </Button>
                    </Col>
                </Row>
                <Row>
                    <Col sm={{size: '4', offset: 8}}>
                        <Button type={"submit"} disabled={!this.state.formIsValid} onClick={this.handleDelete}> Delete
                            Device </Button>
                    </Col>
                </Row>
                {
                    this.state.errorStatus > 0 &&
                    <APIResponseErrorMessage errorStatus={this.state.errorStatus} error={this.state.error}/>
                }
            </div>
        );
    }
}

export default DeviceCRUD;
