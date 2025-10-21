import React, { useState, useEffect } from 'react';
import { 
    ArrowLeftIcon, 
    PhotoIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

const TeacherForm = ({ teacher, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        instrument: '',
        experience: '',
        photo: '',
        bio: '',
        hourlyRate: '',
        availability: []
    });

    const [photoPreview, setPhotoPreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const instruments = ['Piano', 'Guitar', 'Violin', 'Drums', 'Vocal', 'Bass', 'Flute', 'Saxophone'];
    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

    useEffect(() => {
        if (teacher) {
            setFormData({
                name: teacher.name || '',
                email: teacher.email || '',
                phone: teacher.phone || '',
                instrument: teacher.instrument || '',
                experience: teacher.experience || '',
                photo: teacher.photo || '',
                bio: teacher.bio || '',
                hourlyRate: teacher.hourlyRate || '',
                availability: teacher.availability || []
            });
            setPhotoPreview(teacher.photo || '');
        }
    }, [teacher]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({
                    ...prev,
                    photo: 'Ukuran file maksimal 5MB'
                }));
                return;
            }

            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({
                    ...prev,
                    photo: 'File harus berupa gambar'
                }));
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target.result;
                setPhotoPreview(result);
                setFormData(prev => ({
                    ...prev,
                    photo: result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAvailabilityChange = (day, checked) => {
        setFormData(prev => ({
            ...prev,
            availability: checked 
                ? [...prev.availability, day]
                : prev.availability.filter(d => d !== day)
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Nama guru wajib diisi';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email wajib diisi';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Format email tidak valid';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Nomor telepon wajib diisi';
        }

        if (!formData.instrument) {
            newErrors.instrument = 'Instrumen wajib dipilih';
        }

        if (!formData.experience.trim()) {
            newErrors.experience = 'Pengalaman wajib diisi';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            await onSave(formData);
        } catch (error) {
            console.error('Error saving teacher:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <button
                    onClick={onCancel}
                    className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {teacher ? 'Edit Guru' : 'Tambah Guru Baru'}
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {teacher ? 'Perbarui informasi guru' : 'Lengkapi informasi guru baru'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Foto Profil
                        </label>
                        <div className="flex flex-col items-center">
                            <div className="relative w-48 h-48 bg-gray-200 rounded-lg overflow-hidden mb-4">
                                {photoPreview ? (
                                    <>
                                        <img
                                            src={photoPreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPhotoPreview('');
                                                setFormData(prev => ({ ...prev, photo: '' }));
                                            }}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                        >
                                            <XMarkIcon className="w-4 h-4" />
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                        <PhotoIcon className="w-12 h-12 mb-2" />
                                        <span className="text-sm">Belum ada foto</span>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="hidden"
                                id="photo-upload"
                            />
                            <label
                                htmlFor="photo-upload"
                                className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg transition-colors"
                            >
                                {photoPreview ? 'Ubah Foto' : 'Upload Foto'}
                            </label>
                            {errors.photo && (
                                <p className="mt-1 text-sm text-red-600">{errors.photo}</p>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nama Lengkap *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Masukkan nama lengkap"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="contoh@email.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nomor Telepon *
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.phone ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="08123456789"
                            />
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Instrumen *
                                </label>
                                <select
                                    name="instrument"
                                    value={formData.instrument}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.instrument ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Pilih Instrumen</option>
                                    {instruments.map(instrument => (
                                        <option key={instrument} value={instrument}>{instrument}</option>
                                    ))}
                                </select>
                                {errors.instrument && (
                                    <p className="mt-1 text-sm text-red-600">{errors.instrument}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Pengalaman *
                                </label>
                                <input
                                    type="text"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.experience ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="5 tahun"
                                />
                                {errors.experience && (
                                    <p className="mt-1 text-sm text-red-600">{errors.experience}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tarif per Jam (Rp)
                            </label>
                            <input
                                type="number"
                                name="hourlyRate"
                                value={formData.hourlyRate}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="150000"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Biodata Singkat
                            </label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Ceritakan sedikit tentang latar belakang dan keahlian..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ketersediaan Hari
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {days.map(day => (
                                    <label key={day} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.availability.includes(day)}
                                            onChange={(e) => handleAvailabilityChange(day, e.target.checked)}
                                            className="mr-2 rounded text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">{day}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Menyimpan...' : (teacher ? 'Update' : 'Simpan')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TeacherForm;