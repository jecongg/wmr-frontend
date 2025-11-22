import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { useFirebaseAuth } from '../../js/hooks/useFirebaseAuth'; // Pastikan path benar

export default function ForgotPasswordPage() {
    const { register, handleSubmit } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const { sendPasswordReset } = useFirebaseAuth(); // Kita akan tambahkan fungsi ini
    const navigate = useNavigate();

    const handlePasswordReset = async (data) => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            await sendPasswordReset(data.email);

            Swal.fire({
                title: 'Terkirim!',
                text: 'Jika email Anda terdaftar, tautan untuk mereset password telah dikirim. Silakan periksa inbox (dan folder spam) Anda.',
                icon: 'success',
                confirmButtonText: 'Kembali ke Login'
            }).then((result) => {
                // Setelah pengguna menekan tombol "Kembali ke Login"...
                if (result.isConfirmed) {
                    // ...arahkan mereka ke halaman login.
                    navigate('/login');
                }
            });

        } catch (error) {
            // Tampilkan error generik untuk keamanan
            Swal.fire('Error', 'Terjadi kesalahan. Silakan coba lagi nanti.', 'error');
            console.error('Forgot password error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='relative w-full h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-800 via-indigo-900 to-blue-800'>
            <div className='relative z-10 w-full max-w-md bg-white bg-opacity-95 rounded-xl shadow-2xl p-8 sm:p-12 backdrop-blur-sm'>
                <h2 className='font-bold text-3xl mb-3 text-gray-800'>Lupa Password?</h2>
                <p className='text-gray-600 mb-6'>Jangan khawatir. Masukkan email Anda dan kami akan mengirimkan tautan untuk mereset password Anda.</p>
                
                <form onSubmit={handleSubmit(handlePasswordReset)} className="space-y-5">
                    <div className='flex flex-col space-y-2'>
                        <label htmlFor="email" className='text-lg font-medium text-gray-700'>Email</label>
                        <input
                            id="email"
                            type="email"
                            className='mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 transition duration-200'
                            {...register("email", { required: true })}
                            placeholder="emailanda@contoh.com"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={isLoading}
                        className='w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3 rounded-lg mt-4 text-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition duration-300 disabled:opacity-60 flex items-center justify-center'
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                <span>Mengirim...</span>
                            </>
                        ) : (
                            'Kirim Tautan Reset'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link to="/login" className="text-sm text-purple-600 hover:text-purple-800 transition duration-200">
                        &larr; Kembali ke halaman Login
                    </Link>
                </div>
            </div>
        </div>
    );
}