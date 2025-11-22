import React, { useState, useEffect } from 'react';
import api from '../../js/services/api';
import { DocumentIcon, LinkIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import { Card, CardContent } from '@mui/material';

const ModuleIcon = ({ type }) => {
    if (type === 'file') return <DocumentIcon className="w-6 h-6 text-blue-500" />;
    if (type === 'link') return <LinkIcon className="w-6 h-6 text-green-500" />;
    if (type === 'video') return <VideoCameraIcon className="w-6 h-6 text-red-500" />;
    return null;
};

const StudentModules = () => {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const response = await api.get('/api/modules');
                setModules(response.data);
            } catch (error) {
                console.error("Gagal memuat modul:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchModules();
    }, []);

    if (loading) return <p>Memuat modul belajar...</p>;

    return (
        <div className="space-y-6">
            <title>Modul Belajar | Wisma Musik Rapsodi</title>
            {modules.length === 0 ? (
                <p className="text-center text-gray-500">Belum ada modul belajar yang diunggah oleh guru.</p>
            ) : (
                modules.map(module => (
                    <div key={module._id} className="bg-white p-5 rounded-lg shadow-md flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <ModuleIcon type={module.type} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-800">{module.title}</h3>
                            <p className="text-gray-600 mt-2">{module.description}</p>
                            <p className="text-sm text-gray-500">Oleh: {module.teacher.name}</p>
                        </div>
                        {module.type === 'video' ? (
                            <Card sx={{ maxWidth: 600, margin: "auto", borderRadius: 3, boxShadow: 3 }}>
                            <CardContent>
                                <video
                                style={{ width: "100%", borderRadius: 12 }}
                                src={module.url}
                                controls
                                />
                            </CardContent>
                            </Card>
                        ) : 
                        (
                            <div className="flex-shrink-0">
                                <a 
                                    href={module.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 text-sm font-medium"
                                >
                                    Buka
                                </a>
                            </div>
                        )}

                    </div>
                ))
            )}
        </div>
    );
};

export default StudentModules;