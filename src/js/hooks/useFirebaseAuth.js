import { useState, useEffect } from 'react';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signOut, 
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    sendSignInLinkToEmail,
    signInWithEmailLink,
    isSignInWithEmailLink,
    fetchSignInMethodsForEmail
} from 'firebase/auth';
import { auth } from '../../../firebase';
import { db } from "../../../firebase";
import { doc, getDoc, collection, query, where, setDoc, deleteDoc, getDocs, updateDoc } from "firebase/firestore";

export const useFirebaseAuth = () => {
    const [user, setUser] = useState(null);
    const [authloading, setLoading] = useState(true);
    const [redirectTarget, setRedirectTarget] = useState(null);

    useEffect(() => {
        if (isSignInWithEmailLink(auth, window.location.href)) {
            console.log('Email link sign-in detected');
            handleEmailLinkSignIn();
        }

        getRedirectResult(auth)
            .then((result) => {
                if (result) {
                    // Redirect sign-in completed
                }
            })
            .catch((error) => {
                console.error('Redirect result error:', error);
            });

        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    roles: firebaseUser.roles || [],
                    photoURL: firebaseUser.photoURL
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInWithEmail = async (email, password) => {
        try {
            setLoading(true);
            
            const result = await signInWithEmailAndPassword(auth, email, password);
            const user = result.user;
            
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);
            
            if (!userDocSnap.exists()) {
                const usersRef = collection(db, "users");
                const q = query(usersRef, where("email", "==", user.email));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const userDocId = querySnapshot.docs[0].id;
                    const originalData = querySnapshot.docs[0].data();
                    
                    if (originalData.active === false) {
                        await signOut(auth);
                        return { 
                            success: false, 
                            error: 'Akun Anda telah dinonaktifkan oleh administrator. Silakan hubungi administrator untuk mengaktifkan kembali akun Anda.' 
                        };
                    }
                    
                    localStorage.setItem("userDocId", userDocId);
                
                    await setDoc(userDocRef, {
                        email: user.email,
                    });

                    const deletePromises = querySnapshot.docs.map((docSnap) =>
                        deleteDoc(doc(db, "users", docSnap.id))
                    );
                    await Promise.all(deletePromises);
                    
                } else {
                    console.log('No existing user document found, creating new one');
                    
                    await setDoc(userDocRef, {
                        uid: user.uid, 
                        email: user.email,
                        displayName: user.displayName || '',
                        photoURL: user.photoURL || '',
                        createdAt: new Date().toISOString(),
                        active: true 
                    });
                }
            } else {
                const userData = userDocSnap.data();
                
                if (userData.active === false) {
                    await signOut(auth);
                    return { 
                        success: false, 
                        error: 'Akun Anda telah dinonaktifkan oleh administrator. Silakan hubungi administrator untuk mengaktifkan kembali akun Anda.' 
                    };
                }
            }
            
            return { success: true, user: result.user };
        } catch (error) {
            console.error('❌ Email sign-in error:', error);
            
            let errorMessage = 'Login gagal';
            
            switch (error.code) {
                case 'auth/invalid-credential':
                    errorMessage = 'Email atau password salah. Silakan periksa kembali.';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'Email belum terdaftar oleh administrator. Silakan hubungi administrator.';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Password salah. Silakan periksa kembali.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Format email tidak valid.';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'Akun ini telah dinonaktifkan oleh administrator.';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Terlalu banyak percobaan. Silakan coba lagi dalam beberapa menit.';
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage = 'Metode login dengan email/password tidak diizinkan.';
                    break;
                default:
                    errorMessage = error.message || 'Login gagal';
            }
            
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const createUserWithEmail = async (email, password = 'firebase123') => {
        try {
            setLoading(true);
            const result = await createUserWithEmailAndPassword(auth, email, password);
            return { success: true, user: result.user };
        } catch (error) {
            let errorMessage = 'Gagal membuat akun';
            
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'Email sudah terdaftar. Akun dengan email ini sudah ada.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Format email tidak valid.';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Password terlalu lemah. Gunakan password yang lebih kuat.';
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage = 'Operasi pembuatan akun tidak diizinkan.';
                    break;
                default:
                    errorMessage = error.message || 'Gagal membuat akun';
            }
            
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    

    const signInWithGoogle = async () => {
        try {
            setLoading(true);

            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({ 
                prompt: "select_account",
                hd: "gmail.com" 
            });
            
            provider.addScope('email');
            provider.addScope('profile');

            console.log('🚀 Opening Google sign-in popup...');
            
            let result;
            try {
                result = await signInWithPopup(auth, provider);
            } catch (popupError) {
                if (popupError.code === 'auth/popup-blocked') {
                    console.log('🔄 Popup blocked, trying redirect method...');
                    await signInWithRedirect(auth, provider);
                    return { success: true, message: 'Redirecting to Google...' };
                }
                throw popupError;
            }
            const userEmail = result.user.email;
            const userUid = result.user.uid;

            const usersQuery = query(collection(db, 'users'), where('email', '==', userEmail));
            const querySnapshot = await getDocs(usersQuery);

            if (querySnapshot.empty) {
                return { 
                    success: false, 
                    error: 'Email belum terdaftar oleh administrator. Silakan hubungi administrator untuk mendaftarkan email Anda terlebih dahulu.',
                    code: 'email-not-registered'
                };
            }

            const userDocSnapshot = querySnapshot.docs[0];
            const userData = userDocSnapshot.data();
            
            if (userData.active === false) {
                // await signOut(auth);
                return { 
                    success: false, 
                    error: 'Akun Anda telah dinonaktifkan oleh administrator. Silakan hubungi administrator untuk mengaktifkan kembali akun Anda.',
                    code: 'account_inactive'
                };
            }

            const deletePromise = deleteDoc(doc(db, 'users', userDocSnapshot.id));
            const setPromise = setDoc(doc(db, 'users', userUid), userData);

            await Promise.all([deletePromise, setPromise]);

            const authData = {
                uid: userUid,
                email: userEmail,
            };

            router.post('/firebase-auth', authData, {
                onSuccess: () => {
                    // Backend auth successful, redirect to dashboard
                    router.visit('/dashboard');
                },
                onError: (errors) => {
                    console.error('❌ Backend auth error:', errors);
                    return { success: false, error: 'Gagal melakukan autentikasi dengan server' };
                }
            });

            return { success: true, user: result.user };

    } catch (error) {
        console.error('❌ Google sign-in error:', error);
        
        let errorMessage = 'Login Google gagal';
        switch (error.code) {
            case 'auth/popup-closed-by-user':
                errorMessage = 'Login dibatalkan oleh pengguna.';
                break;
            case 'auth/popup-blocked':
                errorMessage = 'Popup diblokir oleh browser. Silakan izinkan popup untuk situs ini.';
                break;
            case 'auth/cancelled-popup-request':
                errorMessage = 'Popup login dibatalkan.';
                break;
            case 'auth/network-request-failed':
                errorMessage = 'Gagal terhubung ke internet. Periksa koneksi Anda.';
                break;
            default:
                errorMessage = error.message || 'Login Google gagal';
        }
        
        return { 
            success: false, 
            error: errorMessage, 
            code: error.code
        };
    } finally {
        setLoading(false);
    }
};

    const actionCodeSettings = {
        url: window.location.origin + '/login',
        handleCodeInApp: true,
        iOS: {
            bundleId: 'com.gms.faq'
        },
        android: {
            packageName: 'com.gms.faq',
            installApp: true,
            minimumVersion: '12'
        }
    };

    const checkEmailExists = async (email) => {
        try {
            console.log('🔗 Checking if email exists in Firestore:', email);
            
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);
            
            const emailExists = !querySnapshot.empty;
            
            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    console.log('🔗 Found document:', doc.id, doc.data());
                });
            }
            
            return emailExists;
        } catch (error) {
            console.error('🔗 Error checking email in Firestore:', error);
            
            if (error.code === 'auth/invalid-email') {
                return false; // Invalid email format
            }
            
            return false;
        }
    };

    const sendSignInLink = async (email) => {
        try {
            setLoading(true);

            const emailExists = await checkEmailExists(email);
            
            if (!emailExists) {
                console.log('🔗 Email not found, returning error');
                return { 
                    success: false, 
                    error: 'Email belum terdaftar oleh administrator. Silakan hubungi administrator untuk mendaftarkan email Anda terlebih dahulu.' 
                };
            }

            console.log('🔗 Email found, sending sign-in link');
            await sendSignInLinkToEmail(auth, email, actionCodeSettings);

            localStorage.setItem('emailForSignIn', email);
            console.log('🔗 Sign-in link sent successfully');
            return { success: true, message: 'Link login telah dikirim ke email Anda' };
        } catch (error) {
            let errorMessage = 'Gagal mengirim link login';
            
            switch (error.code) {
                case 'auth/invalid-email':
                    errorMessage = 'Format email tidak valid. Silakan periksa email Anda.';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'Email belum terdaftar.';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'Akun ini telah dinonaktifkan oleh administrator. Silakan hubungi administrator.';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Terlalu banyak percobaan. Silakan coba lagi dalam beberapa menit.';
                    break;
                case 'auth/quota-exceeded':
                    errorMessage = 'Kuota email terlampaui. Silakan coba lagi nanti.';
                    break;
                case 'auth/unauthorized-domain':
                    errorMessage = 'Domain email tidak diizinkan oleh administrator.';
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage = 'Metode login dengan email tidak diizinkan. Silakan hubungi administrator.';
                    break;
                default:
                    if (error.message && error.message.toLowerCase().includes('user not found')) {
                        errorMessage = 'Email belum terdaftar oleh administrator.';
                    } else {
                        errorMessage = error.message || 'Gagal mengirim link login';
                    }
            }
            
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const handleEmailLinkSignIn = async () => {

        const isEmailLinkTab = window.location.search.includes('mode=signIn') || 
                              window.location.search.includes('oobCode=');
        
        if (isEmailLinkTab) {
            sessionStorage.setItem('isEmailLinkTab', 'true');
            sessionStorage.setItem('emailLinkTimestamp', Date.now().toString());

            try {
                localStorage.setItem('emailLinkActive', Date.now().toString());
                
                if (window.opener && !window.opener.closed) {
                    window.opener.close();
                }
            } catch (error) {
                console.log('⚠️ Could not close opener tab:', error);
            }
        }

        try {
            setLoading(true);
            let email = localStorage.getItem('emailForSignIn');
            
            if (!email) {
                email = window.prompt('Please provide your email for confirmation');
            }

            if (email) {
                const result = await signInWithEmailLink(auth, email, window.location.href);
                const user = result.user;
                
                const uid = user.uid;
                console.log('🔗 Email link sign-in successful for UID:', uid);
                const userDocRef = doc(db, "users", uid);
                const userDocSnap = await getDoc(userDocRef);
                
                if (!userDocSnap.exists()) {
                    console.log('🔗 User document with UID not found, checking for email-based document');
                    
                    const usersRef = collection(db, "users");
                    const q = query(usersRef, where("email", "==", user.email));
                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                        console.log('🔗 Found email-based document, migrating to UID-based');
                        
                        const originalData = querySnapshot.docs[0].data();
                        
                        if (originalData.active === false) {
                            console.log('User account is inactive, preventing login');
                            await signOut(auth);
                            localStorage.removeItem('emailForSignIn');
                            return { 
                                success: false, 
                                error: 'Akun Anda telah dinonaktifkan oleh administrator. Silakan hubungi administrator untuk mengaktifkan kembali akun Anda.' 
                            };
                        }
                        
                        const userData = {
                            uid: uid,
                            email: user.email,
                            displayName: user.displayName || originalData.displayName || '',
                            photoURL: user.photoURL || originalData.photoURL || '',
                            lastLogin: new Date().toISOString(),
                            createdAt: originalData.createdAt || new Date().toISOString(),
                            ...originalData 
                        };

                        await setDoc(userDocRef, userData);

                        const deletePromises = querySnapshot.docs.map((docSnap) =>
                            deleteDoc(doc(db, "users", docSnap.id))
                        );
                        await Promise.all(deletePromises);
                        
                        console.log("🔗 Dokumen berhasil di-migrate dengan ID:", uid);
                    } else {
                        await signOut(auth);
                        localStorage.removeItem('emailForSignIn');
                        return { 
                            success: false, 
                            error: 'Email Anda belum terdaftar oleh administrator.' 
                        };
                    }
                } else {
                    const existingData = userDocSnap.data();
                    
                    if (existingData.active === false) {
                        console.log('User account is inactive, preventing login');
                        await signOut(auth);
                        localStorage.removeItem('emailForSignIn');
                        return { 
                            success: false, 
                            error: 'Akun Anda telah dinonaktifkan oleh administrator. Silakan hubungi administrator untuk mengaktifkan kembali akun Anda.' 
                        };
                    }

                    const updateData = {
                        uid: uid,
                        displayName: user.displayName || existingData.displayName || '',
                        photoURL: user.photoURL || existingData.photoURL || '',
                        lastLogin: new Date().toISOString()
                    };
                    
                    await setDoc(userDocRef, updateData, { merge: true });
                    
                    console.log("🔗 Dokumen berhasil diupdate dengan ID:", uid);
                }
                
                const updatedUserDocSnap = await getDoc(userDocRef);
                const finalUserData = updatedUserDocSnap.data();
                
                const userData = {
                    uid: user.uid,
                    email: user.email,
                    name: user.displayName || finalUserData?.displayName || user.email.split('@')[0],
                    photo_url: user.photoURL
                };
                router.post('/firebase-auth', userData, {
                    onSuccess: () => {
                        console.log('✅ Backend auth successful, redirecting to dashboard');
                        
                        // Clean up email link indicators
                        localStorage.removeItem('emailLinkActive');
                        sessionStorage.removeItem('isEmailLinkTab');
                        sessionStorage.removeItem('emailLinkTimestamp');
                        
                        setTimeout(() => {
                            // Use replace instead of visit to replace current tab history
                            if (isEmailLinkTab) {
                                console.log('🔄 Replacing email link tab with dashboard');
                                router.visit('/dashboard', { replace: true });
                            } else {
                                router.visit('/dashboard');
                            }
                        }, 1000);
                    },
                    onError: (errors) => {
                        console.error('❌ Backend auth error:', errors);
                        return { success: false, error: 'Gagal melakukan autentikasi dengan server' };
                    }
                });
                
                localStorage.removeItem('emailForSignIn');
                return { success: true, user: user };
            } else {
                return { success: false, error: 'Email required for sign-in' };
            }
        } catch (error) {
            localStorage.removeItem('emailForSignIn');
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);

            await signOut(auth);
            
            
            router.post('/firebase-logout', {}, {
                onSuccess: () => {
                    console.log('✅ Laravel logout completed');
                    setTimeout(() => {
                        console.log('🔄 Redirecting to login page...');
                        setLoading(false);
                        router.visit('/login', { replace: true });
                    }, 1000);
                },
                onError: (error) => {
                    console.error('❌ Laravel logout error:', error);
                    setTimeout(() => {
                        console.log('🔄 Error case - Redirecting to login...');
                        setLoading(false);
                        router.visit('/login', { replace: true });
                    }, 500);
                }
            });
            
        } catch (error) {
            console.error('❌ Firebase logout error:', error);
            setTimeout(() => {
                console.log('🔄 Firebase error case - Redirecting to login...');
                setLoading(false);
                router.visit('/login', { replace: true });
            }, 500);
        }
    };

    return {
        user,
        authloading,
        signInWithEmail,
        createUserWithEmail,
        signInWithGoogle,
        sendSignInLink,
        handleEmailLinkSignIn,
        checkEmailExists,
        logout
    };
};
