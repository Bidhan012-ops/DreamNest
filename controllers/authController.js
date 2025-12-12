const { check,validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcrypt");
exports.getLogin = (req, res, next) => {
    res.render("auth/login", { pageTitle: "Login" , currentPage: "Login",isLoggedIn:req.session.isLoggedIn, errorMessages: [],user:{}});
}
exports.postLogin = async (req, res, next) => {
  const {email, password} = req.body;
  const user = await User.findOne({email});
  if (!user) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      currentPage: "login",
      isLoggedIn: false,
      errorMessages: ["User does not exist"],
      oldInput: {email},
      user: {},
    });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      currentPage: "login",
      isLoggedIn: false,
      errorMessages: ["Invalid Password"],
      oldInput: {email},
      user: {},
    });
  }
  req.session.isLoggedIn = true;
  req.session.user={id:user._id.toString(),userName:user.userName,email:user.email,accountType:user.accountType};
   req.session.save((err)=>{
    if(err){
      console.log("Session save error:", err);
    }
    else {
      console.log("User logged in successfully");
  console.log("In the post login",req.session);
  res.redirect("/");
    }
  });
}
exports.getLogout = (req, res, next) => {
  req.session.destroy((err)=>{
    res.redirect("/");
  });
}
exports.getSignUp = (req, res, next) => {
  res.render("auth/signUp", { pageTitle: "Sign Up" , currentPage: "SignUp",isLoggedIn:req.session.isLoggedIn, errorMessages: [], oldInput: {username:"", password:"", confirmPassword:"",accountType:"",user:{}} });
}
exports.postSignUp = [
  check("username").
  notEmpty().
  withMessage("Username cannot be empty").
  isLength({min:4}).
  withMessage("Username must be at least 4 characters long"),
  check("email").
  isEmail().
  withMessage("Please enter a valid email address"),
  check("password").
  isLength({min:6}).
  withMessage("Password must be at least 6 characters long").
  matches(/[0-9]/).
  withMessage("Password must contain a number").
  matches(/[A-Z]/).
  withMessage("Password must contain an uppercase letter").
  matches(/[@$!%*?&]/).
  withMessage("Password must contain a special character")
  ,
  check("confirmPassword").custom((value,{req})=>{
    if(value !== req.body.password){
      throw new Error("Passwords do not match");
    }
    return true;
  }),
  check("accountType").custom((value,{req})=>{  //custom validator recived the value of the field and meta object which have req,location(param,query),path
    if(value !== "host" && value !== "guest"){
      throw new Error("Invalid account type selected");
    }
    return true;
  }),
  async (req, res, next) => {
  const {username,email,password,accountType}= req.body;
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signUp", {
      pageTitle: "Sign Up",
      currentPage: "SignUp",
      isLoggedIn: req.session.isLoggedIn || false,
      errorMessages: errors.array().map(err => err.msg),
      oldInput: {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        accountType: req.body.accountType
      }
    });
  }
  const hashedPassword =bcrypt.hashSync(password, 10);
  const newUser = new User({
    userName: username,
    email: email,
    password: hashedPassword,
    accountType: accountType
  });
  newUser.save()
  .then(() => {
    console.log("User registered successfully");
    res.redirect("/auth/login");
  })
  .catch(err => {
     res.render("auth/signUp", { pageTitle: "Sign Up" , currentPage: "SignUp",isLoggedIn:req.session.isLoggedIn, errorMessages: ["user or email exixt"], oldInput: {username:"", password:"", confirmPassword:"",accountType:"",user:{}} });
  });
}]
