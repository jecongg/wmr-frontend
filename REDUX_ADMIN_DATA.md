# Redux Admin Data Management

## Overview
Sistem ini mengelola data guru dan murid menggunakan Redux, dengan auto-fetch saat admin login.

## Struktur Redux

### Store Structure
```
store
├── auth (authSlice)
│   ├── user
│   ├── status
│   └── redirectTarget
├── teachers (teacherSlice)
│   ├── items: []
│   ├── status: 'idle' | 'loading' | 'succeeded' | 'failed'
│   └── error: null
└── students (studentSlice)
    ├── items: []
    ├── status: 'idle' | 'loading' | 'succeeded' | 'failed'
    └── error: null
```

## Backend Endpoints

### Teachers
- `GET /api/admin/list-teachers` - Mengambil semua data guru
- `POST /api/admin/teachers` - Menambahkan guru baru (invite)

### Students
- `GET /api/admin/list-students` - Mengambil semua data murid
- `POST /api/admin/students` - Menambahkan murid baru
- `PUT /api/admin/students/:id` - Update data murid
- `DELETE /api/admin/students/:id` - Hapus murid

## Flow Data

### 1. Admin Login
```
User Login (Firebase Auth)
    ↓
AuthSlice.setUser()
    ↓
AdminPage component mounted
    ↓
useEffect detects user.role === 'admin'
    ↓
Dispatch fetchTeachers() & fetchStudents()
    ↓
API calls to backend
    ↓
Data stored in Redux
```

### 2. Accessing Data
Data guru dan murid dapat diakses dari komponen manapun menggunakan Redux selectors:

```javascript
import { useSelector } from 'react-redux';
import { selectAllTeachers } from '../../redux/slices/teacherSlice';
import { selectAllStudents } from '../../redux/slices/studentSlice';

function MyComponent() {
  const teachers = useSelector(selectAllTeachers);
  const students = useSelector(selectAllStudents);
  
  return (
    <div>
      <p>Total Guru: {teachers.length}</p>
      <p>Total Murid: {students.length}</p>
    </div>
  );
}
```

## Cara Penggunaan

### Menggunakan Custom Hook (Recommended)
```javascript
import { useAdminData } from '../../js/hooks/useAdminData';

function MyComponent() {
  const { 
    teachers, 
    students, 
    isLoading, 
    isReady,
    refetchAll 
  } = useAdminData();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Teachers: {teachers.length}</h2>
      <h2>Students: {students.length}</h2>
      <button onClick={refetchAll}>Refresh Data</button>
    </div>
  );
}
```

### Manual Redux Access
```javascript
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchTeachers, 
  selectAllTeachers 
} from '../../redux/slices/teacherSlice';

function MyComponent() {
  const dispatch = useDispatch();
  const teachers = useSelector(selectAllTeachers);

  // Manual fetch
  const loadTeachers = () => {
    dispatch(fetchTeachers());
  };

  return <div>...</div>;
}
```

## Redux Actions

### Teacher Slice Actions
```javascript
import { 
  fetchTeachers,      // Async thunk untuk fetch data
  addTeacher,         // Action untuk menambah guru ke state
  updateTeacher,      // Action untuk update guru di state
  removeTeacher       // Action untuk hapus guru dari state
} from '../../redux/slices/teacherSlice';

// Contoh penggunaan
dispatch(fetchTeachers());  // Fetch dari API
dispatch(addTeacher(newTeacherData));  // Tambah ke state
dispatch(updateTeacher(updatedTeacherData));  // Update state
dispatch(removeTeacher(teacherId));  // Hapus dari state
```

### Student Slice Actions
```javascript
import { 
  fetchStudents,      // Async thunk untuk fetch data
  addStudent,         // Action untuk menambah murid ke state
  updateStudent,      // Action untuk update murid di state
  removeStudent       // Action untuk hapus murid dari state
} from '../../redux/slices/studentSlice';

// Contoh penggunaan sama seperti teacher
```

## Update State Setelah CRUD Operations

### Menambah Data Baru
```javascript
// Setelah berhasil POST ke backend
const response = await api.post('/admin/teachers', newTeacherData);
if (response.data.teacher) {
  dispatch(addTeacher(response.data.teacher));
}
```

### Update Data
```javascript
// Setelah berhasil PUT ke backend
const response = await api.put(`/admin/students/${id}`, updatedData);
if (response.data.success) {
  dispatch(updateStudent(updatedData));
}
```

### Hapus Data
```javascript
// Setelah berhasil DELETE di backend
const response = await api.delete(`/admin/students/${id}`);
if (response.data.success) {
  dispatch(removeStudent(id));
}
```

## Best Practices

1. **Auto Fetch on Admin Login**: Data di-fetch otomatis saat admin login pertama kali di `AdminPage.jsx`

2. **Cache di Redux**: Data disimpan di Redux store, jadi tidak perlu fetch ulang setiap kali component re-render

3. **Update State Setelah CRUD**: Setelah operasi create/update/delete, update Redux state agar UI sinkron tanpa perlu fetch ulang

4. **Loading States**: Gunakan status dari Redux untuk menampilkan loading indicator

5. **Error Handling**: Check error state dari Redux untuk menampilkan error message

## Files Modified

### Frontend
- `src/redux/slices/studentSlice.js` - Redux slice untuk students (NEW)
- `src/redux/slices/teacherSlice.js` - Updated dengan actions tambahan
- `src/redux/store.js` - Added studentSlice
- `src/pages/Admin/AdminPage.jsx` - Auto-fetch logic on admin login
- `src/components/Admin/Dashboard.jsx` - Menggunakan data dari Redux
- `src/js/hooks/useAdminData.js` - Custom hook untuk admin data (NEW)

### Backend
- `routes/adminRoutes.js` - Added GET /list-teachers endpoint
- `controllers/adminController.js` - Added listTeachers function

## Testing

1. Login sebagai admin
2. Check console untuk "Fetching teachers data..." dan "Fetching students data..."
3. Data akan tersimpan di Redux DevTools
4. Dashboard akan menampilkan jumlah guru dan murid yang sebenarnya
5. Data dapat diakses dari komponen manapun tanpa fetch ulang

