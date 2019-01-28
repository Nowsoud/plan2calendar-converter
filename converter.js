var convert = require('xml-js');
var request = require('request')
module.exports.XMLtoJSON = (xml) => convert.xml2json(xml, {compact: true, spaces: 4})

module.exports.URLtoJSON = (url) => new Promise((res,rej)=>
    request.get(url,(error, response, body) => res(this.XMLtoJSON(body))))

module.exports.JSONtoICS = (json,url)=>new Promise((res,rej)=>{
    
    
    var plan = JSON.parse(json)
    var name  = plan['plan-zajec']._attributes.nazwa
    var interval = plan['plan-zajec']._attributes.od + " - " + plan['plan-zajec']._attributes.do 
    var lessons = [].concat(plan['plan-zajec'].zajecia)
    const ical = require('ical-generator');
    const cal = ical({domain: 'plan-zajec', name: name});

    lessons.forEach(element => {
        var organizer = element.nauczyciel._text;
        var organizer_email = ""; //doto
        

        var event_name = element.przedmiot._text
        var event_type = element.typ._text
        var room = element.sala._text

        var termin = element.termin._text;
        var from = element['od-godz']._text;
        var to = element['do-godz']._text;

        var start = new Date(termin+" "+from)
        var end = new Date(termin+" "+to)

        cal.createEvent({
            start: start,
            end:  end,
            summary: event_type+' '+event_name,
            description: "",
            organizer: {
                name: organizer+" ",
                email: ''+" "
            },
            location: room,
            url: url
        });    
    });
    
    var filename = name+" "+interval+".ics"
    cal.save(__dirname + "/calendars/"+filename, c=>{res(filename)})
})
