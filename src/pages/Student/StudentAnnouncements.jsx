import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAnnouncements, selectAllAnnouncements, selectAnnouncementsStatus } from '../../redux/slices/announcementSlice';

const StudentAnnouncements = () => {
    const dispatch = useDispatch();
    const announcements = useSelector(selectAllAnnouncements);
    const status = useSelector(selectAnnouncementsStatus);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchAnnouncements());
        }
    }, [status, dispatch]);

    if (status === 'loading') return <p>Memuat pengumuman...</p>;

    return (
        <div className="space-y-5">
            {announcements.length === 0 ? (
                <p className="text-center text-gray-500">Tidak ada pengumuman saat ini.</p>
            ) : (
                announcements.map(ann => (
                    <div key={ann._id} className="bg-white p-5 rounded-lg shadow-md border-l-4 border-indigo-500">
                        <h3 className="text-xl font-bold text-gray-800">{ann.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Oleh: {ann.createdBy.name} - {new Date(ann.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                        <p className="text-gray-700 mt-3 whitespace-pre-wrap">{ann.content}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default StudentAnnouncements;