const express=require('express');
router=express.Router();
const passport=require('passport');
const fs=require('fs-extra');
const User=require('../model/schema');
const Task=require('../model/task');
const Label=require('../model/label');
const checkPassword=require('../config/compare');
const upload=require('../config/multer');

const authCheck = (req, res, next) => {
    if(!req.user){
        res.redirect('/');
    } else {
        next();
    }
};
router.get('/',(req,res)=> res.render('login'));

router.get('/home',authCheck,(req,res)=>res.render('alltasks'));

router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
    successRedirect:'/home',
    failureRedirect:'/',
    failureFlash:true
    })(req,res,next);
});
router.post('/home/getUser',authCheck,(req,res)=>{
    res.json(req.user);
})
router.post('/home/checkPassword',authCheck,(req,res)=>{
    const pwd=req.body.value;
    checkPassword(req.user.password,pwd,function(isMatch){
        console.log(isMatch);
        res.json(isMatch);
    });
});

router.post('/updPic',authCheck,(req,res)=>{
    upload(req, res, (err) => {
        if(err){
          console.log(err);
          res.redirect('/home/info');
        } else {
          if(req.file == undefined){
            res.redirect('/home/info');
          } else {
            req.user.img=req.file.filename;
            req.user.save().then(user=>{
            });
            res.redirect('/home/info');
          }
        }
      });
});

router.post('/home/searchBar',authCheck,(req,res)=>{
    const query=req.body.value;
    console.log(query);
    if(query === "")
      res.json('');
    else
    {
    Task.find({ name : { $regex: query, $options: 'i' },owner:req.user._id }).then(tasks=>{
        //console.log(tasks);
        res.json(tasks);
    })
}
});
router.post('/home/updateTask',authCheck,(req,res)=>{
    const {name,status,priority,targetDate,label}=req.body;
    var id=req.query.id;
    console.log(id);
    var d=new Date(targetDate);
    var p=Date.parse(d);
    Task.findById({_id:id}).then(task=>{
        task.name=name,
        task.status=status,
        task.priority=priority,
        task.targetDate=p,
        task.label=label
        task.save().then(tas=>{
            console.log('upd');
            res.redirect('/home/listTask');
        })
    })
})
router.post('/home/deleteTask',authCheck,(req,res)=>{
    id=req.body.value;
    Task.findByIdAndDelete({_id:id}).then(task=>{
        console.log(task);
        res.json('');
    }).catch(err=>console.log(err));
})

router.post('/home/deleteLabel',authCheck,(req,res)=>{
    id=req.body.value;
    Label.findByIdAndDelete({_id:id}).then(lab=>{
        console.log(lab);
        res.json('');
    }).catch(err=>console.log(err));
})
router.get('/home/listLabel',authCheck,(req,res)=>{
    res.render('label');
})
router.post('/home/updateLabel',authCheck,(req,res)=>{
    const name=req.body.value;
    const id=req.body.id;
    Label.findById({_id:id}).then(lab=>{
        lab.name=name;
        lab.save().then(labs=>{
            res.json('');
        })
    }).catch(err=>console.log(err));
})
router.get('/home/listTask',authCheck,(req,res)=>{
    res.render('alltasks');
})
router.post('/home/checkEmail',authCheck,(req,res)=>{
    const email=req.body.value;
    User.find({email}).then(user=>{
        console.log(user);
        res.json(user);
    }).catch(err => console.log(err));
});

router.post('/home/changePassword',authCheck,(req,res)=>{
    const pwd=req.body.value;
    console.log(pwd);
    console.log(req.user.password);
    req.user.password=pwd;
    require('../config/bcrypt')(req.user);
    console.log(req.user.password);
    res.json(req.user.password);
})
router.get('/home/info',authCheck,(req,res)=>{
    res.render('info',{
        user:req.user
    });
});
router.get('/home/search',authCheck,(req,res)=>{
    res.render('seachPage');
});
router.get('/home/labels',authCheck,(req,res)=>{
    res.render('label');
});

router.post('/home/listTask',authCheck,(req,res)=>{
    var p=req.body.priority;
    var s=req.body.status;
    console.log(p);
    console.log(s);
    if(s === 'All' && p === 'All'){
    Task.find({owner:req.user._id}).then(tasks=>{
        res.json(tasks);
    }).catch(err=>console.log(err));
    }
    else{
        if(s === 'All'){
            Task.find({owner:req.user._id,priority:p}).then(tasks=>{
                if(tasks){
                res.json(tasks);
                }
            }).catch(err=>console.log(err));
        }  
        else if(p === 'All'){
            Task.find({owner:req.user._id,status:s}).then(tasks=>{
                if(tasks){
                    res.json(tasks);
                    }
            }).catch(err=>console.log(err));
        }
        else
        {
            Task.find({owner:req.user._id,priority:p,status:s}).then(tasks=>{
                if(tasks){
                res.json(tasks);
                }
            }).catch(err=>console.log(err));
        }   
    }
})
router.post('/home/listLabel',authCheck,(req,res)=>{
    Label.find({}).then(label=>{
        res.json(label);
    })
});
router.get('/home/tasks',authCheck,(req,res)=>{
    res.render('alltasks');
});
router.post('/home/addLabel',authCheck,(req,res)=>{
    var data=req.body;
    console.log(req.body);
    newLabel= new Label({
        name:data.value
    })
    newLabel.save().then(label=>{
        console.log(label);
        res.json(label);
    }).catch(err=> console.log(err));
    
})

router.get('/home/createTask',authCheck,(req,res)=>{
    res.render('createTask');
});
router.post('/home/createTask',authCheck,(req,res)=>{
    const {taskName,priority,label,datetime}=req.body;
    var d=new Date(datetime);
    var p=Date.parse(d);
    newTask=new Task({
        name:taskName,
        priority,
        label,
        creationDate:Date.now(),
        targetDate:p,
        owner:req.user._id 
    })
    newTask.save().then(task=>{
        console.log(task);
        Label.findOne({name:label}).then(label=>{
            label.task.push({task:task._id});
            label.save().then(lab=>{
                console.log(lab);
            })
            res.redirect('/home/createTask');
        })
        req.user.Tasks.push({id:task._id})
    });
    
    
});

router.get('/signup',(req,res)=>{
    res.render('signup');
});
router.post('/signup',(req,res)=>{
    const {email,username,password}=req.body;
    newUser=new User({
        email,
        username,
        password,
        img:email+'.jpg',
    });
    require('../config/bcrypt')(newUser);
    newUser.save().then(user=>{
        console.log('Created User',user);
        fs.copySync('./public/images/profile.jpg', './public/uploads/'+user.img);
        res.json('');
    })
});

router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile']
})
);
router.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
    console.log(req.user);
    res.redirect('/home');
});

router.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['profile']
})
);
router.get('/auth/facebook/callback', passport.authenticate('facebook'), (req, res) => {
     //res.send(req.user);
    res.redirect('/home');
});


router.get('/auth/github', passport.authenticate('github', {
    scope: ['profile']
})
);
router.get('/auth/github/callback', passport.authenticate('github'), (req, res) => {
     console.log(req.user);
    res.redirect('/home');
});
router.get('/home/logout',(req,res)=>{
    req.logout();
    res.redirect('/');
  });
module.exports= router;