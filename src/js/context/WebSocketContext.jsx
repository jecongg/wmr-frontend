import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase';
import { useDispatch } from 'react-redux';
import { clearAuth } from '../../redux/slices/authSlice';
import Swal from 'sweetalert2';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const user = useSelector((state) => state.auth?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    const newSocket = io(BACKEND_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      setIsConnected(true);

      if (user.role && user.id) {
        const room = `${user.role}-${user.id}`;
        newSocket.emit('join-room', room);
      }

      if (user.role) {
        newSocket.emit('join-room', user.role);
      }
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      setIsConnected(false);
    });

    newSocket.on('force-logout', async (data) => {
      
      await Swal.fire({
        icon: 'warning',
        title: 'Akun Dinonaktifkan',
        text: data.reason || 'Akun Anda telah dinonaktifkan. Anda akan logout otomatis.',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        allowEscapeKey: false
      });
      
      try {
        await signOut(auth);
        dispatch(clearAuth());
        
        navigate('/login', { replace: true });
      } catch (error) {
        console.error('Error during force logout:', error);
        window.location.href = '/login';
      }
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [user, dispatch, navigate]);

  const value = {
    socket,
    isConnected
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
};

export default WebSocketContext;
