rt = exp.Router()
rt.post("/imageadd",function(req,res){
    newid=1
    con.tbl_images.find().sort({_id:-1}).limit(1,(err,result)=>{
        if(result.length!=0){
            newid=result[0]._id
            newid=newid+1
        }
        cont=req.body
        cont._id=newid
        console.log("image inserting...")
    console.log(cont)
    con.tbl_images.insert(cont)
    res.send({result:"image sucessfully added"})
    })
})
rt.get("/getdata",(req,res)=>{
    //console.log("hi")
        con.tbl_images.aggregate([{
            $lookup:{
                from:"tbl_product",
                localField:"pid",
                foreignField:"_id",
                as:"data"
            }
        },
        {"$unwind":"$data"},
    
        {
            "$group":{
                "_id":"$_id",
                "items":{
                    "$push":{
                        
                        "ProductName":"$data.ProductName",
                        "productColor":"$productColor",
                        "productImage":"$productImage",
                        "pid":"$data._id",
                        "images":"$images"
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


    rt.post("/insimages",(req,res)=>{
        console.log("in image js method")
         arr = []
        console.log("enterred into files loop")
        for(i=0;i<req.files.f2.length;i++){
            fname = req.files.f2[i].name
            dt = new Date()
            fname = dt.getTime()+fname
            cont = req.files.f2[i]
            cont.mv("src/assets/uploads/"+fname)
            arr.push(fname)
            console.log(fname+"Moved")
        }
        console.log(arr)
        recid=0;
        con.tbl_images.find().sort({_id:-1}).limit(1,(err,result)=>{
           // console.log(result)
            recid=(result[0]._id)
            //console.log(recid)
            con.tbl_images.update({_id:recid},{$set:{images:arr}})
            res.redirect("http://localhost:4200/ad/img;status=1")
        }) 
    })
    

    rt.post("/getimagesbasedonprodid",(req,res)=>{

            pid1=req.body[0].pid
            col=req.body[1].productColor
            con.tbl_images.aggregate([{
                $lookup:{
                    from:"tbl_product",
                    localField:"pid",
                    foreignField:"_id",
                    as:"data",
                }
            },
            {"$unwind":"$data"},
            {
                $match:{
                    $and:[{"pid":pid1},{"productColor":col}]
                    }
            },
            {
                 $project:
                 {
                        "_id":"$_id",
                        "productColor":"$productColor",
                        "images":"$images",
                        "ProductName":"$data.ProductName",
                        
                }
            }],(err,result)=>{
                if(err)
                res.send(err)
                else
                // console.log(result)
                res.send(result)
            })
        










    
    //     console.log(req.body)
    //     con.tbl_images.find(req.body,(err,result)=>{
    //         if(err)
    //         res.send(err)
    //         else
    //         res.send(result)
    //         console.log(result)
    //         //res.send(result);
    // })
    })

    module.exports=rt;
