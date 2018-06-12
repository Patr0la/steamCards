import json

text = open("./steamcards scraper/save-0.json", "r").read();

#print(text)

games = json.loads(text)

for game in games:
	if "kill" in game["name"]:
		for c in range(len(game["cards"])):
			print("name: {}  price: {}".format(game["cards"][c]["name"], game["cards"][c]["price"]))


