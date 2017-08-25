/**
 * Created by alsayed on 4/13/17.
 */
 'use strict';
module.exports = function (err, req, res, next) {
    if (res.headersSent) {
        return next(err)
    }
    else if(err.name === 'SequelizeForeignKeyConstraintError'){
        err.status = 400;
        //err.myMessage = 'Foreign key constraint error of: ' + err.index;  // index has the name of the foreign key column.
        if (err.index === 'readingTypeIdFK') {
            return res.status(err.status).send({error: {message: 'reading type not found'}});
        }
        else if(err.index === 'sensorTypeIdFK'){
            return res.status(err.status).send({error: {message: 'sensor type not found'}});
        }
        else if(err.index === 'sensorIdFK'){
            return res.status(err.status).send({error: {message: 'sensor not found'}});
        }
        else if(err.index === 'userIdFK'){
            return res.status(err.status).send({error: {message: 'user not found'}});
        }
        else if(err.index === 'sensorGroupIdFK'){
            return res.status(err.status).send({error: {message: 'sensor group not found'}});
        }
        else if(err.index === 'contactIdFK'){
            return res.status(err.status).send({error: {message: 'contact not found'}});
        }
        return res.status(err.status).send({error: {message: err}});
    }
    else if(err.name === 'SequelizeUniqueConstraintError'){
        err.status = 400;
        return res.status(err.status).send({error: {message: err.errors[0].message}});
    }
    else if(err.name === 'SequelizeDatabaseError'){
        return res.status(400).send({error:{message: err.message}});
    }
    else if(err.name === 'SequelizeValidationError'){
        return res.status(400).send({error:{message: err.message}});
    }
    else if(err.status){
        return res.status(err.status).send({error :{message: err.message}});
    }
    else if(err.stack){
        console.log(err.stack);
        return res.status(500).send({error:{message: 'Internal Server Error'}})
    }
    else if(err){
        return res.status(500).send({error:{message: err}})
    }
    else{
        return res.status(500).send({error:{message: 'Internal Server Error'}})
    }
};
