const e = require("express");

const users = []


const addUser = ({id, username, roomname}) =>{
    //check the data
    username = username.trim().toLowerCase();
    roomname = roomname.trim().toLowerCase();

    //validation the data
    if(!roomname || !username){

        return {
            error:'Username or Roomname are required!'
        }
    }

    //check data if some one has a same name or room name
    const existingUser = users.find((user) =>{
        return user.roomname === roomname && user.username === username
    })

    //validate username
    if(existingUser){
        return{
            error:'The username has been created!'
        }
    }

    //store user
    const user = {id, username, roomname}
    users.push(user)
    return {user}

}

const removeUser = (id) =>{
    const index = users.findIndex((user) =>{
        return user.id === id
    })

    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}

const getUserinRoom = (roomname) =>{
    roomname = roomname.trim().toLowerCase();
    return users.filter((user) => user.roomname === roomname)
}

const getUser = (id) =>{

    return users.find((user) => user.id === id)

}

module.exports = {
    addUser,
    removeUser,
    getUserinRoom,
    getUser
}