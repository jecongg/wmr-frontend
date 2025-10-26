import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchTeachers, 
  selectAllTeachers, 
  selectTeachersStatus,
  selectTeachersError 
} from '../../redux/slices/teacherSlice';
import { 
  fetchStudents, 
  selectAllStudents, 
  selectStudentsStatus,
  selectStudentsError 
} from '../../redux/slices/studentSlice';

/**
 * Custom hook untuk mengelola data admin (guru dan murid)
 * Hook ini akan otomatis fetch data jika belum ada di Redux store
 * 
 * @param {boolean} autoFetch - Jika true, akan otomatis fetch data saat hook dipanggil
 * @returns {Object} - Object berisi data teachers, students, dan status loading/error
 */
export const useAdminData = (autoFetch = true) => {
  const dispatch = useDispatch();

  // Teachers data
  const teachers = useSelector(selectAllTeachers);
  const teachersStatus = useSelector(selectTeachersStatus);
  const teachersError = useSelector(selectTeachersError);

  // Students data
  const students = useSelector(selectAllStudents);
  const studentsStatus = useSelector(selectStudentsStatus);
  const studentsError = useSelector(selectStudentsError);

  // Auto fetch jika enabled
  useEffect(() => {
    if (autoFetch) {
      if (teachersStatus === 'idle') {
        dispatch(fetchTeachers());
      }
      if (studentsStatus === 'idle') {
        dispatch(fetchStudents());
      }
    }
  }, [autoFetch, dispatch, teachersStatus, studentsStatus]);

  // Manual fetch functions
  const refetchTeachers = () => dispatch(fetchTeachers());
  const refetchStudents = () => dispatch(fetchStudents());
  const refetchAll = () => {
    dispatch(fetchTeachers());
    dispatch(fetchStudents());
  };

  return {
    // Teachers
    teachers,
    teachersStatus,
    teachersError,
    isLoadingTeachers: teachersStatus === 'loading',
    
    // Students
    students,
    studentsStatus,
    studentsError,
    isLoadingStudents: studentsStatus === 'loading',
    
    // Combined status
    isLoading: teachersStatus === 'loading' || studentsStatus === 'loading',
    hasError: teachersStatus === 'failed' || studentsStatus === 'failed',
    isReady: teachersStatus === 'succeeded' && studentsStatus === 'succeeded',
    
    // Refetch functions
    refetchTeachers,
    refetchStudents,
    refetchAll,
  };
};

