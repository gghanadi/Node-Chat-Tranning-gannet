const generateFunction = (username, text) =>{
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

const generateLocationFunction = (username,  link) =>{
    return{
        username,
        link,
        createdAt: new Date().getTime()
    }
}



module.exports = {
    generateFunction,
    generateLocationFunction
}