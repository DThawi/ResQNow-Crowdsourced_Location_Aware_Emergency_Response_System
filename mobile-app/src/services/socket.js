import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from './api'; 

let socket = null;

const resolveSocketUrl = () => {
  try {
    const apiBaseUrl = API.defaults.baseURL;
    if (apiBaseUrl) {
      const structuralUrl = apiBaseUrl.replace(/\/api\/?$/, '');
      console.log(`[Socket Automation] Resolved backend endpoint connection: ${structuralUrl}`);
      return structuralUrl;
    }
  } catch (err) {
    console.warn('[Socket Automation] Failed to parse API baseURL configuration.');
  }
  return 'http://192.168.8.194:5000';
};

export const connectSocket = async () => {
  try {
    if (socket?.connected) return socket;

    const TARGET_URL = resolveSocketUrl();

    socket = io(TARGET_URL, {
      transports: ['websocket', 'polling'], 
      upgrade: true,                        
      forceNew: true,
      jsonp: false,                         
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1500,
      timeout: 20000,                       
    });

    socket.on('connect', async () => {
      console.log('🚀 Socket connected successfully across automated networks! ID:', socket.id);
      
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        console.log(`[Socket] Sending operational room validation for User ID: ${userId}`);
        socket.emit('join', userId);
      }
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected from backend infrastructure. Reason:', reason);
    });

    socket.on('connect_error', (err) => {
      console.log('Socket automated connection fallback error loop:', err.message);
    });

    return socket;
  } catch (err) {
    console.log('Socket structural initialization failed:', err.message);
    return null;
  }
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    console.log('[Socket] Disconnecting dynamic real-time communication pipeline...');
    socket.disconnect();
    socket = null;
  }
};
