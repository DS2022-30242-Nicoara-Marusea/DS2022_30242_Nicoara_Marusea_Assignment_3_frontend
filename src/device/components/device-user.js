import React from 'react';
import Button from "react-bootstrap/Button";
import * as API_DEVICES from "../api/device-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";
import {Col, Row} from "reactstrap";
import {FormGroup, Input, Label} from 'reactstrap';
import {addDeviceUser} from "../api/device-api";

class DeviceUser extends React.Component {
    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.currentId = window.location.pathname.split('/').at(-1);

        this.state = {

            errorStatus: 0,
            error: null,

            formIsValid: true,

            formControls: {
                user: {
                    value: '',
                    placeholder: 'Device User',
                    touched: false,
                    valid: true,
                },
            }


        };

        this.params = new URLSearchParams(window.location.pathname);
        this.a = this.params.toString().substring(23, this.params.toString().length - 1);
        console.log(this.a);

        this.handleChange = this.handleChange.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);

    };

    toggleForm() {
        this.setState({collapseForm: !this.state.collapseForm});
    };

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

    addUsrDev(device) {
        return API_DEVICES.addDeviceUser(device, (result, status, error) => {
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

    handleUpdate() {
        console.log(this.state.formControls.user.value);
        console.log(this.a);
        let device = {
            id: this.a,
            user: this.state.formControls.user.value,

        };

        console.log(device);
        this.addUsrDev(device);
    };

    render() {

        return (
            <div>
                <FormGroup id='user'>
                    <Label for='userField'> User: </Label>
                    <Input name='user' id='userField'
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.user.value}
                           touched={this.state.formControls.user.touched ? 1 : 0}
                    >
                        {}
                    </Input>

                </FormGroup>

                <Row>
                    <Col sm={{size: '4', offset: 8}}>
                        <Button type={"submit"} disabled={!this.state.formIsValid} onClick={this.handleUpdate}> Add User
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

export default DeviceUser