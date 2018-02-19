var express 			= require("express"),
	app 						= express(),
	bodyParser 			= require("body-parser"),
	mongoose 				= require("mongoose"),
	methodOverride	=	require("method-override"),
	flash						= require("connect-flash"),
	passport				= require("passport"),
	LocalStrategy		=	require("passport-local"),
	Campground 			= require("./models/campground"),
	Comment					= require("./models/comment"),
	User						= require("./models/user"),
	seedDB					= require("./seeds"); //to initialize the db

var commentRoutes 		= require("./routes/comments"),
		campgroundRoutes 	= require("./routes/campgrounds"),
		indexRoutes 			=	require("./routes/index");

//mongoose.connect("mongodb://localhost/yelp_camp",{useMongoClient:true});
// mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect("mongodb://cicak:cicak@ds141028.mlab.com:41028/yelpcampcicak");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.use(flash());

// initialize data
// seedDB();

//config passport
app.use(require("express-session")(
	{
		secret: "mera naam cicak",
		resave: false,
		saveUninitialized: false
	}
));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//send this parm to routes to see if a user is logged in. if not signed in, user = undefined
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
})

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


//app.listen(process.env.PORT, process.env.IP, function(){
	app.listen(3000,function(){
	console.log("connected");
})

//middleware function
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}