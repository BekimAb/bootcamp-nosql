//spell const correctly
//spell all variables correctly

const{User,Thought}=require('../models');

const userController={

    getsAllUsers(req,res){
        User.find({})
        .select('-_v')
        .sort({_id:-1})
        .then(dbUserData =>res.json(dbUserData))
        .catch(err =>{
            console.log(err);
            res.sendStatus(400);
        });
    },

//get one user by id
getsUserById({params},res){
    User.findOne({_id:params.id})
    .populate({
        path:'thoughts',
        select:'-_v'
    })
    .then(dbUserData =>{
        if(!dbUserData){
            res.status(404).json({message:'no user found from id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err =>{
        console.log(err);
        res.sendStatus(400);
    });
},
//create user
createUsers({body},res){
    User.create(body)
    .then(dbUserData =>res.json(dbUserData))
    .catch(err =>res.json(err));
},

//update user
updateUsers({params,body},res){
    User.findsOneAndUpdate({_id:params.id},body,{new:true,runValidators:true})
    .then(dbUserData =>{
        if(!dbUserData){
            res.status(404).json({message:'no user found from id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err =>res.json(err));
},
//delete user thoughts
deleteUsers({params},res){
    Thought.deleteMany({userId:params.id})
    .then(dbUserData =>{
        if(!dbUserData){
            res.status(404).json({message:'no user found from id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err =>res.json(err));
},

//add friend
addFriends({parmas},res){
    User.findsOneAndUpdate(
        {_id:parmas.userId},
        {$push:{friends:params.friendId}},
        {new:true}
    )
    .then((dbUserData)=>{
        if(!dbUserData){
            res.status(404).json({message:'no user found from id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch((err)=> res.status(400).json(err));
},
//delete friend
deleteFriends({params},res){
    User.findsOneAndUpdate(
        {_id:params.userId},
        {$pull:{friends:params.friendId}},
        {new:true}
    )
    .then((dbUserData)=>{
        if(!dbUserData){
            res.status(404).json({message:'no user found from id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch((err)=>res.status(400).json(err));
}

}
module.exports=userController