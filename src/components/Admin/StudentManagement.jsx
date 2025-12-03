import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import StudentList from './StudentList';
import StudentForm from './StudentForm';
import { 
    PlusIcon, 
    MagnifyingGlassIcon,
    FunnelIcon, 
    LockClosedIcon
} from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';
import api from '../../js/services/api';
import { 
    selectAllStudents, 
    selectStudentsStatus,
    addStudent,
    updateStudent,
    updateStudentPhoto,
    removeStudent,
    fetchStudents
} from '../../redux/slices/studentSlice';
import { DataGrid } from '@mui/x-data-grid';
import { PencilIcon, TrashIcon } from 'lucide-react';

const StudentManagement = () => {
    const dispatch = useDispatch();
    
    const students = useSelector(selectAllStudents);
    const studentsStatus = useSelector(selectStudentsStatus);
    const loading = studentsStatus === 'loading';

    const [showForm, setShowForm] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterLevel, setFilterLevel] = useState('');
    const [selectedId, setSelectedId] = useState(null);

    const handleAddStudent = () => {
        setEditingStudent(null);
        setShowForm(true);
    };

    const handleEditStudent = (student) => {
        setSelectedId(student.id);
        setEditingStudent(student);
        setShowForm(true);
        
    };

    const handleDeleteStudent = async (studentId) => {
        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: "Data murid yang dihapus tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/api/admin/students/${studentId}`);
                dispatch(removeStudent(studentId));
                Swal.fire('Dihapus!', 'Data murid telah berhasil dihapus.', 'success');
            } catch (error) {
                console.error('Error deleting student:', error);
                Swal.fire('Gagal', 'Terjadi kesalahan saat menghapus data murid.', 'error');
            }
        }
    };

    const handleToggleStatus = async (student) => {
        const newStatus = student.status === 'active' ? 'inactive' : 'active';
        const actionText = newStatus === 'inactive' ? 'nonaktifkan' : 'aktifkan';
        
        const result = await Swal.fire({
            title: `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Murid?`,
            text: `Apakah Anda yakin ingin ${actionText} ${student.name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: newStatus === 'inactive' ? '#d33' : '#3085d6',
            cancelButtonColor: '#6b7280',
            confirmButtonText: `Ya, ${actionText}!`,
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            try {
                await api.put(`/api/admin/students/${student.id}`, { 
                    ...student,
                    status: newStatus 
                });
                dispatch(updateStudent({ ...student, status: newStatus }));
                Swal.fire(
                    'Berhasil!', 
                    `Murid ${student.name} telah ${newStatus === 'inactive' ? 'dinonaktifkan' : 'diaktifkan'}.`, 
                    'success'
                );
            } catch (error) {
                console.error('Error toggling student status:', error);
                Swal.fire('Gagal', 'Terjadi kesalahan saat mengubah status murid.', 'error');
            }
        }
    };

    const filteredStudents = students.filter(student =>{
        if(student.deletedAt === null){
            return true;
        }
        return false;
    });

    const handleSaveStudent = async (studentData) => {
        try {
            if (editingStudent) {
                
                const studentId = selectedId || editingStudent._id || editingStudent.id;

                if (!studentId) {
                    Swal.fire('Error', 'ID Murid tidak ditemukan.', 'error');
                    return; 
                }
                
                await api.put(`/api/admin/students/${studentId}`, studentData);
                
                dispatch(updateStudent({ 
                    ...editingStudent,  
                    ...studentData,      
                    id: studentId,        
                    _id: studentId 
                }));
                
                Swal.fire({
                    title: 'Sukses',
                    text: 'Data Murid berhasil diperbarui',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });

                setShowForm(false);
                setEditingStudent(null);
                setSelectedId(null);
            } else {
                const response = await api.post('/api/admin/students', studentData);

                if (response.data.student) {
                    const newStudent = response.data.student;

                    dispatch(addStudent({
                        ...newStudent,
                        id: newStudent._id 
                    }));
                }
                
                Swal.fire({
                    title: "Success",
                    text: "Murid berhasil ditambahkan",
                    icon: "success",
                    confirmButtonText: "OK"
                });
            
                setShowForm(false);
                setEditingStudent(null);
                
                return response.data.student; 
            }
        } catch (error) {
            console.error('Error saving student:', error);
            Swal.fire({
                title: 'Error',
                text: error.response?.data?.message || 'Gagal menyimpan data murid',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            throw error; 
        }
    };

    const handlePhotoUpdate = (studentId, photoUrl) => {
        dispatch(updateStudentPhoto({ id: studentId, photo: photoUrl }));
    };

    const searchStudents = filteredStudents.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            student.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const rows = searchStudents.map((student) => ({
        id: student.id,
        name: student.name,
        photo: student.photo,
        phoneNumber: student.phone_number,
        email : student.email,
        status: student.status
    }));

    const columns = [
        { field: 'photo', headerName: "", width: 100, renderCell: (params) => (
            
            <img
                src={params.row.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(params.row.name)}&background=3b82f6&color=fff&size=200`}
                alt={params.row.name}
                className="w-10 h-10 rounded-full object-cover my-2"
            />
        )},
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'email', headerName: "Email", width: 300 },
        { field: 'phoneNumber', headerName: "Phone Number", width: 150 },
        { field: 'action', headerName: "Action", width: 200, renderCell: (params) => {
            const teacher = filteredStudents.find(t => t.id === params.row.id);
            return (
                <>
                    <button
                        onClick={() => handleEditStudent(teacher)}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm mx-1 font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                        >
                        <PencilIcon className="w-4 h-4 mr-1" />
                        Edit
                    </button>
                        <button
                        onClick={() => handleDeleteStudent(teacher.id)}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm mx-1 font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                    >
                        <TrashIcon className="w-4 h-4 mr-1" />
                        Hapus
                    </button>
                </>
            );
        }},
        { field: '', headerName: "", width: 100, renderCell: (params) => {
            const teacher = filteredStudents.find(t => t.id === params.row.id);
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
            <StudentForm
                student={editingStudent}
                onSave={handleSaveStudent}
                onPhotoUpdate={handlePhotoUpdate}
                onCancel={() => {
                    setShowForm(false);
                    setEditingStudent(null);
                }}
            />
        );
    }

    return (
        <div className="max-h-screen bg-gray-50 p-6 font-sans">
            <title>Murid | Wisma Musik Rapsodi</title>
            <div className="overflow-x-auto">

            {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen Murid</h1>
                    <p className="text-gray-600 mt-1">Kelola data murid Wisma Musik Rhapsodi</p>
                </div>
                <button
                    onClick={handleAddStudent}
                    className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Tambah Murid
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari nama atau email murid..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-green-600">{filteredStudents.length}</div>
                    <div className="text-sm text-gray-600">Total Murid</div>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-blue-600">
                        {filteredStudents.filter(s => s.status === 'active').length}
                    </div>
                    <div className="text-sm text-gray-600">Murid Aktif</div>
                </div>
            </div> */}

            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
            ) : (
                <>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Daftar Murid</h1>
                    </div>
                    <div class="mx-auto">
                        <main class="bg-white p-6 rounded-lg shadow-sm">
                            <div class="flex justify-between items-center mb-5">
                                <div class="flex items-center gap-4">
                                    <div className="flex-1 relative">
                                        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Cari nama atau email murid..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <button onClick={handleAddStudent} class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                        Add new
                                    </button>
                                </div>
                            </div>

                            <div class="overflow-x-auto ">
                                <DataGrid rows={rows} columns={columns} getRowId={(row)=>row.email}/>
                            </div>
                        </main>
                    </div>
                </>
                // <StudentList
                //     students={searchStudents}
                //     onEdit={handleEditStudent}
                //     onDelete={handleDeleteStudent}
                //     onToggleStatus={handleToggleStatus}
                // />
            )}
            </div>
        </div>
    );
};

export default StudentManagement;