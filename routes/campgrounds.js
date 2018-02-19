var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// display all campgrounds
router.get("/", function(req,res){
	Campground.find({},function(err,allCampgrounds){
	if(err){
		console.log(err);
		req.flash("error", err.message);
		} 
		else {
		res.render("campgrounds/index",{campgrounds:allCampgrounds});
	}
});
})

router.post("/",middleware.isLoggedIn,function(req,res){
	var name 	= req.body.name;
	var image 	= req.body.image;
	var desc	= req.body.description;
	var price = req.body.price;
	var author = {
		id: req.user._id,
		username: req.user.username 
	}
	var newCampground = {name: name, image: image, description:desc, author:author, price:price};
	
	Campground.create(newCampground,function(err,newlyCreated){
		// error in creating new campground
		if(err){
			console.log(err);
			req.flash("error", err.message);
		}
		else{
			req.flash("success", "Campground successfully created.");
			res.redirect("/campgrounds");//default as get request		
		}

	});
})

router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new");
});

router.get("/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err  || !foundCampground ){
			console.log(err);
			req.flash("error", "Campground not found.");
			res.redirect("/campgrounds");
		}
		else{
			res.render("campgrounds/show",{campground:foundCampground});			
		}
	});	
	
})

router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req,res){
	//check for authentication. only proceed if logged n
	// if(req.isAuthenticated()){
		 Campground.findById(req.params.id,function(err,foundCampground){
			if(err  || !foundCampground ){
				console.log(err);
				req.flash("error", "Campground not found.");
				res.redirect("/campgrounds");
			}
			else{
			res.render("campgrounds/edit",{campground:foundCampground});
			}
		 })
		 
		 
	// 		if(err){
	// 			res.redirect("/campgrounds");
	// 		}
	// 		else{
	// 			if(foundCampground.author.id.equals(req.user._id)){
	// 				//only allow edit if current log in = author id
	// 				//can't use === since author.id is object while _id is string
					
	// 			}
	// 			else{
	// 				res.redirect("back");
	// 			}
	// 		}
	// 	})
	// }
	// else{
	// 		console.log("not authenticated");
	// 		res.send("pls sign in to edit!");
	// }
});

router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,updatedCampground){
		if(err  || ! updatedCampground ){
			req.flash("error", "Campground not found.");
			res.redirect("/campgrounds");}
		else{
			req.flash("success", "Campground successfully updated.");
			res.redirect("/campgrounds/"+req.params.id)
		}
	});
});

router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err ){
			req.flash("error", "Campground not found.");
			res.redirect("/campgrounds");
		}
		else{
			req.flash("success", "Campground successfully deleted.");
			res.redirect("/campgrounds");
		}
	})
});

// moved to middleware/index.js
// function isLoggedIn(req,res,next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	res.redirect("/login");
// }

// function checkCampgroundOwnership(req,res,next){
// 	//check for authentication. only proceed if logged n
// 	if(req.isAuthenticated()){
// 		Campground.findById(req.params.id,function(err,foundCampground){
// 			if(err){
// 				res.redirect("/campgrounds");
// 			}
// 			else{
// 				if(foundCampground.author.id.equals(req.user._id)){
// 					// only allow edit if current log in = author id
// 					// can't use === since author.id is object while _id is string
// 					// res.render("campgrounds/edit",{campground:foundCampground});
// 					next();
// 				}
// 				else{
// 					console.log("current logged in user is not the author")
// 					res.redirect("back");
// 				}
// 			}
// 		})
// 	}
// 	else{
// 			console.log("not authenticated");
// 			// res.send("pls sign in to edit!");
// 			res.redirect("back");
// 	}

// }

module.exports = router;