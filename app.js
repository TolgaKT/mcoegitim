//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");


const app = express();



app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({
  extended:true
}));

app.use(session({
  secret:"Our little secret",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://tolga-admin:a9znk8xyhsvg@cluster0-fn9wb.mongodb.net/mcoOnline",{useNewUrlParser:true,useUnifiedTopology: true});
mongoose.set("useCreateIndex",true);
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  grade: Number,
  branch: String,
  status: String,

});

const commentSchema = new mongoose.Schema({
  comname: String,
  comment: String,
  grade: Number,
  branch: String,
})

const videoSchema = new mongoose.Schema({
  link: String,
  title: String,
  grade: Number,
  branch: String

});

userSchema.plugin(passportLocalMongoose);


const User = new mongoose.model("User",userSchema);
const Comment = new mongoose.model("Comment",commentSchema);
const Video = new mongoose.model("Video",videoSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.get("/1astudent",function(req,res){
  if(req.isAuthenticated()){
  Comment.find({comment:{$ne:null},grade:1,branch:"a"},function(err,comment){
    if(err){
      console.log(err);
    }
    else{
      var commentedStudents = comment;
      console.log(commentedStudents.comment);

      res.render("1astudent",{commentedStudents:comment});
    }
  });
  }
  else{
    res.redirect("/login");
  }
});

app.get("/1ateacher",function(req,res){
  if(req.isAuthenticated()){
  Comment.find({comment:{$ne:null},grade:1,branch:"a"},function(err,comment){
    if(err){
      console.log(err);
    }
    else{
      var commentedStudents = comment;
      console.log(commentedStudents.comment);

      res.render("1ateacher",{commentedStudents:comment});
    }
  });
  }
  else{
    res.redirect("/login");
  }
});

app.get("/2astudent",function(req,res){
  if(req.isAuthenticated()){
  Comment.find({comment:{$ne:null},grade:2,branch:"a"},function(err,comment){
    if(err){
      console.log(err);
    }
    else{
      var commentedStudents = comment;
      console.log(commentedStudents.comment);

      res.render("2astudent",{commentedStudents:comment});
    }
  });
  }
  else{
    res.redirect("/login");
  }
});

app.get("/2ateacher",function(req,res){
  if(req.isAuthenticated()){
  Comment.find({comment:{$ne:null},grade:2,branch:"a"},function(err,comment){
    if(err){
      console.log(err);
    }
    else{
      var commentedStudents = comment;
      console.log(commentedStudents.comment);

      res.render("2ateacher",{commentedStudents:comment});
    }
  });
  }
  else{
    res.redirect("/login");
  }
});

app.get("/3astudent",function(req,res){
  if(req.isAuthenticated()){
  Comment.find({comment:{$ne:null},grade:3,branch:"a"},function(err,comment){
    if(err){
      console.log(err);
    }
    else{
      var commentedStudents = comment;
      console.log(commentedStudents.comment);

      res.render("3astudent",{commentedStudents:comment});
    }
  });
  }
  else{
    res.redirect("/login");
  }
});

app.get("/3ateacher",function(req,res){
  if(req.isAuthenticated()){
  Comment.find({comment:{$ne:null},grade:3,branch:"a"},function(err,comment){
    if(err){
      console.log(err);
    }
    else{
      var commentedStudents = comment;
      console.log(commentedStudents.comment);

      res.render("3ateacher",{commentedStudents:comment});
    }
  });
  }
  else{
    res.redirect("/login");
  }
});

app.get("/logout",function(req,res){
  req.logout();
  res.redirect("/");
})

app.get("/submit",function(req,res){
  if(req.isAuthenticated()){
    res.render("submit");
  }
  else{
    res.redirect("/login");
  }
})

app.post("/register", function(req, res){
  const submittedGrade = req.body.grade;
  const submittedBranch = req.body.branch;
  const submittedStatus = req.body.status;
  const submittedName = req.body.username;
  const concatt = submittedGrade.toString().concat(submittedBranch,submittedStatus);
  User.register({username: req.body.username}, req.body.password, function(err, user){
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {

      passport.authenticate("local")(req, res, function(){


      });
      User.updateOne({username:submittedName},{grade:submittedGrade},function(err){
        if(err){
          console.log(err);
        }
        else{
          User.updateOne({username:submittedName},{branch:submittedBranch},function(err){
            if(err){
              console.log(err);
            }
            else{
              User.updateOne({username:submittedName},{status:submittedStatus},function(err){
                if(err){
                  console.log(err);
                }
                else{
                  res.render(concatt);
                }
              });
            }
          });
        }
      });
    }
  });

});

app.post("/login",function(req,res){
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  req.login(user,function(err){
    if(err){
      console.log(err);

    }else{

      passport.authenticate("local")(req,res,function(){
        User.findOne({username:req.body.username},function(err,foundUsers){
          if(err){
            console.log(err);
          }
          else{
            var cstatus = foundUsers.status;
            var cbranch = foundUsers.branch;
            var cgrade = foundUsers.grade.toString();
            var concatt = cgrade.concat(cbranch,cstatus);

            res.redirect(concatt);
          }
        });
      });
    }
  });
});

app.post("/1astudent",function(req,res){
  console.log(req.user.id);
  console.log(req.body.comment);
  const submittedComment = req.body.comment;
  const submittedName = req.body.comname;
  User.findById(req.user.id,function(err,foundUser){
    if(err){
      console.log(err);
    }
    else{
      if(foundUser){
        const comBranch = foundUser.branch;
        const comGrade = foundUser.grade;
        const comment = new Comment({comname:submittedName,comment:submittedComment,
          grade:comGrade,
          branch:comBranch});
          comment.save(function(err,resp){
            if(err){
              console.log(err);
            }
            else{
              res.redirect("1astudent");
            }
          });
      }
    }
  });

})




app.post("/1teacher",function(req,res){
  console.log(req.user.id);
  console.log(req.body.comment);
  const submittedComment = req.body.comment;
  const submittedName = req.body.comname;
  User.findById(req.user.id,function(err,foundUser){
    if(err){
      console.log(err);
    }
    else{
      if(foundUser){
        const comBranch = foundUser.branch;
        const comGrade = foundUser.grade;
        const comment = new Comment({comname:submittedName,comment:submittedComment,
          grade:comGrade,
          branch:comBranch});
          comment.save(function(err,resp){
            if(err){
              console.log(err);
            }
            else{
              res.redirect("1ateacher");
            }
          });
      }
    }
  });

})

app.post("/2astudent",function(req,res){
  console.log(req.user.id);
  console.log(req.body.comment);
  const submittedComment = req.body.comment;
  const submittedName = req.body.comname;
  User.findById(req.user.id,function(err,foundUser){
    if(err){
      console.log(err);
    }
    else{
      if(foundUser){
        const comBranch = foundUser.branch;
        const comGrade = foundUser.grade;
        const comment = new Comment({comname:submittedName,comment:submittedComment,
          grade:comGrade,
          branch:comBranch});
          comment.save(function(err,resp){
            if(err){
              console.log(err);
            }
            else{
              res.redirect("2astudent");
            }
          });
      }
    }
  });

})

app.post("/2ateacher",function(req,res){
  console.log(req.user.id);
  console.log(req.body.comment);
  const submittedComment = req.body.comment;
  const submittedName = req.body.comname;
  User.findById(req.user.id,function(err,foundUser){
    if(err){
      console.log(err);
    }
    else{
      if(foundUser){
        const comBranch = foundUser.branch;
        const comGrade = foundUser.grade;
        const comment = new Comment({comname:submittedName,comment:submittedComment,
          grade:comGrade,
          branch:comBranch});
          comment.save(function(err,resp){
            if(err){
              console.log(err);
            }
            else{
              res.redirect("2ateacher");
            }
          });
      }
    }
  });

})

app.post("/3astudent",function(req,res){
  console.log(req.user.id);
  console.log(req.body.comment);
  const submittedComment = req.body.comment;
  const submittedName = req.body.comname;
  User.findById(req.user.id,function(err,foundUser){
    if(err){
      console.log(err);
    }
    else{
      if(foundUser){
        const comBranch = foundUser.branch;
        const comGrade = foundUser.grade;
        const comment = new Comment({comname:submittedName,comment:submittedComment,
          grade:comGrade,
          branch:comBranch});
          comment.save(function(err,resp){
            if(err){
              console.log(err);
            }
            else{
              res.redirect("3astudent");
            }
          });
      }
    }
  });

})

app.post("/3ateacher",function(req,res){
  console.log(req.user.id);
  console.log(req.body.comment);
  const submittedComment = req.body.comment;
  const submittedName = req.body.comname;
  User.findById(req.user.id,function(err,foundUser){
    if(err){
      console.log(err);
    }
    else{
      if(foundUser){
        const comBranch = foundUser.branch;
        const comGrade = foundUser.grade;
        const comment = new Comment({comname:submittedName,comment:submittedComment,
          grade:comGrade,
          branch:comBranch});
          comment.save(function(err,resp){
            if(err){
              console.log(err);
            }
            else{
              res.redirect("3ateacher");
            }
          });
      }
    }
  });

})

app.post("/submit",function(req,res){
  console.log(req.user.id);
  const submittedLink = req.body.vidlink;
  const submittedTitle = req.body.title;
  User.findById(req.user.id,function(err,foundUser){
    if(err){
      console.log(err);
    }
    else{
      if(foundUser){
        const vidBranch = foundUser.branch;
        const vidGrade = foundUser.grade;
        const stat = foundUser.status;
        const video = new Video({link:submittedLink,title:submittedTitle,
        grade:vidGrade,
        branch:vidBranch});
        video.save(function(err,resp){
          if(err){
            console.log(err);
          }
          else{
            const concatt = vidGrade.toString().concat(vidBranch,stat);
            res.redirect(concatt);
          }
        })
      }
    }
  })
})

let port = process.env.PORT;
if(port==null || port == ""){
  port = 3000;
}
app.listen(port,function(){
  console.log("server started on port 3000");
});
