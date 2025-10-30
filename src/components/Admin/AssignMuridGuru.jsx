import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form'; // Import useForm
import { joiResolver } from '@hookform/resolvers/joi'; // Import the resolver
import Joi from 'joi'; // Import Joi
import { selectAllTeachers } from '../../redux/slices/teacherSlice';
import { selectAllStudents } from '../../redux/slices/studentSlice';
import { 
    PlusIcon, 
    MagnifyingGlassIcon,
    TrashIcon,
    PencilIcon,
} from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';
import api from '../../js/services/api';

const assignmentSchema = Joi.object({
    teacherId: Joi.string().required().messages({
        'string.empty': 'Guru harus dipilih',
        'any.required': 'Guru harus dipilih',
    }),
    studentId: Joi.string().required().messages({
        'string.empty': 'Murid harus dipilih',
        'any.required': 'Murid harus dipilih',
    }),
    startDate: Joi.date().iso().required().messages({
        'any.required': 'Tanggal mulai harus diisi',
    }),
    scheduleDay: Joi.string().allow('').optional(),
    startTime: Joi.string().allow('').optional(),
    endTime: Joi.string().allow('').optional(),
    instrument: Joi.string().required().messages({
        'string.empty': 'Instrumen harus dipilih',
    }),
    notes: Joi.string().allow('').optional(),
});


const AssignMuridGuru = () => {
    const teachers = useSelector(selectAllTeachers);
    const students = useSelector(selectAllStudents);
    
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('active');

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: joiResolver(assignmentSchema),
        defaultValues: {
            teacherId: '',
            studentId: '',
            notes: '',
            startDate: new Date().toISOString().split('T')[0],
            scheduleDay: '',
            startTime: '',
            endTime: '',
            instrument: ''
        }
    });

    const activeTeachers = teachers.filter(t => !t.deletedAt);
    const activeStudents = students.filter(s => !s.deletedAt);

    useEffect(() => {
        fetchAssignments();
        // console.log("activestudent",activeStudents);
    }, [filterStatus]);

    const fetchAssignments = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/api/admin/assignments?status=${filterStatus}`);
            if (response.data.success) {
                setAssignments(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching assignments:', error);
            Swal.fire('Error', 'Gagal memuat data assignment', 'error');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        try {
            console.log('Submitting data:', data);
            const response = await api.post(`/api/admin/assign`, data);

            if (response.data.success) {
                Swal.fire('Sukses', 'Murid berhasil di-assign ke guru', 'success');
                setShowForm(false);
                reset(); 
                fetchAssignments();
            }
        } catch (error) {
            console.error('Error assigning student:', error);
            Swal.fire('Error', error.response?.data?.message || 'Gagal assign murid', 'error');
        }
    };

    const handleDelete = async (assignmentId) => {
        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: "Assignment akan dinonaktifkan",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, nonaktifkan!',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/api/admin/assignments/${assignmentId}`);
                Swal.fire('Berhasil!', 'Assignment telah dinonaktifkan.', 'success');
                fetchAssignments();
            } catch (error) {
                console.error('Error deleting assignment:', error);
                Swal.fire('Error', 'Gagal menghapus assignment', 'error');
            }
        }
    };

    const handleUpdateStatus = async (assignmentId, newStatus) => {
        try {
            await api.put(`/api/admin/assignments/${assignmentId}/status`, { status: newStatus });
            Swal.fire('Berhasil!', 'Status assignment berhasil diupdate.', 'success');
            fetchAssignments();
        } catch (error) {
            console.error('Error updating status:', error);
            Swal.fire('Error', 'Gagal update status', 'error');
        }
    };

    const filteredAssignments = assignments.filter(assignment => {
        const teacherName = assignment.teacherId?.name?.toLowerCase() || '';
        const studentName = assignment.studentId?.name?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();
        
        return teacherName.includes(search) || studentName.includes(search);
    });

    if (showForm) {
        return (
            <div className="p-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold mb-6">Assign Murid ke Guru</h2>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Pilih Guru *
                            </label>
                            <select
                                {...register("teacherId")}
                                className={`w-full px-3 py-2 border ${errors.teacherId ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            >
                                <option value="">-- Pilih Guru --</option>
                                {activeTeachers.map(teacher => (
                                    <option key={teacher.id || teacher._id} value={teacher.id || teacher._id}>
                                        {teacher.name} - {teacher.email}
                                    </option>
                                ))}
                            </select>
                            {errors.teacherId && <p className="text-red-500 text-sm mt-1">{errors.teacherId.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Pilih Murid *
                            </label>
                            <select
                                {...register("studentId")}
                                className={`w-full px-3 py-2 border ${errors.studentId ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            >
                                <option value="">-- Pilih Murid --</option>
                                {activeStudents.map(student => (
                                    <option key={student.id || student._id} value={student.id || student._id}>
                                        {student.name} - {student.email}
                                    </option>
                                ))}
                            </select>
                            {errors.studentId && <p className="text-red-500 text-sm mt-1">{errors.studentId.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tanggal Mulai
                            </label>
                            <input
                                type="date"
                                {...register("startDate")}
                                className={`w-full px-3 py-2 border ${errors.startDate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            />
                            {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hari Les
                            </label>
                            <select
                                {...register("scheduleDay")}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">-- Pilih Hari --</option>
                                <option value="Senin">Senin</option>
                                <option value="Selasa">Selasa</option>
                                <option value="Rabu">Rabu</option>
                                <option value="Kamis">Kamis</option>
                                <option value="Jumat">Jumat</option>
                                <option value="Sabtu">Sabtu</option>
                            </select>
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Jam Mulai
                                </label>
                                <input
                                    type="time"
                                    {...register("startTime")}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Jam Selesai
                                </label>
                                <input
                                    type="time"
                                    {...register("endTime")}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Instrumen *</label>
                            <select 
                                {...register("instrument")}
                                className={`w-full px-3 py-2 border ${errors.instrument ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}>
                                <option value="">-- Pilih Instrumen --</option>
                                <option value="piano">Piano</option>
                                <option value="gitar">Gitar</option>
                                <option value="drum">Drum</option>
                                <option value="vocal">Vocal</option>
                                <option value="other">Lainnya</option>
                            </select>
                            {errors.instrument && <p className="text-red-500 text-sm mt-1">{errors.instrument.message}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Catatan
                            </label>
                            <textarea
                                {...register("notes")}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Tambahkan catatan (opsional)"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                            >
                                Simpan Assignment
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    reset(); 
                                }}
                                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium rounded-lg transition-colors"
                            >
                                Batal
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Assign Murid ke Guru</h1>
                    <p className="text-gray-600 mt-1">Kelola assignment murid ke guru</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Assign Baru
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari nama guru atau murid..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                    <option value="">Semua</option>
                </select>
            </div>


            {loading ? (
                 <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Guru
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Murid
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Instrumen
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Jadwal
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Catatan
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredAssignments.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                                        Tidak ada data assignment
                                    </td>
                                </tr>
                            ) : (
                                filteredAssignments.map((assignment) => (
                                    <tr key={assignment.id || assignment._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {assignment.teacherId?.name || 'N/A'}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {assignment.teacherId?.email || 'N/A'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {assignment.studentId?.name || 'N/A'}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {assignment.studentId?.email || 'N/A'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            <span className="capitalize font-medium">{assignment.instrument || '-'}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {assignment.scheduleDay ? (
                                                <div>
                                                    <div className="font-medium">{assignment.scheduleDay}</div>
                                                    <div className="text-gray-500">{assignment.startTime} - {assignment.endTime}</div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                assignment.status === 'active' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {assignment.status === 'active' ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {assignment.notes || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex gap-2">
                                                {assignment.status === 'active' ? (
                                                    <button
                                                        onClick={() => handleUpdateStatus(assignment.id || assignment._id, 'inactive')}
                                                        className="text-yellow-600 hover:text-yellow-900"
                                                        title="Nonaktifkan"
                                                    >
                                                        <PencilIcon className="w-5 h-5" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleUpdateStatus(assignment.id || assignment._id, 'active')}
                                                        className="text-green-600 hover:text-green-900"
                                                        title="Aktifkan"
                                                    >
                                                        <PencilIcon className="w-5 h-5" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(assignment.id || assignment._id)}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Hapus"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AssignMuridGuru;