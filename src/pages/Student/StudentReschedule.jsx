import React, { useState, useEffect } from 'react';
import api from '../../js/services/api';

const StudentReschedule = () => {
    // NOTE: Anda perlu endpoint untuk mengambil jadwal tetap murid
    // Untuk saat ini, kita akan hardcode. Ganti ini dengan data dari API.
    const [mySchedules, setMySchedules] = useState([
        { _id: "63e8c5ca5c4e1a4ac0e5d8a1", lesson: "Piano Grade 2", dayOfWeek: 2, time: "16:00" }, // Contoh
    ]);

    const [requests, setRequests] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [scheduleId, setScheduleId] = useState('');
    const [originalDate, setOriginalDate] = useState('');
    const [requestedDate, setRequestedDate] = useState('');
    const [requestedTime, setRequestedTime] = useState('');
    const [reason, setReason] = useState('');
    
    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await api.get('/api/reschedule/student/history');
            setRequests(response.data);
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!scheduleId || !originalDate || !requestedDate || !requestedTime || !reason) {
            alert('Semua kolom wajib diisi.');
            return;
        }
        setSubmitting(true);
        try {
            await api.post('/api/reschedule/student/create', {
                scheduleId, originalDate, requestedDate, requestedTime, reason
            });
            alert('Permintaan berhasil dikirim!');
            fetchHistory(); // Refresh
        } catch (error) {
            alert('Gagal mengirim permintaan.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            {/* Form Pengajuan */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-bold mb-4">Ajukan Ganti Jadwal</h2>
                 {/* Tambahkan Form Inputs di sini untuk:
                    - Pilih Jadwal (Dropdown dari mySchedules)
                    - Tanggal Asli (Date picker)
                    - Tanggal Pengganti (Date picker)
                    - Waktu Pengganti (Time picker)
                    - Alasan (Textarea)
                 */}
                <button type="submit" disabled={submitting} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
                    {submitting ? 'Mengirim...' : 'Kirim Permintaan'}
                </button>
            </form>

            {/* Riwayat Pengajuan */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Riwayat Pengajuan Anda</h2>
                {loadingHistory && <p>Memuat riwayat...</p>}
                <div className="space-y-3">
                    {requests.map(req => (
                        <div key={req._id} className="border p-3 rounded-md">
                            <p>Status: <span className={`font-bold ${
                                req.status === 'approved' ? 'text-green-600' :
                                req.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                            }`}>{req.status}</span></p>
                            {/* Tampilkan detail lainnya */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentReschedule;