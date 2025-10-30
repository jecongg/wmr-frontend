# Token Refresh & Auto Redirect Documentation

## 🔄 Auto Token Refresh

### Masalah yang Diselesaikan
Firebase ID Token memiliki masa berlaku 1 jam. Setelah expired, user harus login ulang. Ini memberikan pengalaman yang buruk.

### Solusi
Implementasi auto token refresh setiap 50 menit (sebelum token expired di 60 menit).

### Implementasi

#### Di `useFirebaseAuth.js`:

```javascript
const tokenRefreshInterval = useRef(null);

const setupTokenRefresh = (firebaseUser) => {
    if (tokenRefreshInterval.current) {
        clearInterval(tokenRefreshInterval.current);
    }

    if (firebaseUser) {
        // Refresh token setiap 50 menit
        tokenRefreshInterval.current = setInterval(async () => {
            try {
                console.log("🔄 Refreshing Firebase token...");
                const newToken = await firebaseUser.getIdToken(true); // force refresh
                
                // Update session di backend dengan token baru
                const response = await api.post('/api/auth/login-with-token', {
                    idToken: newToken
                });

                if (response.data.success) {
                    console.log("✅ Token refreshed successfully");
                    dispatch(setUser(response.data.user));
                }
            } catch (error) {
                console.error("❌ Error refreshing token:", error);
            }
        }, 50 * 60 * 1000); // 50 menit
    }
};
```

### Cara Kerja

1. **Saat Login Berhasil**:
   - Setup interval yang berjalan setiap 50 menit
   - Interval ini akan memanggil `firebaseUser.getIdToken(true)` untuk refresh token
   - Token baru dikirim ke backend untuk update session

2. **Saat Logout**:
   - Clear interval agar tidak ada background process yang berjalan
   - Cleanup resources

3. **Monitoring**:
   - Console log menampilkan status refresh token
   - `🔄 Refreshing Firebase token...` - Proses refresh dimulai
   - `✅ Token refreshed successfully` - Refresh berhasil
   - `❌ Error refreshing token` - Refresh gagal

### Timeline

```
Login (t=0)
  ↓
Token valid selama 60 menit
  ↓
t=50 menit → Auto refresh token ✅
  ↓
Token valid lagi selama 60 menit (total 110 menit dari login awal)
  ↓
t=100 menit → Auto refresh token ✅
  ↓
Dan seterusnya...
```

### Keuntungan

- ✅ User tidak perlu login ulang setiap 1 jam
- ✅ Session tetap aktif selama user masih menggunakan aplikasi
- ✅ Token selalu fresh dan valid
- ✅ Mencegah error "Token expired" saat melakukan request ke backend

---

## 🎯 Auto Redirect After Login

### Masalah yang Diselesaikan
Setelah login, user perlu diarahkan otomatis ke dashboard sesuai role mereka.

### Solusi
Implementasi auto redirect dengan React Router dan Redux.

### Implementasi

#### 1. Redux State (`authSlice.js`)

```javascript
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        status: 'idle',
        redirectTarget: null,
    },
    reducers: {
        setUser: (state, action) => {
            const userData = action.payload;
            state.user = userData;
            state.status = 'succeeded';

            // Set redirect target berdasarkan role
            if (userData) {
                if (userData.role === 'admin') {
                    state.redirectTarget = '/admin';
                } else if (userData.role === 'teacher') {
                    state.redirectTarget = '/teacher/dashboard';
                } else if (userData.role === 'student') {
                    state.redirectTarget = '/student/dashboard';
                } else {
                    state.redirectTarget = '/';
                }
            }
        },
    },
});
```

#### 2. Login Page (`LoginPage.jsx`)

```javascript
const user = useSelector(selectUser);
const redirectTarget = useSelector(selectRedirectTarget);
const location = useLocation();

useEffect(() => {
    if (user && redirectTarget) {
        // Check jika ada redirect path dari location state
        const from = location.state?.from?.pathname || redirectTarget;
        
        Swal.fire({
            title: "Login Berhasil!",
            text: `Selamat datang, ${user.name || user.email}!`,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            timerProgressBar: true
        }).then(() => {
            navigate(from, { replace: true });
        });
    }
}, [user, redirectTarget, navigate, location]);
```

#### 3. Protected Route (`ProtectedRoute.jsx`)

```javascript
const ProtectedRoute = ({ allowedRoles }) => {
    const location = useLocation();
    
    if (!user) {
        // Simpan location untuk redirect setelah login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    // ... rest of code
};
```

### Flow Redirect

#### Scenario 1: Direct Login
```
User buka /login
  ↓
Login dengan email/password atau Google
  ↓
onAuthStateChanged terpicu
  ↓
Backend return user data dengan role
  ↓
Redux set redirectTarget berdasarkan role:
  - Admin → /admin
  - Teacher → /teacher/dashboard
  - Student → /student/dashboard
  ↓
LoginPage useEffect detect user + redirectTarget
  ↓
Show success alert
  ↓
Redirect ke dashboard sesuai role
```

#### Scenario 2: Login dari Protected Route
```
User coba akses /teacher/dashboard (belum login)
  ↓
ProtectedRoute detect user = null
  ↓
Redirect ke /login dengan state: { from: { pathname: '/teacher/dashboard' } }
  ↓
User login
  ↓
LoginPage detect location.state.from
  ↓
Redirect ke /teacher/dashboard (original destination)
```

#### Scenario 3: Akses Unauthorized Route
```
Student coba akses /admin
  ↓
ProtectedRoute detect role mismatch
  ↓
Redirect ke redirectTarget (/student/dashboard)
```

### Role-based Dashboard Mapping

| Role    | Redirect Target        |
|---------|------------------------|
| admin   | `/admin`               |
| teacher | `/teacher/dashboard`   |
| student | `/student/dashboard`   |
| unknown | `/` (landing page)     |

---

## 🧪 Testing

### Test Auto Token Refresh

1. **Setup**:
   ```javascript
   // Ubah interval menjadi lebih pendek untuk testing
   // Di useFirebaseAuth.js, ubah dari 50 * 60 * 1000 menjadi 2 * 60 * 1000 (2 menit)
   tokenRefreshInterval.current = setInterval(async () => {
       // ...
   }, 2 * 60 * 1000); // 2 menit untuk testing
   ```

2. **Test Steps**:
   - Login ke aplikasi
   - Buka Browser DevTools → Console
   - Tunggu 2 menit
   - Lihat console log: `🔄 Refreshing Firebase token...`
   - Lihat console log: `✅ Token refreshed successfully`
   - Check Network tab → Ada POST request ke `/api/auth/login-with-token`

3. **Verify**:
   - Token berhasil di-refresh
   - Session tetap aktif
   - Tidak ada error di console

### Test Auto Redirect

#### Test 1: Login Direct

```bash
# Steps:
1. Buka /login
2. Login sebagai admin
3. Lihat redirect ke /admin
4. Logout
5. Login sebagai teacher
6. Lihat redirect ke /teacher/dashboard
7. Logout
8. Login sebagai student
9. Lihat redirect ke /student/dashboard
```

#### Test 2: Protected Route Redirect

```bash
# Steps:
1. Logout (pastikan tidak ada session)
2. Buka URL /teacher/dashboard langsung di browser
3. Otomatis redirect ke /login
4. Login sebagai teacher
5. Otomatis redirect kembali ke /teacher/dashboard
```

#### Test 3: Unauthorized Access

```bash
# Steps:
1. Login sebagai student
2. Coba akses /admin di browser
3. Otomatis redirect ke /student/dashboard
4. Coba akses /teacher/dashboard
5. Otomatis redirect ke /student/dashboard
```

### Test Loading State

```bash
# Steps:
1. Logout
2. Login dengan email/password
3. Lihat loading spinner muncul sebentar
4. Loading hilang, redirect ke dashboard
```

---

## 🎨 UI/UX Improvements

### Loading Spinner di ProtectedRoute

```jsx
<div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    flexDirection: 'column',
    gap: '20px'
}}>
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
    <p className="text-gray-600">Memuat...</p>
</div>
```

### Success Alert di LoginPage

```javascript
Swal.fire({
    title: "Login Berhasil!",
    text: `Selamat datang, ${user.name || user.email}!`,
    icon: 'success',
    timer: 1500,
    showConfirmButton: false,
    timerProgressBar: true
})
```

### Error Messages

| Error Code | User Message |
|------------|--------------|
| `auth/user-not-found` | Email tidak terdaftar di sistem kami |
| `auth/wrong-password` | Password yang Anda masukkan salah |
| `auth/invalid-credential` | Password yang Anda masukkan salah |
| `auth/too-many-requests` | Terlalu banyak percobaan login. Silakan coba lagi nanti |
| `auth/popup-closed-by-user` | Popup login ditutup. Silakan coba lagi |

---

## 🔒 Security Considerations

### Token Refresh Security

1. **Force Refresh**: Menggunakan `getIdToken(true)` untuk memastikan token benar-benar fresh
2. **Backend Verification**: Token selalu diverifikasi di backend sebelum update session
3. **Automatic Cleanup**: Interval di-clear saat logout untuk mencegah memory leak

### Redirect Security

1. **Replace History**: Menggunakan `replace: true` untuk mencegah user kembali ke login page dengan back button
2. **Role Validation**: Backend tetap validasi role meskipun frontend sudah redirect
3. **State Persistence**: Location state hanya menyimpan path, tidak menyimpan sensitive data

---

## 📊 Performance

### Token Refresh Impact

- **Interval**: Setiap 50 menit
- **Request Size**: ~200 bytes (hanya idToken)
- **Response Size**: ~500 bytes (user data)
- **Network Impact**: Minimal (1 request per 50 menit)
- **Memory Impact**: Negligible (1 interval timer)

### Redirect Performance

- **Loading Time**: < 100ms (Redux state update)
- **Alert Duration**: 1.5 detik (configurable)
- **Total Redirect Time**: ~1.6 detik dari login berhasil

---

## 🐛 Troubleshooting

### Token Refresh Tidak Bekerja

**Symptoms**: Token expired error setelah 1 jam
**Solutions**:
1. Check console log, apakah ada pesan "🔄 Refreshing Firebase token..."?
2. Check Network tab, apakah ada POST request ke `/api/auth/login-with-token` setiap 50 menit?
3. Verify interval setup di `useFirebaseAuth.js`

### Redirect Tidak Bekerja

**Symptoms**: Setelah login, tetap di halaman login
**Solutions**:
1. Check Redux DevTools, apakah `user` dan `redirectTarget` sudah set?
2. Check console, apakah ada error di `useEffect` LoginPage?
3. Verify `navigate` function dari `react-router-dom`

### Redirect ke Wrong Dashboard

**Symptoms**: Admin redirect ke student dashboard
**Solutions**:
1. Check user role di Redux state
2. Verify logic di `authSlice.js` reducer `setUser`
3. Check backend response, apakah role sudah benar?

### Loading State Stuck

**Symptoms**: Loading spinner terus muncul
**Solutions**:
1. Check `authStatus` di Redux state
2. Verify `onAuthStateChanged` di `useFirebaseAuth.js`
3. Check backend response time

---

## 🚀 Future Improvements

### Token Refresh
- [ ] Implement exponential backoff untuk retry saat refresh gagal
- [ ] Add offline detection, pause refresh saat offline
- [ ] Store last refresh time di localStorage untuk debugging
- [ ] Implement silent refresh di background tab

### Redirect
- [ ] Add animated transition saat redirect
- [ ] Implement "Remember last visited page" untuk better UX
- [ ] Add breadcrumb navigation
- [ ] Implement deep linking support

---

## 📝 Summary

### Auto Token Refresh
✅ Token di-refresh setiap 50 menit otomatis
✅ User tidak perlu login ulang
✅ Session tetap aktif selama aplikasi digunakan
✅ Cleanup otomatis saat logout

### Auto Redirect
✅ Redirect otomatis berdasarkan role setelah login
✅ Remember original destination (untuk protected routes)
✅ Prevent unauthorized access dengan redirect
✅ Smooth UX dengan loading state dan success alert
