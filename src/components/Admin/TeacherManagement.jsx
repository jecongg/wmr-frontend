import React, { useState, useEffect } from 'react';
// PERUBAHAN: Import instance 'api' (axios) yang sudah kita buat
import api from '../../js/services/api'; 
import TeacherList from './TeacherList';
import TeacherForm from './TeacherForm';
import { 
    PlusIcon, 
    MagnifyingGlassIcon,
    FunnelIcon 
} from '@heroicons/react/24/outline';

const TeacherManagement = () => {
    const [teachers, setTeachers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterInstrument, setFilterInstrument] = useState('');
    const [loading, setLoading] = useState(false);

    // useEffect sekarang memanggil fungsi loadTeachers saat komponen pertama kali dirender
    useEffect(() => {
        loadTeachers();
    }, []);

    // PERUBAHAN: Fungsi ini sekarang mengambil data dari backend
    const loadTeachers = async () => {
        setLoading(true);
        try {
            // Menggunakan 'api' untuk melakukan GET request ke endpoint admin
            const response = await api.get('/api/admin/teachers');
            setTeachers(response.data); // Mengisi state dengan data dari server
        } catch (error) {
            console.error('Error loading teachers:', error);
            // Anda bisa menambahkan state untuk menampilkan pesan error di UI
            alert('Gagal memuat data guru dari server.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddTeacher = () => {
        setEditingTeacher(null);
        setShowForm(true);
    };

    const handleEditTeacher = (teacher) => {
        setEditingTeacher(teacher);
        setShowForm(true);
    };

    // PERUBAHAN: Fungsi ini sekarang mengirim request DELETE ke backend
    const handleDeleteTeacher = async (teacherId) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus guru ini?')) {
            try {
                // Mengirim request DELETE ke endpoint dengan ID guru
                await api.delete(`/api/admin/teachers/${teacherId}`);
                // Memuat ulang data untuk memastikan daftar selalu sinkron
                loadTeachers(); 
            } catch (error) {
                console.error('Error deleting teacher:', error);
                alert('Gagal menghapus guru');
            }
        }
    };

    // PERUBAHAN: Logika penyimpanan sekarang terbagi antara mengundang (add) dan memperbarui (edit)
    const handleSaveTeacher = async (teacherData) => {
        try {
            if (editingTeacher) {
                // Jika sedang mengedit, kirim request PUT untuk memperbarui data
                await api.put(`/api/admin/teachers/${editingTeacher.id}`, teacherData);
                alert('Data guru berhasil diperbarui!');
            } else {
                // Jika menambah, kirim request POST untuk mengundang guru baru
                // Endpoint ini sama dengan yang kita buat untuk mengirim email
                await api.post('/api/admin/teachers', teacherData);
                alert('Undangan untuk guru baru berhasil dikirim!');
            }
            setShowForm(false);
            setEditingTeacher(null);
            loadTeachers(); // Selalu muat ulang data setelah ada perubahan
        } catch (error) {
            console.error('Error saving teacher:', error);
            const errorMessage = error.response?.data?.message || 'Gagal menyimpan data guru';
            alert(`Error: ${errorMessage}`);
        }
    };

    // Logika filter tidak perlu diubah, karena bekerja di sisi client
    const filteredTeachers = teachers.filter(teacher => {
        const nameMatch = teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
        const emailMatch = teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
        const instrumentMatch = !filterInstrument || teacher.instrument === filterInstrument;
        return (nameMatch || emailMatch) && instrumentMatch;
    });

    const instruments = ['Piano', 'Guitar', 'Violin', 'Drums', 'Vocal', 'Bass', 'Flute', 'Saxophone'];

    if (showForm) {
        return (
            <TeacherForm
                teacher={editingTeacher}
                onSave={handleSaveTeacher}
                onCancel={() => {
                    setShowForm(false);
                    setEditingTeacher(null);
                }}
            />
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen Guru</h1>
                    <p className="text-gray-600 mt-1">Kelola data guru Wisma Musik Rhapsodi</p>
                </div>
                <button
                    onClick={handleAddTeacher}
                    className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Tambah Guru
                </button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari nama atau email guru..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <div className="relative">
                    <FunnelIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                        value={filterInstrument}
                        onChange={(e) => setFilterInstrument(e.target.value)}
                        className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                        <option value="">Semua Instrumen</option>
                        {instruments.map(instrument => (
                            <option key={instrument} value={instrument}>{instrument}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-blue-600">{teachers.length}</div>
                    <div className="text-sm text-gray-600">Total Guru</div>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-green-600">
                        {teachers.filter(t => t.status === 'active').length}
                    </div>
                    <div className="text-sm text-gray-600">Guru Aktif</div>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-yellow-600">
                        {new Set(teachers.map(t => t.instrument)).size}
                    </div>
                    <div className="text-sm text-gray-600">Jenis Instrumen</div>
                </div>
            </div>

            {/* Teacher List */}
            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <TeacherList
                    teachers={filteredTeachers}
                    onEdit={handleEditTeacher}
                    onDelete={handleDeleteTeacher}
                />
            )}
        </div>
    );
};

export default TeacherManagement;