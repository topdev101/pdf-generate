const mongoose = require('mongoose');
const dataSchema = mongoose.Schema(
    {
        userId: {type: String, unique: true},
        data: {},
        email: {type: String, unique: true},
        name: {type: String},
        is: {},
        avatarUrl: {type: String, default: '/assets/user.png'},
        names:[{
		
        }],
    }, {minimize: false}
);

dataSchema.methods.create = function(obj, user, sd) {
	this.avatarUrl = obj.avatarUrl || '/assets/user.png';
	this.userId = obj.userId;
	this.data = {};
}

module.exports = mongoose.model("Data", dataSchema);