// External Module
const express = require("express");
const storeRouter = express.Router();

// Local Module
const homesController = require("../controllers/storeController");

storeRouter.get("/", homesController.getIndex);
storeRouter.get("/homes", homesController.getHomes);
storeRouter.get("/bookings", homesController.getBookings);
storeRouter.get("/favourites", homesController.getFavouriteList);
storeRouter.get("/home-details/:homeId", homesController.getHomeDetails);
storeRouter.post("/favourite", homesController.postAddToFavourites);
storeRouter.post("/remove-favourite", homesController.postRemoveFromFavourites);
module.exports = storeRouter;
