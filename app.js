const express        = require("express");
const app            = express();
const bodyParser     = require("body-parser");
const mongoose       = require("mongoose");
const passport       = require("passport");
const cookieParser   = require("cookie-parser");
const LocalStrategy  = require("passport-local");
const flash          = require("connect-flash");
const Campground     = require("./models/campground");
const Comment        = require("./models/comment");
const User           = require("./models/user");
const session        = require("express-session");
const seedDB         = require("./seeds");
const methodOverride = require("method-override");
// configure dotenv
require('dotenv').load();

//requiring routes
const commentRoutes    = require("./routes/comments");
const campgroundRoutes = require("./routes/campgrounds");
const indexRoutes      = require("./routes/index");
    
// assign mongoose promise library and connect to database
mongoose.Promise = global.Promise;

const databaseUri = process.env.MONGODB_URI || 'mongodb://localhost/yelp_camp';

mongoose.connect(databaseUri, { useMongoClient: true })
      .then(() => console.log(`Database connected`))
      .catch(err => console.log(`Database connection error: ${err.message}`));

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));
//require moment
app.locals.moment = require('moment');
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});


app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, () => {
   console.log("The YelpCamp Server Has Started!");
});