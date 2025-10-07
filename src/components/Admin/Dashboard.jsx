import React from 'react';
import { 
    UsersIcon, 
    AcademicCapIcon, 
    BookOpenIcon,
    ChartBarIcon 
} from '@heroicons/react/24/outline';

const Dashboard = ({ user }) => {
    const stats = [
        {
            name: 'Total Guru',
            value: '12',
            icon: UsersIcon,
            color: 'bg-blue-500',
            changeType: 'positive'
        },
        {
            name: 'Total Murid',
            value: '148',
            icon: AcademicCapIcon,
            color: 'bg-green-500',
            changeType: 'positive'
        },
        {
            name: 'Kelas Aktif',
            value: '8',
            icon: BookOpenIcon,
            color: 'bg-yellow-500',
            changeType: 'neutral'
        },
        {
            name: 'Tingkat Kehadiran',
            value: '94%',
            icon: ChartBarIcon,
            color: 'bg-purple-500',
            changeType: 'positive'
        }
    ];

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Selamat Datang, {user.displayName}!
                </h1>
                <p className="text-gray-600 mt-2">
                    Berikut adalah ringkasan aktivitas Wisma Musik Rhapsodi
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className={`${stat.color} p-3 rounded-lg`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h3>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <p className="text-sm text-gray-600">Guru baru "Sarah Johnson" telah didaftarkan</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <p className="text-sm text-gray-600">5 murid baru mendaftar kelas piano</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <p className="text-sm text-gray-600">Jadwal kelas biola telah diperbarui</p>
                        </div>
                    </div>
                </div>

                {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Akses Cepat</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <button className="p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                            <UsersIcon className="w-5 h-5 text-blue-600 mb-2" />
                            <p className="text-sm font-medium text-blue-900">Tambah Guru</p>
                        </button>
                        <button className="p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                            <AcademicCapIcon className="w-5 h-5 text-green-600 mb-2" />
                            <p className="text-sm font-medium text-green-900">Tambah Murid</p>
                        </button>
                        <button className="p-3 text-left bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors">
                            <BookOpenIcon className="w-5 h-5 text-yellow-600 mb-2" />
                            <p className="text-sm font-medium text-yellow-900">Atur Jadwal</p>
                        </button>
                        <button className="p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                            <ChartBarIcon className="w-5 h-5 text-purple-600 mb-2" />
                            <p className="text-sm font-medium text-purple-900">Lihat Laporan</p>
                        </button>
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default Dashboard;