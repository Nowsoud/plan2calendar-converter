const express = require('express')
const converter = require('./converter')
const app = express()
const port = 240

app.get('/', (req, res) =>{
   var url = `http://planzajec.uek.krakow.pl/index.php?typ=${req.query.typ}&okres=${req.query.okres}&id=${req.query.id}&xml`
   if(req.query.ics)
        converter.URLtoJSON(url).then((json)=>
            converter.JSONtoICS(json,url)
            .then((ics)=>{
                res.download(__dirname + '/calendars/'+ics,ics)
            })
            .catch(err=>{res.send(err); console.log(err);})
        ).catch(err=>res.send(err))
    else
        converter.URLtoJSON(url).then((json)=>res.send(json)).catch(err=>res.send(err)).catch(err=>res.send(err))
})


app.post('/', (req, res) =>{converter.JSONtoICS(req.body).then((ics)=>res.sendFile(ics)).catch(err=>send(err))})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))