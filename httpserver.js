var express = require("express");
var app = express();
app.listen(9090,startup);
function startup(){
    console.log("server started at port 9090")
}
app.use(express.static(__dirname));

var mongoose=require("mongoose")
var ProductSchema = new mongoose.Schema({"_id":Number,productname:String,cost:Number});
var Products = mongoose.model("products",ProductSchema); 

app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html")
});


app.get("/getdetails",function(req,res){
    mongoose.connect("mongodb://localhost/onlineshopping")
  Products.find({productname:{$regex: req.query.s}},function(error,data){
      if(error)
      {
          res.status(500)
          res.send(err)
      }
      else{
          res.send(data)
      }
  })
})