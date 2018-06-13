import json

temp = open("./steamcards scraper/save-3369.json", "r")  #otvara file
text = temp.read()	#cita iz fajla..
temp.close()	#zatvara..

games = json.loads(text)   
'''
pretvara text iz .json fajla u rijecnik
u ovom slučaju, će pretvoriti text iz fajla u listu riječika,

koji izgleda otprilike ovako:

{
    "name": "! That Bastard Is Trying To Steal Our Gold !",  #ime igrice
    "id": "449940",											 #id igrice
    "cards": [												 #kartice koje spadaju pod igricu - lista riječnika
        {
            "name": "GOLD BAR",								 #ime igrice            
            "price": "0.14"									 #cijena kartice
        },
        {..},												 #druge kartice..
        .
        .
    ]
},
.															 #druge igrice...
.
.

'''

def pretraga(games):  #definicja funkcije za pretragu
	
	search = input()  #unos stringa koji se traži
	
	if search == "":	#ako nije nista uneseno, program izlazi
		return
	
	out = list()  #izlaz
	
	for game in games:	#selektiranje svake igre[rijecnik] iz liste igara[lista<rijecnik>]
		if search in game["name"].lower():	#provjera ako se input nalazi u imenu igre, lower se koristi zato što neke igre imaju i velika/mala slova, a unositlej nece to zanti napisati tako..
			cijena = 0   
			for c in range(len(game["cards"])):  #prolazako kroz svaku karticu
				cijena += float(game["cards"][c]["price"])  #parsiranje cijene u float, te dodavanje na cijenu
			out.append({"ime": game["name"], "cijena": round(cijena, 2), "bk": len(game["cards"])})  #dodavanje novog rijenika u listu out, kako bi se mogli sortirati po cijeni

	out = sorted(out, key=lambda x: x["cijena"])  #sortiranje rijecnika  - nismo jos radili, ali ce sortirati rijecnik po vrijednosti koju pokazuje ključ ["cijena"]

	for d in out:  #printanje izlaza..
		print("{} , cijena: {} , broj kartica: {}".format(d["ime"], round(d["cijena"], 2), d["bk"]))

	pretraga(games)  #ponovo pozivanje pretrage


pretraga(games)  #prvo pozivanje pretrage
