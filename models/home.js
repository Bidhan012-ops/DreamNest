const mongoose = require('mongoose');
/**
 this.houseName = houseName;
    this.price = price;
    this.location = location;
    this.rating = rating;
    this.photoUrl = photoUrl;
    this.description=description;
    this._id=_id;
 */
// const Favourite = require("./favourite");
const homeSchema = new mongoose.Schema({
  houseName: {type: String, required: true},
  price: {type: Number, required: true},
  location: {type: String, required: true},
  rating: {type: Number, required: true},
  photoUrl: {type: String, required: true},
  description: {type: String, required: true}
});
module.exports = mongoose.model('Home', homeSchema);
homeSchema.pre('findByIdAndDelete', async function(next) {
  const homeId = this.getQuery()._id;
 await mongoose.model("User").updateMany(
  { favourites: homeId },
  { $pull: { favourites: homeId } }
);
  next();
});