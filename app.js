// Core Module
const path = require('path');

// External Module
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const url="mongodb+srv://Bidhan:Bidhan667@bidhan012.tm75ta4.mongodb.net/airbnb?appName=Bidhan012";
//Local Module
const storeRouter = require("./routes/storeRouter")
const hostRouter = require("./routes/hostRouter")
const rootDir = require("./utils/pathUtil");
const errorsController = require("./controllers/errors");
const authRouter = require("./routes/authRouter");
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true}));
app.use(express.static(path.join(rootDir, 'public')));
const store = new MongoDBStore({
  uri:url,
  collection: 'mySessions'
});
app.use(session({
  secret:'my secret key',
  resave:false,
  saveUninitialized:true,
  store:store
}))
app.use((req,res,next)=>{
  console.log("In the middleware");
  console.log(req.session);
   req.isLoggedIn = req.session.isLoggedIn || false;
   console.log("Is Logged In:", req.isLoggedIn);
   next();
})
app.use("/auth",authRouter);
app.use(storeRouter);
app.use("/host", hostRouter);
app.use(errorsController.pageNotFound);
const PORT = 3000;
const mongoose = require('mongoose');
mongoose.connect(url)
.then(result=>{
  console.log("Connected to Database");
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
})
.catch(err=>{
  console.log("Database connection error:", err);
});
