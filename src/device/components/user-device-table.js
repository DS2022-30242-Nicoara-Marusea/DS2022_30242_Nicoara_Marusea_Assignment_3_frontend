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
        Header: 'Chart',
        accessor: 'id',
        Cell: ({ row }) => (<Link to={`/mydevices/${row.id}/chart/${row.average_consumption}`}>See Chart</Link>)
    },
    {
        Header: 'Chat',
        accessor: 'id',
        Cell: ({ row }) => (<Link to={`/chat`}>Chat</Link>)
    }

];

const filters = [
    {
        accessor: 'id',
    }
];

class UserDeviceTable extends React.Component {

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

export default UserDeviceTable;