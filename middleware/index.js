var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req,res,next){
	//check for authentication. only proceed if logged n
	if(req.isAuthenticated()){
		Campground.findById(req.params.id,function(err,foundCampground){
			if(err  || !foundCampground ){
				req.flash('error', 'Sorry, that campground does not exist!');
				res.redirect("/campgrounds");
			}
			else{
				if(foundCampground.author.id.equals(req.user._id)){
					// only allow edit if current log in = author id
					// can't use === since author.id is object while _id is string
					// res.render("campgrounds/edit",{campground:foundCampground});
					req.flash('success', 'Campground is sucessfully updated');
					next();
				}
				else{
					console.log("current logged in user is not the author")
					res.redirect("back");
				}
			}
		})
	}
	else{
			console.log("not authenticated");
			// res.send("pls sign in to edit!");
			res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	// else
	req.flash("error", "You need to be logged in to do that.");
	res.redirect("/login");
}

middlewareObj.checkCommentOwnership = function(req,res,next){
	//check for authentication. only proceed if logged n
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id,function(err,foundComment){
			if(err || !foundComment){
				req.flash('error', 'Sorry, that comment does not exist!');
				res.redirect("back");
			}
			else{
				if(foundComment.author.id.equals(req.user._id)){
					// only allow edit if current log in = author id
					// can't use === since author.id is object while _id is string
					// res.render("campgrounds/edit",{campground:foundCampground});
					next();
				}
				else{
					console.log("current logged in user is not the author")
					res.redirect("back");
				}
			}
		})
	}
	else{
			console.log("not authenticated");
			// res.send("pls sign in to edit!");
			req.flash("error", "You need to be logged in to do that.");
			res.redirect("back");
	}
}

module.exports = middlewareObj;