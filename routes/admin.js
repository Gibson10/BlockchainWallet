var Article = require('../models/articles'),
	// Admin = require('../models/admin'),
	passport = require('passport'),
	express = require("express"),
	router = express.Router();


// Configure multer and cloudinary
var multer = require('multer');
var storage = multer.diskStorage({
	filename: function(req, file, callback) {
		callback(null, Date.now() + file.originalname);
	}
});
var imageFilter = function(req, file, cb) {
	// accept image file(s) only
	if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
		return cb(new Error('Only image files are allowed!'), false);
	}
	cb(null, true);
};
var upload = multer({
	storage: storage,
	fileFilter: imageFilter
})

var cloudinary = require('cloudinary');
cloudinary.config({
	cloud_name: "drare428p",
	api_key: "866953249176446",
	api_secret: "FdP6-RScsdlbwErByHNGJDF3bg0"
});


/***************************************************************
// ADMIN AUTHENTICATION

// Route to register admin ()
****************************************************************/

// Route to add new article
router.get('/uploadfile', function(req, res) {
	res.render('uploadfile');
});




// News route
router.get("/displaynews", function(req, res) {
	Article.find({}).sort({
		date: -1
	}).exec(function(err, articles) {
		if (err) {
			req.flash("error", "An error has occurred");
			res.redirect("back");
		} else {
			console.log(articles);
			res.render("displaynews", {
				articles: articles
			});
		}
	});
});


// Post route to add new article
router.post('/admin/news/add', upload.single('image'), function(req, res) {
	var filepath = undefined;

	cloudinary.uploader.upload(req.file.path, function(result) {
		filepath = result.secure_url;
		var article = {
			name: req.body.name,
			subject: req.body.subject,
			article: req.body.article,
			url: req.body.url,
			image: filepath
		}

		Article.create(article, function(err, book) {
			if (err) {
				req.flash('error', 'An error seems to have occurred');
				return res.redirect('/admin/news/add');
			}
			req.flash('success', 'Your article has been successfuly added');
			res.redirect('/uploadfile')
		});
	});
});

module.exports = router;