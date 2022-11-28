var express = require("express");
var app = express();

var cookieParser = require("cookie-parser")

var fs = require("fs");

var jsonfile = require("jsonfile");

var path = require("path")

app.use(express.static(__dirname))
app.use(cookieParser());

// Check language and load navbars

app.use(function(req, res, next){

  if (req.cookies.language === undefined) {

    res.cookie('language',"en", {maxAge: 900000, httpOnly: false, path: "/"});
    req.cookies.language = "en";
    console.log("No cookie found... Attempting to fix...");

  }

  navLang = jsonfile.readFileSync(__dirname + "/metadata/locale/navbar/" + req.cookies.language + ".json")
  miniNavLang = jsonfile.readFileSync(__dirname + "/metadata/locale/mini-nav/" + req.cookies.language + ".json")
  miniNavGalleryLang = jsonfile.readFileSync(__dirname + "/metadata/locale/mini-nav-gallery/" + req.cookies.language + ".json")

  next()

});

// Routes

app.get("/", function(req, res) {

  // Load language

  var language = jsonfile.readFileSync(__dirname + "/metadata/locale/index/" + req.cookies.language + ".json")

  // Load page

  var contents = jsonfile.readFileSync(__dirname + "/metadata/" + req.cookies.language + "/jobs/contents.json")
  var file = {}
  var files = []

  var people = {}

  for (var i = 0; i < contents.data.length; i++) {

    file = jsonfile.readFileSync(__dirname + "/metadata/" + req.cookies.language + "/jobs/" + contents.data[i] + ".json")

    people[contents.data[i]] = file.people.length

    files.push(file)

  }

  res.render("index.ejs", {people: people, files: files, language: language, navLang: navLang})

});

app.get("/job/all", function(req, res) {

  // Load language

  var language = jsonfile.readFileSync(__dirname + "/metadata/locale/allJobs/" + req.cookies.language + ".json")

  // Load the page

  res.render("allJobs.ejs", {language: language, navLang: navLang})

});

app.get("/job/:name", function(req, res) {

  // Load language

  var language = jsonfile.readFileSync(__dirname + "/metadata/locale/seeOne/" + req.cookies.language + ".json")
  var errorLanguage = jsonfile.readFileSync(__dirname + "/metadata/locale/noJob/" + req.cookies.language + ".json")

  // Load page

  if(!fs.existsSync(__dirname + "/metadata/" + req.cookies.language + "/jobs/" + req.params.name + ".json")) {

    res.render("noJob.ejs", {job: req.params.name, errorLanguage: errorLanguage})

  }

  var file = jsonfile.readFileSync(__dirname + "/metadata/" + req.cookies.language + "/jobs/" + req.params.name + ".json")

  var people = []

  var allPeople = {}

  for (var i = 0; i < file.people.length; i++) {

    try {
      people.push(jsonfile.readFileSync(__dirname + "/metadata/people/" + file.people[i].split(" ")[0].toLowerCase() + ".json"))
    } catch(err) {
      people.push({
        name: file.people[i],
        images: ["../images/noImage.jpg"]
      })
    }

  }

  for (var i = 0; i < people.length; i++) {

      if (!fs.existsSync(path.resolve(__dirname + "/_/", people[i].images[0]))) {
        console.log("No image found for  " + people[i].name.split(" ")[0].toLowerCase() + " found");
        console.log(__dirname + "/images/people" + people[i].name.split(" ")[0].toLowerCase() + ".png");
        people[i].images[0] = "../images/noImage.jpg"
      }

  }

  console.log("Person File");
  console.log(file);

  res.render("seeOne.ejs", {file: file, people: people, language: language})

});

app.get("/person/:name", function(req, res) {

  // Load language

  var language = jsonfile.readFileSync(__dirname + "/metadata/locale/person/" + req.cookies.language + ".json")
  var errorLanguage = jsonfile.readFileSync(__dirname + "/metadata/locale/noPerson/" + req.cookies.language + ".json")

  // Load page

  var person = req.params.name.split(" ")[0].toLowerCase()

  if (!fs.existsSync(__dirname + "/metadata/people/" + person + ".json")) {

    res.render("noPerson.ejs", {person: req.params.name, errorLanguage: errorLanguage});

  }

  var file = jsonfile.readFileSync(__dirname + "/metadata/people/" + person + ".json")

  var splitString = []
  var contributions = []

  for (var i = 0; i < file.contributions.length; i++) {

    splitString = file.contributions[i].split(" ")[0].toLowerCase()

    contributions.push(jsonfile.readFileSync(__dirname + "/metadata/" + req.cookies.language + "/jobs/" + splitString + ".json"))

  }

  var people = {}

  for (var i = 0; i < contributions.length; i++) {

    for (var m = 0; m < contributions[i].people.length; m++) {

      people[contributions[i].people[m]] = jsonfile.readFileSync(__dirname + "/metadata/people/" + contributions[i].people[m].split(' ')[0].toLowerCase() + ".json")

      if (!fs.existsSync(path.resolve(__dirname + "/_/", people[contributions[i].people[m]].images[0]))) {

        people[contributions[i].people[m]].images[0] = "../images/noImage.jpg"

      }

    }

  }

  console.log(contributions[0].name)

  for (var i = 0; i < file.images.length; i++) {

    if (!fs.existsSync(path.resolve(__dirname + "/_/", file.images[0]))) {

      file.images[i] = "../images/noImage.jpg"

    }

  }

  res.render("person.ejs", {file: file, contributions: contributions, people: people, language: language})

});

app.get("/documents/:category", function(req, res) {

  // Load language

  var language = jsonfile.readFileSync(__dirname + "/metadata/locale/writtenDocuments/" + req.cookies.language + ".json")
  var errorLanguage = jsonfile.readFileSync(__dirname + "/metadata/locale/noDocumentCat/" + req.cookies.language + ".json")

  // Load page

  var category = ""
  var content = {}
  var design = []
  var experience = []

  var file = {}

  if (req.params.category == "design") {

    if (req.cookies.language == "en") {

      category = "Robot Design"

    } else if (req.cookies.language == "fr") {

      category = "Construction du Robot"

    }

  } else if (req.params.category == "experience") {

    if (req.cookies.language == "en") {

      category = "Student Experience"

    } else if (req.cookies.language == "fr") {

      category = "Témoignages des Étudiants"

    }

  } else {

    content = jsonfile.readFileSync(__dirname + "/metadata/" + req.cookies.language + "/written/design/contents.json")
    file = jsonfile.readFileSync(__dirname + "/metadata/" + req.cookies.language + "/written/experience/contents.json")

    for (var i = 0; i < content.data.length; i++) {

      design.push(jsonfile.readFileSync(__dirname + "/metadata/" + req.cookies.language + "/written/design/" + content.data[i] + ".json"))

    }

    for (var i = 0; i < file.data.length; i++) {

      experience.push(jsonfile.readFileSync(__dirname + "/metadata/" + req.cookies.language + "/written/experience/" + file.data[i] + ".json"))

    }

    return res.render("noDocumentCat.ejs", {design: design, experience: experience, errorLanguage: errorLanguage})

  }

  content = jsonfile.readFileSync(__dirname + "/metadata/" + req.cookies.language + "/written/design/contents.json")
  file = jsonfile.readFileSync(__dirname + "/metadata/" + req.cookies.language + "/written/experience/contents.json")

  for (var i = 0; i < content.data.length; i++) {

    design.push(jsonfile.readFileSync(__dirname + "/metadata/" + req.cookies.language + "/written/design/" + content.data[i] + ".json"))

    if (!fs.existsSync(path.resolve(__dirname + "/_/", design[i].image))) {

      design[i].image = "../images/noImage.jpg"

    }

  }

  console.log(design);

  for (var i = 0; i < file.data.length; i++) {

    experience.push(jsonfile.readFileSync(__dirname + "/metadata/" + req.cookies.language + "/written/experience/" + file.data[i] + ".json"))

    if (!fs.existsSync(path.resolve(__dirname + "/_/", experience[i].image))) {

      experience[i].image = "../images/noImage.jpg"

    }

  }

  res.render("writtenDocuments.ejs", {design: design, experience: experience, category: category, pureCat: req.params.category, language: language})

});

app.get("/document/:name", function(req, res) {

  // Load language

  var language = jsonfile.readFileSync(__dirname + "/metadata/locale/readText/" + req.cookies.language + ".json")
  var errorLanguage = jsonfile.readFileSync(__dirname + "/metadata/locale/noDocumentCat/" + req.cookies.language + ".json")

  // Load page

  var experience = fs.readdirSync(__dirname + "/metadata/" + req.cookies.language + "/written/experience")
  var design = fs.readdirSync(__dirname + "/metadata/" + req.cookies.language + "/written/design")
  var file = {}

  for (var i = 0; i < experience.length; i++) {

    if (experience[i].includes(req.params.name)) {

      file = jsonfile.readFileSync(__dirname + "/metadata/" + req.cookies.language + "/written/experience/" + req.params.name + ".json")
      console.log("File found in Experience")

      if (!fs.existsSync(path.resolve(__dirname + "/_/", file.image))) {

        file.image = "../images/noImage.jpg"

      }

      return res.render("readText.ejs", {file: file, language: language})

    }

  }

  for (var i = 0; i < design.length; i++) {

    if (design[i].includes(req.params.name)) {

      file = jsonfile.readFileSync(__dirname + "/metadata/" + req.cookies.language + "/written/design/" + req.params.name + ".json")
      console.log("File found in Design")

      if (!fs.existsSync(path.resolve(__dirname + "/_/", file.image))) {

        file.image = "../images/noImage.jpg"

      }

        return res.render("readText.ejs", {file: file, language: language})

    }

  }

  // Construct error message

  content = jsonfile.readFileSync(__dirname + "/metadata/" + req.cookies.language + "/written/design/contents.json")
  file = jsonfile.readFileSync(__dirname + "/metadata/" + req.cookies.language + "/written/experience/contents.json")

  for (var i = 0; i < content.data.length; i++) {

    design.push(jsonfile.readFileSync(__dirname + "/metadata/" + req.cookies.language + "/written/design/" + content.data[i] + ".json"))

  }

  for (var i = 0; i < file.data.length; i++) {

    experience.push(jsonfile.readFileSync(__dirname + "/metadata/" + req.cookies.language + "/written/experience/" + file.data[i] + ".json"))

  }

  res.render("noDocumentCat.ejs", {design: design, experience: experience, errorLanguage: errorLanguage})

});

app.get("/school", function(req, res) {

  // Load language

  var language = jsonfile.readFileSync(__dirname + "/metadata/locale/school/" + req.cookies.language + ".json")

  // Load page

  res.render("school.ejs", {language: language})

});

app.get("/gallery", function(req, res) {

  // Load language

  var language = jsonfile.readFileSync(__dirname + "/metadata/locale/gallery-index/" + req.cookies.language + ".json")

  // Load page

  res.render("gallery-index.ejs", {language: language});

});

app.get("/gallery/:name", function(req, res) {

  // Load language

  var language = jsonfile.readFileSync(__dirname + "/metadata/locale/gallery/" + req.cookies.language + ".json")
  var errorLanguage = jsonfile.readFileSync(__dirname + "/metadata/locale/noGallery/" + req.cookies.language + ".json")

  // Load page

  if (!fs.existsSync(__dirname + "/metadata/" + req.cookies.language + "/gallery/" + req.params.name + ".json")) {

    res.render("noGallery.ejs", {file: req.params.name, errorLanguage: errorLanguage})

  }

  var file = jsonfile.readFileSync(__dirname + "/metadata/" + req.cookies.language + "/gallery/" + req.params.name + ".json")

  res.render("gallery.ejs", {file: file, language: language})

});

app.get("/gamedescription", function(req, res) {

  // Load language

  var language = jsonfile.readFileSync(__dirname + "/metadata/locale/game/" + req.cookies.language + ".json")

  // Load Page

  res.render("game.ejs", {language: language})

});

app.get("/quicklinks", function(req, res) {

  // Get language

    var language = jsonfile.readFileSync(__dirname + "/metadata/locale/allLinks/" + req.cookies.language + ".json")

  // Load page

  res.render("allLinks.ejs", {language: language})

});

// 404 Error

app.get("*", function(req, res) {

  var language = jsonfile.readFileSync(__dirname + "/metadata/locale/error404/" + req.cookies.language + ".json")

  res.render("error404.ejs", {language: language})

})

// Server Setup

app.listen("30000", function(req, res) {

  console.log("Server has Started");

});
