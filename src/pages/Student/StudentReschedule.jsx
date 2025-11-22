// File: pages/Student/StudentReschedule.jsx (VERSI BARU & LENGKAP)
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import api from "../../js/services/api";
import {
    fetchStudentRequests,
    selectRescheduleItems,
    selectRescheduleStatus,
} from "../../redux/slices/rescheduleSlice";

const StudentReschedule = () => {
    const dispatch = useDispatch();

    const historyRequests = useSelector(selectRescheduleItems);
    const historyStatus = useSelector(selectRescheduleStatus);

    const [myAssignments, setMyAssignments] = useState([]);
    const [loadingAssignments, setLoadingAssignments] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [assignmentId, setAssignmentId] = useState("");
    const [originalDate, setOriginalDate] = useState("");
    const [requestedDate, setRequestedDate] = useState("");
    const [requestedTime, setRequestedTime] = useState("");
    const [reason, setReason] = useState("");
    const [isAutoDate, setIsAutoDate] = useState(true); 

    const getNextScheduleDate = (scheduleDay) => {
        const dayMap = {
            'Minggu': 0,
            'Senin': 1,
            'Selasa': 2,
            'Rabu': 3,
            'Kamis': 4,
            'Jumat': 5,
            'Sabtu': 6
        };

        const today = new Date();
        const targetDay = dayMap[scheduleDay];
        
        if (targetDay === undefined) return '';

        const currentDay = today.getDay();
        let daysUntilNext = targetDay - currentDay;
        
        if (daysUntilNext <= 0) {
            daysUntilNext += 7;
        }

        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + daysUntilNext);

        return nextDate.toISOString().split('T')[0];
    };

    useEffect(() => {
        if (historyStatus === "idle") {
            dispatch(fetchStudentRequests());
        }

        const fetchAssignments = async () => {
            try {
                const response = await api.get("/api/assignments/student/me");
                setMyAssignments(response.data);
            } catch (error) {
                console.error("Gagal memuat jadwal:", error);
            } finally {
                setLoadingAssignments(false);
            }
        };

        fetchAssignments();
    }, [historyStatus, dispatch]);

    const resetForm = () => {
        setAssignmentId("");
        setOriginalDate("");
        setRequestedDate("");
        setRequestedTime("");
        setReason("");
        setIsAutoDate(true); // Reset ke mode otomatis
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            !assignmentId ||
            !originalDate ||
            !requestedDate ||
            !requestedTime ||
            !reason
        ) {
            Swal.fire("Gagal", "Mohon lengkapi semua kolom formulir.", "error");
            return;
        }
        setIsSubmitting(true);
        try {
            await api.post("/api/reschedule/student/create", {
                assignmentId, 
                originalDate,
                requestedDate,
                requestedTime,
                reason,
            });

            Swal.fire(
                "Berhasil!",
                "Permintaan ganti jadwal Anda telah berhasil dikirim.",
                "success"
            );
            dispatch(fetchStudentRequests()); 
            resetForm();
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                "Gagal mengirim permintaan. Silakan coba lagi.";
            Swal.fire("Error", errorMessage, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    const getStatusBadge = (status) => {
        switch (status) {
            case "approved":
                return "bg-green-100 text-green-800";
            case "rejected":
                return "bg-red-100 text-red-800";
            default:
                return "bg-yellow-100 text-yellow-800";
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <title>Pergantian Jadwal | Wisma Musik Rapsodi</title>
            <div className="lg:col-span-2">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-6 rounded-xl shadow-lg space-y-4"
                >
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        Formulir Ganti Jadwal
                    </h2>

                    <div>
                        <label
                            htmlFor="assignment"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Pilih Jadwal
                        </label>
                        <select
                            id="assignment"
                            value={assignmentId}
                            onChange={(e) => {
                                const selectedId = e.target.value;
                                setAssignmentId(selectedId);
                                
                                if (selectedId && isAutoDate) {
                                    const selectedAssignment = myAssignments.find(
                                        assign => assign.id === selectedId
                                    );
                                    if (selectedAssignment?.scheduleDay) {
                                        const nextDate = getNextScheduleDate(selectedAssignment.scheduleDay);
                                        setOriginalDate(nextDate);
                                    }
                                } else if (!selectedId) {
                                    setOriginalDate('');
                                }
                            }}
                            disabled={loadingAssignments}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="">
                                {loadingAssignments
                                    ? "Memuat..."
                                    : "-- Pilih Jadwal --"}
                            </option>
                            {myAssignments.map((assign) => (
                                <option key={assign.id} value={assign.id}>
                                    {assign.instrument} ({assign.scheduleDay},{" "}
                                    {assign.startTime})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Pertemuan Selanjutnya?
                                </label>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    const newAutoMode = !isAutoDate;
                                    setIsAutoDate(newAutoMode);
                                    
                                    if (newAutoMode && assignmentId) {
                                        const selectedAssignment = myAssignments.find(
                                            assign => assign.id === assignmentId
                                        );
                                        if (selectedAssignment?.scheduleDay) {
                                            const nextDate = getNextScheduleDate(selectedAssignment.scheduleDay);
                                            setOriginalDate(nextDate);
                                        }
                                    }
                                    else if (!newAutoMode) {
                                        setOriginalDate('');
                                    }
                                }}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                    isAutoDate ? 'bg-indigo-600' : 'bg-gray-300'
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        isAutoDate ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="originalDate"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Tanggal Les Asli {isAutoDate ? "(Otomatis)" : ""}
                        </label>
                        <input
                            type="date"
                            id="originalDate"
                            value={originalDate}
                            onChange={(e) => setOriginalDate(e.target.value)}
                            readOnly={isAutoDate}
                            disabled={!assignmentId}
                            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm ${
                                isAutoDate 
                                    ? 'bg-gray-100 cursor-not-allowed' 
                                    : 'bg-white'
                            } ${!assignmentId ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            {isAutoDate 
                                ? "Tanggal pertemuan selanjutnya berdasarkan jadwal yang dipilih" 
                                : "Pilih tanggal les yang ingin diganti"}
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor="requestedDate"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Tanggal Pengganti
                        </label>
                        <input
                            type="date"
                            id="requestedDate"
                            value={requestedDate}
                            onChange={(e) => setRequestedDate(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="requestedTime"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Waktu Pengganti
                        </label>
                        <input
                            type="time"
                            id="requestedTime"
                            value={requestedTime}
                            onChange={(e) => setRequestedTime(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="reason"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Alasan
                        </label>
                        <textarea
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows="3"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                            placeholder="Contoh: Ada acara keluarga mendadak"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {isSubmitting ? "Mengirim..." : "Kirim Permintaan"}
                    </button>
                </form>
            </div>

            {/* Kolom Riwayat Pengajuan */}
            <div className="lg:col-span-3">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        Riwayat Pengajuan Anda
                    </h2>
                    {historyStatus === "loading" && <p>Memuat riwayat...</p>}
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {historyStatus === "succeeded" &&
                            historyRequests.length === 0 && (
                                <p className="text-center text-gray-500 py-4">
                                    Belum ada riwayat pengajuan.
                                </p>
                            )}
                        {historyRequests.map((req) => (
                            <div
                                key={req.id}
                                className="border border-gray-200 p-4 rounded-lg"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-gray-700">
                                            {req.assignment?.instrument} (
                                            {req.assignment?.scheduleDay})
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Diajukan pada:{" "}
                                            {formatDate(req.createdAt)}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                                            req.status
                                        )}`}
                                    >
                                        {req.status}
                                    </span>
                                </div>
                                <div className="mt-3 text-sm border-t pt-3">
                                    <p>
                                        <span className="font-medium">
                                            Jadwal Asli:
                                        </span>{" "}
                                        {formatDate(req.originalDate)}
                                    </p>
                                    <p>
                                        <span className="font-medium">
                                            Jadwal Baru:
                                        </span>{" "}
                                        {formatDate(req.requestedDate)} pukul{" "}
                                        {req.requestedTime}
                                    </p>
                                    <p className="mt-2">
                                        <span className="font-medium">
                                            Alasan:
                                        </span>{" "}
                                        {req.reason}
                                    </p>
                                    {req.teacherComment && (
                                        <p className="mt-2 bg-gray-50 p-2 rounded-md">
                                            <span className="font-medium">
                                                Komentar Guru:
                                            </span>{" "}
                                            {req.teacherComment}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentReschedule;
