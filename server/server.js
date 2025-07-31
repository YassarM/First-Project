const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors({
    origin: [
  'https://www.poinix.site',
  "http://localhost:5173"
],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true
}));
app.use(express.json());
// multer for file uploads
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// Set up storage for multer
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // folder penyimpanan
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });


const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MySQLStore = require("express-mysql-session")(session);

const bcrypt = require('bcrypt');
const saltRounds = 10;


app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));


const sessionStore = new MySQLStore({
    host: process.env.MYSQL_HOST,
    port: 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

app.use(session({
    key: "userid",
    secret: "poinix",
    resave: false,
    store: sessionStore,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        secure: true,
    },
}));

// ✅ Gunakan mysql2/promise
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.post('/user/:id/active', express.text(), async (req, res) => {
    const { id } = req.params;

    let active = false;
    try {
        const body = JSON.parse(req.body); // req.body masih berupa string
        active = body.active;
    } catch (err) {
        console.error("Invalid JSON in body:", req.body);
        return res.status(400).json({ error: "Invalid JSON" });
    }

    try {
        const [result] = await pool.query(
            `UPDATE users SET status = ? WHERE id_user = ?`,
            [active ? 'Active' : 'Inactive', id]
        );

        if (result.affectedRows > 0) {
            res.json({ message: `User ${active ? 'activated' : 'deactivated'} successfully` });
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error("Error updating user status:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// ✅ REGISTER
app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const role = req.body.role?.trim() || 'Guest';
    console.log("Registering user:", username, "Role:", role);
    let conn;
    if (username === null || password === null) {
        return res.status(400).json({ error: "⚠️ Username or Password cannot be empty!" })
    }
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
        // ✅ Hash password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const [idRole] = await pool.query(`SELECT id_roles FROM roles WHERE role = ?`, [role])
        // console.log("Connected to database for registration");
        console.log(idRole[0].id_roles)
        // ✅ Simpan user
        const [userResult] = await conn.query(
            `INSERT INTO users(username, password, id_role) VALUES (?, ?, ?)`,
            [username, hashedPassword, idRole[0].id_roles]
        );
        const [newUser] = await conn.query(
            `SELECT * FROM users WHERE id_user = ?`,
            [userResult.insertId]
        );
        res.json({ message: "✅ User Registered Successfully", user: newUser[0] });
        if (!res.ok) return { success: false, message: data.message || "Registration failed" };
        return { success: true, data, user: newUser[0] };
    } catch (error) {
        console.error('❌ Register Error:', error.message);
        return { success: false, message: error.message };
    } finally {
        if (conn) conn.release(); // Pastikan koneksi selalu dilepas
    }
});
app.post('/register-asjur', async (req, res) => {
    const { username, password, role, juri } = req.body.AsjurData;

    if (!username || !password) {
        return res.status(400).json({ error: "⚠️ Username or Password cannot be empty!" });
    }

    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        // Cek apakah username sudah ada
        const [existingUsers] = await conn.query(
            `SELECT * FROM users WHERE username = ?`,
            [username]
        );
        if (existingUsers.length > 0) {
            await conn.rollback();
            return res.status(400).json({ error: "⚠️ Username has been taken" });
        }

        // Hash password dan ambil role ID
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const [roleRes] = await conn.query(
            `SELECT id_roles FROM roles WHERE role = ?`,
            [role]
        );

        const idRole = roleRes[0]?.id_roles;
        if (!idRole) {
            await conn.rollback();
            return res.status(400).json({ error: "⚠️ Role not found" });
        }

        // Simpan user
        const [userResult] = await conn.query(
            `INSERT INTO users (username, password, id_role) VALUES (?, ?, ?)`,
            [username, hashedPassword, idRole]
        );

        const newUserId = userResult.insertId;

        // Ambil id_user dari juri
        const [juriRes] = await conn.query(
            `SELECT id_user FROM users WHERE username = ?`,
            [juri]
        );
        const id_juri = juriRes[0]?.id_user;

        if (!id_juri) {
            await conn.rollback();
            return res.status(400).json({ error: "⚠️ Juri not found" });
        }

        // Tambahkan ke tabel asisten
        await conn.query(
            `INSERT INTO asisten (id_asisten_juri, id_juri) VALUES (?, ?)`,
            [newUserId, id_juri]
        );

        // Ambil data user baru
        const [newUser] = await conn.query(
            `SELECT * FROM users WHERE id_user = ?`,
            [newUserId]
        );

        await conn.commit();

        res.json({ message: "✅ User Registered Successfully", user: newUser[0] });
    } catch (err) {
        await conn.rollback();
        console.error("Register Asjur Error:", err.message);
        res.status(500).json({ error: "❌ Registration failed due to server error" });
    } finally {
        conn.release();
    }
});

// ✅ LOGIN
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body)
    let conn;
    try {
        conn = await pool.getConnection();
        const [results] = await conn.query(
            `SELECT u.id_user,
            u.username,
            u.password,
            r.role
            FROM users u 
            JOIN roles r ON r.id_roles = u.id_role
            WHERE u.username = ?`,
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

        await conn.query(`UPDATE users SET status = "Active" WHERE id_user = ?`, [user.id_user]);
        req.session.user = user;
        console.log(user)
        res.json({ message: "✅ Login successful", data: user, LoggedIn: true });
    } catch (err) {
        console.error("❌ Login Error:", err);
        res.json({ LoggedIn: false })
    } finally {
        if (conn) conn.release(); // Always release the connection
    }
});

// ✅ LOGOUT
app.post('/logout', async (req, res) => {
    const user = req.session.user;

    if (user) {
        try {
            const conn = await pool.getConnection();
            await conn.query(`UPDATE users SET status = "Inactive" WHERE id_user = ?`, [user.id_user]);
            console.log("Successfully Log out")
            conn.release();
        } catch (err) {
            console.error("❌ Error setting inactive:", err.message);
        }
    }

    req.session.destroy(err => {
        if (err) return res.status(500).send({ message: "Logout failed" });
        res.clearCookie('userid');
        res.status(200).send({ message: "Logout successful" });
    });
});

// ✅ CEK SESSION
app.post("/session", (req, res) => {
    if (req.session.user) {
        // console.log(req.session.user)
        res.json({ LoggedIn: true, user: req.session.user });
    } else {
        // console.log(req.session.user)
        res.json({ LoggedIn: false });
    }
});

// ✅ GET ALL USERS
app.get('/users', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const [results] = await conn.query(`
            SELECT 
            u.id_user,
            u.username,
            r.role,
            u.status,
            u.date
             FROM users u
             JOIN roles r ON u.id_role = r.id_roles`);
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

// ✅ GET ROLES
app.get('/roles', async (req, res) => {
    let conn
    try {
        conn = await pool.getConnection();
        const [results] = await conn.query(`SELECT * FROM roles`);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) conn.release();

    }
});

app.get('/user-role-juri', async (req, res) => {
    try {
        const [resRole] = await pool.query(`SELECT id_roles FROM roles WHERE role = 'Juri'`)
        const roleId = resRole[0]?.id_roles;
        const [result] = await pool.query(`SELECT * FROM users WHERE id_role = ?`, [roleId])
        res.json(result)
    } catch (err) {
        console.log(err)
    }
})


app.post('/status/:id', async (req, res) => {
    const { id } = req.params;
    const { user_id } = req.body
    try {
        const [results] = await pool.query(`SELECT status FROM graded WHERE id_peserta = ? AND id_juri = ?`, [id, user_id]);
        // console.log(results)
        if (results.length === 0) {
            console.log("Peserta not found");
            return res.status(404).json({ error: "Peserta not found" });
        }
        console.log("Status peserta:", results[0].status);
        res.json({ status: results[0].status });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ POST PBB MURNI
app.post('/motion-input', async (req, res) => {
    const data = req.body;

    try {
        for (const row of data) {
            const { id, id_score, label, nilai, id_kategori } = row;
            console.log("Row data:", row);
            if (id) {
                // Update
                await pool.query(`UPDATE motion SET motion = ? WHERE id_motion = ?`, [label, id]);
                await pool.query(`UPDATE score SET \`1st\` = ?, \`2nd\` = ?, \`3th\` = ?, \`4th\` = ?, \`5th\` = ? WHERE id_score = ?`, [...nilai, id_score]);
            } else {
                console.log("Insert mode");
                console.log("Inserting score:", nilai);
                // Insert baru
                const [scoreResult] = await pool.query(`INSERT INTO score (\`1st\`, \`2nd\`, \`3th\`, \`4th\`, \`5th\`) VALUES (?, ?, ?, ?, ?)`, nilai);
                const newScoreId = scoreResult.insertId;

                await pool.query(`INSERT INTO motion (motion, id_score, id_kategori) VALUES (?, ?, ?)`, [label, newScoreId, id_kategori]);
            }
        }

        res.json({ success: true });
    } catch (err) {
        console.error("SQL Error:", err.message);
        res.status(500).json({ error: 'Gagal simpan data', detail: err.message });
    }
});
app.post('/motion', async (req, res) => {
    const id_kategori = req.body.data
    console.log(req.body)
    console.log("id kategori:", req.body.data)
    try {

        const [rows] = await pool.query(`
      SELECT
        m.id_motion AS id,
        m.id_score,
        m.id_kategori,
        m.motion,
        s.\`1st\` AS nilai_1,
        s.\`2nd\` AS nilai_2,
        s.\`3th\` AS nilai_3,
        s.\`4th\` AS nilai_4,
        s.\`5th\` AS nilai_5

      FROM motion m
      JOIN score s ON m.id_score = s.id_score
      WHERE id_kategori = ?
    `, [id_kategori]);

        const result = rows.map((row) => ({
            id: row.id,
            id_score: row.id_score,
            motion: row.motion,
            id_kategori: row.id_kategori,
            nilai: [
                row.nilai_1,
                row.nilai_2,
                row.nilai_3,
                row.nilai_4,
                row.nilai_5
            ]
        }));
        console.log("Result:", result)
        res.json(result);
    } catch (err) {
        console.error('❌ Error ambil data:', err);
        res.status(500).json({ error: 'Gagal ambil data' });
    }
});
app.get('/motion/kategori', async (req, res) => {
    try {
        const [rows] = await pool.query(`SELECT * FROM kategori`);
        console.log("Kategori yang diambil:", rows);

        res.json(rows);
    } catch (err) {
        console.error('❌ Error ambil kategori:', err);
        res.status(500).json({ error: 'Gagal ambil kategori' });
    }
});
app.patch('/motion/kategori/:id', async (req, res) => {
    const { id } = req.params;
    const { nama, prioritas } = req.body;
    console.log('test',req.body)
    console.log("Updating category:", id, nama.nama_kategori, prioritas);

    const [result] = await pool.query(`UPDATE kategori SET nama_kategori = ?, prioritas = ? WHERE id_kategori = ?`, [nama.nama_kategori, prioritas, id]);
    if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Kategori tidak ditemukan' });
    }
    res.json({ success: true, message: 'Kategori berhasil diperbarui' });

})
app.get('/scores', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM score");
    res.json(rows);
  } catch (err) {
    console.error("Error ambil skor:", err);
    res.status(500).json({ error: "Gagal ambil skor" });
  }
});
app.delete('/motion/kategori/:id', async (req, res) => {
    const { id } = req.params;
    console.log("Deleting category:", id);
    const [result] = await pool.query(`DELETE FROM kategori WHERE id_kategori = ?`, [id]);
    if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Kategori tidak ditemukan' });
    }
    res.json({ success: true, message: 'Kategori berhasil dihapus' });

});
// X Hapus data
app.delete('/motion-delete/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const [[row]] = await pool.query(`SELECT id_score FROM motion WHERE id_motion = ?`, [id]);
        if (!row) return res.status(404).json({ error: 'Data tidak ditemukan' });

        await pool.query(`DELETE FROM motion WHERE id_motion = ?`, [id]);
        await pool.query(`DELETE FROM score WHERE id_score = ?`, [row.id_score]);

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Gagal hapus data' });
    }
});

app.post('/motion/tambah/kategori', async (req, res) => {
    const { nama_kategori, prioritas } = req.body;
    console.log("Adding category:", nama_kategori, "with priority:", prioritas);
    try {
        const [result] = await pool.query(`INSERT INTO kategori (nama_kategori, prioritas) VALUES (?, ?)`, [nama_kategori, prioritas]);
        res.json({ id_kategori: result.insertId, nama_kategori, prioritas });
    } catch (err) {
        console.error("❌ Error tambah kategori:", err);
        res.status(500).json({ error: 'Gagal tambah kategori' });
    }
})

// Grading status
app.patch('/grading-status/:id', async (req, res) => {
    const { id } = req.params;
    const { id_juri } = req.body;
    console.log(id, id_juri)
    await pool.query("UPDATE graded SET status = 'Graded' WHERE id_peserta = ? AND id_juri = ?", [id, id_juri]);
    res.json({ success: true });

});
app.post('/input-nilai', async (req, res) => {
    const nilaiArray = req.body.data;
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        for (const scoring of nilaiArray) {
            const { id_peserta, id_data, id_juri, nilai } = scoring;
            console.log(id_peserta, id_data, id_juri, nilai)
            await conn.query(
                `INSERT INTO nilai ( id_peserta, id_juri, id_motion ,nilai)
                 VALUES (?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE
                   nilai = VALUES(nilai)`,
                [id_peserta, id_juri, id_data, nilai]
            );
        }
        await conn.commit();
        res.json({ succes: true });

    } catch (err) {
        await conn.rollback();
        console.error("❌ Gagal simpan nilai:", err);
        res.status(500).json({ error: 'Gagal simpan nilai' });

    } finally {
        conn.release();
    }
});
app.post('/ungraded/:id', async (req, res) => {
    const id = req.params.id
    const user_id = req.body.user_id
    // console.log("test",id, user_id)
    try {
        const [existing] = await pool.query(
            `SELECT * FROM graded WHERE id_peserta = ? AND id_juri = ?`,
            [id, user_id]
        );

        if (existing.length > 0) {
            return res.status(200).json({ message: 'Sudah ada, tidak perlu insert' });
        }
        await pool.query(
            `INSERT IGNORE INTO graded (id_peserta, status, id_juri) VALUES (?, 'Ungraded', ?)`,
            [id, user_id]
        );
        res.json({ message: 'Data Masuk' })
    } catch (error) {
        res.status(500).json({ error: 'Gagal Input' })
    }
})
// Submit note for peserta
// Asisten/Juri can submit notes for a participant
app.post('/peserta/:id/note', async (req, res) => {
    const { id } = req.params; // peserta id
    const { note, id_user } = req.body; // id_user = asisten

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        // Try to update first
        const [existing] = await conn.query(
            "SELECT * FROM notes WHERE id_peserta = ? AND id_asisten = ?",
            [id, id_user]
        );
        if (existing.length > 0) {
            // Update
            await conn.query(
                "UPDATE notes SET note = ? WHERE id_peserta = ? AND id_asisten = ?",
                [note, id, id_user]
            );
        } else {
            // Insert
            await conn.query(
                "INSERT INTO notes (id_peserta, id_asisten, note) VALUES (?, ?, ?)",
                [id, id_user, note]
            );
        }
        const [idJuri] = await conn.query(`
    SELECT id_juri FROM asisten WHERE id_asisten_juri = ?`, [id_user])
        console.log('Id Juri:', idJuri)
        await conn.query(`UPDATE graded SET status = 'Locked' WHERE id_peserta = ? AND id_juri = ?`, [id, idJuri[0].id_juri])
        await conn.commit();
        res.json({ success: true, message: 'Note saved successfully' });

    } catch (error) {
        await conn.rollback();
        console.error("❌ Error in note submission:", error);
        res.status(500).json({ error: 'Gagal simpan catatan' });
    } finally {
        conn.release();
    }
});


app.get('/all-pelatih', async (req, res) => {
    try {
        const [results] = await pool.query(`
            SELECT 
            u.id_user,
            u.username
             FROM users u
             JOIN roles r ON u.id_role = r.id_roles
             WHERE r.role = 'Pelatih'`);
        console.log("Fetched pelatih:", results);
        res.json(results);
    } catch (err) {
        console.error("❌ Error fetching pelatih:", err);
        res.status(500).json({ error: 'Gagal ambil data pelatih' });
    }
});
app.get('/peserta/by-pelatih/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [results] = await pool.query(
            `SELECT p.*, u.username AS pelatih FROM peserta p 
       LEFT JOIN users u ON p.id_pelatih = u.id_user 
       WHERE p.id_pelatih = ?`, [id]
        );
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.delete('/delete-pelatih/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const conn = await pool.getConnection();
        // Optional: delete peserta first if FK constraint exists
        await conn.query(`DELETE FROM peserta WHERE id_pelatih = ?`, [id]);
        await conn.query(`DELETE FROM users WHERE id_user = ?`, [id]);
        conn.release();
        res.json({ message: "Pelatih deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// ✅ GET PESERTA
app.get('/peserta', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const [rows] = await conn.query(`
            SELECT 
            p.id_peserta,
            p.nama_peserta,
            p.sekolah,
            p.logo,
            u.username AS pelatih
             FROM peserta p
             JOIN users u ON p.id_pelatih = u.id_user`);
        const result = rows.map(r => ({
            ...r,
            logo: r.logo ? `/uploads/${r.logo}` : null
        }));

        res.json(result)
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) conn.release();
    }
});
app.delete('/peserta/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const conn = await pool.getConnection();
        await conn.query(`DELETE FROM peserta WHERE id_peserta = ?`, [id]);
        res.json({ message: "Peserta deleted successfully" });
        conn.release();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/input-peserta', async (req, res) => {
    console.log("Peserta data received:", req.body);
    const pesertaList = req.body;
    for (const peserta of pesertaList) {
        const { id_peserta, nama_peserta, sekolah, logo, id_pelatih } = peserta;
        if (id_peserta) {
            await pool.query(`UPDATE peserta SET nama_peserta = ?, sekolah = ?, logo = ?, id_pelatih = ? WHERE id_peserta = ?`, [nama_peserta, sekolah, logo, id_pelatih, id_peserta])
        } else {
            await pool.query(
                `INSERT INTO peserta (nama_peserta, sekolah, logo, id_pelatih) VALUES (?, ?, ?, ?)`,
                [nama_peserta, sekolah, logo, id_pelatih]);
        }
    }
    res.json({ success: true });
});

app.get('/juri-by-asjur', async (req, res) => {
    const [rows] = await pool.query(`
        SELECT * FROM asisten 
    `);
    res.json(rows);
})

app.get('/peserta/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query(`
            SELECT * FROM peserta WHERE id_pelatih = ?
        `, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Peserta not found" });
        }
        const peserta = rows[0];
        peserta.logo = peserta.logo ? `/uploads/${peserta.logo}` : null;
        res.json(peserta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/nilai/peserta/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query(`
            SELECT n.*, m.motion, k.nama_kategori AS kategori, u.username AS juri
            FROM nilai n
            JOIN motion m ON n.id_motion = m.id_motion
            JOIN users u ON n.id_juri = u.id_user
            JOIN kategori k ON m.id_kategori = k.id_kategori
            WHERE n.id_peserta = ?
        `, [id]);
        console.log("Nilai peserta:", rows);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint upload logo
app.post('/upload-logo', upload.single('logo'), (req, res) => {
    const filename = req.file.filename;
    console.log("Logo uploaded:", filename);
    res.json({
        success: true,
        filePath: `${req.file.filename}`
    });
});


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// ✅ START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port , ${PORT}`);
});
