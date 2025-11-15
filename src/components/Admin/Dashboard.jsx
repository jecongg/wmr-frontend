import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
    UsersIcon, 
    AcademicCapIcon, 
    BookOpenIcon,
    ChartBarIcon,
    MegaphoneIcon,
    PlusIcon,
    TrashIcon
} from '@heroicons/react/24/outline';
import api from '../../js/services/api';
import { selectAllTeachers } from '../../redux/slices/teacherSlice';
import { selectAllStudents } from '../../redux/slices/studentSlice';

const Dashboard = ({ user }) => {
    const teachers = useSelector(selectAllTeachers);
    const students = useSelector(selectAllStudents);

    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newAnnouncement, setNewAnnouncement] = useState({
        title: "",
        content: ""
    });

    const [showAddForm, setShowAddForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/announcements');
            if (response.data.success) {
                setAnnouncements(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching announcements:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAnnouncement = async (e) => {
        e.preventDefault();
        if (!newAnnouncement.title.trim()) return;

        try {
            setSubmitting(true);
                const response = await api.post('/api/announcements', { 
                title: newAnnouncement.title,
                content: newAnnouncement.content,
                userId: user.id,
            });
            if (response.data.success) {
                setAnnouncements([response.data.data, ...announcements]);
                setNewAnnouncement('');
                setShowAddForm(false);
            }
        } catch (error) {
            console.error('Error creating announcement:', error);
            alert('Gagal membuat pengumuman. Silakan coba lagi.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteAnnouncement = async (id) => {
        if (!confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) return;

        try {
            const response = await api.delete(`/api/announcements/${id}`);
            if (response.data.success) {
                setAnnouncements(announcements.filter(a => a.id !== id));
            }
        } catch (error) {
            console.error('Error deleting announcement:', error);
            alert('Gagal menghapus pengumuman. Silakan coba lagi.');
        }
    };

    const formatDate = (dateString) => {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    const stats = [
        {
            name: 'Total Guru',
            value: teachers.length.toString(),
            icon: UsersIcon,
            color: 'bg-blue-500',
            changeType: 'positive'
        },
        {
            name: 'Total Murid',
            value: students.length.toString(),
            icon: AcademicCapIcon,
            color: 'bg-green-500',
            changeType: 'positive'
        },
    ];

    return (
        <>
            <title>Admin Dashboard | Wisma Musik Rapsodi</title>
            <div className="p-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Selamat Datang, {user.displayName}!
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Berikut adalah ringkasan aktivitas Wisma Musik Rhapsodi
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center">
                                    <div className={`${stat.color} p-3 rounded-lg`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h3>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <p className="text-sm text-gray-600">Guru baru "Sarah Johnson" telah didaftarkan</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <p className="text-sm text-gray-600">5 murid baru mendaftar kelas piano</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                <p className="text-sm text-gray-600">Jadwal kelas biola telah diperbarui</p>
                            </div>
                        </div>
                    </div>


                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center space-x-2">
                                <MegaphoneIcon className="w-5 h-5 text-indigo-600" />
                                <h3 className="text-lg font-semibold text-gray-900">Pengumuman</h3>
                            </div>
                            <button
                                onClick={() => setShowAddForm(!showAddForm)}
                                className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm"
                            >
                                <PlusIcon className="w-4 h-4" />
                                <span>Tambah</span>
                            </button>
                        </div>

                        {showAddForm && (
                            <form onSubmit={handleAddAnnouncement} className="mb-4">
                                <textarea
                                    value={newAnnouncement.title}
                                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                                    placeholder="Tulis Judul..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                    disabled={submitting}
                                />
                                <textarea
                                    value={newAnnouncement.content}
                                    onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value })}
                                    placeholder="Tulis pengumuman..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                    rows="3"
                                    disabled={submitting}
                                />
                                <div className="flex justify-end space-x-2 mt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowAddForm(false);
                                            setNewAnnouncement('');
                                        }}
                                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                                        disabled={submitting}
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                        disabled={submitting || !newAnnouncement.title.trim() || !newAnnouncement.content.trim()}
                                    >
                                        {submitting ? 'Menyimpan...' : 'Simpan'}
                                    </button>
                                </div>
                            </form>
                        )}

                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {loading ? (
                                <div className="text-center py-4">
                                    <p className="text-sm text-gray-500">Memuat pengumuman...</p>
                                </div>
                            ) : announcements.length === 0 ? (
                                <div className="text-center py-4">
                                    <MegaphoneIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">Belum ada pengumuman</p>
                                </div>
                            ) : (
                                announcements.map((announcement) => (
                                    <div
                                        key={announcement.id}
                                        className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition-colors"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-800 whitespace-pre-wrap">
                                                    {announcement.content}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    {formatDate(announcement.createdAt)}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteAnnouncement(announcement.id)}
                                                className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded transition-colors"
                                                title="Hapus pengumuman"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;