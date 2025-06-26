// Dosya Yolu: server/routes/auth.js (TAM VE GÜNCEL HALİ)

const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport"); // Passport.js'i import ediyoruz
const auth = require("../middleware/auth");
const { User } = require("../database");

const router = express.Router();

// --- NORMAL KULLANICI KAYIT ROTASI ---
router.post(
  "/register",
  [
    body("firstName", "İsim alanı zorunludur.").not().isEmpty().trim(),
    body("lastName", "Soyisim alanı zorunludur.").not().isEmpty().trim(),
    body("email", "Lütfen geçerli bir email adresi girin.").isEmail(),
    body(
      "password",
      "Şifre en az 8 karakter uzunluğunda olmalı, en az bir sayı ve bir özel karakter içermelidir."
    )
      .isLength({ min: 8 })
      .matches(/\d/)
      .matches(/[!@#$%^&*(),.?":{}|<>]/),
    body("country", "Ülke alanı zorunludur.").not().isEmpty(),
    body("city", "Şehir alanı zorunludur.").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { firstName, lastName, email, password, country, city } = req.body;
    try {
      let user = await User.findOne({ where: { email } });
      if (user) {
        return res
          .status(400)
          .json({ msg: "Bu email adresi zaten kullanımda." });
      }
      user = new User({ firstName, lastName, email, password, country, city });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      res.status(201).json({ msg: "Kullanıcı başarıyla kaydedildi." });
    } catch (err) {
      console.error("Kayıt sırasında sunucu hatası:", err.message);
      res.status(500).send("Sunucu hatası.");
    }
  }
);

// --- NORMAL KULLANICI GİRİŞ ROTASI ---
router.post(
  "/login",
  [
    body("email", "Lütfen geçerli bir email adresi girin.").isEmail(),
    body("password", "Şifre alanı zorunludur.").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ msg: "Geçersiz kullanıcı bilgileri." });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Geçersiz kullanıcı bilgileri." });
      }
      const payload = { user: { id: user.id } };
      jwt.sign(
        payload,
        process.env.JWT_SECRET || "mysecretjwtkey",
        { expiresIn: "24h" },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error("Giriş sırasında sunucu hatası:", err.message);
      res.status(500).send("Sunucu hatası.");
    }
  }
);

// --- GİRİŞ YAPMIŞ KULLANICI BİLGİLERİNİ GETİRME ROTASI ---
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    res.json(user);
  } catch (err) {
    console.error("Kullanıcı bilgisi alınırken sunucu hatası:", err.message);
    res.status(500).send("Server Error");
  }
});

// --- GOOGLE AUTH ROTASI (ADIM 1: GOOGLE'A YÖNLENDİRME) ---
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"], // Google'dan hangi bilgileri istediğimizi belirtiyoruz
  })
);

// --- GOOGLE AUTH GERİ ÇAĞIRMA ROTASI (ADIM 2: GOOGLE'DAN GELEN CEVABI İŞLEME) ---
// Dosya Yolu: server/routes/auth.js (/google/callback rotası)

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    // ADIM 1: req.user objesinin gelip gelmediğini kontrol et
    if (!req.user) {
      console.error("Passport.js'ten sonra req.user objesi bulunamadı.");
      return res.redirect("http://localhost:5173/login?error=auth_failed");
    }

    console.log("Passport tarafından doğrulanan kullanıcı:", req.user.id);

    try {
      // ADIM 2: JWT Token'ı oluştur
      const payload = { user: { id: req.user.id } };
      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET || "mysecretjwtkey",
        { expiresIn: "24h" }
      );

      console.log("Oluşturulan JWT Token:", token);

      // ADIM 3: Frontend'e yönlendir
      const redirectUrl = `http://localhost:5173/auth/callback?token=${token}`;
      console.log("Yönlendirilecek URL:", redirectUrl);

      return res.redirect(redirectUrl);
    } catch (err) {
      console.error("JWT imzalama veya yönlendirme sırasında hata:", err);
      return res.redirect(
        "http://localhost:5173/login?error=token_signing_failed"
      );
    }
  }
);

module.exports = router;
