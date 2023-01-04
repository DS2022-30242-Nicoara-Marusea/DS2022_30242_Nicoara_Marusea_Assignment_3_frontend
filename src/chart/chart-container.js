import React from 'react';
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import {
    Card,
    CardHeader,
    Col,
    Row
} from 'reactstrap';

import * as API_DEVICES from "./api/chart-api"
import Chart from 'chart.js/auto'
import { Line } from "react-chartjs-2";


class ChartContainer extends React.Component {


    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.reload = this.reload.bind(this);
        this.currentId = window.location.pathname.split('/').at(-1);
        this.state = {
            selected: false,
            collapseForm: false,
            tableData: [],
            isLoaded: false,
            errorStatus: 0,
            error: null
        };

        this.params = new URLSearchParams(window.location.pathname);
        this.a = this.params.toString().substring(15, 51);
        console.log(this.a);
        this.d = this.params.toString().substring(62, 72);
        console.log(this.d);
        this.e = this.params.toString().substring(75, this.params.toString().length - 1);
        console.log("consouption: " + this.e);

        this.labels = [];
        this.dt = [];

        this.datta = {
            labels: this.labels,
            datasets: [
                {
                    label: "Daily energy consumption ",
                    backgroundColor: "rgb(95,15,64)",
                    borderColor: "rgb(95,15,64)",
                    data: this.dt,
                },
            ],
        };
    }



    componentDidMount() {
        this.fetchSensors();
    }


    fetchSensors() {
        return API_DEVICES.putSensor(this.a, this.d, (result, status, err) => {
            console.log(result);
            if (result !== null && status === 200) {
                this.setState({
                    tableData: result,
                    isLoaded: true
                });
                const el = result.map((index) => {
                    this.labels.push(index.timestamp.toString().substring(11, 16));
                    this.dt.push(index.energyConsumption);
                    //alert("OVERDRAFT");
                    if(this.e < index.energyConsumption) {
                        //console.log("OVERDRAFT");
                        alert("OVERDRAFT");
                    }
                    //console.log("OK");

                })
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        });
    }


    toggleForm() {
        this.setState({selected: !this.state.selected});
    }


    reload() {
        this.setState({
            isLoaded: false
        });
        this.toggleForm();
        this.fetchDevices();
    }

    render() {
        return (
            <div>
                <CardHeader>
                    <strong> Chart </strong>
                </CardHeader>

                        <div>
                            <Line data={this.datta} />
                        </div>

            </div>
        )

    }
}


export default ChartContainer;
