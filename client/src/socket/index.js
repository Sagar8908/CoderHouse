import { io } from 'socket.io-client';
import { REACT_APP_SOCKET_SERVER_URL } from '../../env';
// require('dotenv').config();
const socketInit = () => { 
    const options = {
        forceNew: true,
        reconnectionAttempts: Infinity,
        timeout: 10000,
        transports: ['websocket'],
    };
    return io(REACT_APP_SOCKET_SERVER_URL, options);
};

export default socketInit;
