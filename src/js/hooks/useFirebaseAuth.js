import { useEffect } from "react";
import { signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase"; 
import api from "../services/api"; 

// Import Redux tools
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearAuth, setAuthLoading, selectAuthStatus } from '../../redux/slices/authSlice';

export const useFirebaseAuth = () => {
    const dispatch = useDispatch();
    const authStatus = useSelector(selectAuthStatus);

    useEffect(() => {
        // onAuthStateChanged mengembalikan fungsi 'unsubscribe'
        // yang akan kita panggil saat komponen di-unmount untuk mencegah memory leak.
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            
            // Guard Clause (Pencegah Loop):
            // Jika kita SUDAH dalam proses loading atau SUDAH berhasil login,
            // JANGAN jalankan logika di bawah lagi.
            // Ini adalah kunci untuk menghentikan loop.
            if (authStatus === 'loading' || authStatus === 'succeeded') {
                return;
            }

            if (firebaseUser) {
                // Hanya set loading JIKA kita belum login sebelumnya (status 'idle' atau 'failed')
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
                    console.error("Gagal validasi user di backend:", error.message);
                    await signOut(auth);
                    dispatch(clearAuth());
                }
            } else {
                // Jika tidak ada user di Firebase, pastikan state Redux kita juga bersih
                dispatch(clearAuth());
            }
        });

        // Cleanup function: Jalankan saat hook tidak lagi digunakan
        return () => unsubscribe();

    // Dependency array: Effect ini HANYA akan dijalankan ulang jika 'dispatch' atau 'authStatus' berubah.
    // Ini penting untuk memastikan effect berjalan lagi setelah logout (status berubah dari 'succeeded' ke 'failed').
    }, [dispatch, authStatus]); 

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
            await signInWithEmailAndPassword(auth, email, password);
            return { success: true };
        } catch (error) {
            console.error("Email Sign-In Error:", error.code);
            return { success: false, code: error.code };
        }
    };
    
    const logout = async () => {
        await signOut(auth);
        // Setelah sign out dari Firebase, onAuthStateChanged akan otomatis terpicu
        // dan menjalankan dispatch(clearAuth()). Jadi kita tidak perlu dispatch di sini
        // untuk menghindari dispatch ganda.
    };
    
    return { signInWithGoogle, signInWithEmail, logout }; 
};