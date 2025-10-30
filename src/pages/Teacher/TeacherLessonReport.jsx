import React, { useState, useEffect } from 'react';
import api from '../../js/services/api';
import Swal from 'sweetalert2';

const TeacherLessonReport = () => {
    const [myStudents, setMyStudents] = useState([]);
    const [loadingStudents, setLoadingStudents] = useState(true);
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

    useEffect(() => {
        fetchMyStudents();
    }, []);

    const fetchMyStudents = async () => {
        try {
            setLoadingStudents(true);
            const response = await api.get(`/api/teacher/my-students`);
            if (response.data.success) {
                setMyStudents(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching my students:', error);
            Swal.fire('Error', 'Gagal memuat data murid Anda', 'error');
        } finally {
            setLoadingStudents(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedStudent) {
            Swal.fire('Error', 'Silakan pilih murid terlebih dahulu.', 'error');
            return;
        }
        setIsLoading(true);
        try {
            const payload = {
                studentId: selectedStudent,
                date: reportDate,
                ...formData
            };
            await api.post(`${BASE_URL}/records/teacher/create`, payload);
            
            Swal.fire('Sukses', 'Laporan berhasil disimpan!', 'success');
            
            setSelectedStudent('');
            setReportDate(new Date().toISOString().split('T')[0]);
            setFormData({
                time: '14:00',
                duration: 60,
                type: 'offline',
                status: 'present',
                materialsCovered: '',
                report: '',
                homework: '',
            });
        } catch (error) {
            console.error('Gagal menyimpan laporan:', error);
            Swal.fire('Error', 'Gagal menyimpan laporan. ' + (error.response?.data?.message || ''), 'error');
        } finally {
            setIsLoading(false);
        }
    };
    
    if (loadingStudents) {
        return (
            <div className="p-6 flex justify-center items-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">Memuat data murid...</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="px-6">
            
            {myStudents.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center max-w-2xl">
                    <p className="text-yellow-800 font-medium mb-2">Belum Ada Murid</p>
                    <p className="text-yellow-700 text-sm">
                        Anda belum memiliki murid yang di-assign. Silakan hubungi admin untuk assign murid ke Anda.
                    </p>
                </div>
            ) : (
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Murid <span className="text-red-500">*</span>
                            </label>
                        <select 
                            value={selectedStudent} 
                            onChange={(e) => setSelectedStudent(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                        >
                            <option value="">-- Pilih Murid --</option>
                                {myStudents.map(item => (
                                    <option key={item.student.id || item.student._id} value={item.student.id || item.student._id}>
                                        {item.student.name}
                                    </option>
                            ))}
                        </select>
                            <p className="text-xs text-gray-500 mt-1">
                                Total {myStudents.length} murid di-assign ke Anda
                            </p>
                    </div>
                    <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tanggal Les <span className="text-red-500">*</span>
                            </label>
                        <input 
                            type="date"
                            value={reportDate}
                            onChange={(e) => setReportDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Waktu Les <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Durasi (menit) <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="number"
                                name="duration"
                                value={formData.duration}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                min="15"
                                step="15"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tipe Les <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                                <option value="offline">Offline</option>
                                <option value="online">Online</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status Kehadiran <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                                <option value="present">Hadir</option>
                                <option value="absent">Tidak Hadir</option>
                                <option value="late">Terlambat</option>
                            </select>
                        </div>
                </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Materi yang Dibahas <span className="text-red-500">*</span>
                            </label>
                            <textarea 
                                name="materialsCovered" 
                                value={formData.materialsCovered} 
                                onChange={handleInputChange} 
                                rows="3" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Contoh: Teknik fingering tangga nada C mayor, latihan arpegio..."
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Laporan/Feedback <span className="text-red-500">*</span>
                            </label>
                            <textarea 
                                name="report" 
                                value={formData.report} 
                                onChange={handleInputChange} 
                                rows="4" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Berikan feedback tentang progress murid, hal yang perlu diperbaiki, dll..."
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Pekerjaan Rumah
                            </label>
                            <textarea 
                                name="homework" 
                                value={formData.homework} 
                                onChange={handleInputChange} 
                                rows="2" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Tugas yang harus dikerjakan murid (opsional)"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button 
                            type="button"
                            onClick={() => {
                                setSelectedStudent('');
                                setReportDate(new Date().toISOString().split('T')[0]);
                                setFormData({
                                    time: '14:00',
                                    duration: 60,
                                    type: 'offline',
                                    status: 'present',
                                    materialsCovered: '',
                                    report: '',
                                    homework: '',
                                });
                            }}
                            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                            Reset Form
                        </button>
                        <button 
                            type="submit" 
                            disabled={isLoading} 
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? 'Menyimpan...' : 'Simpan Laporan'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default TeacherLessonReport;