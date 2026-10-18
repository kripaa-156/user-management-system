const express=require('express');
const app=express(); //anything that express can do, now this app variable can do it
const path=require('path');
const userModel=require('./models/user');

app.set("view engine","ejs"); //tells express to use ejs to render applications
app.use(express.json()); //parses incoming request bodies containing JSON
app.use(express.urlencoded({extended:true})); //parses form data submitted through html forms
app.use(express.static(path.join(__dirname,'public'))); //This line tells Express to serve static files such as images, CSS, JavaScript, and HTML from your public folder.

app.get('/',(req,res)=>{
    res.render("index");
})

app.get('/read',async (req,res)=>{
    let users=await userModel.find(); //retrieves all matching user documents from MongoDB.
    res.render("read",{users});  //can also be written as {users:users} like { propertyName: variableName }
})

app.get('/edit/:userid',async (req,res)=>{
   let user=await userModel.findOne({_id:req.params.userid});
   res.render("edit",{user});
})

app.post('/update/:userid',async (req,res)=>{
   let {image,name,email}=req.body;
   let user=await userModel.findOneAndUpdate({_id:req.params.userid},{image,name,email},{new:true});
   res.redirect("/read");
})

app.get('/delete/:id',async (req,res)=>{
    let users=await userModel.findOneAndDelete({_id:req.params.id});
    res.redirect("/read");
})

app.post('/create', async (req, res) => {
    let { name, email, imageurl } = req.body;
    await userModel.create({
        name: name,
        email: email,
        image: imageurl
    }); 
    res.redirect('/read');
});

app.listen(3000); 

