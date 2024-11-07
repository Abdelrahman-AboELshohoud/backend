const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  register,
  login,
  logout,
  validateToken,
} = require("../controllers/auth.controller.js");
const { verifyToken } = require("../middlewares/verifications.js");
const { body, validationResult } = require("express-validator");
const upload = require("../config/uploader.js");

const registerValidation = [
  body("username")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long")
    .escape(),
  body("email").isEmail().withMessage("Invalid email").escape(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .escape(),
  body("role")
    .notEmpty()
    .withMessage("Invalid role")
    .isIn(["patient", "nurse"])
    .withMessage("Invalid role")
    .escape(),
];

const loginValidation = [
  body("email").isEmail().withMessage("Invalid email").escape(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .escape(),
];

router.post(
  "/register",
  upload.single("file"),
  registerValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  register
);
router.use((req, res, next) => {
  console.log("hih");
  next();
});

// router.post("/upload", (req, res) => {
//   if (req.file) {
//     res.json({
//       imageUrl: req.file.path,
//       imageId: req.file.filename,
//     });
//     console.log("mwaaaaaaaaa");
//   } else {
//     res.status(400).json({ error: "Image upload failed" });
//   }
// });

router.post(
  "/login",
  loginValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  login
);

router.post("/logout", logout);

router.get("/validate", verifyToken, validateToken);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);

module.exports = router;
