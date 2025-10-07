import React from 'react';
import { 
    PencilIcon, 
    TrashIcon, 
    PhoneIcon, 
    EnvelopeIcon,
    MusicalNoteIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';

const TeacherList = ({ teachers, onEdit, onDelete }) => {
    if (teachers.length === 0) {
        return (
            <div className="text-center py-12">
                <MusicalNoteIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada guru ditemukan</h3>
                <p className="text-gray-600">Tambahkan guru baru atau coba ubah filter pencarian.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teachers.map((teacher) => (
                <div key={teacher.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative">
                        <img
                            src={teacher.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}&background=3b82f6&color=fff&size=200`}
                            alt={teacher.name}
                            className="w-full h-48 object-cover"
                        />
                        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                            teacher.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                        }`}>
                            {teacher.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                        </div>
                    </div>

                    <div className="p-4">
                        <div className="mb-3">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{teacher.name}</h3>
                            <div className="flex items-center text-blue-600">
                                <MusicalNoteIcon className="w-4 h-4 mr-1" />
                                <span className="text-sm font-medium">{teacher.instrument}</span>
                            </div>
                        </div>

                        <div className="space-y-2 mb-4">
                            <div className="flex items-center text-gray-600">
                                <EnvelopeIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                                <span className="text-sm truncate">{teacher.email}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <PhoneIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                                <span className="text-sm">{teacher.phone}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-gray-500">
                            <div>
                                <div className="font-medium">Pengalaman</div>
                                <div>{teacher.experience}</div>
                            </div>
                            <div>
                                <div className="font-medium">Bergabung</div>
                                <div className="flex items-center">
                                    <CalendarIcon className="w-3 h-3 mr-1" />
                                    {new Date(teacher.joinDate).toLocaleDateString('id-ID', {
                                        year: 'numeric',
                                        month: 'short'
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-2">
                            <button
                                onClick={() => onEdit(teacher)}
                                className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                            >
                                <PencilIcon className="w-4 h-4 mr-1" />
                                Edit
                            </button>
                            <button
                                onClick={() => onDelete(teacher.id)}
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

export default TeacherList;