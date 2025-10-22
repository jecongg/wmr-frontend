import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from '../../js/services/api'; // Pastikan Anda punya file konfigurasi axios
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

    // Efek ini akan berjalan saat komponen pertama kali dimuat
    useEffect(() => {
        loadTeachers();
    }, []);

    // --- FUNGSI API ---

    const loadTeachers = async () => {
        setLoading(true);
        try {
            // Ganti mock data dengan panggilan API sesungguhnya
            const response = await api.get('/api/teachers'); // Asumsi endpoint ini ada
            setTeachers(response.data);
        } catch (error) {
            console.error('Error loading teachers:', error);
            Swal.fire('Error', 'Gagal memuat data guru dari server.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleInviteTeacher = async (teacherData) => {
        try {
            // Panggil API untuk mengundang guru
            const response = await api.post('/api/admin/invite-teacher', teacherData);
            Swal.fire('Berhasil!', response.data.message, 'success');
            loadTeachers(); // Muat ulang data untuk menampilkan guru yang baru diundang
        } catch (error) {
            console.error('Error inviting teacher:', error);
            const errorMessage = error.response?.data?.message || 'Gagal mengirim undangan.';
            Swal.fire('Gagal', errorMessage, 'error');
        }
    };

    const handleUpdateTeacher = async (teacherData) => {
        if (!editingTeacher) return;
        try {
            // Panggil API untuk update guru
            const response = await api.put(`/api/teachers/${editingTeacher.id}`, teacherData);
            Swal.fire('Berhasil!', 'Data guru telah diperbarui.', 'success');
            
            // Tutup form dan muat ulang data
            setShowForm(false);
            setEditingTeacher(null);
            loadTeachers();
        } catch (error) {
            console.error('Error updating teacher:', error);
            const errorMessage = error.response?.data?.message || 'Gagal memperbarui data guru.';
            Swal.fire('Gagal', errorMessage, 'error');
        }
    };

    const handleDeleteTeacher = async (teacherId) => {
        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: "Data guru yang dihapus tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            try {
                // Panggil API untuk menghapus guru
                await api.delete(`/api/teachers/${teacherId}`);
                Swal.fire('Dihapus!', 'Data guru telah berhasil dihapus.', 'success');
                loadTeachers(); // Muat ulang data setelah menghapus
            } catch (error) {
                console.error('Error deleting teacher:', error);
                Swal.fire('Gagal', 'Terjadi kesalahan saat menghapus data guru.', 'error');
            }
        }
    };

    // --- HANDLER UNTUK UI ---
    
    const handleOpenInviteForm = () => {
        Swal.fire({
            title: 'Undang Guru Baru',
            html: `
                <input id="swal-input-name" class="swal2-input" placeholder="Nama Lengkap">
                <input id="swal-input-email" class="swal2-input" placeholder="Alamat Email">
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Kirim Undangan',
            cancelButtonText: 'Batal',
            preConfirm: () => {
                const name = document.getElementById('swal-input-name').value;
                const email = document.getElementById('swal-input-email').value;
                if (!name || !email) {
                    Swal.showValidationMessage(`Nama dan Email wajib diisi`);
                    return false;
                }
                return { name, email };
            }
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                handleInviteTeacher(result.value);
            }
        });
    };

    const handleEditTeacher = (teacher) => {
        setEditingTeacher(teacher);
        setShowForm(true);
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingTeacher(null);
    };

    // --- LOGIKA FILTER ---

    const filteredTeachers = teachers.filter(teacher => {
        const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesInstrument = !filterInstrument || teacher.instrument === filterInstrument;
        return matchesSearch && matchesInstrument;
    });

    const instruments = ['Piano', 'Guitar', 'Violin', 'Drums', 'Vocal', 'Bass'];

    // --- RENDER ---

    if (showForm) {
        return (
            <TeacherForm
                teacher={editingTeacher}
                onSave={handleUpdateTeacher} // Form hanya untuk update
                onCancel={handleCancelForm}
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