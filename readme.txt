REST API
1. создать страну POST (restapi/country) postdata = [countryname]

2. создать отель POST (restapi/country/[country]/hotel) postdata = [hotelname]

3. список стран GET (restapi/country)

4. список отелей GET (restapi/country/[countryname]/hotel)

5. получить инфомрацию об отеле GET (restapi/country/[countryname]/hotel/[hotelname])

6. удалить страну POST (restapi/country/[countryname]) postdata = ""

7. удалить отель POST (restapi/country/[countryname]/hotel/[hotelname]) postdata = ""

8. обновить информацию об отеле POST (restapi/country/[countryname]/hotel/[hotelname]) postdata = [information]
