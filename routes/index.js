var express = require('express');
var router = express.Router();
const Controller = require ('../controllers')

const multer= require('multer');
const path= require('path');

const storage= multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./public/images')
    },
    filename: (req, file,cb)=>{
        cb(null, Date.now()+path.extname(file.originalname))
    }
})

const upload= multer({storage:storage })

router.get('/', Controller.loginPage)
router.post('/', Controller.loginCheck)
router.get('/sign-up', Controller.signupPage)
router.post('/sign-up', Controller.signup)

router.use(function(req,res,next){
    if(!req.session.userId){
        res.redirect('/')
    }else{
        next()
    }
})

router.get('/home', Controller.home)
router.get('/profile', Controller.profile)
router.get('/add-post', Controller.postAddForm)
router.post('/add-post', upload.single("imageUrl") , Controller.postAdd)
router.get('/explore', Controller.explore)
router.get('/search', Controller.search)
router.get('/edit-profile', Controller.editProfileForm)
router.post('/edit-profile', Controller.editProfile)
router.get('/admin', Controller.adminPage)
router.get('/:userId/delete', Controller.deleteUser)
router.get('/log-out', Controller.logOut)

module.exports = router;