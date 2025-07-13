const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const bcrypt = require('bcrypt');
const saltRounds = 10;

app.use(express.json());
app.use(cors({
    origin: [
  "http://localhost:5173",
  "https://first-project-gamma-wheat.vercel.app"
],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    key: "userid",
    secret: "Kemal",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
}));

// ✅ Gunakan mysql2/promise
const mysql = require('mysql2/promise');
cconst pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ✅ REGISTER
app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const role = req.body.role?.trim() || 'Guest';
    let conn;

    try {
        conn = await pool.getConnection();

        // ✅ Cek apakah username sudah ada
        const [existingUsers] = await conn.query(
            `SELECT * FROM users WHERE username = ?`,
            [username]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ error: "⚠️ Username has been taken" });
        }

        // ✅ Simpan password asli (optional & sensitif)
        const [passResult] = await conn.query(
            `INSERT INTO real_password(real_password) VALUES (?)`,
            [password]
        );
        const idPassword = passResult.insertId;
        console.log("Password ID: ", idPassword);

        // ✅ Hash password
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log("Hash Password: ", hashedPassword);

        // ✅ Simpan user
        const [userResult] = await conn.query(
            `INSERT INTO users(username, password, role, id_password) VALUES (?, ?, ?, ?)`,
            [username, hashedPassword, role, idPassword]
        );
        const [newUser] = await conn.query(
            `SELECT * FROM users WHERE id_user = ?`,
            [userResult.insertId]
        );
        res.json({ message: "✅ User Registered Successfully", user: newUser[0] });
        if(!res.ok)  return { success: false, message: data.message || "Registration failed" };
        return { success: true, data, user: newUser[0] };
    } catch (error) {
        console.error('❌ Register Error:', error.message);
        return { success: false, message: error.message };
    } finally {
        if (conn) conn.release(); // Pastikan koneksi selalu dilepas
    }
});


// ✅ LOGIN
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const conn = await pool.getConnection();
        const [results] = await conn.query(
            `SELECT * FROM users WHERE username = ?`,
            [username]
        );

        if (results.length === 0) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        req.session.user = user;
        res.json({ message: "✅ Login successful", data: user });
        conn.release();
    } catch (err) {
        console.error("❌ Login Error:", err.message);
        res.status(500).json({ error: "SQL lu bangsat" });
    }
});

// ✅ LOGOUT
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send({ message: "Logout failed" });
        res.clearCookie('userid');
        res.status(200).send({ message: "Logout successful" });
    });
});

// ✅ CEK SESSION
app.get("/login", (req, res) => {
    if (req.session.user) {
        res.send({ LoggedIn: true, user: req.session.user });
    } else {
        res.send({ LoggedIn: false });
    }
});

// ✅ GET ALL USERS
app.get('/users', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const [results] = await conn.query(`
            SELECT u.id_user,u.username,u.role,p.real_password AS password
            FROM users u
            JOIN real_password p ON u.id_password = p.id_password`);
        res.json(results);
        conn.release();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ GET ONE USER
app.get('/user/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const conn = await pool.getConnection();
        const [result] = await conn.query(`SELECT * FROM users WHERE id_user = ?`, [id]);
        res.json(result[0]);
        conn.release();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ DELETE USER
app.delete('/user/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const conn = await pool.getConnection();
        await conn.query(`DELETE FROM users WHERE id_user = ?`, [id]);
        res.json({ message: "User deleted successfully" });
        conn.release();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ UPDATE USER
app.patch('/user/:id', async (req, res) => {
    const { id } = req.params;
    const { username, role } = req.body;
    try {
        const conn = await pool.getConnection();
        await conn.query(`UPDATE users SET username = ?, role = ? WHERE id_user = ?`, [username, role, id]);
        res.json({ message: "User updated successfully" });
        conn.release();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get('/roles', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const [results] = await conn.query(`SELECT DISTINCT role FROM users`);
        res.json(results.map(row => row.role));
        conn.release();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get('/peserta', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const [results] = await conn.query(`SELECT * FROM peserta`);
        res.json(results);
        conn.release();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// ✅ START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server started on port", PORT);
});
