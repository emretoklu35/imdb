// server/routes/auth.js
const auth = require("../middleware/auth");
const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // jsonwebtoken'i de dahil ediyoruz
const User = require("../models/User");

const router = express.Router();

// --- KULLANICI KAYIT ROTASI ---
// @route   POST api/auth/register
// @desc    Yeni bir kullanıcı kaydeder
// @access  Public (Herkes erişebilir)
router.post(
  "/register",
  [
    body("email", "Lütfen geçerli bir email adresi girin.").isEmail(),
    body("password", "Lütfen en az 8 karakterli bir şifre girin.").isLength({
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

    const { email, password, country, city, profilePhotoUrl } = req.body;

    try {
      let user = await User.findOne({ where: { email } });
      if (user) {
        return res
          .status(400)
          .json({ msg: "Bu email adresi zaten kullanımda." });
      }

      user = new User({
        email,
        password,
        country,
        city,
        profilePhotoUrl: profilePhotoUrl || null,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // TODO: Kullanıcı kaydolduktan sonra direkt token verip login yapabiliriz. Şimdilik ayrı tutuyoruz.
      res.status(201).json({ msg: "Kullanıcı başarıyla kaydedildi." });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Sunucu hatası.");
    }
  }
);

// --- KULLANICI GİRİŞ ROTASI ---
// @route   POST api/auth/login
// @desc    Kullanıcıyı doğrular ve token döndürür
// @access  Public (Herkes erişebilir)
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

      // JWT (JSON Web Token) Oluşturma
      // Token'ın içine koyacağımız bilgi (payload)
      const payload = {
        user: {
          id: user.id, // Kullanıcının benzersiz ID'sini token'a ekliyoruz
        },
      };

      // Token'ı imzala
      jwt.sign(
        payload,
        "mysecretjwtkey", // Gizli anahtar. Bu normalde .env dosyasında saklanmalıdır.
        { expiresIn: 3600 }, // Token'ın geçerlilik süresi (saniye cinsinden, 1 saat)
        (err, token) => {
          if (err) throw err;
          res.json({ token }); // Başarılı girişte kullanıcıya token'ı gönder
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Sunucu hatası.");
    }
  }
);
// @route   GET api/auth/me
// @desc    Get logged in user
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    // req.user.id, middleware tarafından token'dan çözülüp eklendi
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] }, // Şifre hariç diğer bilgileri seç
    });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
// Router'ı export ediyoruz ki index.js'te kullanılabilsin.
module.exports = router;
