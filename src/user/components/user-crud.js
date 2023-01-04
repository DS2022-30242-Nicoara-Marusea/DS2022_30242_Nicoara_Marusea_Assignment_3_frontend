import React from 'react';
import Button from "react-bootstrap/Button";
import * as API_USERS from "../api/user-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";
import {Col, Row} from "reactstrap";
import { FormGroup, Input, Label} from 'reactstrap';
import { bool } from 'prop-types';
class UserCRUD extends React.Component {


    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.currentId = window.location.pathname.split('/').at(-1);

        this.state = {

            errorStatus: 0,
            error: null,

            formIsValid: true,

            formControls: {
                name: {
                    value: '',
                    placeholder: 'What is the client\'s name?',
                    touched: false,
                    valid: true,
                },
                address: {
                    value: '',
                    placeholder: 'What is the client\'s address?',
                    touched: false,
                    valid: true,
                },
                admin: {
                    type: bool,
                    value: true,
                    touched: false,
                    valid: true,
                }
            }


        };

        API_USERS.getUserById(this.currentId, (result, status, err) => {
            console.log(this.currentId);
            if (result !== null && status === 200) {
                const updatedControls = this.state.formControls;
                updatedControls['name'].value = result.name;
                updatedControls['address'].value = result.address;
                updatedControls['admin'].value = result.admin;
                //updatedControls['devices'].value = result.devices;
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

    fetchUser(id) {
        let _this = this;
        API_USERS.getUserById(id, (result, status, err) => {
            console.log(result);
            if (result !== null && status === 200) {
                const updatedControls = this.state.formControls;
                updatedControls['name'] = result.name;
                updatedControls['address'] = result.address;
                updatedControls['admin'].value = result.admin;
                //updatedControls['devices'] = result.devices;
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
        const value = (name == 'admin') ? event.target.checked : event.target.value;
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


    updateUser(user) {
        return API_USERS.putUser(user, (result, status, error) => {
            console.log(user);
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully updated user with id: " + result);
            } else {
                this.setState(({
                    errorStatus: status,
                    error: error
                }));
            }
        });
    };

    handleDelete() {
        return API_USERS.deleteUser(this.currentId, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully deleted user with id: " + result);
            } else {
                this.setState(({
                    errorStatus: status,
                    error: error
                }));
            }
        });
    }

    handleUpdate() {
        let user = {
            id: this.currentId,
            name: this.state.formControls.name.value,
            address: this.state.formControls.address.value,
            admin: this.state.formControls.admin.value,
        };

        console.log(user);
        this.updateUser(user);
    };

    render() {
        return (
            <div>

                <FormGroup id='name'>
                    <Label for='nameField'> Name: </Label>
                    <Input name='name' id='nameField' placeholder={this.state.formControls.name.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.name.value}
                           touched={this.state.formControls.name.touched? 1 : 0}
                           required
                    />

                </FormGroup>

                <FormGroup id='address'>
                    <Label for='addressField'> Address: </Label>
                    <Input name='address' id='addressField' placeholder={this.state.formControls.address.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.address.value}
                           touched={this.state.formControls.address.touched? 1 : 0}
                           required
                    />

                </FormGroup>

                <FormGroup id='admin'>
                    <Label for='admin'> Role: </Label>
                    <Input type='checkbox' name='admin' id='adminField' placeholder={this.state.formControls.admin.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.admin.value}
                           touched={this.state.formControls.admin.touched? 1 : 0}
                           required
                    />
                </FormGroup>

                <Row>
                    <Col sm={{size: '4', offset: 8}}>
                        <Button type={"submit"} disabled={!this.state.formIsValid} onClick={this.handleUpdate}> Update Client </Button>
                    </Col>
                </Row>
                <Row>
                    <Col sm={{size: '4', offset: 8}}>
                        <Button type={"submit"} disabled={!this.state.formIsValid} onClick={this.handleDelete}> Delete Client </Button>
                    </Col>
                </Row>
                {
                    this.state.errorStatus > 0 &&
                    <APIResponseErrorMessage errorStatus={this.state.errorStatus} error={this.state.error}/>
                }
            </div>
        ) ;
    }
}

export default UserCRUD;
