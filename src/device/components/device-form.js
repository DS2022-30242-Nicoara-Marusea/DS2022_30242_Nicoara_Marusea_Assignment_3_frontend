import React from 'react';
import Button from "react-bootstrap/Button";
import * as API_USERS from "../api/device-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";
import {Col, Row} from "reactstrap";
import {FormGroup, Input, Label} from 'reactstrap';


class DeviceForm extends React.Component {

    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.reloadHandler = this.props.reloadHandler;
        //this.users = this.props.users;
        //this.sensors = this.props.sensors;

        this.state = {

            errorStatus: 0,
            error: null,

            formIsValid: false,

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
                    type: Number,
                    value: 0,
                    touched: false,
                    valid: true,
                },
                average_consumption: {
                    type: Number,
                    value: 0,
                    touched: false,
                    valid: true,
                }
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    };

    toggleForm() {
        this.setState({collapseForm: !this.state.collapseForm});
    };


    handleChange = event => {
        const name = event.target.name;
        const value = event.target.value;

        const updatedControls = this.state.formControls;
        const updatedFormElement = updatedControls[name];

        console.log(value);
        updatedFormElement.value = value;
        updatedFormElement.touched = true;
        updatedControls[name] = updatedFormElement;

        let formIsValid = true;
        for (let updatedFormElementName in updatedControls) {
            formIsValid = updatedControls[updatedFormElementName].valid && formIsValid;
        }

        this.setState({
            formControls: updatedControls,
            formIsValid: formIsValid
        });

    };

    registerDevice(device) {
        return API_USERS.postDevice(device, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully inserted device with id: " + result);
                this.reloadHandler();
            } else {
                this.setState(({
                    errorStatus: status,
                    error: error
                }));
            }
        });
    };

    handleSubmit() {
        let device = {
            address: this.state.formControls.address.value,
            description: this.state.formControls.description.value,
            max_hourly_energy_consumption: parseInt(this.state.formControls.max_hourly_energy_consumption.value, 10),
            average_consumption: parseInt(this.state.formControls.average_consumption.value, 10),
            /*du: this.state.formControls.du.value,*/
            /*sensor: this.sensors.filter(s => s.id == this.state.formControls.sensor.value)[0] == undefined ? null : {
                id: this.sensors.filter(s => s.id == this.state.formControls.sensor.value)[0].id,
                data: this.sensors.filter(s => s.id == this.state.formControls.sensor.value)[0].data == null ? [] : this.sensors.filter(s => s.id == this.state.formControls.sensor.value)[0].data
            },*/
        };

        console.log(device);
        this.registerDevice(device);
    };

    render() {
        return (
            <div>

                <FormGroup id='address'>
                    <Label for='addressField'> Address: </Label>
                    <Input name='address' id='addressField' placeholder={this.state.formControls.address.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.address.value}
                           touched={this.state.formControls.address.touched ? 1 : 0}
                           required
                    />

                </FormGroup>

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

                <FormGroup id='max_hourly_energy_consumption'>
                    <Label for='max_hourly_energy_consumptionField'> Maximum Hourly Enegery Consumption: </Label>
                    <Input type="number" name='max_hourly_energy_consumption' id='max_hourly_energy_consumptionField'
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.max_hourly_energy_consumption.value}
                           touched={this.state.formControls.max_hourly_energy_consumption.touched ? 1 : 0}
                    />
                </FormGroup>

                <FormGroup id='average_consumption'>
                    <Label for='average_consumptionField'> Average Consumption: </Label>
                    <Input type="number" name='average_consumption' id='average_consumptionField'
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.average_consumption.value}
                           touched={this.state.formControls.average_consumption.touched ? 1 : 0}
                    />
                </FormGroup>

                <Row>
                    <Col sm={{size: '4', offset: 8}}>
                        <Button type={"submit"} disabled={!this.state.formIsValid} onClick={this.handleSubmit}> Add
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

export default DeviceForm;
