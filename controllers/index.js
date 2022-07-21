const {User, Profile, Post, Tag, PostTag} = require('../models')
const createdAtFormatter = require('../helpers')
const bcrypt= require('bcrypt');
const {Op} = require('sequelize')

class Controller {
  static loginPage (req, res) {
    res.render('login-page')
  }

  static loginPage (req, res) {
    let{errors}=req.query
    res.render('login-page',{errors})
  }

  static loginCheck (req, res) {
    const {username, password} = req.body

    User.findOne({where: {username: username}})
    .then(user => {
      if(user){
        const isValidPassword= bcrypt.compareSync(password, user.password)
      if (isValidPassword) {
        req.session.userId= user.id
        req.session.role= user.role
        res.redirect('/home')
        
      } else {
        const error= 'invalid Username or Password'
        res.redirect(`/?errors=${error}`)
      }
    }else{
      const error= 'required Username or Password'
        res.redirect(`/?errors=${error}`)
    }
    })
    .catch(err => {
      res.send(err)
    })
  }

  static signupPage(req, res) {
    let {errors} = req.query

    res.render('signup-page', {errors})
  }

  static signup(req, res) {
    const{firstName,lastName,email, phone, username, password, role, isPrivacy}=req.body

    User.create({username, email, password, role})
    .then((user)=>{
      const UserId = user.id
     return Profile.create({firstName, lastName, phone, isPrivacy, UserId})
    })
    .then(()=>{
      res.redirect('/')
    })
    .catch(err=>{
      let errors
      if (err.name === "SequelizeValidationError") {
        errors = err.errors.map(error => {
          return error.message
        })
        res.redirect(`/sign-up/?errors=${errors}`)
      } else {
        res.send(err)
      }
    })
    
  }

  static home (req, res) {
    Post.findAll({
      attributes: [
        'id', 'caption', 'imageUrl', 'UserId', 'createdAt'
      ],
      include: [{
        model: User,
        attributes: ['username', 'role']
      }, {
        model: Tag,
        attributes: ['name']
      }]
    })
      .then(posts => {
        res.render('home', {posts, createdAtFormatter})
      })
      .catch(err => {
        console.log(err)
      })
  }

  static profile (req, res) {
    User.findByPk(req.session.userId, {
      include: [{
        model: Profile,
        attributes: ['firstName', 'lastName', 'profilePicture', 'bio', 'phone', 'isPrivacy']
      },{
        model: Post,
        attributes: ['caption', 'imageUrl', 'createdAt']
      }
    ],
      attributes: ['username']
    })
      .then(user => {
        res.render('profile', {user, createdAtFormatter})
      })
      .catch(err => {
        res.send(err)
      })
  }

  static postAddForm(req, res) {
    Tag.findAll({
      attributes: ['id','name']
    })
      .then(tags => {
        res.render('post-add', {tags})
      })
      .catch(err => {
        console.log(err)
      })
  }

  static postAdd (req, res) {
    const files= req.file.filename
    const {caption, TagId} =req.body
    Post.create({imageUrl:files, caption, UserId:req.session.userId})
    .then(newPost =>{
      let PostId = newPost.id

      return PostTag.create(PostId, TagId)
    })
    .then(() => {
      res.redirect('/home')
    })
    .catch(err=>{
      res.send(err)
    })
  }

  static explore(req, res) {
    const {tagId} = req.query
    let tagList = []

    let option = {
      attributes: ['id', 'name'],
      include: {
        model: Post,
        attributes: ['id', 'caption', 'imageUrl', 'createdAt'],
        include: {
          model: User,
          attributes: ['username']
        }
      }
    }

    if (tagId) {
      option.where = {
        id: tagId
      }
    }

    Tag.findAll({
      attributes: ['id', 'name']
    })
      .then(nameTags => {
        nameTags.forEach(tag => {
          tagList.push({id: tag.id, name: tag.name})
        })
        return Tag.findAll(option)
      })
      .then(tags => {
        res.render('explore', {tagList, tags, createdAtFormatter})
      })
      .catch(err => {
        res.send(err)
      })
  }

  static search(req, res) {
    const {username} = req.query
    
    if(!username) {
      res.redirect('/home')
      return
    }

    let option = {
      include: [{
        model: Profile,
        attributes: ['firstName', 'lastName', 'profilePicture', 'bio', 'phone', 'isPrivacy']
      },{
        model: Post,
        attributes: ['caption', 'imageUrl', 'createdAt']
      }
    ],
      attributes: ['username']
    }

    if (username) {
      option.where = {
        username: {
          [Op.iLike]: `%${username}%`
        }
      }
    }

    User.findOne(option)
      .then(user => {
        console.log(user.Profile.privateAccount)
        res.render('search', {user, createdAtFormatter})
      })
      .catch(err => {
        res.send(err)
      })
  }

  static adminPage(req,res){
    User.findAll({include:{model:Post}})
    .then(data=>{
      res.render('admin-page',{data})
    })
    .catch(err=>{
      res.send(err)})
  }
  
  static deleteUser(req,res){
    let{userId}=req.params
    User.destroy({where:{id:userId}})
    .then(()=>{
      res.redirect('/admin')
    })
    .catch(err=>{
      res.send(err)
    })
  }

  static editProfileForm (req, res) {
    let UserId = req.session.userId
   User.findOne({include:{model: Profile}})
   .then(user=>{
    res.render('edit-profile', {user})
   })
   .catch(err=>{
    res.send(err)
   })
  }

  static editProfile (req, res) {
    const {firstName, lastName, profilePicture, email, phone, username, isPrivacy} = req.body
    
    let updatedUser = {
      username,
      email,
    }

    let updatedProfile = {
      firstName,
      lastName,
      profilePicture,
      phone,
      isPrivacy
    }
    User.update(updatedUser, {
      where: {
        id: req.session.userId
      }
    })
      .then(() => {
        return Profile.update(updatedProfile, {
          where: {
            id: req.session.userId
          }
        })
      })
      .then(() => {
        res.redirect('/profile')
      })
      .catch(err => {
        res.send(err)
      })
  }

  static logOut(req,res){
    req.session.destroy(err=>{
      if(err){
        res.send(err)
      }else{
        res.redirect('/')
      }
    })
  }

}

module.exports = Controller