let mongoose = require('mongoose');
let passportLocalMongoose = require('passport-local-mongoose');

let User = mongoose.Schema(
    {
        username:
        {
            type:String,
            default:'',
            trim:true,
            required:'user name is required'
        },
        /*
        password:
        {
            type:String,
            default:'',
            trim:true,
            required:'password is required'
        }
        */
       email:
       {
            type:String,
            default:'',
            trim:true,
            required:'email is required'
       },
       displayName:
       {
        type:String,
        default:'',
        trim:true,
        required:'Display name is required'
       },
       created:
       {
            type:Date,
            default:Date.now
       },
       created:
       {
            type:Date,
            default:Date.now,
       }
    },
    {
        collection:"users"
    }
);

//configure options for User Model

let options = ({missingPasswordError:'Wrong/Missing Password'});
User.plugin(passportLocalMongoose,options);

module.exports.User = mongoose.model('User',User);

