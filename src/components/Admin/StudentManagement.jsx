import React, { useState, useEffect } from 'react';
import StudentList from './StudentList';
import StudentForm from './StudentForm';
import { 
    PlusIcon, 
    MagnifyingGlassIcon,
    FunnelIcon 
} from '@heroicons/react/24/outline';

const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterInstrument, setFilterInstrument] = useState('');
    const [filterLevel, setFilterLevel] = useState('');
    const [loading, setLoading] = useState(false);

    // Mock data - replace with actual API calls
    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        setLoading(true);
        try {
            // Mock data - replace with actual API call
            const mockStudents = [
                {
                    id: 1,
                    name: 'Amanda Sari',
                    email: 'amanda.sari@email.com',
                    phone: '08123456789',
                    parentPhone: '08234567890',
                    instrument: 'Piano',
                    level: 'Beginner',
                    age: 12,
                    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
                    status: 'active',
                    joinDate: '2023-01-15',
                    parentName: 'Budi Sari'
                },
                {
                    id: 2,
                    name: 'Kevin Tan',
                    email: 'kevin.tan@email.com',
                    phone: '08234567890',
                    parentPhone: '08345678901',
                    instrument: 'Guitar',
                    level: 'Intermediate',
                    age: 16,
                    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
                    status: 'active',
                    joinDate: '2022-09-10',
                    parentName: 'Linda Tan'
                },
                {
                    id: 3,
                    name: 'Sari Dewi',
                    email: 'sari.dewi@email.com',
                    phone: '08345678901',
                    parentPhone: '08456789012',
                    instrument: 'Violin',
                    level: 'Advanced',
                    age: 14,
                    photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b394?w=150&h=150&fit=crop&crop=face',
                    status: 'active',
                    joinDate: '2021-06-20',
                    parentName: 'Agus Dewi'
                }
            ];
            setStudents(mockStudents);
        } catch (error) {
            console.error('Error loading students:', error);
        } finally {
            setLoading(false);
        }
    };

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
                // API call to delete student
                // await deleteStudent(studentId);
                setStudents(students.filter(student => student.id !== studentId));
            } catch (error) {
                console.error('Error deleting student:', error);
                alert('Gagal menghapus murid');
            }
        }
    };

    const handleSaveStudent = async (studentData) => {
        try {
            if (editingStudent) {
                // Update existing student
                const updatedStudent = { ...studentData, id: editingStudent.id };
                setStudents(students.map(student => 
                    student.id === editingStudent.id ? updatedStudent : student
                ));
            } else {
                // Add new student
                const newStudent = { 
                    ...studentData, 
                    id: Date.now(), // Replace with proper ID from backend
                    joinDate: new Date().toISOString().split('T')[0],
                    status: 'active'
                };
                setStudents([...students, newStudent]);
            }
            setShowForm(false);
            setEditingStudent(null);
        } catch (error) {
            console.error('Error saving student:', error);
            alert('Gagal menyimpan data murid');
        }
    };

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            student.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesInstrument = !filterInstrument || student.instrument === filterInstrument;
        const matchesLevel = !filterLevel || student.level === filterLevel;
        return matchesSearch && matchesInstrument && matchesLevel;
    });

    const instruments = ['Piano', 'Guitar', 'Violin', 'Drums', 'Vocal', 'Bass'];
    const levels = ['Beginner', 'Intermediate', 'Advanced'];

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
            {/* Header */}
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

            {/* Search and Filter */}
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
                <div className="flex gap-3">
                    <select
                        value={filterInstrument}
                        onChange={(e) => setFilterInstrument(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                    >
                        <option value="">Semua Instrumen</option>
                        {instruments.map(instrument => (
                            <option key={instrument} value={instrument}>{instrument}</option>
                        ))}
                    </select>
                    <select
                        value={filterLevel}
                        onChange={(e) => setFilterLevel(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                    >
                        <option value="">Semua Level</option>
                        {levels.map(level => (
                            <option key={level} value={level}>{level}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-green-600">{students.length}</div>
                    <div className="text-sm text-gray-600">Total Murid</div>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-blue-600">
                        {students.filter(s => s.status === 'active').length}
                    </div>
                    <div className="text-sm text-gray-600">Murid Aktif</div>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-yellow-600">
                        {students.filter(s => s.level === 'Beginner').length}
                    </div>
                    <div className="text-sm text-gray-600">Pemula</div>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-purple-600">
                        {Math.round(students.reduce((acc, s) => acc + s.age, 0) / students.length) || 0}
                    </div>
                    <div className="text-sm text-gray-600">Rata-rata Umur</div>
                </div>
            </div>

            {/* Student List */}
            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
            ) : (
                <StudentList
                    students={filteredStudents}
                    onEdit={handleEditStudent}
                    onDelete={handleDeleteStudent}
                />
            )}
        </div>
    );
};

export default StudentManagement;