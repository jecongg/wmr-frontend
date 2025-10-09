import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useFirebaseAuth } from '../../js/hooks/useFirebaseAuth';
import Swal from 'sweetalert2';
import { Navigate } from 'react-router-dom';

export default function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    
    // Kita hanya butuh 'user' untuk redirect, dan 'signInWithGoogle' untuk aksi
    // 'authloading' juga berguna untuk menampilkan loading awal
    const { user, signInWithGoogle, authloading } = useFirebaseAuth();

    // --- LOGIKA UTAMA ---

    // 1. Tampilkan loading screen jika status auth awal belum jelas
    if (authloading) {
        return (
            <div className='w-full h-screen flex items-center justify-center bg-gray-100'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
            </div>
        );
    }

    // 2. Jika user SUDAH login (dari onAuthStateChanged), langsung redirect
    if (user) {
        let target = '/'; // Fallback
        switch (user.role) {
            case 'admin':
                target = '/admin';
                break;
            case 'teacher':
                target = '/teacher-dashboard'; // Ganti path jika perlu
                break;
            case 'student':
                target = '/student-dashboard'; // Ganti path jika perlu
                break;
        }
        return <Navigate to={target} replace />;
    }

    // 3. Fungsi yang dipanggil saat tombol Google di-klik
    const handleGoogleLogin = async () => {
        if (isLoading) return;
        setIsLoading(true);

        const result = await signInWithGoogle();

        // Jika berhasil, tidak perlu melakukan apa-apa.
        // onAuthStateChanged akan mendeteksi perubahan dan memicu redirect dari poin #2.
        // Kita hanya perlu menangani kasus GAGAL.
        if (result && !result.success && !result.silent) { // 'silent' untuk tidak menampilkan error jika popup ditutup
            Swal.fire({
                title: result.code === 'email-not-registered' ? 'Email Belum Terdaftar' : 'Login Gagal',
                text: result.error || 'Terjadi kesalahan. Silakan coba lagi.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
        
        // Selalu set loading ke false setelah selesai
        setIsLoading(false);
    };

    // 4. Tampilan Halaman Login (jika user null dan tidak loading)
    return (
        <div className='w-full h-screen items-center justify-center flex p-10 bg-gray-300'>
            <div className='w-full max-w-[1000px] p-8 space-y-3 bg-white shadow-lg flex flex-row'>
                <div className='flex-1 px-12'>
                    {/* Anda bisa menaruh gambar di sini */}
                    <h1></h1>
                </div>
                <div className='flex-1 mx-12 py-12 pl-12'>
                    <p className='font-bold my-1 text-3xl mb-3'>Login</p>
                    <p className='text-gray-500 my-1 mb-6'>Selamat Datang! Silakan login ke akun Anda.</p>    
                    
                    {/* Form Login Email/Password (saat ini belum fungsional) */}
                    <form>
                        <div className='flex flex-col space-y-1 mb-2'>
                            <label className='text-md'>Email</label>
                            <input type="text" className='mt-1 p-2 border rounded-md text-sm' disabled/>
                        </div>
                        <div className='flex flex-col space-y-1 mb-2'>
                            <label>Password</label>
                            <input type="text" className='mt-1 p-2 border rounded-md text-sm' disabled/>
                        </div>
                        <button disabled className='w-full bg-gray-400 text-white p-2 rounded-md mt-4 cursor-not-allowed'>Login</button>
                    </form>

                    {/* Pembatas "Atau" */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Atau</span>
                            </div>
                        </div>

                        {/* Tombol Login Google */}
                        <button
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="hover:scale-101 mt-4 w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent mr-2"></div>
                                    <span className="truncate">Memproses...</span>
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
    );
}