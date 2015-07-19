var http = require("http");
var url = require("url");
var qs = require('querystring');

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

function start() {

    function onRequest(request, response) {

        var responseMsg = '';
        var pathname = url.parse(request.url).pathname;

        if (pathname == '/favicon.ico'){
            response.writeHead(200, {"Content-Type": "text/html"});
            response.end();
            return;
        }

        request.setEncoding("utf-8");

        console.log("Request " + request.method + " " + pathname + " received.");

        var countryname = '';
        var hotel =  '';
        var hotelname = '';
        var restapiRegEx = /\/restapi\/country\/?([a-z]*)?\/?(hotel)?\/?([a-z]*)?/;
        var paramsArr = restapiRegEx.exec(pathname);
        if (paramsArr) {
            var countryname = paramsArr[1] || '';
            var hotel = paramsArr[2] || '';
            var hotelname = paramsArr[3] || '';
        }
        console.log(countryname +' ' + hotel + ' ' + hotelname);

        if (request.method == 'POST') {
            var body = '';
            request.on('data', function (data) {
                body += data;

                if (body.length > 1e6)
                    request.connection.destroy();
            });
            request.on('end', function () {
                var postData = qs.parse(body);
                console.log(postData);
                var postText = postData['text'];
                console.log(postText.length);

                if (countryname.length && hotel.length && hotelname.length && postText.length){
                    responseMsg = updateHotelInfo(countryname,hotelname,postText);
                   // return 'updateHotelInfo';
                }

                if (countryname.length && hotel.length && hotelname.length && !(postText.length)){
                    responseMsg = removeHotel(countryname,hotelname);
                   // return 'removeHotel';
                }
                if (countryname.length && hotel.length && !(hotelname.length) && postText.length){
                    responseMsg = addHotel(countryname,postText);
                 //   return 'addHotel';
                }
                if (!(countryname.length) && !(hotel.length) && !(hotelname.length) && postText.length) {
                    responseMsg = addCountry(postText);
                   // return 'addCountry';
                }

                if (countryname.length && !(hotel.length) && !(hotelname.length) && !(postText.length)) {
                    responseMsg = removeCountry(countryname);
                    //return 'removeCountry';
                }

                response.writeHead(200, {"Content-Type": "text/html"});
                response.write('<head> <meta charset="utf-8"> </head>\
                            REST API \
                            <p>1. создать страну POST (restapi/country) postdata = [countryname]</p>\
                            <p>2. создать отель POST (restapi/country/[countryname]/hotel) postdata = [hotelname] </p> \
                            <p>3. список стран GET (restapi/country) </p> \
                            <p>4. список отелей GET (restapi/country/[countryname]/hotel) </p> \
                            <p>5. получить инфомрацию об отеле GET (restapi/country/[countryname]/hotel/[hotelname]) </p> \
                            <p>6. удалить страну POST (restapi/country/[countryname]) postdata = "" </p> \
                            <p>7. удалить отель POST (restapi/country/[countryname]/hotel/[hotelname]) postdata = "" </p> \
                            <p>8. обновить информацию об отеле POST (restapi/country/[country]/hotel/[hotel]) postdata = [information] </p> \
                            <form name="form1" method="post" actin="submit"> \
                                Enter the text:<br /> \
                                <textarea name="text" cols="10" rows="1"></textarea> \
                                <input name="" type="submit" value="send"/> \
                            </form>' + responseMsg);
                response.end();
            });
        }

        if (request.method == 'GET'){
            if (countryname.length && hotel.length && hotelname.length)
                responseMsg = getHotelInfo(countryname, hotelname);
            if (countryname.length && hotel.length && !(hotelname.length))
                responseMsg = getHotelsList(countryname);
            if (!(countryname.length) && !(hotel.length) && !(hotelname.length))
                responseMsg = getCountryList();


            response.writeHead(200, {"Content-Type": "text/html"});
            response.write('<head> <meta charset="utf-8"> </head>\
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
                            </form>' + responseMsg);
            response.end();
        }
    }

    http.createServer(onRequest).listen(8888);
    console.log("Server has started.");
}

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
start();
