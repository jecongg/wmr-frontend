import React, { useState, useEffect } from 'react';
import api from '../../js/services/api';

const TeacherReschedule = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/reschedule/teacher/requests');
            setRequests(response.data);
        } finally {
            setLoading(false);
        }
    };

    const handleResponse = async (requestId, status) => {
        try {
            await api.put(`/api/reschedule/teacher/respond/${requestId}`, { status });
            alert(`Permintaan berhasil di-${status === 'approved' ? 'setujui' : 'tolak'}`);
            fetchRequests(); // Refresh
        } catch (error) {
            alert('Gagal merespons.');
        }
    };

    return (
        <div className="space-y-4">
            <title>Izin Pergantian | Wisma Musik Rapsodi</title>
            {loading && <p>Memuat permintaan...</p>}
            {!loading && requests.length === 0 && <p>Tidak ada permintaan ganti jadwal yang tertunda.</p>}
            {requests.map(req => (
                <div key={req._id} className="bg-white p-4 rounded-lg shadow-md">
                    <p><strong>{req.student.name}</strong> meminta ganti jadwal.</p>
                    <p>Alasan: {req.reason}</p>
                    <div className="mt-4 flex space-x-2">
                        <button onClick={() => handleResponse(req._id, 'approved')} className="px-4 py-2 bg-green-500 text-white rounded">Setujui</button>
                        <button onClick={() => handleResponse(req._id, 'rejected')} className="px-4 py-2 bg-red-500 text-white rounded">Tolak</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TeacherReschedule;