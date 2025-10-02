import { useState, useEffect } from 'react';
import {useForm} from 'react-hook-form'
import { useFirebaseAuth } from '../../js/hooks/useFirebaseAuth';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const {register, handleSubmit, formState: {errors}} = useForm()
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const { user, signInWithGoogle, redirectTarget, authloading } = useFirebaseAuth();

    useEffect(() => {
        if (user && redirectTarget) {
            setIsRedirecting(true);
            console.log(user)
            const isAdmin = user.role === "admin" || redirectTarget === '/admin';
            
            Swal.fire({
                title: "Login Berhasil!",
                text: "Selamat, Login Berhasil!",
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                timerProgressBar: true
            }).then(() => {
                navigate(redirectTarget, { replace: true });
            });
        }
    }, [user, redirectTarget, navigate]);


    const handleGoogleLogin = async () => {
        if (isLoading || isRedirecting) return;
        
        setIsLoading(true);

        try {
            const result = await signInWithGoogle();
            if (result && !result.success) {
                const userCancelled = result.code === 'auth/popup-closed-by-user' || 
                                    result.code === 'auth/cancelled-popup-request';

                if (!userCancelled) {
                    let title = 'Login Gagal';
                    let text = result.error;
                    
                    if (result.code === 'email-not-registered') {
                        title = 'Email Belum Terdaftar';
                        text = 'Email Anda belum terdaftar. Silakan hubungi administrator untuk mendaftarkan email Anda.';
                    }

                    Swal.fire({
                        title: title,
                        text: text,
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            }
            
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Terjadi kesalahan yang tidak terduga. Silakan coba lagi.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className='w-full h-screen items-center justify-center flex p-10 bg-gray-300'>
            <div className='w-full max-w-[1000px] p-8 space-y-3 bg-white shadow-lg flex flex-row'>
                <div className='flex-1 px-12 '>
                    <h1></h1>
                </div>
                <div className='flex-1 mx-12 py-12 pl-12'>
                    <p className='font-bold my-1 text-3xl mb-3'>Login</p>
                    <p className='text-gradientmy-1 mb-6'>Welcome Back! Please Login to your Account</p>    
                    <form action="" onSubmit={handleSubmit()}>
                        <div className='flex flex-col space-y-1 mb-2'>
                            <label htmlFor="" className='text-md'>Email</label>
                            <input type="text" className='mt-1 p-2 border-1 text-sm rounded-md'/>
                        </div>
                        <div className='flex flex-col space-y-1 mb-2'>
                            <label htmlFor="">Password</label>
                            <input type="text" className='mt-1 p-2 text-sm border-1 rounded-md'/>
                        </div>
                        <div className='flex flex-row space-y-1 mb-2'>
                            <input type="checkbox" className='mt-2 border-1 rounded-md'/>
                            <label htmlFor="" className='pl-2'>Remember Me</label>
                        </div>
                        <button className='w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white p-2 rounded-md mt-4 hover:scale-101 duration-300' onClick={handleSubmit}>Login</button>
                    </form>
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Atau</span>
                            </div>
                        </div>

                        <button
                            onClick={handleGoogleLogin}
                            disabled={isLoading || isRedirecting}
                            className="hover:scale-101 mt-4 w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent mr-2"></div>
                                    <span className="truncate">Sedang Login...</span>
                                </>
                            ) : isRedirecting ? (
                                <>
                                    <div className="animate-pulse h-5 w-5 bg-green-500 rounded-full mr-2"></div>
                                    <span className="truncate">Mengarahkan...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    <span className="truncate">Sign In With Google</span>
                                </>
                            )}
                        </button>

                    </div>
                </div>
            </div>
        </div>
    )
}