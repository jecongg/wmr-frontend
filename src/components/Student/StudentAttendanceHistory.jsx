import React, { useState, useEffect } from 'react';
// 
// PERHATIAN: Sesuaikan path ini ke lokasi file 'api.js' Anda!
// Contoh: '../../utils/api', 'src/api/apiService', dll.
//
import api from '../../js/services/api';
//
import { CheckCircleIcon, XCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';

// Helper untuk format tanggal
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

// Komponen Ikon Status
const StatusIcon = ({ status }) => {
    if (status === 'present') {
        return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
    }
    if (status === 'absent') {
        return <XCircleIcon className="w-6 h-6 text-red-500" />;
    }
    if (status === 'excused') {
        return <ExclamationCircleIcon className="w-6 h-6 text-yellow-500" />;
    }
    return null;
};

// Komponen Teks Status
const StatusText = ({ status }) => {
    if (status === 'present') {
        return <span className="font-medium text-green-600">Hadir</span>;
    }
    if (status === 'absent') {
        return <span className="font-medium text-red-600">Absen</span>;
    }
    if (status === 'excused') {
        return <span className="font-medium text-yellow-600">Izin</span>;
    }
    return <span className="font-medium text-gray-500">N/A</span>;
};


const StudentAttendanceHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            try {
                // Asumsi API ini dilindungi oleh auth middleware murid
                const response = await api.get('/api/attendance/student/history');
                setHistory(response.data);
            } catch (error) {
                console.error('Error fetching attendance history:', error);
                // Tampilkan error jika perlu
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Riwayat Absensi Anda</h2>
            {loading ? (
                <div className="text-center py-4">Memuat riwayat...</div>
            ) : history.length === 0 ? (
                <div className="text-center text-gray-500 py-4">Belum ada riwayat absensi.</div>
            ) : (
                <ul className="divide-y divide-gray-200">
                    {history.map(item => (
                        <li key={item.attendanceId} className="py-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">{formatDate(item.date)}</p>
                                    <p className="text-lg font-semibold text-indigo-700">{item.lesson}</p>
                                    <p className="text-sm text-gray-600">Guru: {item.teacher}</p>
                                    {item.notes && (
                                        <p className="text-sm text-gray-500 mt-1 italic">Catatan: "{item.notes}"</p>
                                    )}
                                </div>
                                <div className="flex flex-col items-center">
                                    <StatusIcon status={item.status} />
                                    <StatusText status={item.status} />
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default StudentAttendanceHistory;