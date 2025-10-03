import { useContext } from "react";
import { FirebaseDataContext } from "../context/FirebaseDataProvider";

export function useFirebase() {
    const context = useContext(FirebaseDataContext);
    if (context === undefined) {
        throw new Error("useFirebase must be used within a FirebaseDataProvider");
    }
    return context;
}