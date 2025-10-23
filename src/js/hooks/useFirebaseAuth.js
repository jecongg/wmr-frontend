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
            
            // [KUNCI 2] Tambahkan "Gerbang Penjaga" (Guard Clause)
            // Ambil status Redux saat ini SECARA LANGSUNG dari store.
            const { status } = store.getState().auth;

            // Jika kita sudah loading atau sudah berhasil, jangan lakukan apa-apa.
            // Ini akan memutus infinite loop.
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
                    console.error("Gagal validasi user ke backend:", error);
                    await signOut(auth);
                    dispatch(clearAuth());
                }
            } else {
                // Jika tidak ada user, panggil clearAuth.
                // Ini akan mengubah status menjadi 'failed', yang akan menghentikan loading.
                dispatch(clearAuth());
            }
        });

        return () => unsubscribe();
    }, [dispatch]); // Dependency array sudah benar

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