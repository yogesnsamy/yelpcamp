var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/",function(req,res){
	res.render("landing");
})

//auth route
router.get("/register",function(req,res){
	res.render("register");
});

router.post("/register",function(req,res){
	var newUser = new User({
		username: req.body.username
	})
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			console.log(err);
			req.flash("error", err.message);
			//return res.render("register");
			return res.redirect("/register");
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success", "Welcome to YelpCamp "+user.username);
			res.redirect("/campgrounds");
		});
	})
});

router.get("/login",function(req,res){
	res.render("login");
});

// router.post("/login",function(req,res,next){
// passport.authenticate("local",
// { 
// 	successRedirect: "/campgrounds",
// 	failureRedirect: "/login", 
// 	failureFlash: true, 
// 	successFlash: "Welcome, " + req.body.username + "!" 
// }),
// //callback, can be left out
// //function(req,res){
// 	(req,res)
// })

// -----------------------------
//     // Login logic
    router.post("/login", function (req, res, next) {
			passport.authenticate("local",
					{
							successRedirect: "/campgrounds",
							failureRedirect: "/login",
							failureFlash: true,
							successFlash: "Welcome to YelpCamp, " + req.body.username + "!"
					})(req, res);
	});
// ------------------------------

router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged you out successfully!");
	res.redirect("/campgrounds");
});

module.exports = router;