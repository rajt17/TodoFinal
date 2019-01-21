const multer=require('multer');
const path=require('path');
const fs=require('fs-extra');

const storage=multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/')
      },
      filename: function (req, file, cb) {
        var name=req.user.img;
        var pos=name.lastIndexOf('.jpg');
        name=name.substring(0,pos);
        console.log(name);
        var len=req.user.oldpic.length;
        name=name+'('+len+').jpg';
        fs.copySync('./public/uploads/'+req.user.img, './public/uploads/'+name);
        req.user.oldpic.push({name:name});
        cb(null, req.user.img)
      }
});

const upload=multer({storage:storage}).single('image');

module.exports=upload;