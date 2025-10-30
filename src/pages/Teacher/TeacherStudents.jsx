import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../js/services/api';
import { UserCircleIcon, MagnifyingGlassIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';

const BASE_URL = 'http://localhost:3000/api';


const StudentCard = ({ assignment, onClick }) => {
    const student = assignment.student;
    const schedule = assignment.scheduleDay && assignment.startTime && assignment.endTime 
        ? `${assignment.scheduleDay}, ${assignment.startTime} - ${assignment.endTime}`
        : 'Belum dijadwalkan';

    return (
        <div onClick={onClick} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
            <div className="p-5">
                <div className="flex items-center gap-4 mb-4">
                    <UserCircleIcon className="w-14 h-14 text-slate-300" />
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 truncate">{student?.name || 'N/A'}</h3>
                        <p className="text-sm text-gray-500 truncate">{student?.email || 'N/A'}</p>
                    </div>
                </div>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-500 font-medium">Usia:</span>
                        <span className="text-gray-800 font-semibold">{student?.age || 'N/A'} tahun</span>
                    </div>
                    <div className="flex justify-between items-start">
                        <span className="text-gray-500 font-medium">Jadwal Les:</span>
                        <span className="text-gray-800 font-semibold text-right">{schedule}</span>
                    </div>
                    {assignment.notes && (
                        <div className="pt-2 border-t border-gray-100">
                            <p className="text-xs text-gray-600 italic">"{assignment.notes}"</p>
                        </div>
                    )}
                </div>
            </div>
            {/* <div className="bg-gray-50 px-5 py-3">
                <button className="w-full inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                    <DocumentTextIcon className="w-5 h-5 mr-2" />
                    Lihat Laporan
                </button>
            </div> */}
        </div>
    );
    
};


const TeacherStudents = ({ onStudentClick }) => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                const response = await api.get(`${BASE_URL}/teacher/my-students`);
                
                if (response.data.success) {
                    setAssignments(response.data.data);
                }
                setLoading(false);

            } catch (error) {
                console.error("Gagal memuat data murid:", error);
                Swal.fire('Error', 'Gagal memuat data murid', 'error');
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const filteredAssignments = assignments.filter(assignment => 
        assignment.student?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAssignmentClick = (assignment) => {
        const studentId = assignment.student._id || assignment.student.id;
        if (onStudentClick) {
            onStudentClick(studentId);
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Daftar Murid Anda</h1>
                    <p className="text-gray-600 mt-1">Lihat semua murid yang terhubung dengan Anda.</p>
                </div>
                <div className="mt-4 sm:mt-0 relative">
                    <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari nama murid..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <p className="ml-3 text-gray-600">Memuat data murid...</p>
                </div>
            ) : (
                filteredAssignments.length > 0 ? (
                    <>
                        <div className="mb-4 text-lg text-gray-600">
                            Total: <span className="font-semibold">{filteredAssignments.length}</span> murid
                        </div>
                        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredAssignments.map(assignment => (
                                <StudentCard onClick={() => handleAssignmentClick(assignment)} key={assignment.assignmentId} assignment={assignment} />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                        <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                            {searchTerm ? 'Murid Tidak Ditemukan' : 'Belum Ada Murid'}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchTerm ? 'Tidak ada murid yang cocok dengan pencarian Anda.' : 'Saat ini tidak ada murid yang di-assign kepada Anda. Silakan hubungi admin.'}
                        </p>
                    </div>
                )
            )}
        </div>
    );
};

export default TeacherStudents;