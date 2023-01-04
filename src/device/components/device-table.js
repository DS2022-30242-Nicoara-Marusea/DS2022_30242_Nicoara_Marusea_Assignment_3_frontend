import React from "react";
import Table from "../../commons/tables/table";
import { Link } from "react-router-dom";

const columns = [

    {
        Header: 'Description',
        accessor: 'description',
    },
    {
        Header: 'Address',
        accessor: 'address',
    },
    {
        Header: 'Maximum Hourly Energy Consumption',
        accessor: 'max_hourly_energy_consumption',
    },
    {
        Header: 'Average Consumption',
        accessor: 'average_consumption',
    },
    {
        Header: 'Update',
        accessor: 'id',
        Cell: ({ row }) => (<Link to={`/devices/update/${row.id}`}>Update/Delete</Link>)
    },
    {
        Header: 'User',
        accessor: 'id',
        Cell: ({ row }) => (<Link to={`/devices/adduser/${row.id}`}>Add User</Link>)
    }

];

const filters = [
    {
        accessor: 'id',
    }
];

class DeviceTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tableData: this.props.tableData
        };
    }

    render() {
        return (
            <Table
                data={this.state.tableData}
                columns={columns}
                search={filters}
                pageSize={5}
            />
        )
    }
}

export default DeviceTable;