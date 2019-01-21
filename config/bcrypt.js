const bcrypt=require('bcryptjs');

module.exports=function(newUser){
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(newUser.password,salt,(err,hash)=>{
            if(err) throw err;
            newUser.password=hash;
            newUser.save().then(err=>{
                console.log('hashed');
            }).catch(err=>console.log(err));
        })
    });
}