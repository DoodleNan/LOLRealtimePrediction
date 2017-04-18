var API_KEY = "RGAPI-48368D89-F4C8-4979-9973-EE735761DD42";
var participant_attr = ['kill', 'death', 'level'];
var team_attr = ['gold', 'dragon', 'baron', 'inner_and_outer_turret', 'base_and_nexus_turret', 'inhibitor', 'ward'];
var itemId = [];
var itemId_mapping = {};
var matchId = [];
var match_count = 0;
var final_result = {};
var item_weight = {};
var champions = {};
// load item id
d3.csv("item.csv", function(error, data){
	data.forEach(function(d, i) {
        itemId.push(d.id);
        itemId_mapping[d.id] = i;
    });
});

d3.json("item_weight_normalize.json", function(data) {
	item_weight = data;
});

d3.json("champion.json", function(data) {
	champions = data;
});

weights = {}
weights[5] = {}
weights[5]["team-gold-diff"] = 0;
weights[5]["team-dragon-diff"] = 0;
weights[5]["team-baron-diff"] = 0;
weights[5]["team-outturret-diff"] = 0;
weights[5]["team-baseturret-diff"] = 0;
weights[5]["team-inhabitor-diff"] = 0;
weights[5]["team-ward-diff"] = 0;
weights[5]["heros-kill-diff"] = 0;
weights[5]["heros-death-diff"] = 0;
weights[5]["heros-assist-diff"] = 0;
weights[5]["heros-item-diff"] = 0;

weights[10] = {}
weights[10]["team-gold-diff"] = 0;
weights[10]["team-dragon-diff"] = 0;
weights[10]["team-baron-diff"] = 0;
weights[10]["team-outturret-diff"] = 0;
weights[10]["team-baseturret-diff"] = 0;
weights[10]["team-inhabitor-diff"] = 0;
weights[10]["team-ward-diff"] = 0;
weights[10]["heros-kill-diff"] = 0;
weights[10]["heros-death-diff"] = 0;
weights[10]["heros-assist-diff"] = 0;
weights[10]["heros-item-diff"] = 0;

weights[15] = {}
weights[15]["team-gold-diff"] = 0;
weights[15]["team-dragon-diff"] = 0;
weights[15]["team-baron-diff"] = 0;
weights[15]["team-outturret-diff"] = 0;
weights[15]["team-baseturret-diff"] = 0;
weights[15]["team-inhabitor-diff"] = 0;
weights[15]["team-ward-diff"] = 0;
weights[15]["heros-kill-diff"] = 0;
weights[15]["heros-death-diff"] = 0;
weights[15]["heros-assist-diff"] = 0;
weights[15]["heros-item-diff"] = 0;

weights[20] = {}
weights[20]["team-gold-diff"] = 0;
weights[20]["team-dragon-diff"] = 0;
weights[20]["team-baron-diff"] = 0;
weights[20]["team-outturret-diff"] = 0;
weights[20]["team-baseturret-diff"] = 0;
weights[20]["team-inhabitor-diff"] = 0;
weights[20]["team-ward-diff"] = 0;
weights[20]["heros-kill-diff"] = 0;
weights[20]["heros-death-diff"] = 0;
weights[20]["heros-assist-diff"] = 0;
weights[20]["heros-item-diff"] = 0;

weights[25] = {}
weights[25]["team-gold-diff"] = 0;
weights[25]["team-dragon-diff"] = 0;
weights[25]["team-baron-diff"] = 0;
weights[25]["team-outturret-diff"] = 0;
weights[25]["team-baseturret-diff"] = 0;
weights[25]["team-inhabitor-diff"] = 0;
weights[25]["team-ward-diff"] = 0;
weights[25]["heros-kill-diff"] = 0;
weights[25]["heros-death-diff"] = 0;
weights[25]["heros-assist-diff"] = 0;
weights[25]["heros-item-diff"] = 0;

weights[30] = {}
weights[30]["team-gold-diff"] = 0;
weights[30]["team-dragon-diff"] = 0;
weights[30]["team-baron-diff"] = 0;
weights[30]["team-outturret-diff"] = 0;
weights[30]["team-baseturret-diff"] = 0;
weights[30]["team-inhabitor-diff"] = 0;
weights[30]["team-ward-diff"] = 0;
weights[30]["heros-kill-diff"] = 0;
weights[30]["heros-death-diff"] = 0;
weights[30]["heros-assist-diff"] = 0;
weights[30]["heros-item-diff"] = 0;

weights[35] = {}
weights[35]["team-gold-diff"] = 0;
weights[35]["team-dragon-diff"] = 0;
weights[35]["team-baron-diff"] = 0;
weights[35]["team-outturret-diff"] = 0;
weights[35]["team-baseturret-diff"] = 0;
weights[35]["team-inhabitor-diff"] = 0;
weights[35]["team-ward-diff"] = 0;
weights[35]["heros-kill-diff"] = 0;
weights[35]["heros-death-diff"] = 0;
weights[35]["heros-assist-diff"] = 0;
weights[35]["heros-item-diff"] = 0;

weights[40] = {}
weights[40]["team-gold-diff"] = 0;
weights[40]["team-dragon-diff"] = 0;
weights[40]["team-baron-diff"] = 0;
weights[40]["team-outturret-diff"] = 0;
weights[40]["team-baseturret-diff"] = 0;
weights[40]["team-inhabitor-diff"] = 0;
weights[40]["team-ward-diff"] = 0;
weights[40]["heros-kill-diff"] = 0;
weights[40]["heros-death-diff"] = 0;
weights[40]["heros-assist-diff"] = 0;
weights[40]["heros-item-diff"] = 0;

weights[45] = {}
weights[45]["team-gold-diff"] = 0;
weights[45]["team-dragon-diff"] = 0;
weights[45]["team-baron-diff"] = 0;
weights[45]["team-outturret-diff"] = 0;
weights[45]["team-baseturret-diff"] = 0;
weights[45]["team-inhabitor-diff"] = 0;
weights[45]["team-ward-diff"] = 0;
weights[45]["heros-kill-diff"] = 0;
weights[45]["heros-death-diff"] = 0;
weights[45]["heros-assist-diff"] = 0;
weights[45]["heros-item-diff"] = 0;
// for test
getMatchData('3019374593', 'EUW')

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

function get(url) {
    return new Promise(function(resolve, reject) {
        var req = new XMLHttpRequest();

        req.open('GET', url);

        req.onload = function() {
            if (req.status == 200) {
            	var jsonData = JSON.parse(req.response);
            	if (jsonData.matchMode == 'CLASSIC' && jsonData.participants.length == 10)
                    resolve(jsonData);
                else 
                	reject(Error("Matchmode is not classic."));
            } else {
                reject(Error(req.statusText));
            }
        };

        req.onerror = function() {
            reject(Error("Network Error"));
        };

        req.send();
    });
}

function getMatchData(matchId, region) {
	var url = 'https://euw.api.riotgames.com/api/lol/' + region + '/v2.2/match/' + matchId + '?includeTimeline=true&api_key=' + API_KEY;

	console.log("Fetching data from: " + url);

	get(url).then(function(response) {

        console.log("Successfully fetch data of match: " + matchId);
        var result = parseData(response);
        final_result = result;

    }, function(error) {
        console.error("Failed: ", error);
    })
}

function parseData(response){
	var result = {};
	var KILL = "kill", DEATH = "death", LEVEL = "level";
	var GOLD = "gold", DRAGON = "dragon", BARON = "baron", BASE_TURRET = "base_and_nexus_turret", OUTER_TURRET = "inner_and_outer_turret", INHIBITOR = "inhibitor", WARD = "ward";

	if (response.teams[0].winner == true) 
		result['outcome'] = [1, 0];
	else 
		result['outcome'] = [0, 1];

	var championId = [];
	response.participants.forEach(function(d){
		championId.push(d.championId);
	});
	result['championId'] = championId;
	final_result['participant_attribute'] = participant_attr;
	final_result['team_attribute'] = team_attr;
	final_result['item_id'] = itemId;

	var timeline = {};
	timeline['team'] = Array(2).fill(null).map(() => Object());
	timeline['participant'] = Array(10).fill(null).map(() => Object());
	timeline['item'] = Array(10).fill(null).map(() => Object());

	var frameInterval = 60000; 
	var frames = response['timeline']['frames'];
	var end = 5;

	for (var i = 0; i < frames.length; i++){

		var timestamp = frames[i].timestamp;
		if (Math.floor(timestamp/frameInterval) <= end){
			if ('events' in frames[i]){
				// analyze event		
				frames[i].events.forEach(function(d){
					var item_index, teamId;

					switch(d.eventType){
						case "ITEM_PURCHASED":
						    item_index = itemId_mapping[d.itemId];
						    // console.log(d.itemId + ' has index number ' + item_index);
						    if (timeline.item[d.participantId-1][item_index])
						    	timeline.item[d.participantId-1][item_index] += 1;
					    	else
					    		timeline.item[d.participantId-1][item_index] = 1;
						    // console.log(d.participantId + " purchased " + d.itemId);
						    // console.log("Updated item number " + timeline.item[d.participantId-1][item_index]);
						    break;

						case "ITEM_SOLD":
						    item_index = itemId_mapping[d.itemId];
						    if (!timeline.item[d.participantId-1][item_index]) {
						    		timeline.item[d.participantId-1][item_index] = 0;
						    		break;
						    	}
						    if (timeline.item[d.participantId-1][item_index] >= 1)
							    timeline.item[d.participantId-1][item_index] -= 1;
						    // console.log(d.participantId + " sold " + d.itemId);
						    // console.log("Updated item number " + timeline.item[d.participantId-1][item_index]);
						    // if (timeline.item[d.participantId-1][item_index] < 0)
						    	// alert("the number of " + itemId_mapping[d.itemId] +  " < 0");
						    break;

						case "ITEM_UNDO":
						    if (d.itemAfter == 0){
						    	item_index = itemId_mapping[d.itemBefore];
						    	if (!timeline.item[d.participantId-1][item_index]) {
						    		timeline.item[d.participantId-1][item_index] = 0;
						    		break;
						    	}
						    	if (timeline.item[d.participantId-1][item_index] >= 1)
							    	timeline.item[d.participantId-1][item_index] -= 1;
						    	// if (timeline.item[d.participantId-1][item_index] < 0)
						    	    // alert("the number of " + itemId_mapping[d.itemBefore] +  " < 0");
						    } else if (d.itemBefore == 0) {
						    	item_index = itemId_mapping[d.itemAfter];
						    	if (timeline.item[d.participantId-1][item_index])
						    		timeline.item[d.participantId-1][item_index] += 1;
						    	else
						    		timeline.item[d.participantId-1][item_index] = 1;
						    		
						    }
						    // console.log(d.participantId + " undo " + d.itemBefore + '/' + d.itemAfter);
						    // console.log("Updated item number " + timeline.item[d.participantId-1][item_index]);

						    break;

						case "ITEM_DESTROYED":
						    if (d.participantId != 0){
						    	item_index = itemId_mapping[d.itemId];
						    	if (!timeline.item[d.participantId-1][item_index]) {
						    		timeline.item[d.participantId-1][item_index] = 0;
						    		break;
						    	}
						    	if (timeline.item[d.participantId-1][item_index] >= 1)
							    	timeline.item[d.participantId-1][item_index] -= 1;
						    	// if (timeline.item[d.participantId-1][item_index] < 0)
						    	    // alert(d.participantId + " the number of item " + d.itemId +  " < 0");
						    	// console.log(d.participantId + " destroyed " + d.itemId);
							    // console.log("Updated item number " + timeline.item[d.participantId-1][item_index]);
						    }
						    
						    break;

						case "CHAMPION_KILL":
						    if (d.killerId == 0 || d.victimId == 0)
						    	break;
						    if (timeline.participant[d.killerId-1][KILL])
					    		timeline.participant[d.killerId-1][KILL] += 1;
					    	else
					    		timeline.participant[d.killerId-1][KILL] = 1;
					    	if (timeline.participant[d.victimId-1][DEATH])
					    		timeline.participant[d.victimId-1][DEATH] += 1;
					    	else
					    		timeline.participant[d.victimId-1][DEATH] = 1;
						    // console.log(d.killerId + " killed " + d.victimId);
						    // console.log("Updated: " + d.killerId + 'killed' + timeline.participant[d.killerId-1][KILL]);
						    // console.log("Updated: " + d.victimId + 'dead' + timeline.participant[d.victimId-1][DEATH]);
						    break;

						case "ELITE_MONSTER_KILL":
						    if (d.killerId <= 5) teamId = 0;
						    else teamId = 1;
						    if (d.monsterType == "DRAGON") {
						    	if (timeline.team[teamId][DRAGON])
						    		timeline.team[teamId][DRAGON] += 1;
						    	else
						    		timeline.team[teamId][DRAGON] = 1;
							}
						    else if (d.monsterType == "BARON") {
						    	if (timeline.team[teamId][BARON])
						    		timeline.team[teamId][BARON] += 1;
						    	else
						    		timeline.team[teamId][BARON] = 1;
						    }

						    // console.log(d.killerId + ' killed ' + d.towerType + ' updated: ' + timeline.team[teamId][BASE_TURRET] + '/' + timeline.team[teamId][BASE_TURRET])
						    break;

						case "BUILDING_KILL":
						    if (d.teamId == 200) teamId = 0;
						    else teamId = 1;
						    if (d.buildingType == "INHIBITOR_BUILDING") {
						    	if (timeline.team[teamId][INHIBITOR])
						    		timeline.team[teamId][INHIBITOR] += 1;
						    	else
						    		timeline.team[teamId][INHIBITOR] = 1;
						    }
						    else if (d.towerType == 'OUTER_TURRET' || d.towerType == 'INNER_TURRET') {
						    	if (timeline.team[teamId][OUTER_TURRET])
						    		timeline.team[teamId][OUTER_TURRET] += 1;
						    	else
						    		timeline.team[teamId][OUTER_TURRET] = 1;
						    }
						    else if (d.towerType == 'BASE_TURRET' || d.towerType == 'NEXUS_TURRET') {
						    	if (timeline.team[teamId][BASE_TURRET])
						    		timeline.team[teamId][BASE_TURRET] += 1;
						    	else
						    		timeline.team[teamId][BASE_TURRET] = 1;
						    }

						    // console.log(d.teamId + ' destroyed ' + d.towerType + '/' + d.buildingType + ' updated: ' + timeline.team[teamId][BASE_TURRET] + '/' + timeline.team[teamId][BASE_TURRET] + '/' + timeline.team[teamId][INHIBITOR])
						    break;

						case "WARD_PLACED":
						    if (d.creatorId <= 5) teamId = 0;
						    else teamId = 1;
						    if (timeline.team[teamId][WARD])
					    		timeline.team[teamId][WARD] += 1;
					    	else
					    		timeline.team[teamId][WARD] = 1;
						    // console.log(d.creatorId + ": placed ward");
						    // console.log("Update timeline of " + teamId + ": " + timeline.team[teamId][WARD]);
						    break;

						case "WARD_KILL":
						    if (d.killerId <= 5) teamId = 1;
						    else teamId = 0;
						    if (!timeline.team[teamId][WARD])
						    	timeline.team[teamId][WARD] = 0;
						    	break;
						    if (timeline.team[teamId][WARD] >= 1)
							    timeline.team[teamId][WARD] -= 1;
						    // console.log(d.killerId + ": killed ward");
						    // console.log("Update timeline of " + teamId + ": " + timeline.team[teamId][WARD]);
						    break;

						default:
						    break;
					}
				});
            }
		}

		if (i == end || i == frames.length - 1){
            // calculate totalGold of each team
            var f = frames[i].participantFrames;
            timeline.team[0][GOLD] = 0.0;
            timeline.team[1][GOLD] = 0.0;

            for (var j = 1; j < 6; j++){
            	// console.log(timeline.team[0][GOLD]);
            	timeline.team[0][GOLD] += f[j]['totalGold'];
            }
            for (var j = 6; j < 11; j++){
            	timeline.team[1][GOLD] += f[j]['totalGold'];
            }

            for (var j = 1; j < 11; j++){
            	timeline.participant[j-1][LEVEL] = f[j]['level'];
            }
            // store timeline data to result
            result[i.toString()] = (JSON.parse(JSON.stringify(timeline)));
            end += 5;
        }
	}
	return result;
}

function getMLData(data, item_weight) {
	var results = {};
	for (var i = 5;i <= 45;i += 5) {
		if (!data[i]) {
			i -= 4;
			for (var t = i; t < i + 4; t ++) {
				if (data[t]) {
					i = t;
					break;
				}
			}
			if (!data[i])
				break;
		}
		var result = {};
		var current = data[i];
		result["team-gold-diff"] = current["team"][0]["gold"]  - current["team"][1]["gold"];
		result["team-dragon-diff"] = current["team"][0]["dragon"]? current["team"][0]["dragon"] : 0 - current["team"][1]["dragon"]? current["team"][1]["dragon"] : 0;
		result["team-baron-diff"] = current["team"][0]["baron"]? current["team"][0]["baron"]:0 - current["team"][1]["baron"]? current["team"][1]["baron"]:0;
		result["team-outturret-diff"] = current["team"][0]["inner_and_outer_turret"]? current["team"][0]["inner_and_outer_turret"]:0 - current["team"][1]["inner_and_outer_turret"]? current["team"][1]["inner_and_outer_turret"]:0;
		result["team-baseturret-diff"] = current["team"][0]["base_and_nexus_turret"]? current["team"][0]["base_and_nexus_turret"]:0 - current["team"][1]["base_and_nexus_turret"]? current["team"][1]["base_and_nexus_turret"]:0;
		result["team-inhabitor-diff"] = current["team"][0]["inhabitor"]? current["team"][0]["inhabitor"]:0 - current["team"][1]["inhabitor"]?current["team"][1]["inhabitor"]:0;
		result["team-ward-diff"] = current["team"][0]["ward"]? current["team"][0]["ward"]:0 - current["team"][1]["ward"]? current["team"][1]["ward"]:0;
		result["heros-kill-diff"] = 0;
		result["heros-death-diff"] = 0;
		result["heros-assist-diff"] = 0;
		result["heros-item-diff"] = 0;
		for (var j = 0;j < 10; j++) {
			result["heros-kill-diff"] += (current["participant"][j]["kill"]? current["participant"][j]["kill"]:0) * (j < 5? 1:-1);
			result["heros-death-diff"] += (current["participant"][j]["death"]? current["participant"][j]["death"]:0) * (j < 5? 1:-1);
			result["heros-assist-diff"] += (current["participant"][j]["assist"]? current["participant"][j]["assist"]:0) * (j < 5? 1:-1);
			champion_type = champions[data["championId"][j]];
			for (var k in Object.keys(current["item"][j])) {
				result["heros-item-diff"] += item_weight[champion_type][k] * (j < 5? 1:-1);
			}
		}
		results[i % 5 == 0? i:(i - i % 5 + 5)] = result;
	}
	return results;
}

function calculatePredictionResult(data, weights, time) {
	if (time != 0) {
		return calculateSinglePrediction(data, weights, time);
	}
	total_result = {}
	for (var i = 5; i  <= 45; i += 5) {
		if (!data[i])
			break;
		total_result[i] = calculateSinglePrediction(data[i], weights[i], i);
	}
	return total_result;
}

function calculateSinglePrediction(current, weight) {
	var result = {};
	var finalPoint = 0;
	keys = Object.keys(current);
	for (var i = 0; i < keys.length; i++) {
		var key = keys[i];
		var name = key.split("-")[1];
		result[name] = weight[key] * current[key];
		finalPoint += result[name];
	}
	return finalPoint;
}






















