import React from "react";
import Table from "../../commons/tables/table";
import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";

const columns = [
    {
        Header: 'Name',
        accessor: 'name',
    },
    {
        Header: 'Address',
        accessor: 'address',
    },
    {
        Header: 'Admin',
        id: 'admin',
        accessor: d => d.admin ? 'YES' : 'NO',
    },
    {
        Header: 'Update',
        accessor: 'id',
        Cell: ({ row }) => (<Link to={`/devicesusers/updates/${row.id}`}>Update/Delete</Link>)
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

class UserTable extends React.Component {

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

export default UserTable;