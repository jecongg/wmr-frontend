import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import api from '../../js/services/api';
import TeacherList from './TeacherList';
import TeacherForm from './TeacherForm';
import { 
    PlusIcon, 
    MagnifyingGlassIcon,
    FunnelIcon 
} from '@heroicons/react/24/outline';
import { 
    selectAllTeachers, 
    selectTeachersStatus,
    addTeacher,
    updateTeacher,
    removeTeacher,
    fetchTeachers
} from '../../redux/slices/teacherSlice';

const TeacherManagement = () => {
    const dispatch = useDispatch();
    
    const teachers = useSelector(selectAllTeachers);
    const teachersStatus = useSelector(selectTeachersStatus);
    const loading = teachersStatus === 'loading';

    const [showForm, setShowForm] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterInstrument, setFilterInstrument] = useState('');

    const loadTeachers = () => {
        dispatch(fetchTeachers());
    };


    const handleAddTeacher = () => {
        setEditingTeacher(null); 
        setShowForm(true);     
    };

    const handleEditTeacher = (teacher) => {
        setEditingTeacher(teacher); 
        setShowForm(true);        
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingTeacher(null);
    };

    const handleSaveTeacher = async (teacherData) => {
        try {
            if (editingTeacher) {
                const response = await api.put(`http://localhost:3000/api/admin/teachers/${editingTeacher.id}`, teacherData);
                dispatch(updateTeacher({ ...teacherData, id: editingTeacher.id }));
                Swal.fire('Berhasil!', 'Data guru telah diperbarui.', 'success');
            } else {
                const response = await api.post('http://localhost:3000/api/admin/teachers', teacherData);
                if (response.data.teacher) {
                    dispatch(addTeacher(response.data.teacher));
                }
                Swal.fire('Berhasil!', response.data.message || 'Undangan telah berhasil dikirim.', 'success');
            }
            setShowForm(false);
            setEditingTeacher(null);
        } catch (error) {
            console.error('Error saving teacher:', error);
            const errorMessage = error.response?.data?.message || 'Gagal menyimpan data guru.';
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
                await api.delete(`http://localhost:3000/api/admin/teachers/${teacherId}`);
                dispatch(removeTeacher(teacherId));
                Swal.fire('Dihapus!', 'Data guru telah berhasil dihapus.', 'success');
            } catch (error) {
                console.error('Error deleting teacher:', error);
                Swal.fire('Gagal', 'Terjadi kesalahan saat menghapus data guru.', 'error');
            }
        }
    };

    const filteredTeachers = teachers.filter(teacher =>
        (teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         teacher.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!filterInstrument || teacher.instrument === filterInstrument)
    );


    if (showForm) {
        return (
            <TeacherForm
                teacher={editingTeacher}
                onSave={handleSaveTeacher} 
                onCancel={handleCancelForm}
            />
        );
    }

    return (
        <div className="p-6">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-blue-600">{teachers.length}</div>
                    <div className="text-sm text-gray-600">Total Guru</div>
                </div>
                {/* <div className="bg-white p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-green-600">
                        {teachers.filter(t => t.status === 'active').length}
                    </div>
                    <div className="text-sm text-gray-600">Guru Aktif</div>
                </div> */}
            </div>

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