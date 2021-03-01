const isStringArray = arr => {
    
    if (Array.isArray(arr)) {

        arr.forEach(item => {
           if(typeof item !== 'string'){
              return false
           }
        })

        return true
    }

    return false
}

module.exports = {
    isStringArray
}