var express 	= require("express"),
	app 		= express(),
	bodyParser 	= require("body-parser"),
	mongoose 	= require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp",{useMongoClient:true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");

var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

Campground.create(
	 {
	 	name: "Granite Hill", 
	 	image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"
	 }, function(err, campground){
		if(err){
			console.log(err);
		}
			else{
				console.log("Newly created");
				console.log(campground);
			}
	}
	);

var campgrounds = [ 
		{name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
        {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
        {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
        {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
        {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
        {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
        {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
        {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
        {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"}
        ]

app.get("/",function(req,res){
	res.render("landing");
})

app.get("/campgrounds",function(req,res){
	res.render("campgrounds",{campgrounds});
})
app.post("/campgrounds",function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var newCampground = {name: name, image: image};
	campgrounds.push(newCampground);
	//res.send("post method");
	res.redirect("/campgrounds");//default as get request
})
app.get("/campgrounds/new",function(req,res){
	res.render("new");
});
//app.listen(process.env.PORT, process.env.IP, function(){
	app.listen(3000,function(){
	console.log("connected");
})