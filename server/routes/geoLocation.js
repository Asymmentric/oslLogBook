exports.getLocationFunc = (req, res) => {
  res.send(`
    <script>
    options={
        enableHightAccuracy:true,
        timeout:10000,
        maximumAge:0
      }
      
      success=(pos)=>{
        console.log(pos)
        latitude=pos.coords.latitude
        longitude=pos.coords.longitude
        fetch('/oslLog/api/v1/scan/entry2',{
          method:'post',
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify({latitude,longitude,geoLocTime:pos.timestamp})
          
        })
        .then(response=>response.json())
        .then(data=>{
          if(data.err) document.write(data.write)
          if(!data.err) {
            window.location=data.redirect
          }
        })
      }
      error=(err)=>{
        console.warn('ERROR:'+err.code + err.message)
        document.write("<center><h3>If you're seeing this....</h3><h5>It seems you're browser is blocking the location access</h5></center>")
      }
      navigator.geolocation.getCurrentPosition(success,error,options)
      </script>
    `)
}

exports.locationVerification = (lat, long) => {
  return new Promise((resolve, reject) => {
    try {
      
      if ((lat <= 12.336900 && lat >= 12.336300) && (long <= 76.619500 && long >= 76.6185992)) {
        resolve(true)
      } else throw new Error('Location data out of permissible range')
    } catch (error) {
      console.log('Location data not correct')
      console.log(error)

      reject({ err: true, msg: 'Location data not correct' })
    }
  })
}