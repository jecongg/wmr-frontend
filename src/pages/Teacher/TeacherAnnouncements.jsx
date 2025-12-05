import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import api from '../../js/services/api';

import { 
    fetchAnnouncements, 
    addAnnouncement, 
    selectAllAnnouncements, 
    selectAnnouncementsStatus, 
    deleteAnnouncement
} from '../../redux/slices/announcementSlice';
import Swal from 'sweetalert2';

const TeacherAnnouncements = () => {
    const dispatch = useDispatch();
    const announcements = useSelector(selectAllAnnouncements);
    const status = useSelector(selectAnnouncementsStatus);
    const user = useSelector(state => state.auth.user); // Untuk memfilter pengumuman

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchAnnouncements());
        }
    }, [status, dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Peringatan',
                text: 'Judul dan konten pengumuman tidak boleh kosong.',
            })
            return;
        }
        setIsLoading(true);
        try {
            const response = await api.post('/api/announcements', { title, content });
            dispatch(addAnnouncement(response.data.data));
            setTitle('');
            setContent('');
            Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: 'Pengumuman berhasil dibuat.',
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: 'Gagal membuat pengumuman: ' + (error.response?.data?.message || 'Error'),
            })
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) return;
        try {
            dispatch(deleteAnnouncement(id));
            Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: 'Pengumuman berhasil dihapus.',
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: 'Gagal menghapus pengumuman.',
            })
        }
    };

    const myAnnouncements = announcements.filter(ann => ann.createdBy?._id === user?._id);

    return (
        <div>
            {/* Form Membuat Pengumuman */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Buat Pengumuman Baru</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Judul</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            placeholder="Contoh: Jadwal Ujian Kenaikan Tingkat"
                        />
                    </div>
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">Konten</label>
                        <textarea
                            id="content"
                            rows="4"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            placeholder="Isi detail pengumuman di sini..."
                        />
                    </div>
                </div>
                <div className="text-right mt-4">
                    <button type="submit" disabled={isLoading} className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        {isLoading ? 'Memublikasikan...' : 'Publikasikan'}
                    </button>
                </div>
            </form>

            {/* Daftar Pengumuman Anda
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Pengumuman yang Telah Anda Buat</h2>
                {status === 'loading' && <p>Memuat...</p>}
                <div className="space-y-4">
                    {myAnnouncements.length > 0 ? myAnnouncements.map(ann => (
                        <div key={ann._id} className="border p-4 rounded-md bg-gray-50 flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg">{ann.title}</h3>
                                <p className="text-gray-600 whitespace-pre-wrap">{ann.content}</p>
                                <p className="text-xs text-gray-400 mt-2">
                                    Dipublikasikan pada {new Date(ann.createdAt).toLocaleString('id-ID')}
                                </p>
                            </div>
                            <button onClick={() => handleDelete(ann._id)} className="p-2 text-red-500 hover:bg-red-100 rounded-full">
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    )) : <p className="text-gray-500 text-center">Anda belum membuat pengumuman apapun.</p>}
                </div>
            </div> */}
        </div>
    );
};

export default TeacherAnnouncements;