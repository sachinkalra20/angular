rt = exp.Router()
rt.get("/getdata",(req,res)=>{
    
        
        con.tbl_cat.find((err,result)=>{
            res.send(result);
    

    })
})


rt.post("/updatecatref",(req,res)=>{
    con.tbl_cat.update(req.body[0],req.body[1])
    console.log(req.body)
    res.send({result:"Updated.."})
})

rt.post("/addcatref",function(req,res){
    
    newid=1
    
    con.tbl_cat.find().sort({_id:-1}).limit(1,(err,result)=>{
        if(result.length!=0)
        {
            newid = result[0]._id
            newid = newid + 1
        }
        cont=req.body
        cont._id = newid  
        con.tbl_cat.insert(cont)
        console.log(cont)
        res.send({result:"Added"})
    })
})
   


module.exports=rt;