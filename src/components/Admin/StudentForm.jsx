import React, { useState, useEffect } from 'react';
import { 
    ArrowLeftIcon, 
    PhotoIcon,
    XMarkIcon,
    UserIcon
} from '@heroicons/react/24/outline';

const StudentForm = ({ student, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_number: '',
        age: '',
        photo: '',
        parent_name: '',
        parent_phone: '',
        address: '',
    });

    const [photoPreview, setPhotoPreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (student) {
            setFormData({
                name: student.name || '',
                email: student.email || '',
                phone_number: student.phone_number || '',
                age: student.age || '',
                photo: student.photo || '',
                parent_name: student.parent_name || '',
                parent_phone: student.parent_phone || '',
                address: student.address || '',
            });
            setPhotoPreview(student.photo || '');
        }
    }, [student]);

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

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Nama murid wajib diisi';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email wajib diisi';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Format email tidak valid';
        }

        if (!formData.phone_number.trim()) {
            newErrors.phone_number = 'Nomor telepon wajib diisi';
        }

        if (!formData.age || formData.age < 4 || formData.age > 80) {
            newErrors.age = 'Umur harus antara 4-80 tahun';
        }

        if (!formData.parent_name.trim()) {
            newErrors.parentName = 'Nama orang tua/wali wajib diisi';
        }

        if (!formData.parent_phone.trim()) {
            newErrors.parentPhone = 'Nomor telepon orang tua/wali wajib diisi';
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
            console.error('Error saving student:', error);
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex items-center mb-6">
                <button
                    onClick={onCancel}
                    className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {student ? 'Edit Murid' : 'Tambah Murid Baru'}
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {student ? 'Perbarui informasi murid' : 'Lengkapi informasi murid baru'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Foto Murid
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
                                className="cursor-pointer bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded-lg transition-colors"
                            >
                                {photoPreview ? 'Ubah Foto' : 'Upload Foto'}
                            </label>
                            {errors.photo && (
                                <p className="mt-1 text-sm text-red-600">{errors.photo}</p>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-3 space-y-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Murid</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nama Lengkap *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
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
                                        Umur *
                                    </label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleInputChange}
                                        min="4"
                                        max="80"
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                            errors.age ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Masukkan umur"
                                    />
                                    {errors.age && (
                                        <p className="mt-1 text-sm text-red-600">{errors.age}</p>
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
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
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
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                            errors.phone_number ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="08123456789"
                                    />
                                    {errors.phone_number && (
                                        <p className="mt-1 text-sm text-red-600">{errors.phone_number}</p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Alamat
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Masukkan alamat lengkap"
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                <UserIcon className="w-5 h-5 mr-2" />
                                Informasi Orang Tua/Wali
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nama Orang Tua/Wali *
                                    </label>
                                    <input
                                        type="text"
                                        name="parent_name"
                                        value={formData.parent_name}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                            errors.parent_name ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Nama orang tua/wali"
                                    />
                                    {errors.parent_name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.parent_name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Telepon Orang Tua/Wali *
                                    </label>
                                    <input
                                        type="tel"
                                        name="parent_phone"
                                        value={formData.parent_phone}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                            errors.parent_phone ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="08123456789"
                                    />
                                    {errors.parent_phone && (
                                        <p className="mt-1 text-sm text-red-600">{errors.parent_phone}</p>
                                    )}
                                </div>
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
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Menyimpan...' : (student ? 'Update' : 'Simpan')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StudentForm;