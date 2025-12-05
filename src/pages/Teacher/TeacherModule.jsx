import React, { useState, useEffect } from 'react';
import api from '../../js/services/api';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';

const TeacherModules = () => {
    const [modules, setModules] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('link'); // 'link', 'file', 'video'
    const [link, setLink] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchModules();
    }, []);

    const fetchModules = async () => {
        const response = await api.get('/api/modules');
        setModules(response.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('type', type);
        if (type === 'file') {
            formData.append('file', file);
        } else {
            formData.append('link', link);
        }

        try {
            await api.post('/api/modules/teacher/create', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: 'Modul berhasil diunggah.',
            })
            fetchModules(); 
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: 'Terjadi kesalahan saat mengunggah modul.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-bold mb-4">Unggah Modul Baru</h2>
                 <button type="submit" disabled={loading} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
                    {loading ? 'Mengunggah...' : 'Unggah Modul'}
                </button>
            </form>

            <div>
                 <h2 className="text-xl font-bold mb-4">Daftar Modul Anda</h2>
            </div>
        </div>
    );
};

export default TeacherModules;