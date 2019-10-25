rt = exp.Router()
rt.get("/getdata",(req,res)=>{
     
    con.tbl_subsubcat.aggregate([{
            $lookup:{
                from:"tbl_cat",
                localField:"catid",
                foreignField:"_id",
                as:"data"
            }
        },
        {"$unwind":"$data"},

        {
            $lookup:{
                from:"tbl_subcat",
                localField:"subid",
                foreignField:"_id",
                as:"datanew"
            }   
        },
        {"$unwind":"$datanew"},  

        {
            "$group":{
                "_id":"$_id",
                "newitems":{
                    "$push":{
                        "catname":"$data.catname",
                        "subcatname":"$datanew.subcatname",
                        "subsubcatname":"$subsubcatname",
                        "subid":"$datanew._id",
                        "catid":"$data._id",
                        "Active":"$Active"
                    }
                }
            }
        },
        {"$unwind":"$newitems"}],(err,result)=>{
            if(err)
            res.send(err)
            else
            res.send(result)
        })   
})  


rt.post("/updatesubsubcatref",(req,res)=>{
    con.tbl_subsubcat.update(req.body[0],req.body[1])
    console.log(req.body)
    res.send({result:"Updated.."})
})

rt.post("/addsubsubcatref",(req,res)=>{
    newid=1
    con.tbl_subsubcat.find().sort({_id:-1}).limit(1,(err,result)=>{
        if(result.length!=0)
        {
            newid = result[0]._id
            newid = newid + 1
        }
        cont = req.body
        cont._id = newid
        con.tbl_subsubcat.insert(cont)
        console.log(cont)
        res.send({result:"subsubcat Added"})
    })
})


rt.post("/getsubsubcatbasedonsubcatid",(req,res)=>{
    //console.log(req.body)
    // console.log("Hiiii")

    con.tbl_subsubcat.find(req.body,(err,result)=>{
        // console.log(req.body)
        if(err)
        res.send(err)
        else
        res.send(result)
        // console.log("helo")
    })
})

module.exports=rt;