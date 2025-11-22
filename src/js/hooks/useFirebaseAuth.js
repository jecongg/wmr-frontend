import { useEffect, useRef } from "react";
import {
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../../../firebase";
import api from "../services/api";

import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearAuth, setAuthLoading, selectAuthStatus } from '../../redux/slices/authSlice';
import { useToast } from '../context/ToastContext';

export const useFirebaseAuth = () => {
    const dispatch = useDispatch();
    const authStatus = useSelector(selectAuthStatus);
    const tokenRefreshInterval = useRef(null);
    const { showToast } = useToast();
    const toastShownRef = useRef(false);

    useEffect(() => {
        const setupTokenRefresh = (firebaseUser) => {
            if (tokenRefreshInterval.current) {
                clearInterval(tokenRefreshInterval.current);
            }

            if (firebaseUser) {
                tokenRefreshInterval.current = setInterval(async () => {
                    try {
                        const newToken = await firebaseUser.getIdToken(true); // force refresh

                        // Update token in cookie
                        await api.post('/api/auth/set-token', { idToken: newToken });

                        const response = await api.post(
                            "/api/auth/login-with-token",
                            {
                                idToken: newToken,
                            }
                        );

                        if (response.data.success) {
                            dispatch(setUser(response.data.user));
                        } else {
                            console.warn(
                                "⚠️ Token refresh failed, logging out..."
                            );
                            await signOut(auth);
                        }
                    } catch (error) {
                        console.error("❌ Error refreshing token:", error);
                    }
                }, 50 * 60 * 1000);
            }
        };

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                if (authStatus === "loading" || authStatus === "succeeded") {
                    setupTokenRefresh(firebaseUser);
                    return;
                }

                dispatch(setAuthLoading());
                try {
                    const idToken = await firebaseUser.getIdToken(true);

                    // Store token in cookie
                    await api.post('/api/auth/set-token', { idToken });

                    const response = await api.post(
                        "/api/auth/login-with-token",
                        {
                            idToken: idToken,
                        }
                    );

                    if (response.data.success) {
                        dispatch(setUser(response.data.user));

                        setupTokenRefresh(firebaseUser);
                    } else {
                        console.warn("Backend tidak mengenali user, logout...");
                        await signOut(auth);
                    }
                } catch (error) {
                    if (error.response?.status === 403) {
                        const message = error.response.data?.message || 'Akun Anda tidak aktif. Silakan hubungi administrator.';
                        
                        if (!toastShownRef.current) {
                            showToast(message, 'error', 6000);
                            toastShownRef.current = true;
                            
                            setTimeout(() => {
                                toastShownRef.current = false;
                            }, 7000);
                        }
                        
                        await signOut(auth);
                        dispatch(clearAuth());
                        return;
                    }

                    if (error.code === 'ERR_NETWORK') {
                        console.error("❌ Network Error: Backend tidak dapat dijangkau. Pastikan backend server berjalan di http://localhost:3000");
                        console.error("💡 Jalankan: cd wmr-backend && npm start");
                    } else if (error.response) {
                        console.error(
                            "❌ Backend Error:",
                            error.response.status,
                            error.response.data
                        );
                    } else if (error.request) {
                        console.error(
                            "❌ No Response: Backend tidak merespons. Pastikan backend berjalan."
                        );
                    } else {
                        console.error("❌ Error:", error.message);
                    }

                    await signOut(auth);

                    dispatch(clearAuth());
                }
            } else {
                dispatch(clearAuth());
                if (tokenRefreshInterval.current) {
                    clearInterval(tokenRefreshInterval.current);
                    tokenRefreshInterval.current = null;
                }
            }
        });

        return () => {
            unsubscribe();
            if (tokenRefreshInterval.current) {
                clearInterval(tokenRefreshInterval.current);
            }
        };
    }, [dispatch, authStatus]);

    const sendPasswordReset = async (email) => {
        api.post("/api/auth/forgot-password", { email }).catch((err) => {
            console.warn(
                "Silent check for forgot password failed, proceeding with Firebase.",
                err.response?.data?.message
            );
        });

        await sendPasswordResetEmail(auth, email);
    };

    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            
            // Get ID token and store in cookie
            const idToken = await result.user.getIdToken();
            await api.post('/api/auth/set-token', { idToken });
            
            return { success: true };
        } catch (error) {
            return { success: false, code: error.code, error: error.message };
        }
    };

    const signInWithEmail = async (email, password) => {
        try {
            const result = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            
            // Get ID token and store in cookie
            const idToken = await result.user.getIdToken();
            await api.post('/api/auth/set-token', { idToken });
            
            return { success: true };
        } catch (error) {
            console.error("Email Sign-In Error:", error.code);
            return { success: false, code: error.code };
        }
    };

    const logout = async () => {
        try {
            await api.post("/api/auth/logout").catch((error) => {
                console.warn("Error calling logout endpoint:", error);
            });
        } catch (error) {
            console.error("Error during backend logout:", error);
        } finally {
            await signOut(auth);
        }
    };

    return { signInWithGoogle, signInWithEmail, logout, sendPasswordReset };
};
