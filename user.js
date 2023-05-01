const express=require('express');
const router=express.Router();
const User=require('../models/User');

router.post('/user', (req,res)=>{
    console.log("hello");
    const user=new User({
        name:req.body.name,
        email:req.body.email,
        city:req.body.city
    });
    user.save().then(data=>{
        res.send({user:data})
        console.log(data)
    }).catch(err=>{
        res.status(500).send({
            message:err.message || 'Add data'
        });
    });

});

// get all users data

router.get('/users', function(req,res){
 User.find().then((data)=>{
    console.log(data)
    res.send(data)
 })  
})

// get single user
router.get("/:id",async(req,res)=>{
	try{
		const user=await User.findById(req.params.id);
		res.json(user);

	}catch (error){
			res.json({message:error});
		}
});

router.put('/:id',async (req,res)=>{
	console.log("put response new")

	try{
		const _id=req.params.id;
		const getUser=await User.findOneAndUpdate(_id, req.body,{
			new:true
		});
		res.send(getUser);
	}catch(e){
		res.status(400).send(e)

	}
})

//delete
router.delete('/:id',async(req,res)=>{
	console.log("delted response from backend")

	try{
		const removeUser=await User.findOneAndRemove(req.params.id);
		res.send(removeUser);
	}catch (error){
		res.json({message:error});

	}
});


module.exports=router;