const express = require('express');
const router = express.Router();
const { Subscriber } = require("../models/Subscriber");
const mongoose = require('mongoose');


//videodetail에서 영상을 올린사람의 구독자수를 보여주기위해 필요한 처리임
router.post("/subcribeNumber", (req, res) => {
    
   Subscriber.find({'receivedUser': req.body.receivedUser})
   .exec((err, subscribe)=>{ //recivedUser를 구독하고있는 모든 case가 뽑힌다.
        if(err) return res.status(400).send(err);

        return res.status(200).json({success:true, subscribeNumber: subscribe.length})
                                   
   })
});

//한마디로 videoDetail에 들어갔을때 버튼에, 구독하기를 보여줄지, 구독취소하기를 보여줄지를위해필요한작업임
//Subscripber DB는 구독에 대한 정보를가지고있음,
//이해하기 편하게 (구독한사람 :id  ,  구독당한사람: id)쌍으로 가지고 있다고 생각하면됨,
//밑의find문에의해 데이터가 한개라도있다면, 이미 구독이 되어있는 상태를 의미함
//req.body.giveUser에는 현재 로그인중인 사람의 _id가있고
//req.body.receivedUser에는 동영상을 올린 사람의 _id가 들어있다.

router.post("/subscribedboolean", (req, res) => {
    Subscriber.find({'receivedUser': req.body.receivedUser, 'giveUser': req.body.giveUser})
    .exec( (err, subscribe)=>{
        if(err) return res.status(400).send(err);

        let result = false
        
        if(subscribe.length !== 0){ //이미 해당유저가 구독되어있다면
            result = true
        }

        res.status(200).json({success: true, subscribed: result})
    })
 });

 // 구독취소하기 기능처리
router.post("/unSubscribe", (req, res) => {
   Subscriber.findOneAndDelete({'receivedUser':req.body.receivedUser ,'giveUser': req.body.giveUser})
    .exec((err, doc)=>{
        if(err) return res.status(400).json({success: false, err})
        
        res.status(200).json({success: true, doc})
    })
});
 
 
  //구독하기 기능처리
router.post("/subscribe", (req, res) => {
    
    const subscribe = new Subscriber(req.body)

    subscribe.save((err, doc)=>{
        if(err) return res.json({success: false, err})

        res.status(200).json({ success:true, doc})
    })
 });
 
 
 
 




module.exports = router;
