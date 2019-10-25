rt = exp.Router()
rt.get("/getdata",(req,res)=>{
    
       con.tbl_subcat.aggregate([{
           $lookup:{
               from:"tbl_cat",
               localField:"catid",
               foreignField:"_id",
               as:"data",
           }
       },
       {"$unwind":"$data"},
       {
           "$group":{
               "_id":"$_id",
               "items":{
                   "$push":{
                       "catname":"$data.catname",
                       "subcatname":"$subcatname",
                       "catid":"$catid",
                       "Active":"$Active"
                   }
               }
           }
       },
       {"$unwind":"$items"}],(err,result)=>{
           if(err)
           res.send(err)
           else
           res.send(result)
       })
        
})

rt.post("/updatesubcatref",(req,res)=>{
    con.tbl_subcat.update(req.body[0],req.body[1])

    console.log(req.body)
    res.send({result:"Updated.."})
})

rt.post("/addsubcatref",function(req,res){
    newid=1

    con.tbl_subcat.find().sort({_id:-1}).limit(1,(err,result)=>{
        if(result.length!=0)
        {
            newid=result[0]._id
            newid = newid + 1
        }
        cont=req.body
        cont._id = newid
        con.tbl_subcat.insert(cont)
        console.log(cont)
        res.send({result:"subcat added.."})
    })
})

rt.post("/getsubcatbasedoncatid",(req,res)=>{
    //console.log(req.body)
    console.log("Hiiii")

    con.tbl_subcat.find(req.body,(err,result)=>{
        // console.log(req.body)
        if(err)
        res.send(err)
        else
        res.send(result)
        // console.log(result)
    })
})

module.exports=rt;