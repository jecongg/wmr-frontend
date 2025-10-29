import React, { useState, useEffect } from 'react';
import api from '../../js/services/api';
import { useSelector } from 'react-redux';
import { selectAllStudents } from '../../redux/slices/studentSlice'; // Asumsi data murid sudah ada

const TeacherLessonReport = () => {
    const allStudents = useSelector(selectAllStudents);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
    const [formData, setFormData] = useState({
        time: '14:00',
        duration: 60,
        type: 'offline',
        status: 'present',
        materialsCovered: '',
        report: '',
        homework: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedStudent) {
            alert('Silakan pilih murid terlebih dahulu.');
            return;
        }
        setIsLoading(true);
        try {
            const payload = {
                studentId: selectedStudent,
                date: reportDate,
                ...formData
            };
            await api.post('/api/records/teacher/create', payload);
            alert('Laporan berhasil disimpan!');
        } catch (error) {
            console.error('Gagal menyimpan laporan:', error);
            alert('Gagal menyimpan laporan. ' + (error.response?.data?.message || ''));
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Buat Laporan Les</h1>
            
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Murid</label>
                        <select 
                            value={selectedStudent} 
                            onChange={(e) => setSelectedStudent(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                            <option value="">-- Pilih Murid --</option>
                            {allStudents.map(student => (
                                <option key={student.id} value={student.id}>{student.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Les</label>
                        <input 
                            type="date"
                            value={reportDate}
                            onChange={(e) => setReportDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    {/* Tambahkan input untuk time, duration, type, status... */}
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Materi yang Dibahas</label>
                        <textarea name="materialsCovered" value={formData.materialsCovered} onChange={handleInputChange} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg"></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Laporan/Feedback</label>
                        <textarea name="report" value={formData.report} onChange={handleInputChange} rows="4" className="w-full px-3 py-2 border border-gray-300 rounded-lg"></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pekerjaan Rumah</label>
                        <textarea name="homework" value={formData.homework} onChange={handleInputChange} rows="2" className="w-full px-3 py-2 border border-gray-300 rounded-lg"></textarea>
                    </div>
                </div>

                <div className="mt-6 text-right">
                    <button type="submit" disabled={isLoading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                        {isLoading ? 'Menyimpan...' : 'Simpan Laporan'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TeacherLessonReport;