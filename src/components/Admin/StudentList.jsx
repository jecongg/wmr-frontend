import React from 'react';
import { 
    PencilIcon, 
    TrashIcon, 
    PhoneIcon, 
    EnvelopeIcon,
    MusicalNoteIcon,
    CalendarIcon,
    UserIcon,
    AcademicCapIcon
} from '@heroicons/react/24/outline';

const StudentList = ({ students, onEdit, onDelete }) => {
    if (students.length === 0) {
        return (
            <div className="text-center py-12">
                <AcademicCapIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada murid ditemukan</h3>
                <p className="text-gray-600">Tambahkan murid baru atau coba ubah filter pencarian.</p>
            </div>
        );
    }

    const getLevelBadgeColor = (level) => {
        switch (level) {
            case 'Beginner':
                return 'bg-green-100 text-green-800';
            case 'Intermediate':
                return 'bg-yellow-100 text-yellow-800';
            case 'Advanced':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {students.map((student) => (
                <div key={student.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    {/* Profile Photo */}
                    <div className="relative">
                        <img
                            src={student.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=10b981&color=fff&size=200`}
                            alt={student.name}
                            className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-3 left-3 flex space-x-2">
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelBadgeColor(student.level)}`}>
                                {student.level}
                            </div>
                        </div>
                        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                            student.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                        }`}>
                            {student.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                        </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4">
                        {/* Name, Age, and Instrument */}
                        <div className="mb-3">
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                                <span className="text-sm text-gray-500">({student.age} tahun)</span>
                            </div>
                            <div className="flex items-center text-green-600">
                                <MusicalNoteIcon className="w-4 h-4 mr-1" />
                                <span className="text-sm font-medium">{student.instrument}</span>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center text-gray-600">
                                <EnvelopeIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                                <span className="text-sm truncate">{student.email}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <PhoneIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                                <span className="text-sm">{student.phone}</span>
                            </div>
                            {student.parentName && (
                                <div className="flex items-center text-gray-600">
                                    <UserIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                                    <div className="text-sm">
                                        <div>{student.parentName}</div>
                                        <div className="text-xs text-gray-500">{student.parentPhone}</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Join Date */}
                        <div className="mb-4 text-xs text-gray-500">
                            <div className="flex items-center">
                                <CalendarIcon className="w-3 h-3 mr-1" />
                                <span>Bergabung {new Date(student.joinDate).toLocaleDateString('id-ID', {
                                    year: 'numeric',
                                    month: 'short'
                                })}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                            <button
                                onClick={() => onEdit(student)}
                                className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-md transition-colors"
                            >
                                <PencilIcon className="w-4 h-4 mr-1" />
                                Edit
                            </button>
                            <button
                                onClick={() => onDelete(student.id)}
                                className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                            >
                                <TrashIcon className="w-4 h-4 mr-1" />
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StudentList;