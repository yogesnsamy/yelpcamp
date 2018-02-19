var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   price: String,
   author:{
     id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
   },
   comments: [
      {
         // ori code by colt: 
         type: mongoose.Schema.Types.ObjectId,
         // type: mongoose.Schema.Types.Object, //for push(comment) to work
         ref: "Comment"
      }
   ]
})//,{ usePushEach: true });

module.exports = mongoose.model("Campground", campgroundSchema);
