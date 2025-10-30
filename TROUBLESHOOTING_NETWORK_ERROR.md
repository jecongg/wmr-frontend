# Troubleshooting: Network Error saat Login

## ❌ Error: "Network Error"

### Gejala
```
Gagal validasi user di backend atau token expired: Network Error
```

Error ini muncul di console saat mencoba login (Google atau Email/Password).

---

## 🔍 Penyebab Umum

### 1. Backend Server Tidak Berjalan

**Check:**
```bash
# Di folder wmr-backend, check apakah server berjalan
# Seharusnya ada output: "Server berjalan di port 3000"
```

**Solusi:**
```bash
cd wmr-backend
npm start
```

**Expected Output:**
```
Server berjalan di port 3000
Database terhubung dengan MongoDB
```

---

### 2. Port Sudah Digunakan

**Check:**
```bash
# Windows PowerShell
netstat -ano | findstr :3000

# Jika ada output, berarti port 3000 sedang digunakan
```

**Solusi A - Kill Process:**
```bash
# Windows PowerShell (as Administrator)
# Cari PID dari netstat, lalu:
taskkill /PID <PID_NUMBER> /F
```

**Solusi B - Ubah Port:**
```bash
# Di wmr-backend/.env
PORT=3001

# Di wmr-frontend/.env
VITE_API_BASE_URL=http://localhost:3001/
```

Restart frontend dan backend setelah ubah port.

---

### 3. MongoDB Tidak Terhubung

**Check Backend Console:**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solusi:**
```bash
# Windows - Start MongoDB service
# Method 1: Services
1. Win + R → services.msc
2. Cari "MongoDB"
3. Right click → Start

# Method 2: Command Line (as Administrator)
net start MongoDB

# Verify MongoDB berjalan
mongosh
# atau
mongo
```

---

### 4. Environment Variable Tidak Terbaca

**Check Frontend:**
```javascript
// Di browser console
console.log(import.meta.env.VITE_API_BASE_URL)
// Should output: "http://localhost:3000/"
```

**Jika undefined:**
```bash
# Pastikan file .env ada di root folder wmr-frontend
# Pastikan nama variable diawali dengan VITE_
# Restart dev server setelah ubah .env
npm run dev
```

---

### 5. CORS Error

**Check Browser Console:**
```
Access to XMLHttpRequest at 'http://localhost:3000/api/auth/login-with-token' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solusi - Check Backend CORS Config:**
```javascript
// Di wmr-backend/index.js
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

**Check .env Backend:**
```bash
# Di wmr-backend/.env
FRONTEND_URL=http://localhost:5173
```

---

### 6. Firewall/Antivirus Blocking

**Windows Firewall:**
```bash
1. Control Panel → Windows Defender Firewall
2. Advanced Settings → Inbound Rules
3. New Rule → Port → TCP → 3000
4. Allow the connection
```

**Antivirus:**
- Temporarily disable antivirus
- Add exception untuk Node.js

---

## 🧪 Diagnostic Steps

### Step 1: Check Backend Health

**Test dengan cURL atau Browser:**
```bash
# Windows PowerShell
Invoke-WebRequest -Uri http://localhost:3000 -Method GET

# Atau buka di browser:
http://localhost:3000
```

**Expected Response:**
```
API Server Wisma Musik Rhapsodi is running!
```

**Jika error:**
- Backend tidak berjalan → Jalankan `npm start`
- Connection refused → Check port atau firewall

---

### Step 2: Check Backend Auth Endpoint

```bash
# Test dengan cURL (ganti <FIREBASE_TOKEN> dengan token valid)
curl -X POST http://localhost:3000/api/auth/login-with-token \
  -H "Content-Type: application/json" \
  -d '{"idToken":"<FIREBASE_TOKEN>"}'
```

**Expected Response (jika email tidak terdaftar):**
```json
{
  "success": false,
  "code": "email-not-registered",
  "message": "Email tidak terdaftar di sistem kami."
}
```

**Jika no response:**
- Route tidak terdaftar → Check `routes/authRoutes.js`
- Backend crash → Check backend console

---

### Step 3: Check Network Tab

**Browser DevTools → Network Tab:**
1. Clear network log
2. Try login
3. Look for request to `/api/auth/login-with-token`

**Status Codes:**
- **Failed** (red) → Backend tidak dapat dijangkau
- **200** → Success
- **401** → Token invalid
- **404** → Email tidak terdaftar
- **500** → Backend error

---

### Step 4: Check Console Logs

**Frontend Console (Browser):**
```javascript
// Good logs:
✅ Token refreshed successfully

// Error logs:
❌ Network Error: Backend tidak dapat dijangkau
❌ Backend Error: 404
❌ No Response: Backend tidak merespons
```

**Backend Console (Terminal):**
```javascript
// Good logs:
POST /api/auth/login-with-token 200
Server berjalan di port 3000

// Error logs:
Error: connect ECONNREFUSED (MongoDB)
TypeError: Cannot read property 'uid' of undefined
```

---

## 🔧 Quick Fix Checklist

Jalankan langkah-langkah ini secara berurutan:

### ✅ Checklist

- [ ] **Backend berjalan?**
  ```bash
  cd wmr-backend
  npm start
  ```

- [ ] **MongoDB berjalan?**
  ```bash
  net start MongoDB
  # atau check services.msc
  ```

- [ ] **Port 3000 tersedia?**
  ```bash
  netstat -ano | findstr :3000
  ```

- [ ] **Environment variables benar?**
  ```bash
  # Frontend: VITE_API_BASE_URL=http://localhost:3000/
  # Backend: FRONTEND_URL=http://localhost:5173
  ```

- [ ] **CORS configured?**
  ```javascript
  // Backend: cors({ origin: 'http://localhost:5173', credentials: true })
  ```

- [ ] **Firewall allow port 3000?**
  ```bash
  # Check Windows Firewall settings
  ```

- [ ] **Test backend health:**
  ```bash
  # Browser: http://localhost:3000
  # Expected: "API Server Wisma Musik Rhapsodi is running!"
  ```

---

## 💡 Development Best Practices

### 1. Start Backend First
```bash
# Terminal 1: Start Backend
cd wmr-backend
npm start

# Wait for: "Server berjalan di port 3000"
# Wait for: "Database terhubung dengan MongoDB"

# Terminal 2: Start Frontend
cd wmr-frontend
npm run dev
```

### 2. Keep Backend Console Visible
- Monitor untuk errors
- Check incoming requests
- Verify database connections

### 3. Use Proper Error Handling
Frontend sudah memiliki:
- ✅ Network error detection
- ✅ User-friendly error messages
- ✅ Automatic logout on backend failure
- ✅ Console logs untuk debugging

---

## 🚨 Common Error Messages

### "Network Error: Backend tidak dapat dijangkau"
**Cause:** Backend server tidak berjalan atau port salah  
**Fix:** Start backend dengan `npm start`

### "CORS policy: No 'Access-Control-Allow-Origin'"
**Cause:** CORS tidak dikonfigurasi dengan benar  
**Fix:** Check `cors()` config di backend

### "connect ECONNREFUSED 127.0.0.1:27017"
**Cause:** MongoDB tidak berjalan  
**Fix:** Start MongoDB service

### "listen EADDRINUSE: address already in use :::3000"
**Cause:** Port 3000 sudah digunakan  
**Fix:** Kill process atau ganti port

---

## 📞 Still Having Issues?

### Debug Mode

**Enable Verbose Logging:**

Frontend (`useFirebaseAuth.js`):
```javascript
console.log("🔍 DEBUG: Firebase User:", firebaseUser);
console.log("🔍 DEBUG: ID Token:", idToken);
console.log("🔍 DEBUG: API Base URL:", import.meta.env.VITE_API_BASE_URL);
```

Backend (`authController.js`):
```javascript
console.log("🔍 DEBUG: Received token:", req.body.idToken);
console.log("🔍 DEBUG: Decoded UID:", uid);
console.log("🔍 DEBUG: Found user:", userDoc);
```

### Test in Isolation

**Test Backend Only:**
```bash
# Use Postman or cURL
POST http://localhost:3000/api/auth/login-with-token
Body: { "idToken": "..." }
```

**Test Frontend Only:**
```javascript
// Mock backend response
console.log("Backend URL:", import.meta.env.VITE_API_BASE_URL);
```

---

## 📝 Summary

Paling sering, "Network Error" disebabkan oleh:
1. ❌ Backend tidak berjalan
2. ❌ MongoDB tidak terhubung
3. ❌ Port conflict

**Quick Fix:**
```bash
# 1. Start MongoDB
net start MongoDB

# 2. Start Backend
cd wmr-backend
npm start

# 3. Start Frontend
cd wmr-frontend
npm run dev

# 4. Test
# Browser: http://localhost:5173/login
```

Jika masih error, check console logs (browser & terminal) untuk detail lebih lanjut.
