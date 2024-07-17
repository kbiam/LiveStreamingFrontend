import { io } from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production' ? undefined : process.env.REACT_APP_SOCKET_URL;

export const socket = io(URL,{withCredentials: true});