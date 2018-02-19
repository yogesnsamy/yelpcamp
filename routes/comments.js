var express = require("express");
var router = express.Router({mergeParams:true});

var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/new",middleware.isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
		}
		else{
			res.render("comments/new",{campground:campground});		
		}
	})

router.post("/",middleware.isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			res.redirect("/campgrounds")
		}
		else{
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					console.log(err)
				}
				else{
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					// console.log("campground comments is "+campground.comments);
					// original code by colt doesn't work. only first comment is stored. the rest fails 
					// with error ValidationError: Campground validation failed: comments: Cast to [undefined] failed for value "[{"author":{"id":"5a72d82d15d5a545902ee706","username":"a"},
					// "_id":"5a742286e5e79e3a1c4bf08b","text":"saya nak berak","__v":0}]" at path "comments"
					// campground.comments.push(comment); 
					// so use solution by ian
					// console.log("comment .. "+comment);
					campground.comments.push(comment._id);
					campground.save();
					res.redirect("/campgrounds/"+campground._id);
				}
			})
		}
	});
});	
});

router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req,res){
	Comment.findById(req.params.comment_id,function(err,foundComment){
		if(err){
			console.log("coment not found "+req.params.comment_id);
			res.redirect("back");
		}
		else{
			res.render("comments/edit",{campground_id:req.params.id,comment:foundComment});
		}
	})
	
});

router.put("/:comment_id",middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
		if(err){
			res.redirect("back");
			}
			else{
				res.redirect("/campgrounds/"+req.params.id);
			}
	})
});

router.delete("/:comment_id",middleware.checkCommentOwnership, function(req,res){
	// res.send("delete comment");
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			console.log("error in deleting comment");
			res.redirect("back");
		}
		else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
});

// function isLoggedIn(req,res,next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	res.redirect("/login");
// }

// function checkCommentOwnership(req,res,next){
// 	//check for authentication. only proceed if logged n
// 	if(req.isAuthenticated()){
// 		Comment.findById(req.params.comment_id,function(err,foundComment){
// 			if(err){
// 				res.redirect("back");
// 			}
// 			else{
// 				if(foundComment.author.id.equals(req.user._id)){
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