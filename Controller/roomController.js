const Rooms = require('../Model/Room')
const findallrooms = () => {
    Rooms.find({}).
    then((rooms) =>{
        if(!rooms) return "Error: No Room found" 
        return rooms;
    })
}
module.exports = {findallrooms}