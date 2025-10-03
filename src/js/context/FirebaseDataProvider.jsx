import { useEffect, createContext, useState, useContext } from "react";
import { useFirebaseAuth } from "../hooks/useFirebaseAuth";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";

export const FirebaseDataContext = createContext();

export function FirebaseDataProvider({ children }) {

    const {user : firebaseUser} = useFirebaseAuth();
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        if (!firebaseUser) {
            setCurrentUser(null);
            return;
        }
        let unsubscribe = null;

        try {
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            
            unsubscribe = onSnapshot(userDocRef, async (userDoc) => {
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    if (userData.uid !== firebaseUser.uid) {
                        try {
                            await updateDoc(userDocRef, {
                                uid: firebaseUser.uid,
                                updated_at: new Date(),
                                last_login: new Date()
                            });
                            
                            userData.uid = firebaseUser.uid;
                            userData.last_login = new Date();
                        } catch (updateError) {
                            console.error("Error updating uid field:", updateError);
                        }
                    }
                    setCurrentUser({
                        ...userData,
                        uid: firebaseUser.uid,
                        docId: firebaseUser.uid
                    });
                } else {
                    setCurrentUser({
                        uid: firebaseUser.uid,
                        docId: firebaseUser.uid,
                        email: firebaseUser.email,
                        username: firebaseUser.username,
                        role: firebaseUser.role,
                        created_at: new Date(),
                        last_login: new Date(),
                    });
                }
            }, (error) => {
                setCurrentUser({
                    uid: firebaseUser.uid,
                    docId: firebaseUser.uid,
                    email: firebaseUser.email,
                    username: firebaseUser.username,
                    role: firebaseUser.role
                });
            });

        } catch (error) {
            setCurrentUser({
                uid: firebaseUser.uid,
                docId: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                role: firebaseUser.role || 'user',
                roles: firebaseUser.roles || []
            });
        }

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [firebaseUser]);

    const value = {
        currentUser,
    }


    return (
        <>
            <FirebaseDataContext.Provider value={value}>
                {children}
            </FirebaseDataContext.Provider>
        </>
    )
}

// // Hook untuk menggunakan FirebaseDataContext
// export function useFirebaseData() {
//     const context = useContext(FirebaseDataContext);
//     if (context === undefined) {
//         throw new Error('useFirebaseData must be used within a FirebaseDataProvider');
//     }
//     return context;
// }

