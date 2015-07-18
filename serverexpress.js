var http = require("http");
var url = require("url");
var qs = require('querystring');
var path = require('path');
var express = require('express'),

app = express();

var bodyParser = require('body-parser')
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));


var base = {
    'ukraine' : 	{
        'luxaryhotel':'best',
        'midlehotel':'notbad',
        'onestar':'verypurehotel'
    },
    'vietnam' : 	{
        'luxaryhotel':'best',
        'midlehotel':'notbad',
        'onestar':'verypurehotel'
    },
    'taiwan' : 	{
        'luxaryhotel':'best',
        'midlehotel':'notbad',
        'onestar':'verypurehotel'
    }
};

var responseMsg = '';
responseTemplate = '<head> <meta charset="utf-8"> </head>\
                            REST API \
                            <p>1. создать страну POST (restapi/country) postdata = [country]</p>\
                            <p>2. создать отель POST (restapi/country/[country]/hotel) postdata = [hotel] </p> \
                            <p>3. список стран GET (restapi/country) </p> \
                            <p>4. список отелей GET (restapi/country/[country]/hotel) </p> \
                            <p>5. получить инфомрацию об отеле GET (restapi/country/[country]/hotel/[hotel]) </p> \
                            <p>6. удалить страну POST (restapi/country/[country]) postdata = "" </p> \
                            <p>7. удалить отель POST (restapi/cntry/[country]/hotel/[hotel]) postdata = "" </p> \
                            <p>8. обновить информацию об отеле POST (restapi/cntry/[country]/htl/[hotel]) postdata = [information] </p> \
                            <form name="form1" method="post" actin="submit"> \
                                Enter the text:<br /> \
                                <textarea name="text" cols="10" rows="1"></textarea> \
                                <input name="" type="submit" value="send"/> \
                            </form>';

app.get('/restapi/country', function(req, res){

    responseMsg = getCountryList();
    res.send(responseTemplate + responseMsg);

});

app.get('/restapi/country/:countryname' + '/hotel', function(req, res){

    responseMsg = getHotelsList(req.params.countryname);
    res.send(responseTemplate + responseMsg);

});

app.get('/restapi/country/:countryname', function(req, res){

    res.send(responseTemplate + responseMsg);

});

app.get('/restapi/country/:countryname' + '/hotel/' + ':hotelname', function(req, res){

    responseMsg = getHotelInfo(req.params.countryname, req.params.hotelname);
    res.send(responseTemplate + responseMsg);

});

app.post('/restapi/country', function(req, res){

    var postText = req.body['text'];
    if (postText.length)
        responseMsg = addCountry(postText);
    res.send(responseTemplate + responseMsg);

});

app.post('/restapi/country/:countryname', function(req, res){

    responseMsg = removeCountry(req.params.countryname);
    res.send(responseTemplate + responseMsg);

});

app.post('/restapi/country/:countryname' + '/hotel/', function(req, res){

    var postText = req.body['text'];
    if (postText.length)
        responseMsg = addHotel(req.params.countryname,postText);
    res.send(responseTemplate + responseMsg);

});

app.post('/restapi/country/:countryname' + '/hotel/' + ':hotelname', function(req, res){
    var postText = req.body['text'];
    if (postText.length)
        responseMsg = updateHotelInfo(req.params.countryname,req.params.hotelname,postText);
    else
        responseMsg = removeHotel(req.params.countryname,req.params.hotelname);
    res.send(responseTemplate + responseMsg);

});

app.listen(3000);

function getCountryList() {
    return Object.getOwnPropertyNames(base);
}

function getHotelsList(countryname) {
    if (base.hasOwnProperty(countryname))
        return Object.getOwnPropertyNames(base[countryname]);
    else return 'not found country';
}

function getHotelInfo(countryname, hotelname) {
    if (base.hasOwnProperty(countryname))
        if (base[countryname].hasOwnProperty(hotelname))
            return base[countryname][hotelname];
    else return 'not found country or hotel';
}

function addCountry(postText){
    base[postText] = {};
    return 'country ' + postText + ' add' ;
}

function removeCountry(countryname){
    if (base.hasOwnProperty(countryname)) {
        delete base[countryname];
        return 'country ' + countryname + ' removed';
    }
    else return 'not found country';
}

function addHotel(countryname, postText){
    if (base.hasOwnProperty(countryname)) {
        base[countryname][postText] = '';
        return 'hotel ' + postText + ' in country ' + countryname + ' add';
    }
    else return 'not found country';
}

function removeHotel(countryname,hotelname){
    if (base.hasOwnProperty(countryname))
        if (base[countryname].hasOwnProperty(hotelname)) {
            delete base[countryname][hotelname];
            return 'hotel ' + hotelname + ' in country ' + countryname + ' removed';
        }
    else return 'not found country or hotel';
}
function updateHotelInfo(countryname,hotelname,postText) {
    if (base.hasOwnProperty(countryname))
        if (base[countryname].hasOwnProperty(hotelname)) {
            base[countryname][hotelname] = postText;
            return 'Information about ' + hotelname + ' in country ' + countryname + ' add';
        }
    else return 'not found country or hotel';
}
