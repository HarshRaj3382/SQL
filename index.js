const { faker } = require('@faker-js/faker');

 let createRandomUser =() => {
  return [
     faker.string.uuid(),
     faker.internet.userName(),
     faker.internet.email(),
   
    faker.internet.password(),
   
  ];
};




const express=require("express");
const app=express();

let port=8080;

const mysql = require('mysql2');
const path = require('path'); 
// Set view engine to EJS
app.set('view engine', 'ejs');
let methodOverride = require('method-override')
// Set the views directory
app.set('views', path.join(__dirname, '/views'));


app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));

// Create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password:'3382'
});


let q="INSERT INTO user (id,Username,email,password) VALUES ?";

// to insert data manually
// let user=[["123A","123_newuserA","abs@gamil.comA","abcA"],
// ["123B","123_newuserB","abs@gamil.comB","abcB"],];


//to insert data using facker;
// let data=[];
// for(let i=1;i<=100;i++){
//   data.push(createRandomUser());
// }

// try{
//     connection.query(q,[data],(err,result)=>{
//         if(err) throw err;
//         console.log(result);
//     });
// }catch(err){
//     console.log(err);
// }

// connection.end();


 

//building Rest Api

// count 

app.get("/",(req,res)=>{
 let q= `SELECT count(*) FROM user`;
  try{
    connection.query(q,(err,result)=>{
        if(err) throw err;
       let count=result[0]["count(*)"];
      res.render("home.ejs",{  count });
    });
}catch(err){
    console.log(err);
    res.send("some error in server");
}
});

// to show data
app.get("/user",(req,res)=>{
  let q=`SELECT * FROM user`;
  try{
    connection.query(q,(err,users)=>{
        if(err) throw err;
      //  console.log(result);
      res.render("show.ejs",{users});
    });
}catch(err){
    console.log(err);
    res.send("some error in server");
}
});

//edit 
app.get("/user/:id/edit",(req,res)=>{
  let {id}=req.params;
  let q=`SELECT * FROM user WHERE id='${id}'`;

  try{
    connection.query(q,(err,result)=>{
        if(err) throw err;
      let user=result[0];
      res.render("edit.ejs",{user});
    });
}catch(err){
    console.log(err);
    res.send("some error in server");
}


});

//upsate route
app.patch("/user/:id",(req,res)=>{
  let {id}=req.params;
  let q=`SELECT * FROM user WHERE id='${id}'`;
 let {password:formpass,Username:newusername}=req.body;
  try{
    connection.query(q,(err,result)=>{
        if(err) throw err;
      let user=result[0];
      if(formpass!=user.password){
        res.send("Wrong password");
      }
      else{
        let q2=`UPDATE  user SET Username='${newusername}' WHERE id='${id}'`;
        connection.query(q2,(err,result)=>{
          if(err) throw err;
          res.redirect("/user");
        });

      }
     
    });
}catch(err){
    console.log(err);
    res.send("some error in server");
}
});

// create new 
app.get("/user",(req,res)=>{
  let {username,email,password}=req.body;
  let id=uuidv4();

  res.render("new.ejs");

})

app.listen(8080,()=>{
    console.log("Radhe Radheon port 8080");
});


