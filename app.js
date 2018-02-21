var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds")
    
//requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")
 
var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";
mongoose.connect(url);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//var port = process.env.PORT || 3000;
var ipaddress = process.env.IP || "127.0.0.1";

// --------------
const port = 3000;
const PORT = process.env.PORT || port;
const HOST = process.env.BASE_URL || 'localhost';
//const baseUrl = `http://${HOST}:${PORT}`;

console.log("process.env.PORT: " + process.env.PORT);

//server.set('port', process.env.PORT);

//---------------
console.log("url: " + url);
console.log("PORT: "+PORT);
console.log("ipaddress: "+ipaddress);
app.listen(process.env.PORT, process.env.IP, function(){
//    app.listen(port, function(){
    console.log("process.env.IP 2: "+process.env.IP)
   console.log("The YelpCamp Server Has Started!");
});

