import React, { useState, useEffect } from 'react';
import StudentList from './StudentList';
import StudentForm from './StudentForm';
import { 
    PlusIcon, 
    MagnifyingGlassIcon,
    FunnelIcon 
} from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';

const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterLevel, setFilterLevel] = useState('');
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try{
                const res = await fetch('http://localhost:3000/api/admin/list-students');
                const data = await res.json();

                setStudents(data);
            }catch(error){
                console.error('Error fetching students:', error);
            }
        }
        fetchData(); 
    }, [students, showForm]);

    // useEffect(() => {
    //     setLoading(true);
    //     try{
    //         const update = async () => {
    //             await upda
    //         }
    //     }catch(error){

    //     }
    // }, [editingStudent]);

    const handleAddStudent = () => {
        setEditingStudent(null);
        setShowForm(true);
    };

    const handleEditStudent = (student) => {
        setEditingStudent(student);
        setShowForm(true);
        
    };

    const handleDeleteStudent = async (studentId) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus murid ini?')) {
            try {
                const res = await fetch(`http://localhost:3000/api/admin/students/${studentId}`, {
                    method: 'DELETE',
                });

                if (!res.ok) {
                    throw new Error('Gagal menghapus murid');
                }
            } catch (error) {
                console.error('Error deleting student:', error);
                alert('Gagal menghapus murid');
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
                const res = await fetch(`http://localhost:3000/api/admin/students/${editingStudent.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(studentData),
                })

                if(!res.ok){
                    throw new Error('Gagal memperbarui data murid');
                }
                
                Swal.fire({
                    title: 'Sukses',
                    text: 'Data Murid berhasil diperbarui',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                
                setShowForm(false);
                setEditingStudent(null);
            } else {
                const res = await fetch('http://localhost:3000/api/admin/students', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(studentData),
                });
                if (!res.ok) {
                    Swal.fire({
                        title: 'Error',
                        text: 'Gagal menambahkan murid',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    })
                }
                Swal.fire({
                    title: "Success",
                    text: "Murid berhasil ditambahkan",
                    icon: "success",
                    confirmButtonText: "OK"
                })
                setShowForm(false);
                setEditingStudent(null);
            }
        } catch (error) {
            console.error('Error saving student:', error);
            alert('Gagal menyimpan data murid');
        }
    };

    const searchStudents = filteredStudents.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            student.email.toLowerCase().includes(searchTerm.toLowerCase());
        // const matchesInstrument = !filterInstrument || student.instrument === filterInstrument;
        // const matchesLevel = !filterLevel || student.level === filterLevel;
        return matchesSearch;
    });

    // const instruments = ['Piano', 'Guitar', 'Violin', 'Drums', 'Vocal', 'Bass'];
    // const levels = ['Beginner', 'Intermediate', 'Advanced'];

    if (showForm) {
        return (
            <StudentForm
                student={editingStudent}
                onSave={handleSaveStudent}
                onCancel={() => {
                    setShowForm(false);
                    setEditingStudent(null);
                }}
            />
        );
    }

    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
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
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
            ) : (
                <StudentList
                    students={searchStudents}
                    onEdit={handleEditStudent}
                    onDelete={handleDeleteStudent}
                />
            )}
        </div>
    );
};

export default StudentManagement;