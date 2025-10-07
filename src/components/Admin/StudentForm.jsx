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
        phone: '',
        age: '',
        instrument: '',
        level: '',
        photo: '',
        parentName: '',
        parentPhone: '',
        parentEmail: '',
        address: '',
        emergencyContact: '',
        medicalInfo: '',
        goals: ''
    });

    const [photoPreview, setPhotoPreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const instruments = ['Piano', 'Guitar', 'Violin', 'Drums', 'Vocal', 'Bass', 'Flute', 'Saxophone'];
    const levels = ['Beginner', 'Intermediate', 'Advanced'];

    useEffect(() => {
        if (student) {
            setFormData({
                name: student.name || '',
                email: student.email || '',
                phone: student.phone || '',
                age: student.age || '',
                instrument: student.instrument || '',
                level: student.level || '',
                photo: student.photo || '',
                parentName: student.parentName || '',
                parentPhone: student.parentPhone || '',
                parentEmail: student.parentEmail || '',
                address: student.address || '',
                emergencyContact: student.emergencyContact || '',
                medicalInfo: student.medicalInfo || '',
                goals: student.goals || ''
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
        // Clear error when user starts typing
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
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({
                    ...prev,
                    photo: 'Ukuran file maksimal 5MB'
                }));
                return;
            }

            // Validate file type
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

        if (!formData.phone.trim()) {
            newErrors.phone = 'Nomor telepon wajib diisi';
        }

        if (!formData.age || formData.age < 4 || formData.age > 80) {
            newErrors.age = 'Umur harus antara 4-80 tahun';
        }

        if (!formData.instrument) {
            newErrors.instrument = 'Instrumen wajib dipilih';
        }

        if (!formData.level) {
            newErrors.level = 'Level wajib dipilih';
        }

        if (!formData.parentName.trim()) {
            newErrors.parentName = 'Nama orang tua/wali wajib diisi';
        }

        if (!formData.parentPhone.trim()) {
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
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            {/* Header */}
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
                    {/* Photo Upload */}
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

                    {/* Form Fields */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Student Information */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Murid</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Name */}
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

                                {/* Age */}
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

                                {/* Email */}
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

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nomor Telepon *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                            errors.phone ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="08123456789"
                                    />
                                    {errors.phone && (
                                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                                    )}
                                </div>

                                {/* Instrument */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Instrumen *
                                    </label>
                                    <select
                                        name="instrument"
                                        value={formData.instrument}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
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

                                {/* Level */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Level *
                                    </label>
                                    <select
                                        name="level"
                                        value={formData.level}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                            errors.level ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">Pilih Level</option>
                                        {levels.map(level => (
                                            <option key={level} value={level}>{level}</option>
                                        ))}
                                    </select>
                                    {errors.level && (
                                        <p className="mt-1 text-sm text-red-600">{errors.level}</p>
                                    )}
                                </div>
                            </div>

                            {/* Address */}
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

                        {/* Parent/Guardian Information */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                <UserIcon className="w-5 h-5 mr-2" />
                                Informasi Orang Tua/Wali
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Parent Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nama Orang Tua/Wali *
                                    </label>
                                    <input
                                        type="text"
                                        name="parentName"
                                        value={formData.parentName}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                            errors.parentName ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Nama orang tua/wali"
                                    />
                                    {errors.parentName && (
                                        <p className="mt-1 text-sm text-red-600">{errors.parentName}</p>
                                    )}
                                </div>

                                {/* Parent Phone */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Telepon Orang Tua/Wali *
                                    </label>
                                    <input
                                        type="tel"
                                        name="parentPhone"
                                        value={formData.parentPhone}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                            errors.parentPhone ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="08123456789"
                                    />
                                    {errors.parentPhone && (
                                        <p className="mt-1 text-sm text-red-600">{errors.parentPhone}</p>
                                    )}
                                </div>

                                {/* Parent Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Orang Tua/Wali
                                    </label>
                                    <input
                                        type="email"
                                        name="parentEmail"
                                        value={formData.parentEmail}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="orangtua@email.com"
                                    />
                                </div>

                                {/* Emergency Contact */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Kontak Darurat
                                    </label>
                                    <input
                                        type="tel"
                                        name="emergencyContact"
                                        value={formData.emergencyContact}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Kontak alternatif untuk keadaan darurat"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Tambahan</h3>
                            <div className="space-y-4">
                                {/* Medical Info */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Informasi Kesehatan (Alergi, Kondisi Khusus)
                                    </label>
                                    <textarea
                                        name="medicalInfo"
                                        value={formData.medicalInfo}
                                        onChange={handleInputChange}
                                        rows={2}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Informasi penting terkait kesehatan murid"
                                    />
                                </div>

                                {/* Goals */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tujuan Belajar Musik
                                    </label>
                                    <textarea
                                        name="goals"
                                        value={formData.goals}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Apa yang ingin dicapai murid dalam belajar musik..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
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