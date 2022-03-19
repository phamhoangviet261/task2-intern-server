const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const UserModel = require('../models/User.model')

// @route POST /api/auth/login
// @desc login user
// @access public
router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    // console.log("body", req.body);
    // Validation
    if(!email || !password) return res.status(400).json({success: false, message: 'Missing email or password'})

    try {
        // check existing user
        const user = await UserModel.findOne({email})
        if(!user){
            return res.status(400).json({success: false, message: 'Incorrect email or password'})
        }

        // found user
        // const hashedPassword = await bcrypt.hash(password, '$2b$10$o/hktJ4aYLFo3zuvTU80mO');
        // console.log("user.password          ", user.password)
        // console.log("hashedPassword login   ", hashedPassword);
        const passwordValid = await bcrypt.compareSync(password, user.password);
        // console.log("passwordValid", passwordValid)
        if(!passwordValid){
            return res.status(400).json({success: false, message: 'Incorrect email or password'})
        }

        //return token 
        const accessToken = jwt.sign({userId: user._id}, process.env.ACCESS_TOKEN_SECRET)
        console.log("accessToken", accessToken);
        return res.json({success: true, message: 'Login successfully', name: user.firstname, email:user.email, accessToken})
    } catch (error) {
        console.log("ERROR: ", error);
        return res.status(500).json({success: false, message: "Internal server error"})
    }
})

router.get('/', async (req, res) => {
    // console.log(req.query)
    const name = req.query.name || ""
    const email = req.query.email || ""
    try {
        let result = await UserModel.find({username: {$regex: name, $options: 'i'}, email: {$regex: email, $options: 'i'}}).sort({'_id': 1})
        return res.json({status: 'success', data: result})
    } catch (error) {
        return res.json({status: 'failed', data: [], error})
    }
})

router.post('/add', async (req, res) => {
    let newUser = new UserModel(req.body)
    newUser.save(function(err, doc) {
        if (err) return console.error(err);
        console.log("Document inserted succussfully!");
    })
    res.json(req.body)
})

router.post('/', async (req, res) => {
    //array user in body
    // console.log(req.body)
    let data = Object.keys(req.body).map((key) => req.body[key]);
    console.log(data)
    if(data.length == 0) {
        return res.json({status: 'failed', data: [], error: 'Incorrect data.'})
    }
    for(let i = 0; i < data.length; i++){
        if(data[i].username && data[i].email && data[i].birthday){
            const update = {
                username: data[i].username,
                email: data[i].email,
                birthday: data[i].birthday
            }
            // console.log("update", update)
            let userData = await UserModel.findById(data[i].id)
            if(!userData){
                // return res.json({status: 'failed', data: [], error: 'Incorrect username.'})
                break;
                // break if cannot find user
            }
            let result = await UserModel.findByIdAndUpdate(data[i].id, update,{
                returnOriginal: false
            })
        }  else {
            break;
            // breake for loop is username or email or birthday empty
        }      
    }
    const listUser = await UserModel.find()
    return res.json({status: 'success', data: listUser})
    
    return res.json({status: 'failed', data: [], error: 'Incorrect username, email or birthday.'})
})

module.exports = router