"use strict";
exports.__esModule = true;
var https = require("https");
var cheerio = require("cheerio");
var fs = require("fs");
var url = "https://www.steamcardexchange.net/api/request.php?GetBadgePrices_Guest&_=1528715141488";
https.get(url, function (res) {
    var body = "";
    res.on("data", function (data) {
        if (data != undefined)
            body += data;
    });
    res.on("end", function () {
        //@ts-ignore
        MainGetDone(JSON.parse(body));
    });
});
var Url2 = "https://www.steamcardexchange.net/index.php?gamepage-appid-";
function SecondariGetDone(data, t) {
    var _loop_1 = function (i) {
        console.log(data.data[i + t][0][0]);
        https.get(Url2 + data.data[i + t][0][0], function (res) {
            //https.get("https://www.steamcardexchange.net/index.php?gamepage-appid-449940", (res) => {
            var body = "";
            console.log(res.statusCode);
            res.on("data", function (data) {
                if (data != undefined)
                    body += data;
            });
            res.on("end", function () {
                //console.log(body)
                //@ts-ignore
                GetCards(data.data[i + t][0][0], body, data.data[i + t][0][1], i + t);
            });
        });
        setTimeout(function () {
            if (i % 10 == 0) {
                var text = JSON.stringify(Games);
                fs.writeFile("./save-" + (i + t).toString() + ".json", text, function (err) {
                    if (err)
                        console.log(err);
                });
            }
        }, 5000);
    };
    for (var i = 0; i < 3; i++) {
        _loop_1(i);
    }
    setTimeout(function () {
        SecondariGetDone(data, t + 3);
    }, 3000);
}
function MainGetDone(data) {
    console.log(data.data.length);
    SecondariGetDone(data, 0);
}
var Games = new Array();
function GetCards(appid, body, name, i) {
    console.log("Processing : " + name);
    var $ = cheerio.load(body);
    var names = new Array();
    var ids = new Array();
    var prices = new Array();
    var hrefs = new Array();
    $('div[id="cards"]').find(".element-text").each(function (index, element) {
        names.push($(element).html());
    });
    $('div[id="cards"]').find(".button-blue").each(function (index, element) {
        hrefs.push($(element).attr('href'));
        prices.push($(element).html().split('$')[1]);
    });
    var cards = new Array();
    for (var i_1 = 0; i_1 < names.length; i_1++) {
        cards.push(new Card(hrefs[i_1], names[i_1], prices[i_1]));
    }
    Games.push(new Game(name, appid, cards));
}
var CardValueUrl = "https://steamcommunity.com/market/itemordershistogram?country=HR&language=english&currency=3&item_nameid=";
var Card = /** @class */ (function () {
    function Card(href, name, price) {
        this.href = href;
        this.name = name;
        this.price = price;
    }
    return Card;
}());
var Game = /** @class */ (function () {
    function Game(name, id, cards) {
        this.name = name;
        this.id = id;
        this.cards = cards;
    }
    return Game;
}());
