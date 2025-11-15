import { useWebSocket } from '../../js/hooks/useWebSocket';

/**
 * Component untuk menampilkan status WebSocket connection
 * Bisa ditambahkan di header atau sidebar untuk monitoring
 */
const WebSocketStatus = () => {
  const { isConnected } = useWebSocket();

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
      <span className="text-xs text-gray-600">
        {isConnected ? 'Live' : 'Offline'}
      </span>
    </div>
  );
};

export default WebSocketStatus;
