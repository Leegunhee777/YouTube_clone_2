const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriberSchema = mongoose.Schema({
  receivedUser:{
      type: Schema.Types.ObjectId,
      ref: 'User'
  },
  giveUser:{
      type:Schema.Types.ObjectId,
      ref: 'User'
  }
 
},{timestamps:true}) //timestamps를통해 생성시간과 업데이트시간에 대한 기록을 남길수있음(해당필드가 자동으로추가됨)



const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = { Subscriber }