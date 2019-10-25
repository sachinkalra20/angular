rt = exp.Router()

rt.get("/getdata",(req,res)=>{
    con.tbl_userregistration.find((err,result)=>{
        console.log(result)
        res.send(result);
    })
})

rt.post("/userlogininfo",function(req,res){
    console.log(req.body)
    con.tbl_userregistration.find(req.body,(err,result)=>{
        if(err){
            res.send(err)
        }
        else{
           if(result.length==0)
           res.send({resp:0})
           else
           {
            token=js.sign({em:req.body.email}, "$%$#FS$%")
            //console.log(token)
            result[0].tk=token;
            sessions=req.session
            sessions.token=token
            sessions.uid=result[0]._id
            console.log(sessions.token)
            console.log(sessions.uid)
            res.send(result)
           }
        }
    })
})

rt.post("/userreginfo",function(req,res){
    newid=1;
    email=req.body.email;
    // console.log(email)
    token=js.sign({em:email}, "$#^%^%$%%@%$")
    con.tbl_userregistration.find().sort({_id:-1}).limit(1,(err,result)=>{
        if(result.length!=0){
            newid=result[0]._id
            newid=newid+1
        }
        cont=req.body
        cont._id=newid
        cont.actlink=token
        console.log(cont)
        con.tbl_userregistration.insert(cont)
        console.log(cont)
        str = "Account created..! Click on activation link!!! <a href='http://localhost:4200/use/active?tk="+token+"'> Click Here </a>"
        console.log(token)
        console.log(str)
        transporter.sendMail({
            from:"sreelekha.jadala@gmail.com",
            to:email,
            subject:"Shopping Activation",
            html:str
        },(err,dt)=>{
            if(err){
                res.send(err)
            }
            else{
                res.send("Mail Sent")
            }
        })
    })
})





rt.post("/getregistrationdata",(req,res)=>{
    console.log(req.body)
    sess=req.session
    if(sess.token==req.body.token)
    {
        user_id=sess.uid
        con.tbl_userregistration.find({_id:user_id},(err,result)=>{
            if(err)
            res.send(err)
            else
            res.send(result)
        })
    }
    else
    {
    res.send({err:1}) 
    }
   
})

rt.post("/updateregisterdata",function(req,res){
    console.log(req.body)
    // con.tbl_register.update({$set: {actlink: req.body.actlink}}, {$set: {Active: req.body.Active}}) 
    con.tbl_userregistration.update(req.body[0],req.body[1])
    console.log("user activated")
    res.send({result:"updated"})

})

rt.post("/updateshippingaddr",function(req,res){
    console.log(req.body)
    if(sess.token==req.body.token)
    {
        user_id=sess.uid
    con.tbl_userregistration.update({_id:user_id,token:req.body[0].token,shippingaddress:req.body[1].shippingaddress})
    res.send({result:"updated"})
    }
    else
    {
    res.send({err:1}) 
    }
})


rt.post("/updateactive",function(req,res){
    console.log(req.body)
    // con.tbl_userregistration.update({$set: {actlink: req.body.actlink}}, {$set: {Active: req.body.Active}}) 
    con.tbl_userregistration.update(req.body[0],req.body[1])
    console.log("hiii..............")
    res.send({result:"updated"})

})


rt.post("/aftersuccessmailsend",function(req,res){
    console.log("in js"+req.body._id)
    uid=req.body._id
    orderid=req.body.paymentid
    con.tbl_userregistration.find({_id:parseInt(uid)},(err,result)=>{
        if(err){
            res.send(err)
        }
        else{
            console.log(result)
            // res.send(result)
        
            data=result
            console.log("resultdata"+data)
        email=result[0].email;
      console.log(email)
      token=js.sign({em:email}, "$#^%^%$%%@%$")
      str = "Your Order" +orderid+ "is successfully placed...!!!!"
      transporter.sendMail({
        from:"sreelekha.jadala@gmail.com",
        to:email,
        subject:"Shopping Activation",
        html:'<div style="background-color:lightblue;height:100px;font-size:50px;color:white">Order Invoice</div><br>Orderid:${orderid}'
    },(err,dt)=>{
        if(err){
            res.send(err)
        }
        else{

            res.send("Mail Sent")
        }
    })
}
    })
})



module.exports=rt