const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/auth");
const { User } = require("../database");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "avatar-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpg, .jpeg, .png formats are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
});

router.post(
  "/register",
  upload.single("profilePhoto"),
  [
    body("firstName", "İsim alanı zorunludur.").not().isEmpty().trim(),
    body("lastName", "Soyisim alanı zorunludur.").not().isEmpty().trim(),
    body("email", "Lütfen geçerli bir email adresi girin.").isEmail(),
    body("password", "Şifre en az 8 karakter uzunluğunda olmalı.").isLength({
      min: 8,
    }),
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

      const newUserPayload = {
        firstName,
        lastName,
        email,
        password,
        country,
        city,
        profilePhotoUrl: req.file
          ? `${process.env.BACKEND_URL || "http://localhost:9090"}/uploads/${
              req.file.filename
            }`
          : null,
      };

      user = new User(newUserPayload);

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

// --- GOOGLE AUTH ROTASI ---
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// --- GOOGLE AUTH GERİ ÇAĞIRMA ROTASI ---
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    if (!req.user) {
      return res.redirect("http://localhost:5173/login?error=auth_failed");
    }
    try {
      const payload = { user: { id: req.user.id } };
      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET || "mysecretjwtkey",
        { expiresIn: "24h" }
      );
      const redirectUrl = `http://localhost:5173/auth/callback?token=${token}`;
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
