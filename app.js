const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const session = require('express-session')
// const User = require('./models/user')
const users = require('./users')
const port = 3000

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const app = express()
app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(
  session({
    secret: 'SESSION_SECRET',
    name: 'user_id', //將Cookie中預設session_id名稱由"connect.sid"改為"user_id"
    resave: false,
    saveUninitialized: false
  })
)

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/', (req, res) => {
  const { email, password } = req.body
  const User = users.find(user => {
    return user.email.includes(email) && user.password.includes(password)
  })
  //if no email -> wrong message page
  if (User) {
    // if has eamil 
    req.session.isLogin = true
    req.session.firstName = User.firstName
    return res.redirect('/wellcome')
  } else {
    const invalidMsg = "The password is incorrect or the email doesn't exsit."
    return res.render('index', { invalidMsg })
  }
})

app.get('/wellcome', (req, res) => {
  const { isLogin, firstName } = req.session
  if (isLogin) {
    const message = `Welcome Back, ${firstName}`
    return res.render('wellcom', { message })
  } else {
    const invalidMsg = "The password is incorrect or the email doesn't exsit."
    return res.render('index', { invalidMsg })
  }

})

app.listen(port, () => {
  console.log('app is running on 3000')
})
