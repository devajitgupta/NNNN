const express = require('express');
const router = express.Router();
const Employee = require('../models/employee');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async(req,res)=>{
	const emailExist= await Employee.findOne({
		email:req.body.email
	});
	
	if(emailExist) return res.status(400).send("Email id is already exist");

	//-- hash password
	const salt=await bcrypt.genSalt(10);
	const hashedPassword=await bcrypt.hash(req.body.password, salt);
	// create a new user

	const user=new Employee({
		name:req.body.name,
		email:req.body.email,
		password:hashedPassword
	})
	try{
		const savedUser=await user.save();
		res.send(savedUser);

	}catch(error){
		res.status(400).send(error);

	}
})



router.post('/', (req, res) => {

	bcrypt.hash(req.body.password, 10, (err, hash)=> {

		if (err) {
			res.status(400).json({
				msg: "Something Wrong, Try Later!",
				results: err
			});
		} else {
			var userDetails = new Employee({
				name: req.body.name,
				email: req.body.email,
				password: hash,

			});

			userDetails.save().then(resResult => {
				res.status(201).json({
					msg: "Inserted Successfully",
					results: resResult
				});


			})
				.catch(err => {
					res.json(err);
				});
		}
	});
});



// Middleware to parse request body

router.post('/login', async(req,res)=>{
	// get the email and password of req.body
	const user =await Employee.findOne({email:req.body.email});

	// find the user of requested email
	if(!user) return res.sendStatus(401).send("Email Id is wrong");

	// comapre sent in password with found user password
	const passwordMatch=await bcrypt.compare(req.body.password, user.password);
	if(!passwordMatch) return res.status(400).send("Emaild id is wrong")


	//-- create and asign a token
	const Token=jwt.sign({_id:user._id}, process.env.TOKEN_SECRET);
	res.header("auth token", Token).send({token:token})
});

// Route for handling login requests
router.post('/loginn', async (req, res) => {
	console.log("login routes ")
  try {
    // Parse email and password from request body
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await Employee.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare password with hashed password from database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Send success response with user object
    res.status(200).json({ user });
  } catch (err) {
    // Handle any errors that occur during login
    console.error('Error logging in:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// get single user
router.get("/:id", async (req, res) => {
	try {
		const user = await Employee.findById(req.params.id);
		res.json(user);

	} catch (error) {
		res.json({ message: error });
	}
});

router.put('/:id', async (req, res) => {
	console.log("put response new")

	try {
		const _id = req.params.id;
		const getUser = await Employee.findOneAndUpdate(_id, req.body, {
			new: true
		});
		res.send(getUser);
		console.log(getUser);
	} catch (e) {
		res.status(400).send(e)

	}
})

//delete
router.delete('/:id', async (req, res) => {
	console.log("delted response from backend")

	try {
		const removeUser = await Employee.findOneAndRemove(req.params.id);
		res.send(removeUser);
	} catch (error) {
		res.json({ message: error });

	}
});


module.exports = router;