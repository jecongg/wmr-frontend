import React from 'react';
import { 
    PencilIcon, 
    TrashIcon, 
    PhoneIcon, 
    EnvelopeIcon,
    MusicalNoteIcon,
    CalendarIcon,
    LockClosedIcon,
    LockOpenIcon
} from '@heroicons/react/24/outline';
import { DataGrid } from '@mui/x-data-grid';

const TeacherList = ({ teachers, onEdit, onDelete, onToggleStatus, onAdd }) => {
    if (teachers.length === 0) {
        return (
            <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada guru ditemukan</h3>
                <p className="text-gray-600">Tambahkan guru baru atau coba ubah filter pencarian.</p>
            </div>
        );
    }
        const rows = teachers.map((teacher) => ({
            id: teacher.id,
            name: teacher.name,
            photo: teacher.photo,
            phoneNumber: teacher.phone,
            email : teacher.email,
            status: teacher.status
        }));

        const columns = [
            { field: 'photo', headerName: "", width: 100, renderCell: (params) => (
                
                <img
                    src={params.row.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(params.row.name)}&background=3b82f6&color=fff&size=200`}
                    alt={params.row.name}
                    className="w-10 h-10 rounded-full object-cover my-2"
                />
            )},
            { field: 'name', headerName: 'Product Name', width: 200 },
            { field: 'email', headerName: "Email", width: 300 },
            { field: 'phoneNumber', headerName: "Phone Number", width: 150 },
            { field: 'action', headerName: "Action", width: 200, renderCell: (params) => {
                const teacher = teachers.find(t => t.id === params.row.id);
                return (
                    <>
                        <button
                            onClick={() => onEdit(teacher)}
                            className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm mx-1 font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                            >
                            <PencilIcon className="w-4 h-4 mr-1" />
                            Edit
                        </button>
                         <button
                            onClick={() => onDelete(teacher.id)}
                            className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm mx-1 font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                        >
                            <TrashIcon className="w-4 h-4 mr-1" />
                            Hapus
                        </button>
                    </>
                );
            }},
            { field: '', headerName: "", width: 100, renderCell: (params) => {
                const teacher = teachers.find(t => t.id === params.row.id);
                return (
                    <button
                        onClick={() => onToggleStatus(teacher)}
                        className={`flex-1 inline-flex items-center justify-center px-3 py-2 text-sm mx-1 font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors ${
                            teacher.status === 'active'
                                ? 'text-orange-700 bg-orange-50 hover:bg-orange-100' : 'text-green-700 bg-green-50 hover:bg-green-100'
                        }`}
                    >
                        <LockClosedIcon className="w-4 h-4 mr-1" />
                        {teacher.status === 'active' ? 'Block' : 'Active'}
                    </button>
                );
            }},
            { field: 'status', headerName: "Status", width: 150, renderCell: (params) => {
                return (
                    <div className={`px-3 py-1 mt-4 rounded-full items-center flex flex-col justify-center text-xs font-medium ${
                        params.row.status === 'active' 
                            ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                        {params.row.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                    </div>
                )

            }},
        ];

    return (
        <>
            <title>Guru | Wisma Rapsodi Musik</title>
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"> */}
                {/* {teachers.map((teacher) => (
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
                                    <div className="font-medium">Bergabung</div>
                                    <div className="flex items-center">
                                        <CalendarIcon className="w-3 h-3 mr-1" />
                                        <span>Bergabung {new Date(teacher.createdAt).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'short'
                                        })}</span>
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
                                    onClick={() => onToggleStatus(teacher)}
                                    className={`flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                        teacher.status === 'active'
                                            ? 'text-orange-700 bg-orange-50 hover:bg-orange-100'
                                            : 'text-green-700 bg-green-50 hover:bg-green-100'
                                    }`}
                                    title={teacher.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                                >
                                    {teacher.status === 'active' ? (
                                        <>
                                            <LockClosedIcon className="w-4 h-4 mr-1" />
                                            Block
                                        </>
                                    ) : (
                                        <>
                                            <LockOpenIcon className="w-4 h-4 mr-1" />
                                            Aktifkan
                                        </>
                                    )}
                                </button>
                            </div>
                           
                        </div>
                    </div>
                ))}
            </div> */}
            <div class="mx-auto">
                {/* <header class="flex justify-end mb-6">
                    <div class="text-right text-sm text-gray-500">
                        <p>Total members: <span class="font-medium text-gray-800">2000</span></p>
                        <p>Current used: <span class="font-medium text-gray-800">1800</span></p>
                    </div>
                </header> */}

                <main class="bg-white p-6 rounded-lg shadow-sm">
                    <div class="flex justify-between items-center mb-5">
                        <div class="flex items-center gap-4">
                            <h1 class="text-2xl font-bold text-gray-800">Teachers</h1>
                            {/* <button class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Import members
                            </button>
                            <button class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Export members (Excel)
                            </button> */}
                        </div>
                        <div>
                            <button onClick={onAdd} class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Add new
                            </button>
                        </div>
                    </div>

                    <div class="overflow-x-auto">
                        <DataGrid rows={rows} columns={columns} />

                    </div>
                </main>
            </div>
        </>

    );
};

export default TeacherList;