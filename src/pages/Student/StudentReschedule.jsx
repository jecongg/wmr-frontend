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

    // Gunakan Redux untuk mengambil riwayat
    const historyRequests = useSelector(selectRescheduleItems);
    const historyStatus = useSelector(selectRescheduleStatus);

    // State lokal untuk jadwal & form
    const [myAssignments, setMyAssignments] = useState([]);
    const [loadingAssignments, setLoadingAssignments] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [assignmentId, setAssignmentId] = useState("");
    const [originalDate, setOriginalDate] = useState("");
    const [requestedDate, setRequestedDate] = useState("");
    const [requestedTime, setRequestedTime] = useState("");
    const [reason, setReason] = useState("");

    useEffect(() => {
        // Ambil riwayat dari Redux
        if (historyStatus === "idle") {
            dispatch(fetchStudentRequests());
        }

        // Ambil jadwal aktif murid
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
                assignmentId, // Kirim assignmentId, bukan scheduleId
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
            dispatch(fetchStudentRequests()); // Refresh data riwayat
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
            {/* Kolom Form Pengajuan */}
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
                            onChange={(e) => setAssignmentId(e.target.value)}
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

                    <div>
                        <label
                            htmlFor="originalDate"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Tanggal Les Asli
                        </label>
                        <input
                            type="date"
                            id="originalDate"
                            value={originalDate}
                            onChange={(e) => setOriginalDate(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                        />
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
