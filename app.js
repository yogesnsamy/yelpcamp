var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	methodOverride = require("method-override"),
	flash = require("connect-flash"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	Campground = require("./models/campground"),
	Comment = require("./models/comment"),
	User = require("./models/user"),
	seedDB = require("./seeds"); //to initialize the db

var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index");

// mongoose.connect("mongodb://localhost/yelp_camp",{useMongoClient:true});
// mongoose.connect("mongodb://localhost/yelp_camp");
var dbURL = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";
// mongoose.connect("mongodb://cicak:cicak@ds141028.mlab.com:41028/yelpcampcicak");
mongoose.connect(dbURL);

// app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.static(__dirname+"/public"));
// app.use(methodOverride("_method"));
// app.set("view engine","ejs");
// app.use(flash());

//------------------------
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(flash());
//-----------------------------




// initialize data
// seedDB();

//config passport
app.use(require("express-session")({
	secret: "mera naam cicak",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  console.log('%s %s', req.method, req.url);
  next();
});

//send this parm to routes to see if a user is logged in. if not signed in, user = undefined
app.use(function (req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
})

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

var port = process.env.PORT || 3000;
var ip = process.env.IP || "127.0.0.1";

//set port and ip
app.set("port", process.env.PORT || 3000);
app.set("ip", process.env.IP || "0.0.0.0");
// server can be done like so:
//Start Server and use port
app.listen(app.get("port"), app.get("ip"), function (err) {
	if (err) {
		console.error(err);
		return;
	} else {
		//var port = server.address().port;
		console.info("App is running on port " + app.get("port") + ".");
	}
});

// // app.listen(process.env.PORT, process.env.IP, function(){
// //    app.listen(process.env.PORT, function(){
// //	app.listen(3000,function(){
// app.listen(port, function () {
// 	console.log("connected");
// 	console.log(ip);
// })

//middleware function
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}