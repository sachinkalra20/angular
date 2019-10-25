rt=exp.Router()

rt.post("/insertcartdata",function(req,res){
    newid=1
    con.tbl_usercart.find().sort({_id:-1}).limit(1,(err,result)=>{
        if(result.length!=0)
        {
        newid=result[0]._id
        newid=newid+1
        }
    cont=req.body
    cont._id=newid
    con.tbl_usercart.insert(cont)
    console.log(cont)
    if(err)
    res.send(err)
    else
    res.send(result)
    })

})



rt.post("/matchuseridinDB",function(req,res){
    console.log(req.body)
    sess=req.session
    if(sess.token==req.body.token)
    {
        user_id=sess.uid
    con.tbl_usercart.find({uid:user_id},(err,result)=>{
        if(err){
            res.send(err)
        }
        else{
            console.log(result)
            res.send(result)
        }
    })
    }
    else
    {
    res.send({err:1}) 
    }
})


rt.post("/insertprodafterlogintodb",function(req,res){
    // console.log("in usercartjjjjjjj"+req.body.uid)
    pid=req.body.pid
    uqty=req.body.uqty
    pname=req.body.pname
    price=req.body.price
    image=req.body.image
    prodColor=req.body.image
    token=req.body.token
    sess=req.session
    if(sess.token==token)
    {
        user_id=sess.uid
    con.tbl_usercart.insert({uid:user_id,pid:pid,uqty:uqty,pname:pname,price:price,image:image,prodColor:prodColor,token:token},(err,result)=>{
        if(err){
            res.send(err)
        }
        else{
            res.send(result)
            
        }
    })
    }
    else
    {
    res.send({err:1}) 
    }

})

rt.post("/updatecartquant",function(req,res){
    // console.log("in usercartjjjjjjj"+req.body.uid)
  console.log("updatinggg")
  console.log(req.body)
  
  if(sess.token==req.body.token)
    {
        user_id=sess.uid
    con.tbl_usercart.update({uid:user_id,token:req.body.token,pid:req.body.pid,prodColor:req.body.prodColor},{$set:{uqty:parseInt(req.body.uqty)}},(err,result)=>{
        if(err){
            res.send(err)
        }
        else{
            console.log(result)
            res.send(result)
        }
    })
    }
    else
    {
    res.send({err:1}) 
    }
})

rt.post("/getwishlist",(req,res)=>{
    console.log(req.body)
    con.tbl_wishlist.find(req.body,(err,result)=>{
        console.log(result)
        res.send(result)
    })
})

rt.post("/insertWishListData",function(req,res){
    console.log(req.body)
    // pid:req.body[1].productId
    // console.log(pid)
    console.log(sess.token)
    sess=req.session
    if(sess.token==req.body.token)
    {
        user_id=sess.uid
    con.tbl_wishlist.insert({uid:user_id,pid:req.body.productId},(err,result)=>{
    if(err)
        res.send(err)
    else
        console.log(result)
        res.send(result)
    })
    }
})

rt.post("/removeWishListData",function(req,res){
    sess=req.session
    if(sess.token==req.body.token)
    {
        user_id=sess.uid
    con.tbl_wishlist.remove({uid:user_id,pid:req.body.productId},(err,result)=>{
    console.log(result)
    if(err)
    res.send(err)
    else
    res.send({result:"removed"})  
    })
    }
  })

  rt.post("/getwishlistbypidanduid",(req,res)=>{
    console.log(req.body)
    sess=req.session
    if(sess.token==req.body.token)
    {
        console.log(sess.uid)
        user_id=sess.uid
    con.tbl_wishlist.find({uid:user_id,pid:req.body.productId},(err,result)=>{
        console.log(result)
        res.send(result)
    })
}
})

rt.post("/getorderdata",(req,res)=>{
    console.log("order table data"+req.body)
    sess=req.session
    if(sess.token==req.body.token)
    {
        console.log(sess.uid)
        user_id=sess.uid
    con.tbl_orders.find({uid:user_id},(err,result)=>{
        console.log(result)
        res.send(result)
    })
}
})

rt.post("/getorderproductsdata",(req,res)=>{
    console.log("order_product table data"+req.body)
    sess=req.session
    if(sess.token==req.body.token)
    {
        console.log(sess.uid)
        user_id=sess.uid
    con.tbl_orders_products.find({uid:user_id},(err,result)=>{
        console.log(result)
        res.send(result)
    })
}
})
  


module.exports=rt