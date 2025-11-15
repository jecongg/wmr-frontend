import { Outlet } from "react-router-dom";
import { ToastProvider } from '../../js/context/ToastContext';
import { WebSocketProvider } from '../../js/context/WebSocketContext';
import { useFirebaseAuth } from "../../js/hooks/useFirebaseAuth";

const RootLayout = () => {
  useFirebaseAuth(); 

  return (
      <WebSocketProvider>
        <Outlet />
      </WebSocketProvider>
  );
};

export default RootLayout;