import React, { useState, useEffect } from 'react';
import api from '../../js/services/api';

const StudentReportHistory = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get('/api/records/student/history');
                setReports(response.data);
            } catch (error) {
                console.error("Gagal mengambil riwayat:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

    if (loading) return <div>Memuat riwayat...</div>;

    return (
        <div className="p-6">
            {/* <h1 className="text-2xl font-bold text-gray-900 mb-6">Riwayat Laporan Belajar</h1> */}
            
            {/* Tampilkan modal/detail jika ada 'selectedReport' */}

            <div className="bg-white p-4 rounded-lg shadow-md">
                <ul className="divide-y divide-gray-200">
                    {reports.length > 0 ? reports.map(report => (
                        <li key={report._id} className="py-4 flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-indigo-600">{formatDate(report.date)} - {report.time}</p>
                                <p className="text-gray-700">Guru: {report.teacher.name}</p>
                            </div>
                            <button onClick={() => setSelectedReport(report)} className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg">
                                Lihat Detail
                            </button>
                        </li>
                    )) : <p className='text-center text-gray-500'>Belum ada riwayat laporan.</p>}
                </ul>
            </div>
        </div>
    );
};

export default StudentReportHistory;