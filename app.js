const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  http = require("http");

//Connect mongoose
mongoose.connect("mongodb://localhost:27017/user_app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

//App Config
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("port", process.env.PORT || 5000);

//Mongoose Model
const userSchema = new mongoose.Schema({
  userName: String,
  dateOfBirth: Date,
});
const User = mongoose.model("User", userSchema);

//Age function
function calculate_age(birth_month,birth_day,birth_year)
{
    today_date = new Date();
    today_year = today_date.getFullYear();
    today_month = today_date.getMonth();
    today_day = today_date.getDate();
    age = today_year - birth_year;

    if ( today_month < (birth_month - 1))
    {
        age--;
    }
    if (((birth_month - 1) == today_month) && (today_day < birth_day))
    {
        age--;
    }
    return age;
}

//--------ROUTES----------

app.get("/", function (req, res) {
  res.redirect("/users");
});

//Index
app.get("/users", function (req, res) {
  User.find({}, function (err, allUsers) {
    if (err) {
      console.log(err);
    } else {
      res.render("index.ejs", { users: allUsers });
    }
  });
});

//New
app.get("/users/new", function (req, res) {
  res.render("new.ejs");
});

//Create
app.post("/users", function (req, res) {
  //create user
  User.create(req.body.user, function (err, newUser) {
    if (err) {
      res.render("new.ejs");
    } else {
      //redirect to index
      res.redirect("/users");
    }
  });
});

//Show
app.get("/users/:id", function (req, res) {
  let date = new Date($('#date-input').val());
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let age=calculate_age(month,day,year);
  User.findById(req.params.id, function (err, foundUser) {
    if (err) {
      res.redirect("/users");
    } else {
      res.render("show.ejs", { user: foundUser, userAge:age });
    }
  });
});

// http.createServer(app).listen(app.get("port"), function () {
//   console.log("Express server listening on port " + app.get("port"));
// });

app.listen(process.env.PORT||5000,function(){
	console.log("APP IS RUNNING");
});
