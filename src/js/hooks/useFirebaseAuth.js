import { useEffect } from "react";
import { signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase"; 
import api from "../services/api"; 

// Import Redux tools
import { useDispatch } from 'react-redux';
import { setUser, clearAuth, setAuthLoading } from '../../redux/slices/authSlice'; // Sesuaikan path
import { store } from '../../redux/store'; // <-- [KUNCI 1] Import 'store' secara langsung

export const useFirebaseAuth = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            
            const { status } = store.getState().auth;

            if (status === 'loading' || status === 'succeeded') {
                return;
            }

            if (firebaseUser) {
                dispatch(setAuthLoading());
                try {
                    const response = await api.post('/api/auth/google-login', {
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                    });

                    if (response.data.success) {
                        dispatch(setUser(response.data.user)); 
                    } else {
                        await signOut(auth);
                        dispatch(clearAuth());
                    }
                } catch (error) {
                    console.error("Gagal validasi user ke backend:", error.message);
                    await signOut(auth);
                    dispatch(clearAuth());
                }
            } else {
                dispatch(clearAuth());
            }
        });

        return () => unsubscribe();
    }, [dispatch]); 

    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            return { success: true };
        } catch (error) {
            return { success: false, code: error.code, error: error.message };
        }
    };

    const signInWithEmail = async (email, password) => {
        try {
            // Panggil Firebase untuk melakukan login
            await signInWithEmailAndPassword(auth, email, password);

            // Jika berhasil, onAuthStateChanged akan otomatis terpicu.
            // Kita tidak perlu melakukan apa-apa lagi di sini.
            return { success: true };
        } catch (error) {
            // Jika gagal, kembalikan kode error agar bisa ditangani di UI
            console.error("Email Sign-In Error:", error.code);
            return { success: false, code: error.code };
        }
    };
    
    const logout = async () => {
        await signOut(auth);
        dispatch(clearAuth());
    };
    
    return { signInWithGoogle, signInWithEmail, logout }; 
};