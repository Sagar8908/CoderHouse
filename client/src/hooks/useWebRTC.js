import React, { useRefuseEffect, useState, useRef, useCallback, useEffect } from 'react'
import useStateWithCallBack from './useStateWithCallBack';
import { useSelector } from 'react-redux'
import socketInit from '../socket';
import { ACTIONS } from '../actions';
import freeice from 'freeice';
// import { useParams, useHistory } from 'react-router-dom';

// const user = [
//     {
//         id: 1,
//         name: "dasfreffrwe",
//     },
//     {
//         id: 2,
//         name: "fiowerw",
//     }
// ];

const useWebRTC = (roomId, user) => {
    console.log(user);
    const [clients, setClients] = useStateWithCallBack([]); 
    const audioElements = useRef({});
    const connections = useRef({});
    const socket = useRef(null);
    const localMediaStream = useRef(null);
    const clientsRef = useRef(null);
    useEffect(() => {
        socket.current = socketInit();
    },[])

    const addNewClient = useCallback(
        (newClient, cb) => {
            const lookingFor = clients.find(
                (client) => client.id === newClient.id
            );

            if (lookingFor === undefined) {
                setClients(
                    (existingClients) => [...existingClients, newClient],
                    cb
                );
            }
        },
        [clients, setClients]
    );

    useEffect(() => {
        clientsRef.current = clients;
    }, [clients]);

    useEffect(() => {
        const startCapture = async () => { 
            localMediaStream.current = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
        }
        // console.log({ ...user });
        startCapture().then(() => {
            addNewClient({ ...user, muted: true }, () => {
                const localElement = audioElements.current[user.id];
                if (localElement) {
                    localElement.volume = 0;
                    localElement.srcObject = localMediaStream.current;
                }
                //
                socket.current.emit(ACTIONS.JOIN, { roomId,user});
            });
        });

        return () => {
            //Leaving the room
            // localMediaStream.current.getTracks().forEach(track => track.stop());

            socket.current.emit(ACTIONS.LEAVE, { roomId });
        }
    }, [])

    useEffect(() => {

        const handleNewPeer = async ({
            peerId,
            createOffer,
            user: remoteUser,
        }) => {
            if (peerId in connections.current) {
                return console.warn(
                    `You are already connected with ${peerId} (${user.name})`
                );
            }

            // Store it to connections
            connections.current[peerId] = new RTCPeerConnection({
                iceServers: freeice(),
            });

            // Handle new ice candidate on this peer connection
            connections.current[peerId].onicecandidate = (event) => {
                socket.current.emit(ACTIONS.RELAY_ICE, {
                    peerId,
                    icecandidate: event.candidate,
                });
            };

            // Handle on track event on this connection
            connections.current[peerId].ontrack = ({
                streams: [remoteStream],
            }) => {
                addNewClient({...remoteUser,muted:true}, () => {
                    if (audioElements.current[remoteUser.id]) {
                        audioElements.current[remoteUser.id].srcObject =
                            remoteStream;
                    } else {
                        let settled = false;
                        const interval = setInterval(() => {
                            if (audioElements.current[remoteUser.id]) {
                                audioElements.current[
                                    remoteUser.id
                                ].srcObject = remoteStream;
                                settled = true;
                            }

                            if (settled) {
                                clearInterval(interval);
                            }
                        }, 300);
                    }
                })
            };

            // Add connection to peer connections track
            localMediaStream.current.getTracks().forEach((track) => {
                connections.current[peerId].addTrack(
                    track,
                    localMediaStream.current
                );
            });

            // Create an offer if required
            if (createOffer) {
                const offer = await connections.current[
                    peerId
                ].createOffer();

                // Set as local description
                await connections.current[peerId].setLocalDescription(
                    offer
                );

                // send offer to the server
                socket.current.emit(ACTIONS.RELAY_SDP, {
                    peerId,
                    sessionDescription: offer,
                });
            }

        };
       
        socket.current.on(ACTIONS.ADD_PEER, handleNewPeer);

        return () => {
            socket.current.off(ACTIONS.ADD_PEER);
        };
    }, []);
    
    // Handle ice candidate
    useEffect(() => {
        socket.current.on(ACTIONS.ICE_CANDIDATE, ({ peerId, icecandidate }) => {
            if (icecandidate) {
                connections.current[peerId].addIceCandidate(icecandidate);
            }
        })
        return () => {
            socket.current.off(ACTIONS.ICE_CANDIDATE);
        };
    }, []);

    // Handle SDP
    useEffect(() => {
        const handleRemoteSdp = async ({ peerId, sessionDescription:remoteSessionDescription }) => {
            connections.current[peerId].setRemoteDescription(
                new RTCSessionDescription(remoteSessionDescription)
            )

            //if session description is type of offer then create an answer

            if (remoteSessionDescription.type === 'offer') {
                const connection = connections.current[peerId];
                const answer = await connection.createAnswer();

                connection.setLocalDescription(answer);
                socket.current.emit(ACTIONS.RELAY_SDP, {
                    peerId,
                    sessionDescription: answer,
                });
            }
        }
        socket.current.on(ACTIONS.SESSION_DESCRIPTION, handleRemoteSdp)
        return () => {
            socket.current.off(ACTIONS.SESSION_DESCRIPTION);
        }
    }, []);

    // Handle remove peer
    useEffect(() => {
        const handleRemovePeer = async ({peerId,userId}) => {
            if (connections.current[peerId]) {
                connections.current[peerId].close();

                delete connections.current[peerId];
                delete audioElements.current[peerId];
                setClients((list) => list.filter((c) => c.id !== userId));
            }
        }
        socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);
    })


    // Listen Mute/Unmute
    useEffect(() => {
        socket.current.on(ACTIONS.MUTE, ({ peerId, userId }) => {
            setMute(true, userId);
        });
        socket.current.on(ACTIONS.UNMUTE, ({ peerId, userId }) => {
            setMute(false, userId);
        });

        const setMute = (mute, userId) => {
            const clientIdx = clientsRef.current.map(client => client.id).indexOf(userId);
            console.log('idx', clientIdx);

            const connectedClients = JSON.parse(
                JSON.stringify(clientsRef.current)
            );
            if (clientIdx > -1) {
                connectedClients[clientIdx].muted = mute; //true or false
                setClients(connectedClients);
            }
        }
    }, [clients]);

    const provideRef = (instance, userId) => {
        audioElements.current[userId] = instance;
    };
    // console.log(clients);
    // console.log("clients");

    const handleMute = (isMute, userId) => {
        let settled = false;

        if (userId === user.id) {
            let interval = setInterval(() => {
                if (localMediaStream.current) {
                    localMediaStream.current.getTracks()[0].enabled = !isMute;
                    if (isMute) {
                        socket.current.emit(ACTIONS.MUTE, {
                            roomId,
                            userId: user.id,
                        });
                    } else {
                        socket.current.emit(ACTIONS.UNMUTE, {
                            roomId,
                            userId: user.id,
                        });
                    }
                    settled = true;
                }
                if (settled) {
                    clearInterval(interval);
                }
            }, 200);
        }
    };

    return { clients, provideRef, handleMute };
}

export default useWebRTC