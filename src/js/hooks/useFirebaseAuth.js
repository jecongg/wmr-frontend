import { useState, useEffect } from "react";
import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { auth } from "../../../firebase"; // Pastikan path ini benar
import api from "../services/api"; // Pastikan path ini benar

export const useFirebaseAuth = () => {
    const [user, setUser] = useState(null);
    const [authloading, setLoading] = useState(true); // Mulai dengan true

    // useEffect ini akan menjadi SATU-SATUNYA sumber kebenaran untuk status user
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Saat Firebase bilang ada user, kita validasi ke backend
                // Ini akan berjalan saat pertama kali load DAN setelah signInWithGoogle berhasil
                try {
                    const response = await api.post('/api/auth/google-login', {
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                    });

                    if (response.data.success) {
                        const completeUserData = { 
                            ...firebaseUser,
                            ...response.data.user
                        };
                        setUser(completeUserData);
                    } else {
                        // Jika backend menolak (misal: email tidak terdaftar), logout dari Firebase
                        await signOut(auth);
                        setUser(null);
                    }
                } catch (error) {
                    console.error("Gagal memvalidasi user ke backend:", error);
                    await signOut(auth);
                    setUser(null);
                }
            } else {
                // Jika Firebase bilang tidak ada user, kita set null
                setUser(null);
            }
            setLoading(false); // Selesai loading setelah semua pengecekan selesai
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        // Fungsi ini sekarang menjadi SANGAT sederhana
        // Tugasnya hanya memicu popup login Firebase.
        // Sisanya akan ditangani oleh onAuthStateChanged di atas.
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            // Tidak perlu melakukan apa-apa lagi di sini!
            return { success: true };
        } catch (error) {
            // ... (logika penanganan error popup, misal ditutup pengguna) ...
            return { success: false, code: error.code, error: error.message };
        }
    };
    
    const logout = async () => {
        await signOut(auth);
        setUser(null);
    };

    // Kita tidak perlu lagi redirectTarget di sini
    return { user, authloading, signInWithGoogle, logout };
};