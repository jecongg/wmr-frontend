import { useEffect, useCallback } from 'react';
import { useWebSocketContext } from '../context/WebSocketContext';

/**
 * Custom hook for WebSocket functionality
 * @returns {object} Socket instance, connection status, and helper functions
 */
export const useWebSocket = () => {
  const { socket, isConnected } = useWebSocketContext();

  /**
   * Subscribe to a specific event
   * @param {string} event - Event name to listen to
   * @param {function} callback - Callback function when event is received
   */
  const on = useCallback((event, callback) => {
    if (socket) {
      socket.on(event, callback);
    }
  }, [socket]);

  /**
   * Unsubscribe from a specific event
   * @param {string} event - Event name to stop listening to
   * @param {function} callback - Callback function to remove
   */
  const off = useCallback((event, callback) => {
    if (socket) {
      socket.off(event, callback);
    }
  }, [socket]);

  /**
   * Emit an event to the server
   * @param {string} event - Event name
   * @param {any} data - Data to send
   */
  const emit = useCallback((event, data) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    }
  }, [socket, isConnected]);

  /**
   * Join a specific room
   * @param {string} room - Room name to join
   */
  const joinRoom = useCallback((room) => {
    if (socket && isConnected) {
      socket.emit('join-room', room);
    }
  }, [socket, isConnected]);

  /**
   * Leave a specific room
   * @param {string} room - Room name to leave
   */
  const leaveRoom = useCallback((room) => {
    if (socket && isConnected) {
      socket.emit('leave-room', room);
    }
  }, [socket, isConnected]);

  return {
    socket,
    isConnected,
    on,
    off,
    emit,
    joinRoom,
    leaveRoom
  };
};

/**
 * Custom hook to listen to a specific WebSocket event
 * @param {string} event - Event name to listen to
 * @param {function} callback - Callback function when event is received
 */
export const useWebSocketEvent = (event, callback) => {
  const { socket } = useWebSocketContext();

  useEffect(() => {
    if (socket) {
      socket.on(event, callback);

      return () => {
        socket.off(event, callback);
      };
    }
  }, [socket, event, callback]);
};

export default useWebSocket;
