import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
    fetchStudentAttendanceHistory, 
    selectStudentAttendanceHistory, 
    selectStudentAttendanceStatus 
} from '../../redux/slices/studentSlice';
import { CheckCircleIcon, XCircleIcon, ExclamationCircleIcon, ClockIcon } from '@heroicons/react/24/solid';

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return timeString.substring(0, 5); // HH:MM
};

const StatusBadge = ({ status }) => {
    const configs = {
        present: {
            icon: CheckCircleIcon,
            text: 'Hadir',
            bgColor: 'bg-green-100',
            textColor: 'text-green-800',
            iconColor: 'text-green-600'
        },
        absent: {
            icon: XCircleIcon,
            text: 'Tidak Hadir',
            bgColor: 'bg-red-100',
            textColor: 'text-red-800',
            iconColor: 'text-red-600'
        },
        excused: {
            icon: ExclamationCircleIcon,
            text: 'Izin',
            bgColor: 'bg-yellow-100',
            textColor: 'text-yellow-800',
            iconColor: 'text-yellow-600'
        }
    };

    const config = configs[status] || {
        icon: ClockIcon,
        text: 'Belum Dicatat',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800',
        iconColor: 'text-gray-600'
    };

    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.textColor}`}>
            <Icon className={`w-5 h-5 mr-2 ${config.iconColor}`} />
            {config.text}
        </span>
    );
};

const AttendanceCard = ({ attendance }) => {
    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-5 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">{formatDate(attendance.date)}</p>
                    <h3 className="text-lg font-bold text-indigo-700">{attendance.lesson}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Guru:</span> {attendance.teacher}
                    </p>
                    {attendance.time && (
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Waktu:</span> {formatTime(attendance.startTime)} - {formatTime(attendance.endTime)}
                        </p>
                    )}
                </div>
                <StatusBadge status={attendance.status} />
            </div>
            
            {attendance.notes && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-700">
                        <span className="font-medium text-gray-900">Catatan:</span>
                        <span className="ml-2 italic">{attendance.notes}</span>
                    </p>
                </div>
            )}
        </div>
    );
};

const StudentAttendanceHistory = () => {
    const dispatch = useDispatch();
    const attendances = useSelector(selectStudentAttendanceHistory);
    const status = useSelector(selectStudentAttendanceStatus);

    useEffect(() => {
        dispatch(fetchStudentAttendanceHistory());
    }, [dispatch]);

    const stats = attendances.reduce((acc, attendance) => {
        if (attendance.status === 'present') acc.present++;
        if (attendance.status === 'absent') acc.absent++;
        if (attendance.status === 'excused') acc.excused++;
        return acc;
    }, { present: 0, absent: 0, excused: 0 });

    const totalAttendance = attendances.length;
    const attendanceRate = totalAttendance > 0 
        ? ((stats.present / totalAttendance) * 100).toFixed(1) 
        : 0;

    return (
        <div className="space-y-6">
            <title>Laporan Kehadiran | Wisma Musik Rapsodi</title>
            <div className="my-3 mb-6">
                <h2 className="text-4xl font-bold text-gray-800 mb-2">Riwayat Kehadiran</h2>
                <p className="text-gray-600">Lihat semua riwayat kehadiran les Anda</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Total Les</p>
                            <p className="text-3xl font-bold text-gray-900">{totalAttendance}</p>
                        </div>
                        <ClockIcon className="w-12 h-12 text-indigo-600 opacity-20" />
                    </div>
                </div>

                {/* <div className="bg-white rounded-lg shadow-md p-5 border border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Hadir</p>
                            <p className="text-3xl font-bold text-green-600">{stats.present}</p>
                        </div>
                        <CheckCircleIcon className="w-12 h-12 text-green-600 opacity-20" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-5 border border-red-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Tidak Hadir</p>
                            <p className="text-3xl font-bold text-red-600">{stats.absent}</p>
                        </div>
                        <XCircleIcon className="w-12 h-12 text-red-600 opacity-20" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-5 border border-yellow-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Tingkat Kehadiran</p>
                            <p className="text-3xl font-bold text-indigo-600">{attendanceRate}%</p>
                        </div>
                        <ExclamationCircleIcon className="w-12 h-12 text-yellow-600 opacity-20" />
                    </div>
                </div> */}
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Riwayat Lengkap</h3>
                
                {status === 'loading' ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        <p className="mt-4 text-gray-600">Memuat riwayat kehadiran...</p>
                    </div>
                ) : status === 'failed' ? (
                    <div className="text-center py-12">
                        <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <p className="text-red-600 font-medium">Gagal memuat riwayat kehadiran</p>
                        <button 
                            onClick={() => dispatch(fetchStudentAttendanceHistory())}
                            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            Coba Lagi
                        </button>
                    </div>
                ) : attendances.length === 0 ? (
                    <div className="text-center py-12">
                        <ClockIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">Belum ada riwayat kehadiran</p>
                        <p className="text-gray-400 text-sm mt-2">Riwayat akan muncul setelah guru mencatat kehadiran Anda</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {attendances.map((attendance) => (
                            <AttendanceCard key={attendance.attendanceId} attendance={attendance} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentAttendanceHistory;
