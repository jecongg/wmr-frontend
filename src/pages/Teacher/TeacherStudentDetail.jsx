import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../js/services/api';
import Swal from 'sweetalert2';
import { 
    fetchAttendanceHistory, 
    createAttendance, 
    selectAllAttendances, 
    selectAttendanceStatus 
} from '../../redux/slices/attendanceSlice';
import { 
    fetchTeacherAssignments, 
    selectAllAssignments 
} from '../../redux/slices/assignmentSlice';
import {
    fetchStudentModules,
    createModule,
    deleteModule,
    selectAllModules,
    selectModulesStatus
} from '../../redux/slices/moduleSlice';
import { 
    ArrowLeftIcon, 
    UserCircleIcon,
    CalendarIcon,
    ClockIcon,
    PlusIcon,
    CheckCircleIcon,
    XCircleIcon,
    ExclamationCircleIcon,
    FolderIcon,
    DocumentIcon,
    LinkIcon,
    VideoCameraIcon,
    TrashIcon
} from '@heroicons/react/24/outline';

const TeacherStudentDetail = ({ studentId: propStudentId, onBackClick }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const studentId = propStudentId;
    
    const attendanceHistory = useSelector(selectAllAttendances);
    const attendanceStatus = useSelector(selectAttendanceStatus);
    
    const modules = useSelector(selectAllModules);
    const modulesStatus = useSelector(selectModulesStatus);
    
    const assignments = useSelector(selectAllAssignments);
    
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploadingModule, setUploadingModule] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showModuleForm, setShowModuleForm] = useState(false);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        startTime: '',
        endTime: '',
        status: 'present',
        materialsCovered: '',
        notes: '',
        homework: ''
    });

    const [moduleFormData, setModuleFormData] = useState({
        title: '',
        description: '',
        category: '',
        type: 'file',
        file: null,
        video: null
    });

    useEffect(() => {
        if (studentId) {
            // dispatch(fetchTeacherAssignments());
            dispatch(fetchAttendanceHistory(studentId));
            dispatch(fetchStudentModules(studentId));
        }
    }, [studentId, dispatch]);

    useEffect(() => {
        if (assignments.length > 0 && studentId) {
            const studentAssignment = assignments.find(
                a => (a.student?._id === studentId || a.student?.id === studentId)
            );
            
            if (studentAssignment) {
                setStudentData(studentAssignment);
                setLoading(false);
            } else {
                setLoading(false);
                Swal.fire('Error', 'Murid tidak ditemukan', 'error');
                if (onBackClick) {
                    onBackClick();
                } else {
                    navigate('/teacher/students');
                }
            }
        }
    }, [assignments, studentId]);

    const handleSubmitModule = async (e) => {
        e.preventDefault();
        
        if (uploadingModule) return; 
        
        try {
            setUploadingModule(true);
            
            const formData = new FormData();
            formData.append('title', moduleFormData.title);
            formData.append('description', moduleFormData.description);
            formData.append('type', moduleFormData.type);
            formData.append('student', studentId); 

            if(moduleFormData.type === 'file') {
                formData.append('file', moduleFormData.file);
            } else {
                formData.append('file', moduleFormData.video); 
            }

            const resultAction = await dispatch(createModule(formData));

            if (createModule.fulfilled.match(resultAction)) {
                Swal.fire('Sukses', 'Modul berhasil ditambahkan', 'success');
                setShowModuleForm(false);
                setModuleFormData({
                    title: '',
                    description: '',
                    category: '',
                    type: 'file',
                    file: null,
                    video: null
                });
            } else {
                Swal.fire('Error', resultAction.payload || 'Gagal menambahkan modul', 'error');
            }
        } catch (error) {
            console.error('Error submitting module:', error);
            Swal.fire('Error', 'Gagal menambahkan modul', 'error');
        } finally {
            setUploadingModule(false);
        }
    };

    const handleDeleteModule = async (moduleId) => {
        const result = await Swal.fire({
            title: 'Hapus Modul?',
            text: 'Modul yang dihapus tidak dapat dikembalikan',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            try {
                const resultAction = await dispatch(deleteModule(moduleId));
                
                if (deleteModule.fulfilled.match(resultAction)) {
                    Swal.fire('Terhapus!', 'Modul berhasil dihapus', 'success');
                } else {
                    Swal.fire('Error', resultAction.payload || 'Gagal menghapus modul', 'error');
                }
            } catch (error) {
                console.error('Error deleting module:', error);
                Swal.fire('Error', 'Gagal menghapus modul', 'error');
            }
        }
    };

    const getModuleIcon = (type) => {
        switch(type) {
            case 'file':
                return <DocumentIcon className="w-5 h-5 text-blue-500" />;
            case 'video':
                return <VideoCameraIcon className="w-5 h-5 text-red-500" />;
            default:
                return <FolderIcon className="w-5 h-5 text-gray-500" />;
        }
    };

    const handleSubmitAttendance = async (e) => {
        e.preventDefault();
        
        try {
            const payload = {
                studentId,
                ...formData
            };
            
            const resultAction = await dispatch(createAttendance(payload));
            
            if (createAttendance.fulfilled.match(resultAction)) {
                Swal.fire('Sukses', 'Laporan pertemuan berhasil disimpan', 'success');
                setShowForm(false);
                setFormData({
                    date: new Date().toISOString().split('T')[0],
                    startTime: '',
                    endTime: '',
                    status: 'present',
                    materialsCovered: '',
                    notes: '',
                    homework: ''
                });
            } else {
                Swal.fire('Error', resultAction.payload || 'Gagal menyimpan laporan', 'error');
            }
        } catch (error) {
            console.error('Error submitting attendance:', error);
            Swal.fire('Error', 'Gagal menyimpan laporan', 'error');
        }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'present':
                return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
            case 'absent':
                return <XCircleIcon className="w-5 h-5 text-red-500" />;
            case 'late':
                return <ExclamationCircleIcon className="w-5 h-5 text-yellow-500" />;
            default:
                return null;
        }
    };

    const getStatusText = (status) => {
        switch(status) {
            case 'present': return 'Hadir';
            case 'absent': return 'Tidak Hadir';
            case 'late': return 'Terlambat';
            default: return status;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">Memuat data...</p>
                </div>
            </div>
        );
    }

    if (!studentData) {
        return (
            <div className="p-6">
                <p className="text-gray-600">Data murid tidak ditemukan</p>
            </div>
        );
    }

    const student = studentData.student;
    const schedule = studentData.scheduleDay && studentData.startTime && studentData.endTime 
        ? `${studentData.scheduleDay}, ${studentData.startTime} - ${studentData.endTime}`
        : 'Belum dijadwalkan';

    return (
        <div className="px-6 max-w-7xl mx-auto">
            <title>Detail Siswa | Wisma Musik Rapsodi</title>
            <div className="mb-6">
                <button
                    onClick={() => onBackClick ? onBackClick() : navigate(-1)}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Kembali
                </button>
                {/* <div className="flex justify-between items-start">
                    <h1 className="text-3xl font-bold text-gray-900">Detail Murid</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Laporan Baru
                    </button>
                </div> */}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="flex items-start gap-6">
                    {student.photo ? (
                        <img src={student.photo} alt={student.name} className="w-14 h-14 rounded-full object-cover" />
                    ) : (
                        <UserCircleIcon className="w-14 h-14 text-slate-300" />
                    )}
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{student.name}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">Email</p>
                                <p className="font-medium text-gray-900">{student.email}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Nomor Telepon</p>
                                <p className="font-medium text-gray-900">{student.phone_number || '-'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Usia</p>
                                <p className="font-medium text-gray-900">{student.age} tahun</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Jadwal Les</p>
                                <p className="font-medium text-gray-900">{schedule}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Orang Tua</p>
                                <p className="font-medium text-gray-900">{student.parent_name || '-'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Telepon Orang Tua</p>
                                <p className="font-medium text-gray-900">{student.parent_phone || '-'}</p>
                            </div>
                        </div>
                        {studentData.notes && (
                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-sm text-yellow-800">
                                    <span className="font-semibold">Catatan: </span>
                                    {studentData.notes}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className='flex justify-end mb-4 gap-3'>
                <button
                    onClick={() => setShowModuleForm(!showModuleForm)}
                    className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                >
                    <FolderIcon className="w-5 h-5 mr-2" />
                    Tambah Modul
                </button>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Laporan Baru
                </button>
            </div>

            {/* Form Module */}
            {showModuleForm && (
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Tambah Modul Belajar</h3>
                    <form onSubmit={handleSubmitModule} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Judul Modul <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={moduleFormData.title}
                                onChange={(e) => setModuleFormData({ ...moduleFormData, title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                placeholder="Contoh: Latihan Tangga Nada C Mayor"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Deskripsi
                            </label>
                            <textarea
                                value={moduleFormData.description}
                                onChange={(e) => setModuleFormData({ ...moduleFormData, description: e.target.value })}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                placeholder="Penjelasan singkat tentang modul..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tipe Modul <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={moduleFormData.type}
                                onChange={(e) => setModuleFormData({ ...moduleFormData, type: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                required
                            >
                                <option value="file">File</option>
                                <option value="video">Video</option>
                            </select>
                        </div>

                        {moduleFormData.type === 'file' ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    File Unggahan <span className="text-red-500">*</span>
                                </label>
                                <div
                                    className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer"
                                    onClick={() => document.getElementById('file-upload').click()}
                                >
                                    <div className="space-y-1 text-center">
                                        <svg
                                            className="mx-auto h-12 w-12 text-gray-400"
                                            stroke="currentColor"
                                            fill="none"
                                            viewBox="0 0 48 48"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        {moduleFormData.file ? (
                                            <p className="text-sm text-gray-900">File Selected : <p className='text-red-500'>{ moduleFormData.file.name}</p></p>
                                        ) : (
                                            <>
                                                <div className="flex text-sm text-gray-600">
                                                    <label
                                                        htmlFor="video-upload"
                                                        className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                                                        >
                                                        <span>Silahkan upload File</span>
                                                    </label>
                                                    <p className="pl-1">atau seret dan lepas</p>
                                                </div>
                                                <p className="text-xs text-gray-500">DOCX, PDF, PPTX hingga 20MB</p>
                                            </>
                                    )   }
                                    </div>
                                    <input
                                        id='file-upload'
                                        type="file"
                                        accept='application/pdf, application/msword'
                                        className="sr-only"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                setModuleFormData({ ...moduleFormData, file: e.target.files[0] });
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Video Unggahan <span className="text-red-500">*</span>
                                </label>
                                <div
                                    className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer"
                                    onClick={() => document.getElementById('video-upload').click()}
                                >
                                    <div className="space-y-1 text-center">
                                        <svg
                                            className="mx-auto h-12 w-12 text-gray-400"
                                            stroke="currentColor"
                                            fill="none"
                                            viewBox="0 0 48 48"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <div className="flex text-sm text-gray-600">
                                            <label
                                                htmlFor="video-upload"
                                                className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                                            >
                                                <span>Silahkan upload video</span>
                                            </label>
                                            <p className="pl-1">atau seret dan lepas</p>
                                        </div>
                                        <p className="text-xs text-gray-500">MP4, MOV, AVI, WMV hingga 100MB</p>
                                    </div>
                                    <input
                                        id="video-upload"
                                        name="video-upload"
                                        type="file"
                                        className="sr-only"
                                        accept="video/*"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                console.log(e.target.files[0])
                                                setModuleFormData({ ...moduleFormData, video: e.target.files[0] });
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={uploadingModule}
                                className={`px-6 py-2 ${uploadingModule ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white font-medium rounded-lg transition-colors inline-flex items-center`}
                            >
                                {uploadingModule ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Mengupload...
                                    </>
                                ) : (
                                    'Simpan Modul'
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowModuleForm(false)}
                                disabled={uploadingModule}
                                className={`px-6 py-2 ${uploadingModule ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-300 hover:bg-gray-400'} text-gray-700 font-medium rounded-lg transition-colors`}
                            >
                                Batal
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Form Laporan */}
            {showForm && (
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Laporan Pertemuan Baru</h3>
                    <form onSubmit={handleSubmitAttendance} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tanggal <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Jam Mulai <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    value={formData.startTime}
                                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Jam Selesai <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    value={formData.endTime}
                                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status Kehadiran <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                required
                            >
                                <option value="present">Hadir</option>
                                <option value="absent">Tidak Hadir</option>
                                <option value="late">Terlambat</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Materi yang Dibahas <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={formData.materialsCovered}
                                onChange={(e) => setFormData({ ...formData, materialsCovered: e.target.value })}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                placeholder="Contoh: Tangga nada C mayor, latihan arpegio..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Catatan/Feedback <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                rows="4"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                placeholder="Progress murid, hal yang perlu diperbaiki, dll..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Pekerjaan Rumah
                            </label>
                            <textarea
                                value={formData.homework}
                                onChange={(e) => setFormData({ ...formData, homework: e.target.value })}
                                rows="2"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                placeholder="Tugas yang harus dikerjakan murid (opsional)"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                            >
                                Simpan Laporan
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium rounded-lg transition-colors"
                            >
                                Batal
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FolderIcon className="w-6 h-6 text-green-600" />
                    Modul Belajar ({modules.length})
                </h3>
                
                {modules.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <FolderIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p>Belum ada modul untuk murid ini</p>
                    </div>
                ) : (
                    <div className="gap-4">
                        {modules.length === 0 ? (
                            <div className="col-span-1 md:col-span-2 text-center py-10">
                                <p className="text-gray-600">Belum ada modul untuk murid ini</p>
                            </div>
                        ) : (
                            modules.map((module) => (
                                <div
                                    key={module._id}
                                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            {getModuleIcon(module.type)}
                                            <h4 className="font-semibold text-gray-900">{module.title}</h4>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteModule(module._id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                    
                                    {module.description && (
                                        <p className="text-sm text-gray-600 mb-2">{module.description}</p>
                                    )}
                                    
                                    <div className="mt-3">
                                        <a
                                            href={module.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-600 hover:text-blue-800 underline"
                                        >
                                            {module.type === 'file' ? 'Open File' : 'Buka Link'}
                                        </a>
                                    </div>
                                    
                                    <p className="text-xs text-gray-400 mt-2">
                                        Ditambahkan: {new Date(module.createdAt).toLocaleDateString('id-ID')}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Riwayat Pertemuan */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Riwayat Pertemuan ({attendanceHistory.length})
                </h3>
                
                {attendanceHistory.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <CalendarIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p>Belum ada riwayat pertemuan</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {attendanceHistory.map((attendance, index) => (
                            <div
                                key={index}
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                                <div className='flex flex-row justify-between'>
                                    
                                    <div className="space-y-2">
                                        <div>
                                            <p className="text-lg font-bold text-gray-700">Materi:</p>
                                            <p className="text-sm text-gray-600">{attendance.materialsCovered}</p>
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold text-gray-700">Catatan:</p>
                                            <p className="text-sm text-gray-600">{attendance.notes}</p>
                                        </div>
                                        {attendance.homework && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">PR:</p>
                                                <p className="text-sm text-gray-600">{attendance.homework}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-end justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(attendance.status)}
                                                <span className="font-semibold text-gray-900">
                                                    {getStatusText(attendance.status)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <CalendarIcon className="w-4 h-4" />
                                                {new Date(attendance.date).toLocaleDateString('id-ID', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                            <div className="flex items-center gap-1 mt-1">
                                                <ClockIcon className="w-4 h-4" />
                                                {attendance.startTime} - {attendance.endTime}
                                            </div>
                                        </div>
                                </div>

                                
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherStudentDetail;

