// -----------------------------------
// Packages needed and basic setup
//------------------------------------

var express     = require ("express");
var bodyParser  = require ("body-parser");
var methoOverride = require("method-override");
var mongoose    = require ("mongoose");
var expressSanitizer  =require("express-sanitizer");
app             = express();


// -----------------------------------
// Configurations
//------------------------------------


mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methoOverride("_method"));
// to run mongodb : "C:\Program Files\MongoDB\Server\4.0\bin\mongod.exe" --dbpath="c:\data\db"



// -----------------------------------
// SCHEMA
//------------------------------------

var blogSchema = new mongoose.Schema({
	title : String,
	image : String,
	body : String,
	created : {type: Date,default : Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);


 // For testing and initialising databse
// Blog.create({
// 	title : "Test Blog",
// 	image : "http://www.trendsuk.co.uk/images/Page/zing-logo-header.jpg",
// 	body : "hello"
// }); 


// -----------------------------------
// RESTFUL ROUTES
//------------------------------------
   
// INDEX ROUTE

	app.get("/",function(req,res){
 			res.redirect("/blogs");
	});

 
	app.get("/blogs",function(req,res){
		   Blog.find({},function(err,blogs){
 				if(err){
 					console.log("ERROR");
 				}
 				else{
 					res.render("index",{blogs : blogs});
 				}
		   });
	     
	});



// NEW ROUTE

	app.get("/blogs/new",function(req,res){
			res.render("new");
	});



//CREATE ROUTE

	app.post("/blogs",function(req,res){
			 
			req.body.blog.body=req.sanitize(req.body.blog.body);
		
			Blog.create(req.body.blog,function(err,newBLog){
					if(err){
						res.render("new");
					}else{
						res.redirect("/blogs");
					}
			});
	});


//SHOW ROUTE

	app.get("/blogs/:id",function(req,res){
		Blog.findById(req.params.id,function(err,foundBlog){
				if(err){
					res.redirect("/blogs");
				}else{
					res.render("show",{blog:foundBlog});
				}
		});
	});

 
//EDIT ROUTE

	app.get("/blogs/:id/edit",function(req,res){
		Blog.findById(req.params.id,function(err,foundBlog){
				if(err){
					res.redirect("/blogs");
				}else{
					res.render("edit",{blog: foundBlog});
				}
		});
	}); 

//UPDATE

	app.put("/blogs/:id",function(req,res){
		    req.body.blog.body=req.sanitize(req.body.blog.body);
			Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
				if(err){
					res.redirect("/blogs");
				}else{
					res.redirect("/blogs/"+req.params.id);
				}
			});
	});


//DELETE

	app.delete("/blogs/:id",function(req,res){
		Blog.findByIdAndRemove(req.params.id,function(err){
			if(err){
				res.redirect("/blogs");
			}else{
				res.redirect("/blogs");
			}
		})
	});


// -----------------------------------
// Localhost servet at port 3000
//------------------------------------



	app.listen(3000,function(err){
	if(err) {
		console.log("Not Connected");
	}
	else{
		console.log("Server started");
	}
});