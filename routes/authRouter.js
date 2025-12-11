const authController = require("../controllers/authController");
const express = require("express");
const authRouter = express.Router();
authRouter.get("/login", authController.getLogin);
authRouter.post("/login", authController.postLogin);
authRouter.get("/logout",authController.getLogout);
authRouter.get("/signUp", authController.getSignUp);
authRouter.post("/signUp", authController.postSignUp);
module.exports = authRouter;