# Quick Reference: Auto Token Refresh & Redirect

## 🎯 Apa yang Sudah Ditambahkan?

### 1. Auto Token Refresh ✅
- **Interval**: Setiap 50 menit (sebelum token expired di 60 menit)
- **Otomatis**: Tidak perlu user action
- **Silent**: Berjalan di background tanpa gangguan
- **Cleanup**: Otomatis stop saat logout

### 2. Auto Redirect After Login ✅
- **Role-based**: Admin → `/admin`, Teacher → `/teacher/dashboard`, Student → `/student/dashboard`
- **Smart Redirect**: Remember halaman yang dicoba diakses sebelum login
- **Success Alert**: Tampilkan welcome message setelah login
- **Improved UX**: Better loading state dan error handling

---

## 🔧 Cara Menggunakan

### User Experience

1. **Login Pertama Kali**:
   ```
   User buka /login → Login → Success Alert → Auto redirect ke dashboard
   ```

2. **Akses Protected Route (belum login)**:
   ```
   User buka /teacher/dashboard → Redirect ke /login → 
   Login → Auto redirect kembali ke /teacher/dashboard
   ```

3. **Session Tetap Aktif**:
   ```
   User login → Gunakan aplikasi 2 jam → 
   Token auto-refresh di t=50 menit dan t=100 menit → 
   User tidak perlu login ulang
   ```

---

## 🧪 Testing Checklist

### ✅ Test Token Refresh

```bash
# Di browser console, setiap 50 menit akan muncul:
🔄 Refreshing Firebase token...
✅ Token refreshed successfully
```

**Manual Test**:
1. Login
2. Wait 50-55 minutes
3. Check browser console for refresh logs
4. Try accessing protected routes (should still work)

### ✅ Test Auto Redirect

**Scenario 1**: Login as Admin
```bash
1. Logout
2. Go to /login
3. Login with admin credentials
4. Should redirect to /admin automatically
```

**Scenario 2**: Login as Teacher
```bash
1. Logout
2. Go to /login
3. Login with teacher credentials
4. Should redirect to /teacher/dashboard automatically
```

**Scenario 3**: Protected Route
```bash
1. Logout
2. Try to access /teacher/dashboard (in browser URL)
3. Should redirect to /login
4. Login as teacher
5. Should redirect back to /teacher/dashboard
```

**Scenario 4**: Unauthorized Access
```bash
1. Login as student
2. Try to access /admin (in browser URL)
3. Should redirect to /student/dashboard
```

---

## 📊 Console Logs untuk Monitoring

### Normal Flow
```
✅ Token refreshed successfully (setiap 50 menit)
```

### Error Flow
```
❌ Error refreshing token: [error message]
⚠️ Token refresh failed, logging out...
```

---

## 🐛 Common Issues

### Issue 1: Token Masih Expired Setelah 1 Jam
**Check**:
- Buka DevTools → Console
- Cari log "🔄 Refreshing Firebase token..."
- Jika tidak ada, cek `useFirebaseAuth.js` interval setup

### Issue 2: Tidak Auto Redirect Setelah Login
**Check**:
- Buka Redux DevTools
- Check apakah `user` dan `redirectTarget` sudah ada
- Check console untuk error di `useEffect` LoginPage

### Issue 3: Redirect ke Dashboard yang Salah
**Check**:
- Redux state → `auth.user.role`
- Backend response → apakah role sudah benar?

---

## 🔑 Key Files Modified

### Frontend
```
src/js/hooks/useFirebaseAuth.js         → Token refresh logic
src/pages/Login/LoginPage.jsx           → Auto redirect logic
src/components/Layout/ProtectedRoute.jsx → Save location for redirect
```

### Documentation
```
TOKEN_REFRESH_AND_REDIRECT.md → Full documentation
```

---

## 💡 Tips

### Development
- Set interval lebih pendek (2 menit) untuk testing:
  ```javascript
  // In useFirebaseAuth.js
  }, 2 * 60 * 1000); // 2 minutes for testing
  ```

### Production
- Keep interval 50 menit untuk production:
  ```javascript
  // In useFirebaseAuth.js
  }, 50 * 60 * 1000); // 50 minutes for production
  ```

### Monitoring
- Always check browser console for refresh logs
- Use Redux DevTools to monitor auth state
- Use Network tab to see token refresh requests

---

## 📞 Need Help?

Jika ada issue:
1. Check browser console untuk error messages
2. Check Redux DevTools untuk auth state
3. Check Network tab untuk request/response
4. Refer to `TOKEN_REFRESH_AND_REDIRECT.md` untuk detailed troubleshooting

---

## ✅ Verification Checklist

Sebelum deploy ke production:

- [ ] Token refresh interval set ke 50 menit
- [ ] Console logs untuk debugging sudah di-comment (optional)
- [ ] Test semua scenario redirect (admin, teacher, student)
- [ ] Test protected route redirect
- [ ] Test unauthorized access redirect
- [ ] Test token refresh dengan wait 50 menit
- [ ] Verify tidak ada memory leak (interval cleanup)
- [ ] Test logout functionality
- [ ] Test login dengan different roles
- [ ] Verify error messages user-friendly
