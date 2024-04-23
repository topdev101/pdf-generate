const jwt = require('jsonwebtoken');
const Data = require('../models/dataModel');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const signUp = (req, res) => {
    Data.findOne({
        userId: req.body.userId
    }, function (err, dataObj) {
        if (err) return res.json(err);
        if (dataObj) return res.json(dataObj);

        var dataObj = new Data();


        dataObj.email = req.body.email;
        if(!dataObj.data) dataObj.data={};
        if(!dataObj.data.application) dataObj.data.application = {
            employerone_names:[{employer_name:'',address_name:'',occupation_name:'',employment_name:''}],
            country_names:[{country_name:''}],
            sponsorform_names:[{sponsorsubfirstname_name:'',sponsorsubmiddle_name:'',sponsorsublastname_name:''}],
            typeofaddress_names:[{previousaddress_name:'',previousmovein_name:'',previousmoveout_name:''}],
            children_names:[{
                mother_name:'',
                childscurrentmiddele_name:'',
                mothermiddle_name:'',
                motherfamily_name:'',
                marriagedatespouses_name:'',
                marriagedatespouse_name:'',
                marriagetopriortownspouse_name:'',
                marriagetopriorprovince_name:'',
                marriagetopriorcountry_name:'',
                marriagespousesdateofbirth_name:'',
                marriagelegallyendedstate_name:'',
                marriagelegallyendedcontry_name:''
            }],
            marriages_names:[{
                childscurrent_name:'',
                childscurrentmiddele_name:'',
                childscurrentfamily_name:'',
                childscurrentdatefobirth_name:'',
                childscurrentcountryofbirth_name:'',
                childscurrentanumber_name:''
            }],
            physicaladdressesus_names:[{
                togetheraddress_name:'',
                moveindate_name:'',
                moveoutdate_name:''
            }],
            marriagessponsor_names:[{
                mothersponsor_name:'',
                middlesponsor_name:'',
                familysponsor:'',
                marriagedatesponsor_name:'',
            }],
            employmenthistory_names:[{
                admissiontown_name:'',
                employeradmissiontown_name:'',
                admissionoccupation_name:'',
                employmentstart_name:'',
                employmentend_name:'',
            }],
            sponsorrelative_names:[{

            }],
            other_names:[{subfirstname_name:'',submiddlename_name:'',sublastname_name:''}]
        };

        dataObj.data.application.name = req.body.data.application.name;
        dataObj.data.cardholder  = req.body.data.cardholder;
        dataObj.data.location  = req.body.data.location;

        dataObj.data.application.sponsorname = req.body.data.application.sponsorname;
        dataObj.data.price = req.body.data.price;
        dataObj.userId = req.body.userId;
        dataObj.name = req.body.name;
        dataObj.avatarUrl = req.body.avatarUrl;

        dataObj.is = {
            admin: false,
            ...req.body.is
        };

        dataObj.save(function(err) {
            if (err) throw err;
            res.json(dataObj);
        });
    })
}

const singIn = (req, res) => {
    Data.findOne({
        userId: req.query.userId
    }, function (err, dataObj) {
        console.log(err)
        console.log(dataObj)
        if (err) return res.json(err);
        res.json(dataObj);
    })
}

const allUsers = (req, res) => {
    Data.find({}, function (err, usersData) {
        if (err) return res.json(err);
        res.json({
            usersData
        });
    })
}

const deleteUser = (req, res) => {
    const resourceId = req.params.id;
    Data.findByIdAndDelete(resourceId)
    .then((user) => res.send(user))
    .catch(error => res.status(500).send('Error deleting resource: ' + error));
}

const updateUser = (req, res) => {

    const id = req.params.id;
    const updatedData = req.body;
    Data.findByIdAndUpdate(id, updatedData, {new: true})
    .then((updatedDocument) => {
        if (!updatedDocument) {
          return res.status(404).send('Document not found');
        }
        res.send(updatedDocument);
      })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Internal server error');
    });
}



const updateData = (req, res) => {
    console.log("user data", req.body.data.application.securitynumberone_name);

    Data.findOne({
        userId: req.body.userId
    }, function (err, dataObj) {
        if (err) return res.json(err);

        // const data = req.body.data;

        // if(req.body.data.application.securitynumberone_name) {
        //     const salt = bcrypt.genSaltSync(10);
        //     const hashString = req.body.data.application.securitynumberone_name;
        //     const hashedString = bcrypt.hashSync(hashString, salt);
        //     data.application.securitynumberone_name = hashedString
        // }
        // if(req.body.data.application.securitynumbertwo_name) {
        //     const salt = bcrypt.genSaltSync(10);
        //     const hashString = req.body.data.application.securitynumbertwo_name;
        //     const hashedString = bcrypt.hashSync(hashString, salt);
        //     data.application.securitynumbertwo_name = hashedString
        // }
        // if(req.body.data.application.securitynumberthree_name) {
        //     const salt = bcrypt.genSaltSync(10);
        //     const hashString = req.body.data.application.securitynumberthree_name;
        //     const hashedString = bcrypt.hashSync(hashString, salt);
        //     data.application.securitynumberthree_name = hashedString
        // }

        // console.log("hash", data);

        if(dataObj) {
            dataObj.data = req.body.data;
            dataObj.markModified('data');
            dataObj.save(function(err) {
                if (err) throw err;
                res.json(dataObj);
            });
        }
    })
}

module.exports = { signUp, singIn, allUsers, deleteUser, updateUser, updateData };