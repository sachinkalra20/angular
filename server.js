exp=require("express")
app=exp()
sess=require("express-session")
bp=require("body-parser")
mj=require("mongojs")
file=require("express-fileupload")
js=require("jsonwebtoken")
nm=require("nodemailer")
cat=require("./nodefiles/category")
subcat=require("./nodefiles/subcategory")
subsubcat=require("./nodefiles/subsubcategory")
product=require("./nodefiles/product")
brand=require("./nodefiles/brand")
image=require("./nodefiles/images")
userinfo=require("./nodefiles/userinfo")
payment=require("./nodefiles/payment")
ser_settings=require("./serversettings")
usercart=require("./nodefiles/usercart")
console.log(ser_settings.server_path)
app.use(bp.json())
app.use(file())
app.use(sess({
    secret:"#$%#%$"
}))

app.use(exp.static(__dirname));
app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html")
});
/*md=require("mongodb").MongoClient
//client = md.MongoClient
con=new md("mongodb://localhost:27017/mean-stack",{useNewUrlParser:true});
*/

con=mj("mongodb://localhost:27017/mean-stack")
app.use("/catref",cat)
app.use("/subcatref",subcat)
app.use("/subsubcatref",subsubcat)
app.use("/productref",product)
app.use("/brandref",brand)
app.use("/imageref",image)
app.use("/userref",userinfo)
app.use("/payment",payment)
app.use("/cartitemref",usercart)


transporter=nm.createTransport({
    service:"gmail",
    auth:{
        user:"sreelekha.jadala@gmail.com",
        pass:"j9550909767J"
    }
})

app.post("/insprodimages",(req,res)=>{
    arr = []
    console.log("enterred into files loop")
    for(i=0;i<req.files.f1.length;i++){
        fname = req.files.f1[i].name
        dt = new Date()
        fname = dt.getTime()+fname
        cont = req.files.f1[i]
        cont.mv("src/assets/uploads/"+fname)
        arr.push(fname)
        console.log(fname+"Moved")
    }

    console.log(arr)
    recid=0;
    con.tbl_product.find().sort({_id:-1}).limit(1,(err,result)=>{
       // console.log(result)
        recid=(result[0]._id)
        //console.log(recid)
        con.tbl_product.update({_id:recid},{$set:{images:arr}})
        res.redirect("http://localhost:4200/ad/prod;status=1")
    })
})



app.listen(1000);
console.log("server started with port no:1000")