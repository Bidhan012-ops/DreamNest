const Home = require("../models/home");
const User=require("../models/user");
exports.getAddHome = (req, res, next) => {
  res.render("host/addHome", {
    pageTitle: "Add Home to airbnb",
    currentPage: "addHome",
    isLoggedIn:req.session.isLoggedIn,
    user: req.session.user
  });
};

exports.getHostHomes = (req, res, next) => {
  const userId=req.session.user.id;
  User.findById(userId).populate("hostHomes").then((user)=>{
   console.log("The home check",user);
    res.render("host/host-home-list", {
      registeredHomes:user.hostHomes,
      pageTitle: "Host Homes List",
      currentPage: "host-homes",
      isLoggedIn:req.session.isLoggedIn,
      user: req.session.user
    })
  })
};
exports.postAddHome = (req, res, next) => {
  const userId=req.session.user.id;
  const { houseName, price, location, rating, photoUrl,id,description} = req.body;
  const home = new Home({houseName, price, location, rating, photoUrl,id,description});
  home.save().then(()=>{
     User.findById(userId).then((user)=>{
     const homeList=user.hostHomes;
     homeList.push(home._id);
     user.save().then(()=>{
       console.log("Home Added Successfully");
   res.render("host/home-added", {
    pageTitle: "Home Added Successfully",
    currentPage: "homeAdded",
    isLoggedIn:req.session.isLoggedIn,
    user: req.session.user
  })
     })
  })
  });
};
exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId).then((home) => {
    if (!home) {
      return res.redirect('/host/host-home-list');
    }
     console.log("Editing Home ID:", homeId);
  res.render("host/edit-home",{
    home:home,
     pageTitle: "edit Home",
    currentPage: "host-homes",
  isLoggedIn:req.session.isLoggedIn,
user:req.session.user
}
  );
  })
}
exports.postEditHome = (req, res, next) => {
  const { houseName, price, location, rating, photoUrl,_id,description } = req.body;
  console.log("Editing Home ID:", _id);
  Home.findById(_id).then((home) => {
    if (!home) {
      return res.redirect('/host/host-home-list');
    }
    home.houseName=houseName;
    home.price=price;
    home.location=location;
    home.rating=rating;
    home.photoUrl=photoUrl;
    home.description=description;
    return home.save();
}).then(()=>{
       console.log(" After Editing Home ID:", _id);
  res.redirect('/host/host-home-list');
  })
  .catch((err)=>{
    console.log("Error updating home:", err);
    res.redirect('/host/host-home-list'); 
  })
}
exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
    console.log("Deleting Home ID:", homeId);
    const userId=req.session.user.id;
  Home.findByIdAndDelete(homeId).then((result)=>{
    User.findById(userId).then((user)=>{
      const hosthomes=user.hostHomes;
      const newhosthomes=hosthomes.filter(homeid=>homeid.toString()!=homeId);
      user.hostHomes=newhosthomes;
      user.save().then(()=>{
       console.log("Home Deleted Successfully:", result);
         res.redirect('/host/host-home-list');
      })
    })
  })
}