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
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            
            if (firebaseUser) {
                // [PERBAIKAN] Guard Clause dipindahkan ke dalam sini.
                // Ini HANYA akan mencegah eksekusi ulang jika kita SUDAH berhasil login.
                // Ini penting untuk mencegah request API berulang kali setelah login berhasil.
                if (authStatus === 'loading' || authStatus === 'succeeded') {
                    return;
                }

                // Hanya set loading JIKA kita belum login sebelumnya
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
                        // onAuthStateChanged akan terpicu lagi dengan user null, 
                        // dan blok 'else' di bawah akan menangani clearAuth.
                    }
                } catch (error) {
                    console.error("Gagal validasi user di backend:", error.message);
                    await signOut(auth);
                }
            } else {
                // Jika tidak ada user di Firebase, kita SELALU ingin membersihkan state Redux.
                // Tidak perlu guard clause di sini. Inilah kunci agar logout berfungsi.
                dispatch(clearAuth());
            }
        });

        // Cleanup function
        return () => unsubscribe();

    // Dependency array tetap sama, ini sudah benar.
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