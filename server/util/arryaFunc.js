exports.getMaxDate=(DateArray)=>{
    // let maxDate=DateArray[0]
    DateArray.sort((a,b)=>a-b)
    // DateArray.forEach(givenDate  => {
    //     if(givenDate>maxDate) maxDate=givenDate
    // });
    return DateArray[DateArray.length-1]
}

exports.getMinDate=(DateArray)=>{
    // let minDate=DateArray[0]
    // DateArray.forEach(givenDate=>{
    //     if(givenDate<minDate) minDate=givenDate
    // })
    // return minDate
    DateArray.sort((a,b)=>a-b)
    return DateArray[0]
}