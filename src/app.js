import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import NavigationBar from './navigation-bar'
import Home from './home/home';
import PersonContainer from './person/person-container'

import ErrorPage from './commons/errorhandling/error-page';
import styles from './commons/styles/project-style.css';

import UserContainer from './user/user-container'
import UserCRUD from "./user/components/user-crud";

import DeviceContainer from './device/device-container'
import DeviceCRUD from "./device/components/device-crud";
import DeviceUser from "./device/components/device-user";
import UserDevices from "./user/components/user-devices";
import UserDeviceContainer from "./device/userdevice-container";
import ChartForm from "./chart/components/chart-form";
import ChartContainer from "./chart/chart-container";
import ChatContainer from "./chat/chat-container";

class App extends React.Component {


    render() {

        return (
            <div className={styles.back}>
            <Router>
                <div>
                    <NavigationBar />
                    <Switch>

                        <Route
                            exact
                            path='/'
                            render={() => <Home/>}
                        />

                        <Route
                            exact
                            path='/person'
                            render={() => <PersonContainer/>}
                        />

                        <Route
                            exact
                            path='/devicesusers'
                            render={() => <UserContainer/>}
                        />

                        <Route
                            exact
                            path='/devicesusers/updates/:id'
                            render={() => <UserCRUD/>}
                        />

                        <Route
                            exact
                            path='/devices'
                            render={() => <DeviceContainer/>}
                        />

                        <Route
                            exact
                            path='/devices/update/:id'
                            render={() => <DeviceCRUD/>}
                        />

                        <Route
                            exact
                            path='/devices/adduser/:id'
                            render={() => <DeviceUser/>}
                        />

                        <Route
                            exact
                            path='/mydevices'
                            render={() => <UserDevices/>}
                        />

                        <Route
                            exact
                            path='/mydevices/:id'
                            render={() => <UserDeviceContainer/>}
                        />

                        <Route
                            exact
                            path='/mydevices/:id/chart/:e'
                            render={() => <ChartForm/>}
                        />

                        <Route
                            exact
                            path='/mydevices/:id/chart/:date/:e'
                            render={() => <ChartContainer/>}
                        />

                        <Route
                            exact
                            path='/chat'
                            render={() => <ChatContainer/>}
                        />

                        {/*Error*/}
                        <Route
                            exact
                            path='/error'
                            render={() => <ErrorPage/>}
                        />

                        <Route render={() =><ErrorPage/>} />
                    </Switch>
                </div>
            </Router>
            </div>
        )
    };
}

export default App
