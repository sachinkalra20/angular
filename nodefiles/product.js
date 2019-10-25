rt = exp.Router()
rt.post("/prodadd",function(req,res){
    newid=1
    con.tbl_product.find().sort({_id:-1}).limit(1,(err,result)=>{
        if(result.length!=0){
            newid=result[0]._id
            newid=newid+1
        }
        cont=req.body
        cont._id=newid
        console.log("product inserting...")
    console.log(cont)
    con.tbl_product.insert(cont)
    res.send({result:"product sucessfully added"})
    })

    
})

rt.post("/removeproddata",(req,res)=>{
    console.log(req.body[0])
    console.log("deleting...")
   con.tbl_product.remove(req.body,(err,result)=>{
       if(err)
       console.log("error")
       else
       res.send({result:"Deleted"})
   })
})




rt.post("/updateprodref",(req,res)=>{
    console.log("service to server...")
    con.tbl_product.update(req.body[0],req.body[1])
    console.log(req.body)
    res.send({result:"updated"})
})





rt.post("/getdata",(req,res)=>{
//console.log("hi")
console.log(req.body)
    con.tbl_product.aggregate([{
        $lookup:{
            from:"tbl_cat",
            localField:"productCategory",
            foreignField:"_id",
            as:"data1"
        }
    },
    {"$unwind":"$data1"},

    {
        $lookup:{
            from:"tbl_subcat",
            localField:"productSubCategory",
            foreignField:"_id",
            as:"data2"
        }   
    },
    {"$unwind":"$data2"}, 
    
    {
        $lookup:{
            from:"tbl_subsubcat",
            localField:"productSubSubCategory",
            foreignField:"_id",
            as:"data3"
        }   
    },
    {"$unwind":"$data3"}, 
    
    

    {
        $lookup:{
            from:"tbl_brand",
            localField:"productBrand",
            foreignField:"_id",
            as:"data4"
        }   
    },
    {"$unwind":"$data4"}, 

    {
        "$group":{
            "_id":"$_id",
            "items":{
                "$push":{
                    
                    "ProductName":"$ProductName",
                    "productType":"$productType",
                    "description":"$description",
                    "productColor":"$productColor",
                    "productRatings":"$productRatings",
                    "productImage":"$productImage",
                    "productNewPrice":"$productNewPrice",
                    "productQuantity":"$productQuantity",
                    "productOldPrice":"$productOldPrice",
                    "productCategory":"$productCategory",
                    "productSubCategory":"$productSubCategory",
                    "productSubSubCategory":"$productSubSubCategory",
                    "productBrand":"$productBrand",
                    "productOffers":"$productOffers",
                    "sizes":"$sizes",
                    "catname":"$data1.catname",
                    "subcatname":"$data2.subcatname",
                    "subsubcatname":"$data3.subsubcatname",
                    "brandname":"$data4.brandname",
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




rt.post("/getproductbasedonsubsubcatid",(req,res)=>{
    
    console.log(req.body)
    con.tbl_product.find(req.body,(err,result)=>{
        if(err)
        res.send(err)
        else
        res.send(result)
        console.log(result)
        //res.send(result);
})
})


rt.post("/getproductbasedonproductid",(req,res)=>{
    //console.log(req.body)
    // console.log("Hiiii")

    con.tbl_product.find(req.body,(err,result)=>{
        // console.log(req.body)
        if(err)
        res.send(err)
        else
        res.send(result)
        // console.log("helo")
    })
})

rt.post("/getproductByProductType",(req,res)=>{
    //console.log(req.body)
    // console.log("Hiiii")

    con.tbl_product.find(req.body,(err,result)=>{
        // console.log(req.body)
        if(err)
        res.send(err)
        else
        res.send(result)
        // console.log("helo")
    })
})








module.exports=rt;