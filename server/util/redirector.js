const getQueryParams=(url)=>{
    console.log(url)
    url=url.split('?')
    if(url.length<=1) return undefined
    queries=url[1].split('&')
    let b=new Object()
    for(i=0;i<queries.length;i++){
        
        b[queries[i].split('=')[0]]=queries[i].split('=')[1]
        
    }
    console.log(b)
    return b
}

module.exports={
    getQueryParams
}