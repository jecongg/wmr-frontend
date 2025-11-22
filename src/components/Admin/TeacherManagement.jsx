import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import api from '../../js/services/api';
import TeacherList from './TeacherList';
import TeacherForm from './TeacherForm';
import { 
    PlusIcon, 
    MagnifyingGlassIcon,
    FunnelIcon, 
    LockClosedIcon
} from '@heroicons/react/24/outline';
import { 
    selectAllTeachers, 
    selectTeachersStatus,
    addTeacher,
    updateTeacher,
    removeTeacher,
    fetchTeachers
} from '../../redux/slices/teacherSlice';
import { DataGrid } from '@mui/x-data-grid';
import { PencilIcon, TrashIcon } from 'lucide-react';

const TeacherManagement = () => {
    const dispatch = useDispatch();
    
    const teachers = useSelector(selectAllTeachers);
    const teachersStatus = useSelector(selectTeachersStatus);
    const loading = teachersStatus === 'loading';

    const [showForm, setShowForm] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterInstrument, setFilterInstrument] = useState('');

    if (teachers.length === 0) {
        return (
            <div className="text-center py-12">
                <MusicalNoteIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada guru ditemukan</h3>
                <p className="text-gray-600">Tambahkan guru baru atau coba ubah filter pencarian.</p>
            </div>
        );
    }
        

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
        loadTeachers();
    };

    const handleSaveTeacher = async (teacherData) => {
        try {
            let savedTeacher;
            if (editingTeacher) {
                const response = await api.put(`/api/admin/teachers/${editingTeacher.id}`, teacherData);
                dispatch(updateTeacher({ ...teacherData, id: editingTeacher.id }));
                savedTeacher = { ...teacherData, id: editingTeacher.id };
            } else {
                const response = await api.post('/api/admin/teachers', teacherData);
                if (response.data.teacher) {
                    dispatch(addTeacher(response.data.teacher));
                    savedTeacher = response.data.teacher;
                }
            }
            return savedTeacher; 
        } catch (error) {
            console.error('Error saving teacher:', error);
            const errorMessage = error.response?.data?.message || 'Gagal menyimpan data guru.';
            Swal.fire('Gagal', errorMessage, 'error');
            throw error;
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
                await api.delete(`/api/admin/teachers/${teacherId}`);
                dispatch(removeTeacher(teacherId));
                Swal.fire('Dihapus!', 'Data guru telah berhasil dihapus.', 'success');
            } catch (error) {
                console.error('Error deleting teacher:', error);
                Swal.fire('Gagal', 'Terjadi kesalahan saat menghapus data guru.', 'error');
            }
        }
    };

    const handleToggleStatus = async (teacher) => {
        const newStatus = teacher.status === 'active' ? 'inactive' : 'active';
        const actionText = newStatus === 'inactive' ? 'nonaktifkan' : 'aktifkan';
        
        const result = await Swal.fire({
            title: `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Guru?`,
            text: `Apakah Anda yakin ingin ${actionText} ${teacher.name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: newStatus === 'inactive' ? '#d33' : '#3085d6',
            cancelButtonColor: '#6b7280',
            confirmButtonText: `Ya, ${actionText}!`,
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            try {
                await api.put(`/api/admin/teachers/${teacher.id}`, { 
                    ...teacher,
                    status: newStatus 
                });
                dispatch(updateTeacher({ ...teacher, status: newStatus }));
                Swal.fire(
                    'Berhasil!', 
                    `Guru ${teacher.name} telah ${newStatus === 'inactive' ? 'dinonaktifkan' : 'diaktifkan'}.`, 
                    'success'
                );
            } catch (error) {
                console.error('Error toggling teacher status:', error);
                Swal.fire('Gagal', 'Terjadi kesalahan saat mengubah status guru.', 'error');
            }
        }
    };

    const filteredTeachers = teachers.filter(teacher =>
        (teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         teacher.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!filterInstrument || teacher.instrument === filterInstrument)
    );

    const rows = filteredTeachers.map((teacher) => ({
            id: teacher.id,
            name: teacher.name,
            photo: teacher.photo,
            phoneNumber: teacher.phone,
            email : teacher.email,
            status: teacher.status
        }));

        const columns = [
            { field: 'photo', headerName: "", width: 100, renderCell: (params) => (
                
                <img
                    src={params.row.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(params.row.name)}&background=3b82f6&color=fff&size=200`}
                    alt={params.row.name}
                    className="w-10 h-10 rounded-full object-cover my-2"
                />
            )},
            { field: 'name', headerName: 'Product Name', width: 200 },
            { field: 'email', headerName: "Email", width: 300 },
            { field: 'phoneNumber', headerName: "Phone Number", width: 150 },
            { field: 'action', headerName: "Action", width: 200, renderCell: (params) => {
                const teacher = teachers.find(t => t.id === params.row.id);
                return (
                    <>
                        <button
                            onClick={() => handleEditTeacher(teacher)}
                            className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm mx-1 font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                            >
                            <PencilIcon className="w-4 h-4 mr-1" />
                            Edit
                        </button>
                         <button
                            onClick={() => handleDeleteTeacher(teacher.id)}
                            className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm mx-1 font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                        >
                            <TrashIcon className="w-4 h-4 mr-1" />
                            Hapus
                        </button>
                    </>
                );
            }},
            { field: '', headerName: "", width: 100, renderCell: (params) => {
                const teacher = teachers.find(t => t.id === params.row.id);
                return (
                    <button
                        onClick={() => handleToggleStatus(teacher)}
                        className={`flex-1 inline-flex items-center justify-center px-3 py-2 text-sm mx-1 font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors ${
                            teacher.status === 'active'
                                ? 'text-orange-700 bg-orange-50 hover:bg-orange-100' : 'text-green-700 bg-green-50 hover:bg-green-100'
                        }`}
                    >
                        <LockClosedIcon className="w-4 h-4 mr-1" />
                        {teacher.status === 'active' ? 'Block' : 'Active'}
                    </button>
                );
            }},
            { field: 'status', headerName: "Status", width: 150, renderCell: (params) => {
                return (
                    <div className={`px-3 py-1 mt-4 rounded-full items-center flex flex-col justify-center text-xs font-medium ${
                        params.row.status === 'active' 
                            ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                        {params.row.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                    </div>
                )

            }},
        ];


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
        <div className="max-h-screen bg-gray-50 p-6 font-sans">
            <div className="overflow-x-auto">
                {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
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
                </div> */}

                {/* <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
                </div> */}

                {/* <div className="mb-6">
                    <div className="bg-white p-4 rounded-lg border">
                        <div className="text-2xl font-bold text-blue-600">{teachers.length}</div>
                        <div className="text-sm text-gray-600">Total Guru</div>
                    </div> */}
                    {/* <div className="bg-white p-4 rounded-lg border">
                        <div className="text-2xl font-bold text-green-600">
                            {teachers.filter(t => t.status === 'active').length}
                        </div>
                        <div className="text-sm text-gray-600">Guru Aktif</div>
                    </div>
                </div> */}

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    // <TeacherList
                    //     teachers={filteredTeachers}
                    //     onEdit={handleEditTeacher}
                    //     onDelete={handleDeleteTeacher}
                    //     onToggleStatus={handleToggleStatus}
                    //     onAdd={handleAddTeacher}
                    // />
                    <>
                        <title>Guru | Wisma Rapsodi Musik</title>     
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">Daftar Guru</h1>
                        </div>
                        <div class="mx-auto">
                            <main class="bg-white p-6 rounded-lg shadow-sm">
                                <div class="flex justify-between items-center mb-5">
                                    <div class="flex items-center gap-4">
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
                                    <div>
                                        <button onClick={handleAddTeacher} class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                            Add new
                                        </button>
                                    </div>
                                </div>

                                <div class="overflow-x-auto">
                                    <DataGrid rows={rows} columns={columns} />
                                </div>
                            </main>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TeacherManagement;