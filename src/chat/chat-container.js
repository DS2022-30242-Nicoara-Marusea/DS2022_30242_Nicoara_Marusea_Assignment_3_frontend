import React, {useEffect, useState} from 'react'
import {over} from 'stompjs';
import SockJS from 'sockjs-client';

import * as API_CHAT from "./api/chat-api"

var stompClient = null;

const ChatContainer = () => {
    const [privateChats, setPrivateChats] = useState(new Map());
    const [publicChats, setPublicChats] = useState([]);
    const [tab, setTab] = useState('CHATROOM');
    const [userData, setUserData] = useState({
        username: '',
        receivername: '',
        connected: false,
        message: '',
    });

    const chat = (payloadData) => {
        var chat = {
            addresser: payloadData.addresser,
            receptor: payloadData.receptor,
            content: payloadData.content,
            state: payloadData.state
        };
        return chat;
    };

    useEffect(() => {
        console.log(userData);
    }, [userData]);

    const connect = () => {
        const Sock = new SockJS('https://b3ckend.herokuapp.com/ws');
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    };

    const onConnected = () => {
        setUserData({...userData, "connected": true});
        stompClient.subscribe('/public/public', onMessageReceived);
        stompClient.subscribe(`/client/${userData.username}/private`, onPrivateMessage);
        userJoin();
    };

    const userJoin = () => {
        const chatMessage = {
            addresser: userData.username,
            state: 'JOIN',
        };
        stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
    };

    const onMessageReceived = (payload) => {
        var payloadData = JSON.parse(payload.body);
        if (payloadData.state == "JOIN") {
            if (!privateChats.get(payloadData.addresser)) {
                privateChats.set(payloadData.addresser, []);
                setPrivateChats(new Map(privateChats));
            }
        }
        if (payloadData.state == "MESSAGE") {
            publicChats.push(payloadData);
            setPublicChats([...publicChats]);
        }
    }

    const onPrivateMessage = (payload) => {
        console.log(payload);
        var payloadData = JSON.parse(payload.body);
        API_CHAT.getMessage(chat(payloadData), (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully");
            } else {
                this.setState(({
                    errorStatus: status,
                    error: error
                }));
            }
        });

        if (privateChats.get(payloadData.addresser)) {
            privateChats.get(payloadData.addresser).push(payloadData);
            setPrivateChats(new Map(privateChats));
        } else {
            let list = [];
            list.push(payloadData);
            privateChats.set(payloadData.addresser, list);
            setPrivateChats(new Map(privateChats));
        }
    }

    const onError = (err) => {
        console.log(err);

    }

    const handleMessage = (event) => {
        const {value} = event.target;
        setUserData({...userData, "content": value});
    }
    const sendValue = () => {
        if (stompClient) {
            var chatMessage = {
                addresser: userData.username,
                content: userData.content,
                state: "CONTENT"
            };
            console.log(chatMessage);
            stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
            setUserData({...userData, "content": ""});
        }
    }

    const sendPrivateValue = () => {
        if (stompClient) {
            var chatMessage = {
                addresser: userData.username,
                receptor: tab,
                content: userData.content,
                state: "CONTENT"
            };

            if (userData.username !== tab) {
                privateChats.get(tab).push(chatMessage);
                setPrivateChats(new Map(privateChats));
            }
            stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
            setUserData({...userData, "content": ""});
        }
    }

    const handleUsername = (event) => {
        const {value} = event.target;
        setUserData({...userData, "username": value});
    }

    const registerUser = () => {
        connect();
    }
    return (
        <div className="container">
            {userData.connected ?
                <div className="chat-box">
                    <div className="member-list">
                        <ul>
                            <li onClick={() => {
                                setTab("CHATROOM")
                            }} className={`member ${tab === "CHATROOM" && "active"}`}>Chatroom
                            </li>
                            {[...privateChats.keys()].map((name, index) => (
                                <li onClick={() => {
                                    setTab(name)
                                }} className={`member ${tab === name && "active"}`} key={index}>{name}</li>
                            ))}
                        </ul>
                    </div>
                    {tab === "CHATROOM" && <div className="chat-content">
                        <ul className="chat-messages">
                            {publicChats.map((chat, index) => (
                                <li className={`message ${chat.addresser === userData.username && "self"}`}
                                    key={index}>
                                    {chat.addresser !== userData.username &&
                                        <div className="avatar">{chat.addresser}</div>}
                                    <div className="message-data">{chat.message}</div>
                                    {chat.addresser === userData.username &&
                                        <div className="avatar self">{chat.addresser}</div>}
                                </li>
                            ))}
                        </ul>

                        <div className="send-message">
                            <input type="text" className="input-message" placeholder="enter the message"
                                   value={userData.content} onChange={handleMessage}/>
                            <button type="button" className="send-button" onClick={sendValue}>send</button>
                        </div>
                    </div>}
                    {tab !== "CHATROOM" && <div className="chat-content">
                        <ul className="chat-messages">
                            {[...privateChats.get(tab)].map((chat, index) => (
                                <li className={`message ${chat.addresser === userData.username && "self"}`}
                                    key={index}>
                                    {chat.addresser !== userData.username &&
                                        <div className="avatar">{chat.addresser}</div>}
                                    <div className="message-data">{chat.content}</div>
                                    {chat.addresser === userData.username &&
                                        <div className="avatar self">{chat.addresser}</div>}
                                </li>
                            ))}
                        </ul>

                        <div className="send-message">
                            <input type="text" className="input-message" placeholder="enter the message"
                                   value={userData.content} onChange={handleMessage}/>
                            <button type="button" className="send-button" onClick={sendPrivateValue}>send</button>
                        </div>
                    </div>}
                </div>
                :
                <div className="register">
                    <input
                        id="user-name"
                        placeholder="Enter your name"
                        name="userName"
                        value={userData.username}
                        onChange={handleUsername}
                        margin="normal"
                    />
                    <button type="button" onClick={registerUser}>
                        connect
                    </button>
                </div>}
        </div>
    )
}

export default ChatContainer;
