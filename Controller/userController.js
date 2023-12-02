const Users = require('../Model/Users')

const loadHome = async(req,res)=>{
    try {
        res.render('profile',{userData : req.session.userData})
    } catch (error) {
        res.send('internal server error')
    }
}

const Register = async(req,res)=>{
    try {
        const existing = await Users.findOne({email : req.body.email})
        if(existing){
            return res.render('register')
        }
        const user = new Users({
            fullName: req.body.fullName,
            email: req.body.email,
            password: req.body.password,
            profileImg: req.file.filename,
        });
        

        const userData = await user.save()

        req.session.userData = userData

        res.redirect('/home')
    } catch (error) {
        res.send(error)
    }
}

const loadLogin = async(req,res)=>{
    try {
        res.render('login')
    } catch (error) {
        res.send('internal server error')
    }
}

const verifyUser = async(req,res)=>{
    try {
        const {email,password} = req.body
        const findUser = await Users.findOne({email : email})
        if(findUser){
            if(password === findUser.password){
                req.session.userData = findUser
                res.redirect('/home')
            }
            else{
                return res.render('login',{msg : 'password is wrong'})
            }
        }
        else{
            return res.render('login',{msg : 'user not founded'})
        }
    } catch (error) {
        res.send('server error')
    }
}

const loadMeeting = async(req,res)=>{
    try {
        const serversecret = process.env.serversecret
        const appId = process.env.APPID
        res.render('WEB_UIKITS',{userData : req.session.userData,appId,serversecret})
    } catch (error) {
        res.send('server error')
    }
}

module.exports = {
  Register,
  loadLogin,
  verifyUser,
  loadHome,
  loadMeeting
}