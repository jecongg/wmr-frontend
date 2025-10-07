import React, { useState, useEffect } from 'react';
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

    // Mock data - replace with actual API calls
    useEffect(() => {
        loadTeachers();
    }, []);

    const loadTeachers = async () => {
        setLoading(true);
        try {
            // Mock data - replace with actual API call
            const mockTeachers = [
                {
                    id: 1,
                    name: 'Sarah Johnson',
                    email: 'sarah.johnson@email.com',
                    phone: '08123456789',
                    instrument: 'Piano',
                    experience: '5 tahun',
                    photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b394?w=150&h=150&fit=crop&crop=face',
                    status: 'active',
                    joinDate: '2023-01-15'
                },
                {
                    id: 2,
                    name: 'Michael Chen',
                    email: 'michael.chen@email.com',
                    phone: '08234567890',
                    instrument: 'Guitar',
                    experience: '8 tahun',
                    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
                    status: 'active',
                    joinDate: '2022-09-10'
                },
                {
                    id: 3,
                    name: 'Emily Rodriguez',
                    email: 'emily.rodriguez@email.com',
                    phone: '08345678901',
                    instrument: 'Violin',
                    experience: '12 tahun',
                    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
                    status: 'active',
                    joinDate: '2021-06-20'
                }
            ];
            setTeachers(mockTeachers);
        } catch (error) {
            console.error('Error loading teachers:', error);
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

    const handleDeleteTeacher = async (teacherId) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus guru ini?')) {
            try {
                // API call to delete teacher
                // await deleteTeacher(teacherId);
                setTeachers(teachers.filter(teacher => teacher.id !== teacherId));
            } catch (error) {
                console.error('Error deleting teacher:', error);
                alert('Gagal menghapus guru');
            }
        }
    };

    const handleSaveTeacher = async (teacherData) => {
        try {
            if (editingTeacher) {
                // Update existing teacher
                const updatedTeacher = { ...teacherData, id: editingTeacher.id };
                setTeachers(teachers.map(teacher => 
                    teacher.id === editingTeacher.id ? updatedTeacher : teacher
                ));
            } else {
                // Add new teacher
                const newTeacher = { 
                    ...teacherData, 
                    id: Date.now(), // Replace with proper ID from backend
                    joinDate: new Date().toISOString().split('T')[0],
                    status: 'active'
                };
                setTeachers([...teachers, newTeacher]);
            }
            setShowForm(false);
            setEditingTeacher(null);
        } catch (error) {
            console.error('Error saving teacher:', error);
            alert('Gagal menyimpan data guru');
        }
    };

    const filteredTeachers = teachers.filter(teacher => {
        const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesInstrument = !filterInstrument || teacher.instrument === filterInstrument;
        return matchesSearch && matchesInstrument;
    });

    const instruments = ['Piano', 'Guitar', 'Violin', 'Drums', 'Vocal', 'Bass'];

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