 const bcrypt=require('bcryptjs');

module.exports=function(password,entVal,cb){
    bcrypt.compare(entVal,password, (err, isMatch) => {
    if (err) throw err;
    console.log(isMatch);
    cb(isMatch);
  });
};