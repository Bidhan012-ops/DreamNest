const Home = require("../models/home");
const user = require("../models/user");
const User = require("../models/user");
exports.getIndex = (req, res, next) => {
  console.log(req.session);
 Home.find()
 .then((registeredHomes)=>{
res.render("store/index", {
      registeredHomes: registeredHomes,
      pageTitle: "airbnb Home",
      currentPage: "index",
      isLoggedIn:req.session.isLoggedIn,
      user: req.session.user
    })
   })
};
exports.getHomes = (req, res, next) => {
   Home.find().then((registeredHomes)=>{
 res.render("store/home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Homes List",
      currentPage: "Home",
      isLoggedIn:req.session.isLoggedIn,
      user: req.session.user
    })
   })
};

exports.getBookings = (req, res, next) => {
  res.render("store/bookings", {
    pageTitle: "My Bookings",
    currentPage: "bookings",
    isLoggedIn:req.session.isLoggedIn,
    user: req.session.user
  })
};

exports.getFavouriteList = (req, res, next) => {
  const userId = req.session.user.id;

  User.findById(userId)
    .populate('favourites')
    .then(user => {
      if (!user) {
        return res.render("store/favourite-list", {
          registeredHomes: [],
          pageTitle: "My Favourites",
          currentPage: "favourites",
          isLoggedIn: req.session.isLoggedIn,
          user: req.session.user
        });
      }
      console.log("Fetched Favourites:", user.favourites);
      res.render("store/favourite-list", {
        registeredHomes: user.favourites,   // this is already an array
        pageTitle: "My Favourites",
        currentPage: "favourites",
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user
      });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};
exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
 console.log(req.params.homeId);
  Home.findById(homeId).then((home) => {
    console.log("Fetched Home:", home);
    if(!home) {
     res.redirect('/');
     return;
    }
    res.render("store/home-detail", {
    pageTitle: "Home Details",
    currentPage: "index",
    home: home,
    isLoggedIn:req.session.isLoggedIn,
    user: req.session.user
  });
  })
}
exports.postAddToFavourites = async (req, res, next) => {
  if(!req.isLoggedIn){
    return res.redirect('/auth/login');
  }
  const homeID = req.body.homeId;
  if(!homeID){
    return res.redirect('/favourites');
  }
  const userId=req.session.user.id;
  const user= await User.findById(userId);
      if (!user.favourites.includes(homeID)) {
      user.favourites.push(homeID);
      await user.save();      
    }
 return res.redirect('/favourites');
}
exports.postRemoveFromFavourites = async (req, res, next) => {
  const homeId = req.body.homeId;
  const userId=req.session.user.id;
 User.findById(userId).then((user)=>{
   if(user){
    const favouriteHomes=user.favourites;
    const newfavourites=favouriteHomes.filter(homeid=>homeid.toString()!=homeId);
    user.favourites=newfavourites;
     user.save().then(()=>{
     console.log("Removed from favourites");
     res.redirect('/favourites');
     })
     .catch(()=>{
      console.log("Error occured during new favouite save when remove from favouite");
     })
    
   }
 })
}