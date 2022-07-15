const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
  username:{type: String , required: true , unique:true},
  emailid:{type: String , required: true , unique:true},
  password:{type: String , required: true },
  isAdmin : {type: Boolean , default:false},
  img : {type:String},
  },
  {timestamps:true},
);

module.exports = mongoose.model("user",UserSchema);