import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { selectUser, selectRedirectTarget } from '../../redux/slices/authSlice';
import { useFirebaseAuth } from '../../js/hooks/useFirebaseAuth';
import { useForm } from 'react-hook-form';

export default function LoginPage() {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const user = useSelector(selectUser);
    const redirectTarget = useSelector(selectRedirectTarget);
    const { signInWithGoogle, signInWithEmail } = useFirebaseAuth();

    useEffect(() => {
        if (user && redirectTarget) {
            Swal.fire({
                title: "Login Berhasil!",
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
                timerProgressBar: true
            }).then(() => {
                navigate(redirectTarget, { replace: true });
            });
        }
    }, [user, redirectTarget, navigate]);

    const handleEmailLogin = async (data) => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const result = await signInWithEmail(data.email, data.password);

            if (!result.success) {
                let errorMessage = 'Terjadi kesalahan. Silakan coba lagi.';
                switch (result.code) {
                    case 'auth/user-not-found':
                    case 'auth/invalid-email':
                        errorMessage = 'Email tidak terdaftar di sistem kami.';
                        break;
                    case 'auth/wrong-password':
                    case 'auth/invalid-credential':
                        errorMessage = 'Password yang Anda masukkan salah.';
                        break;
                    default:
                        errorMessage = 'Gagal login. Periksa kembali email dan password Anda.';
                }
                Swal.fire('Login Gagal', errorMessage, 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Terjadi kesalahan yang tidak terduga.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            await signInWithGoogle();
        } catch (error) {
            Swal.fire('Error', 'Terjadi kesalahan saat mencoba login.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='relative w-full h-screen flex items-center justify-center p-4 sm:p-10 overflow-hidden bg-gradient-to-br from-purple-800 via-indigo-900 to-blue-800'>
            {/* Background musical notes animation */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <span
                        key={i}
                        className="absolute text-white/10 text-5xl animate-float-notes"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDuration: `${5 + Math.random() * 10}s`,
                            animationDelay: `${Math.random() * 5}s`,
                            transform: `scale(${0.5 + Math.random() * 1.5}) rotate(${Math.random() * 360}deg)`
                        }}
                    >
                        {['♬', '♪', '♩', '♫', '𝄞'][Math.floor(Math.random() * 5)]}
                    </span>
                ))}
            </div>

            <div className='relative z-10 w-full max-w-4xl bg-white bg-opacity-90 rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden backdrop-blur-sm'>
                
                {/* ========== BAGIAN INI DIUBAH ========== */}
                {/* Left Section: Gambar Statis */}
                <div
                    className='hidden md:block md:flex-1 bg-cover bg-center'
                    style={{
                        // GANTI URL INI dengan gambar Anda sendiri (misal: dari folder assets)
                        backgroundImage: "url('https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80')"
                    }}
                >
                    {/* Konten dikosongkan, gambar di-handle oleh background CSS */}
                </div>
                {/* ======================================= */}


                {/* Right Section: Login Form */}
                <div className='flex-1 p-8 sm:p-12'>
                    <p className='font-bold text-4xl mb-3 text-gray-800'>Login</p>
                    <p className='text-gray-600 mb-6 text-lg'>Welcome Back! Please Login to your Account</p>
                    <form onSubmit={handleSubmit(handleEmailLogin)} className="space-y-5">
                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="email" className='text-lg font-medium text-gray-700'>Email</label>
                            <input
                                id="email"
                                type="email"
                                className='mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200'
                                {...register("email", { required: true })}
                            />
                        </div>
                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="password" className='text-lg font-medium text-gray-700'>Password</label>
                            <input
                                id="password"
                                type="password"
                                className='mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200'
                                {...register("password", { required: true })}
                            />
                        </div>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center'>
                                <input type="checkbox" id="rememberMe" className='h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded' />
                                <label htmlFor="rememberMe" className='ml-2 text-sm text-gray-700'>Remember Me</label>
                            </div>
                            <a href="#" className="text-sm text-purple-600 hover:text-purple-800 transition duration-200">Forgot Password?</a>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className='w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3 rounded-lg mt-6 text-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition duration-300 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center'
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                    <span>Logging In...</span>
                                </>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-3 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>
                        <button
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="mt-6 w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent mr-2"></div>
                                    <span>Signing In...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    <span>Sign In With Google</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}