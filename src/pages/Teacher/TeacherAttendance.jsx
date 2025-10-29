import React, { useState, useEffect } from 'react';
// 
// PERHATIAN: Sesuaikan path ini ke lokasi file 'api.js' Anda!
// Contoh: '../../utils/api', 'src/api/apiService', dll.
//
import api from '../../js/services/api';
//
import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm';
import { 
    CheckCircleIcon, 
    XCircleIcon, 
    ExclamationCircleIcon,
    CalendarIcon,
    UserIcon,
    ClockIcon
} from '@heroicons/react/24/solid';
import { UserCircleIcon } from '@heroicons/react/24/outline';

// Helper untuk format tanggal YYYY-MM-DD
const getISODate = (date) => {
    return date.toISOString().split('T')[0];
};

const TeacherAttendancePage = () => {
    const [selectedDate, setSelectedDate] = useState(getISODate(new Date()));
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // State untuk menyimpan perubahan absensi
    // Format: { scheduleId_studentId: { status, notes } }
    const [attendanceChanges, setAttendanceChanges] = useState({});

    // Fetch data jadwal saat tanggal berubah
    useEffect(() => {
        const fetchSchedule = async () => {
            setLoading(true);
            try {
                // Asumsi API Anda sudah di-setup untuk menangani '/api/...'
                const response = await api.get(`/api/attendance/teacher/schedule?date=${selectedDate}`);
                setSchedules(response.data);
                
                // Reset perubahan & isi state 'attendanceChanges' dengan data yg sudah ada
                const initialChanges = {};
                response.data.forEach(schedule => {
                    schedule.students.forEach(student => {
                        if (student.status) { // Jika sudah ada data absensi
                            initialChanges[`${schedule.scheduleId}_${student._id}`] = {
                                status: student.status,
                                notes: student.notes || ''
                            };
                        }
                    });
                });
                setAttendanceChanges(initialChanges);

            } catch (error) {
                console.error('Error fetching schedule:', error);
                Swal.fire('Error', 'Gagal memuat jadwal.', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();
    }, [selectedDate]);

    // Handler saat status absensi diubah (tombol diklik)
    const handleStatusChange = (scheduleId, studentId, status) => {
        const key = `${scheduleId}_${studentId}`;
        setAttendanceChanges(prev => ({
            ...prev,
            [key]: {
                ...prev[key], // Pertahankan notes jika ada
                status: status
            }
        }));
    };

    // Handler saat catatan absensi diubah
    const handleNotesChange = (scheduleId, studentId, notes) => {
        const key = `${scheduleId}_${studentId}`;
        setAttendanceChanges(prev => ({
            ...prev,
            [key]: {
                ...prev[key], // Pertahankan status jika ada
                notes: notes
            }
        }));
    };

    // Handler untuk menyimpan absensi SATU KELAS
    const handleSaveAttendance = async (schedule) => {
        setSaving(true);
        try {
            // Siapkan data 'records' untuk API
            const records = schedule.students.map(student => {
                const key = `${schedule.scheduleId}_${student._id}`;
                const change = attendanceChanges[key];
                
                if (!change || !change.status) {
                    // Jika guru tidak memilih satupun, anggap 'absen'
                    return {
                        studentId: student._id,
                        status: 'absent', 
                        notes: change ? change.notes : ''
                    };
                }
                return {
                    studentId: student._id,
                    status: change.status,
                    notes: change.notes || ''
                };
            });

            const payload = {
                scheduleId: schedule.scheduleId,
                date: selectedDate,
                records: records
            };

            await api.post('/api/attendance/teacher/mark', payload);
            
            Swal.fire('Sukses!', 'Absensi untuk kelas ini telah disimpan.', 'success');

        } catch (error) {
            console.error('Error saving attendance:', error);
            Swal.fire('Error', 'Gagal menyimpan absensi.', 'error');
        } finally {
            setSaving(false);
        }
    };
    
    // Fungsi untuk render tombol status
    const renderStatusButtons = (scheduleId, student) => {
        const key = `${scheduleId}_${student._id}`;
        const currentStatus = attendanceChanges[key]?.status;
        
        const baseStyle = "px-3 py-1.5 rounded-md text-sm font-medium transition-all";
        const activeStyle = "text-white shadow-md";
        const inactiveStyle = "bg-gray-100 text-gray-700 hover:bg-gray-200";

        return (
            <div className="flex space-x-2">
                <button
                    onClick={() => handleStatusChange(scheduleId, student._id, 'present')}
                    className={`${baseStyle} ${currentStatus === 'present' ? `bg-green-600 ${activeStyle}` : inactiveStyle}`}
                >
                    Hadir
                </button>
                <button
                    onClick={() => handleStatusChange(scheduleId, student._id, 'absent')}
                    className={`${baseStyle} ${currentStatus === 'absent' ? `bg-red-600 ${activeStyle}` : inactiveStyle}`}
                >
                    Absen
                </button>
                <button
                    onClick={() => handleStatusChange(scheduleId, student._id, 'excused')}
                    className={`${baseStyle} ${currentStatus === 'excused' ? `bg-yellow-500 ${activeStyle}` : inactiveStyle}`}
                >
                    Izin
                </button>
            </div>
        );
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Absensi Siswa</h1>

            {/* Pemilih Tanggal */}
            <div className="mb-6 max-w-xs">
                <label htmlFor="attendance-date" className="block text-sm font-medium text-gray-700 mb-1">
                    Pilih Tanggal
                </label>
                <div className="relative">
                    <input
                        type="date"
                        id="attendance-date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <CalendarIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            {/* Daftar Kelas */}
            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
            ) : schedules.length === 0 ? (
                <div className="text-center text-gray-500 bg-white p-8 rounded-lg shadow">
                    Tidak ada jadwal mengajar pada tanggal ini.
                </div>
            ) : (
                <div className="space-y-6">
                    {schedules.map(schedule => (
                        <div key={schedule.scheduleId} className="bg-white p-6 rounded-xl shadow-lg">
                            {/* Header Kelas */}
                            <div className="pb-4 border-b border-gray-200 mb-4">
                                <h2 className="text-xl font-bold text-indigo-700">{schedule.lesson}</h2>
                                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                    <span className="flex items-center"><ClockIcon className="w-4 h-4 mr-1.5"/>{schedule.time} ({schedule.duration} min)</span>
                                    <span className="flex items-center capitalize"><UserIcon className="w-4 h-4 mr-1.5"/>{schedule.type}</span>
                                </div>
                            </div>
                            
                            {/* Daftar Murid di Kelas Ini */}
                            <div className="space-y-4">
                                {schedule.students.map(student => {
                                    const key = `${schedule.scheduleId}_${student._id}`;
                                    const changes = attendanceChanges[key] || {};
                                    return (
                                        <div key={student._id} className="p-4 bg-gray-50 rounded-lg">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                <div className="flex items-center mb-3 sm:mb-0">
                                                    {student.photo ? (
                                                        <img src={student.photo} alt={student.name} className="w-10 h-10 rounded-full object-cover mr-3"/>
                                                    ) : (
                                                        <UserCircleIcon className="w-10 h-10 text-gray-400 mr-3"/>
                                                    )}
                                                    <span className="font-medium text-gray-900">{student.name}</span>
                                                </div>
                                                {/* Tombol Status */}
                                                {renderStatusButtons(schedule.scheduleId, student)}
                                            </div>
                                            {/* Input Catatan */}
                                            {(changes.status === 'absent' || changes.status === 'excused' || (changes.notes && changes.notes.length > 0)) && (
                                                <div className="mt-3">
                                                    <input
                                                        type="text"
                                                        placeholder="Tambah catatan (opsional)..."
                                                        value={changes.notes || ''}
                                                        onChange={(e) => handleNotesChange(schedule.scheduleId, student._id, e.target.value)}
                                                        className="w-full text-sm px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-transparent"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Tombol Simpan per Kelas */}
                            <div className="mt-6 text-right">
                                <button
                                    onClick={() => handleSaveAttendance(schedule)}
                                    disabled={saving}
                                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {saving ? 'Menyimpan...' : 'Simpan Absensi Kelas Ini'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TeacherAttendancePage;