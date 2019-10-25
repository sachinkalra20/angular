rt = exp.Router()
rt.post("/paymenturl",function(req,res){
  console.log("kkkkk")
    var request= require('request');

var headers = { 'X-Api-Key': 'd7d5a7077b085ceb2c2a66c68cb0d56a', 'X-Auth-Token': 'ce24b9ed21f78537182e60284e37f37b'}
var payload = {
  purpose: 'FIFA 16',
  amount: '10',
  phone: '+919550909767',
  buyer_name: 'sreelekha',
  redirect_url: 'http://localhost:4200/use/payment',
  send_email: true,
  webhook: 'http://localhost:4200',
  send_sms: true,
  email: 'sreelekha.jadala@gmail.com',
  allow_repeated_payments: false}
  console.log("hiiiiiiiiii")

request.post('https://www.instamojo.com/api/1.1/payment-requests/', {form: payload,  headers: headers}, function(error, response, body){
  if(!error && response.statusCode == 201){
      var cont=JSON.parse(body)
      res.send({url:cont.payment_request.longurl});
    console.log(body);
  }
})
})

rt.post("/afterpayment",(req,res)=>{
  uid=req.body.uid
  tm=new Date()
  dt=tm.getDate()+"/"+tm.getMonth()+"/"+tm.getFullYear()+"-"+tm.getHours()+":"+tm.getMinutes()
  console.log(dt)
  con.tbl_usercart.find({uid:parseInt(uid)},(err,result)=>{
    for(i=0;i<result.length;i++)
    {
      result[i].orderid=req.body.paymentid
    }
    con.tbl_orders_products.insert(result,()=>{
      con.tbl_orders.save({uid:parseInt(uid),orderid:req.body.paymentid,date:dt,status:'Pending'})
      con.tbl_usercart.remove({uid:parseInt(uid)})
      console.log("Inserted")
        
      res.send({result:"Inserted"})
    })

  })
  })

 

module.exports = rt