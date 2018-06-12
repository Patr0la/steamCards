import https = require("https");
import cheerio = require("cheerio");
import fs = require("fs");

let url = "https://www.steamcardexchange.net/api/request.php?GetBadgePrices_Guest&_=1528715141488";

https.get(url, (res) => {
    let body: any = "";

    res.on("data", (data) => {
        if (data != undefined)
            body += data;
    });

    res.on("end", () => {
        //@ts-ignore
        MainGetDone(JSON.parse(body));
    });
});

const Url2: string = "https://www.steamcardexchange.net/index.php?gamepage-appid-";

function SecondariGetDone(data: Data, t: number) {
    for (let i: number = 0; i < 3; i++) {
        console.log(data.data[i + t][0][0]);

        https.get(Url2 + data.data[i + t][0][0], (res) => {
            //https.get("https://www.steamcardexchange.net/index.php?gamepage-appid-449940", (res) => {
            let body: any = "";

            console.log(res.statusCode);

            res.on("data", (data) => {
                if (data != undefined)
                    body += data;
            });

            res.on("end", () => {
                //console.log(body)
                //@ts-ignore

                GetCards(data.data[i + t][0][0], body, data.data[i + t][0][1], i + t);
            });
        });

        setTimeout(() => {
            if (i % 10 == 0) {
                let text = JSON.stringify(Games);
                fs.writeFile("./save-" + (i + t).toString() + ".json", text, (err) => {
                    if (err)
                        console.log(err);
                });
            }
        }, 5000);
    }

    setTimeout(() => {
        SecondariGetDone(data, t + 3);
    }, 3000);
}

function MainGetDone(data: Data) {
    console.log(data.data.length);

    SecondariGetDone(data, 0);
}

var Games: Array<Game> = new Array<Game>();

function GetCards(appid, body, name, i) {
    console.log("Processing : " + name);

    var $ = cheerio.load(body);

    var names: Array<string> = new Array<string>();
    var ids: Array<number> = new Array<number>();
    var prices: Array<string> = new Array<string>();
    var hrefs: Array<string> = new Array<string>();

    $('div[id="cards"]').find(".element-text").each(function (index, element) {
        names.push($(element).html());
    });

    $('div[id="cards"]').find(".button-blue").each(function (index, element) {
        hrefs.push($(element).attr('href'));
        prices.push($(element).html().split('$')[1]);
    });

    let cards: Array<Card> = new Array<Card>();

    for (let i = 0; i < names.length; i++) {
        cards.push(new Card(hrefs[i], names[i], prices[i]))
    }

    Games.push(new Game(name, appid, cards));
    
}

var CardValueUrl = "https://steamcommunity.com/market/itemordershistogram?country=HR&language=english&currency=3&item_nameid=";



class Card {
    href: string;
    name: string;
    price: string;

    constructor(href: string, name: string, price: string) {
        this.href = href;
        this.name = name;
        this.price = price;
    }
}

class Game {
    cards: Array<Card>;
    name: string;
    id: number;

    constructor(name: string, id: number, cards: Array<Card>) {
        this.name = name;
        this.id = id;
        this.cards = cards;
    }
}

interface Card {

}

interface Game {
    cards: Array<Card>;
    id: number;
}

interface SubData {
    0: Array<string>;
    1: number;
    2: string;
    3: string;
}

interface Data {
    data: Array<Array<SubData>>
}