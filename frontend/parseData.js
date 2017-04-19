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
weights[5]["heros-level-diff"] = 0;
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
weights[10]["heros-level-diff"] = 0;
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
weights[15]["heros-level-diff"] = 0;
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
weights[20]["heros-level-diff"] = 0;
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
weights[25]["heros-level-diff"] = 0;
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
weights[30]["heros-level-diff"] = 0;
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
weights[35]["heros-level-diff"] = 0;
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
weights[40]["heros-level-diff"] = 0;
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
weights[45]["heros-level-diff"] = 0;
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
        ml = getMLData(final_result, item_weight);
        draw(final_result[30], ml[30]);

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
            if (i % 5 != 0) {
				i = i - i % 5 + 5;
			}
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
		result["heros-level-diff"] = 0;
		result["heros-item-diff"] = 0;
		for (var j = 0;j < 10; j++) {
			result["heros-kill-diff"] += (current["participant"][j]["kill"]? current["participant"][j]["kill"]:0) * (j < 5? 1:-1);
			result["heros-level-diff"] += (current["participant"][j]["level"]? current["participant"][j]["level"]:0) * (j < 5? 1:-1);
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

function draw(result, MLData) {
        var winrate = [0.5,0.3, 0.2, 0.3, 0.6, 0.8, 0.7];
        var gold = [result["team"][0]["gold"], result["team"][1]["gold"]]
        var ward = [result["team"][0]["ward"], result["team"][0]["ward"]]
        var parlevel0 = [];
        var parlevel1 = [];
        var adv = []
        var disadv = []
        if (MLData["heros-assist-diff"] > 0) {
        	adv.push({legend: "heros-assist-diff", value: MLData["heros-assist-diff"]});
        }else if (MLData["heros-assist-diff"] < 0){
        	disadv.push({legend: "heros-assist-diff", value: MLData["heros-assist-diff"]});
        }

        if (MLData["heros-death-diff-diff"] > 0) {
        	adv.push({legend: "heros-death-diff", value: MLData["heros-death-diff"]});
        }else if (MLData["heros-death-diff"] < 0){
        	disadv.push({legend: "heros-death-diff", value: MLData["heros-death-diff"]});
        }

        if (MLData["heros-item-diff"] > 0) {
        	adv.push({legend: "heros-item-diff", value: MLData["heros-item-diff"]});
        }else if (MLData["heros-item-diff"] < 0){
        	disadv.push({legend: "heros-item-diff", value: MLData["heros-item-diff"]});
        }

        if (MLData["heros-kill-diff"] > 0) {
        	adv.push({legend: "heros-kill-diff", value: MLData["heros-kill-diff"]});
        }else if (MLData["heros-kill-diff"] < 0){
        	disadv.push({legend: "heros-kill-diff", value: MLData["heros-kill-diff"]});
        }

        if (MLData["team-baron-diff"] > 0) {
        	adv.push({legend: "team-baron-diff", value: MLData["team-baron-diff"]});
        }else if (MLData["team-baron-diff"] < 0){
        	disadv.push({legend: "team-baron-diff", value: MLData["team-baron-diff"]});
        }

        if (MLData["team-baseturret-diff"] > 0) {
        	adv.push({legend: "team-baseturret-diff", value: MLData["team-baseturret-diff"]});
        }else if (MLData["team-baseturret-diff"] < 0){
        	disadv.push({legend: "team-baseturret-diff", value: MLData["team-baseturret-diff"]});
        }

        if (MLData["team-dragon-diff"] > 0) {
        	adv.push({legend: "team-dragon-diff", value: MLData["team-dragon-diff"]});
        }else if (MLData["team-dragon-diff"] < 0){
        	disadv.push({legend: "team-dragon-diff", value: MLData["team-dragon-diff"]});
        }

        if (MLData["team-gold-diff"] > 0) {
        	adv.push({legend: "team-gold-diff", value: MLData["team-gold-diff"]});
        }else if (MLData["team-gold-diff"] < 0){
        	disadv.push({legend: "team-gold-diff", value: MLData["team-gold-diff"]});
        }

        if (MLData["team-inhabitor-diff"] > 0) {
        	adv.push({legend: "team-inhabitor-diff", value: MLData["team-inhabitor-diff"]});
        }else if (MLData["heros-assist-diff"] < 0){
        	disadv.push({legend: "team-inhabitor-diff", value: MLData["team-inhabitor-diff"]});
        }

        if (MLData["team-outturret-diff"] > 0) {
        	adv.push({legend: "team-outturret-diff", value: MLData["team-outturret-diff"]});
        }else if (MLData["team-outturret-diff"] < 0){
        	disadv.push({legend: "team-outturret-diff", value: MLData["team-outturret-diff"]});
        }

        if (MLData["team-ward-diff"] > 0) {
        	adv.push({legend: "team-ward-diff", value: MLData["team-ward-diff"]});
        }else if (MLData["team-ward-diff"] < 0){
        	disadv.push({legend: "team-ward-diff", value: MLData["team-ward-diff"]});
        }


        for (var i = 0; i < 5; i++) {
        	parlevel0.push(result["participant"][i]["level"]);
        	parlevel1.push(result["participant"][i+5]["level"]);
        }

        var margin = {top: 30, right: 20, bottom: 30, left: 50},
          width = 800 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;
        var svg = d3.select("svg")
            .attr("width", 1200)
    

        var x = d3.scale.linear().range([0, width]).domain([0,8]);
        var y = d3.scale.linear().range([height, 0]).domain([0,1]);

        var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(8).tickFormat(function(d){
          return d*5;
        });
        var yAxis = d3.svg.axis().scale(y).orient("left").ticks(10);

        var valueline = d3.svg.line()
          .x(function(d, i){
            return x(i);
          })
          .y(function(d){
            return y(d);
          })
        var div = d3.select("body").append("div") 
          .attr("class", "tooltip")       
          .style("opacity", 0);

        // var winrate_section = svg.append("g")

        // winrate_section.append("rect")
        // 	// .attr("y", -40)
        // 	.attr("width", 100)
        // 	.attr("height", 60)
        // 	.style("fill", "grey")
       	// winrate_section.append("text")
       	// 	// .attr("y", 40)
       	// 	.text("WinRate Analysis")
       	// 	.style("stroke", "white")
        
        var g = svg
            .append("g")
            .attr("width", width)
            .attr("height", height)
            .attr("transform", "translate("+margin.left+","+margin.top+")");
        
        g.append("path")
          .attr("class", "line")
          .attr("d", valueline(winrate))
          .style("stroke", "white")
        
        g.selectAll("dot")
          .data(winrate)
          .enter().append("circle")
          .attr("r", 8)
          .attr("cx", function(d, i){
            return x(i);
          })
          .attr("cy", function(d){
            return y(d);
          })
          .style("fill", "#d07a21")
          .on("mouseover", function(d){

          	  d3.select(this).transition()
        		.duration(750)
        		.attr("r", 15)
        		.style("fill", "#d07a21")
              div.transition()    
                .duration(200)    
                .style("opacity", .9);    
              div.html(
                "<strong>Winning Rate:</strong> <span>" + Number(d) + "</span>"
                )
                .style("left", (d3.event.pageX + 20) + "px")  .style("top", (d3.event.pageY - 28) + "px");  
            })
           .on("mouseout", function(d){
            	d3.select(this).transition()
        			.duration(750)
    				.attr("r", 8);
              	div.transition()    
                	.duration(500)    
                	.style("opacity", 0);
            });
        
        svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate("+ margin.left + "," + (height+30) + ")")
          .attr("stroke", "white")
          .attr("fill", "white")
          .call(xAxis)
          .selectAll("text")
          .append("text")
          .text(function(d){
            return "" 
          });
        
        svg.append("g")
          .attr("class", "y axis")
          .attr("stroke", "white")
          .attr("transform", "translate(" + margin.left + "," + margin.bottom + ")")
          .call(yAxis);
        

        var team_section = svg.append("g")
        	.attr("transform", "translate(0, 550)")
        team_section.append("rect")
        	
        	.attr("width", 100)
        	.attr("height", 60)
        	.style("fill", "grey")
        team_section.append("text")
        	.attr("y", 40)
        	.style("fill", "white")
        	.text("Team Analysis")
        
        var x_compare_1 = d3.scale.linear().range([0,200]).domain([0,1])
        var y_compare_1 = d3.scale.linear().range([150, 0]).domain([d3.min(gold)*0.8, d3.max(gold) * 1.2])
        var xAxis_compare_1 = d3.svg.axis()
          .scale(x_compare_1)
          .orient("bottom")
          .ticks(0)
        var yAxis_compare_1 = d3.svg.axis()
          .scale(y_compare_1)
          .orient("left")
          .ticks(5);
        var g_compare = svg.append("g");
        var g_compare_1 = g_compare.append("g")
          .attr("transform", "translate(55,700)")

    g_compare_1.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0, 150)")
      .call(xAxis_compare_1)
      .append("text")
      .text("team1" + "\t"  + "team2")
      .attr("transform", "translate(60, 20)");
      
    
    g_compare_1.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(0,0)")
      .call(yAxis_compare_1)
      .append("text")
      .text("gold")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
        
        
        g_compare_1.selectAll("bar")
          .data(gold)
          .enter().append("rect")
          .style("fill", function(d, i){
          	if (i == 0) {
          		return "#d07a21"
          	}else{
          		return "#386ecb"
          	}
          })
          .attr("x", function(d, i) { if(i == 0){
            return 55;
          }else{
            
            return 105;
          } })
          .attr("width", 30)
          .attr("y", function(d) { return y_compare_1(d); })
          .attr("height", function(d) { return 150 - y_compare_1(d); })
          .on("mouseover", function(d){
          	  d3.select(this).transition()
        		.duration(750)
        		.style("opacity", 1.5);
              div.transition()    
                .duration(200)    
                .style("opacity", .9);    
              div.html(
                "<strong>Gold:</strong> <span>" + Number(d) + "</span>"
                )
                .style("left", (d3.event.pageX) + "px")  .style("top", (d3.event.pageY - 58) + "px");  
            })
            .on("mouseout", function(d){
            	d3.select(this).transition()
        			.duration(750)
    				.style("opacity", 1.0);
              	div.transition()    
                	.duration(500)    
                	.style("opacity", 0);
            });

        // chart team 2
        var x_compare_2 = d3.scale.linear().range([0, 200]).domain([0,1]);
        var y_compare_2 = d3.scale.linear().range([150, 0]).domain([0, 80]);
        var xAxis_compare_2 = d3.svg.axis()
          .scale(x_compare_2)
          .orient("bottom")
          .ticks("0");
        var yAxis_compare_2 = d3.svg.axis()
          .scale(y_compare_2)
          .orient("left")
          .ticks(5);
        var g_compare_2 = g_compare.append("g")
          .attr("transform", "translate(350, 700)");
        g_compare_2.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0, 150)")
          .call(xAxis_compare_2)
          .append("text")
          .text("team1" + "\t\t"  + "team2")
          .attr("transform", "translate(60, 20)");

        g_compare_2.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(0, 0)")
          .call(yAxis_compare_2)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("ward");

        g_compare_2.selectAll("bar")
          .data(ward)
          .enter()
          .append("rect")
          .style("fill", function(d, i){
          	if (i == 0) {
          		return "#d07a21"
          	}else{
          		return "#386ecb"
          	}
          })
          .attr("x", function(d, i) { if(i == 0){
            return 55;
          }else{
            return 105;
          } })
          .attr("width", 30)
          .attr("y", function(d) { return y_compare_2(d); })
          .attr("height", function(d) { return 150 - y_compare_2(d); })
          .on("mouseover", function(d){
          	  d3.select(this).transition()
        		.duration(750)
        		.style("opacity", 1.5);
              div.transition()    
                .duration(200)    
                .style("opacity", .9);    
              div.html(
                "<strong>Ward:</strong> <span>" + Number(d) + "</span>"
                )
                .style("left", (d3.event.pageX) + "px")  .style("top", (d3.event.pageY - 58) + "px");  
            })
            .on("mouseout", function(d){
            	d3.select(this).transition()
        			.duration(750)
    				.style("opacity", 1);
              	div.transition()    
                	.duration(500)    
                	.style("opacity", 0);
            });


        var par_section = svg.append("g")
        	.attr("transform", "translate(0, 900)")
        par_section.append("rect")
        	.style("fill", "grey")
        	.attr("height", 60)
        	.attr("width", 100)
        par_section.append("text")
        	.text("Player Analysis")
        	.attr("y", 40)
        	.style("stroke", "white")

        // chart participant level
        var x_compare_3 = d3.scale.linear().range([0, 450]).domain([0, 5]);
        var y_compare_3 = d3.scale.linear().range([300, 0]).domain([0, 25]);

        var xAxis_compare_3 = d3.svg.axis()
          .scale(x_compare_3)
          .orient("bottom")
          .ticks(0)
          .tickFormat("");
        var yAxis_compare_3 = d3.svg.axis()
          .scale(y_compare_3)
          .orient("left")
          .ticks(5);

        var g_compare_3 = g_compare.append("g")
        	.attr("transform", "translate(50, 900)");
       	g_compare_3.append("g")
       		.attr("class", "x axis")
       		.attr("transform", "translate(0, 400)")
       		.call(xAxis_compare_3)
       		.append("text")
	        .style("text-anchor", "end")
	        .attr("x", 500)
	        .attr("y", -10)
	        .text("players");
     		
     

       	g_compare_3.append("g")
       		.attr("class", "y axis")
       		.attr("transform", "translate(0, 100)")
       		.call(yAxis_compare_3)
       		.append("text")
       		.attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          
	        .text("level");
	    g_compare_3.selectAll("bar")
          .data(parlevel0)
          .enter()
          .append("rect")
          .style("fill", "#d07a21")
          .attr("x", function(d, i) { 
          	return x_compare_3(i) + 20
          	})
          .attr("width", 50)
          .attr("y", function(d) { return y_compare_3(d); })
          .attr("height", function(d) { return 400 - y_compare_3(d); })
          .on("mouseover", function(d){
          	  d3.select(this).transition()
        		.duration(750)
        		.style("opacity", 1.5);
              div.transition()    
                .duration(200)    
                .style("opacity", .9);    
              div.html(
                "<strong>Level:</strong> <span>" + Number(d) + "</span>"
                )
                .style("left", (d3.event.pageX) + "px")  .style("top", (d3.event.pageY - 58) + "px");  
            })
            .on("mouseout", function(d){
            	d3.select(this).transition()
        			.duration(750)
    				.style("opacity", 1);
              	div.transition()    
                	.duration(500)    
                	.style("opacity", 0);
            });;

        // participant chart team 2
        var xAxis_compare_3 = d3.svg.axis()
          .scale(x_compare_3)
          .orient("bottom")
          .ticks(0)
          .tickFormat("");
        var yAxis_compare_3 = d3.svg.axis()
          .scale(y_compare_3)
          .orient("left")
          .ticks(5);

        var g_compare_3 = g_compare.append("g")
        	.attr("transform", "translate(580, 900)");
       	g_compare_3.append("g")
       		.attr("class", "x axis")
       		.attr("transform", "translate(0, 400)")
       		.call(xAxis_compare_3)
       		.append("text")
	        .style("text-anchor", "end")
	        .attr("x", 500)
	        .attr("y", -10)
	        .text("players");

       	g_compare_3.append("g")
       		.attr("class", "y axis")
       		.attr("transform", "translate(0, 100)")
       		.call(yAxis_compare_3)
       		.append("text")
       		.attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          
	        .text("level");
	    g_compare_3.selectAll("bar")
          .data(parlevel1)
          .enter()
          .append("rect")
          .style("fill", "#386ecb")
          .attr("x", function(d, i) { 
          	return x_compare_3(i) + 20
          	})
          .attr("width", 50)
          .attr("y", function(d) { return y_compare_3(d); })
          .attr("height", function(d) { return 400 - y_compare_3(d); })
          .on("mouseover", function(d){
          	  d3.select(this).transition()
        		.duration(750)
        		.style("opacity", 1.5);
              div.transition()    
                .duration(200)    
                .style("opacity", .9);    
              div.html(
                "<strong>Level:</strong> <span>" + Number(d) + "</span>"
                )
                .style("left", (d3.event.pageX) + "px")  .style("top", (d3.event.pageY - 58) + "px");  
            })
            .on("mouseout", function(d){
            	d3.select(this).transition()
        			.duration(750)
    				.style("opacity", 1);
              	div.transition()    
                	.duration(500)    
                	.style("opacity", 0);
            });;
        

          // pie chart
         
          var color = d3.scale.category20();
          var g_pie = svg.append("g")
            .attr("width", 350)
            .attr("height", 200)
            .attr("transform", "translate(150, 1500)");
          var arc = d3.svg.arc()
            .outerRadius(100)
            .innerRadius(50);
          var pieValue = d3.layout.pie()
            .sort(null)
            .value(function(d){
              return d.value;
            });

          var pie = g_pie.selectAll(".fan")
            .data(pieValue(adv))
            .enter()
            .append("g")
            .attr("transform", "translate(50, 100)")
            .attr("class", "fan");

          pie.append("path")
            .attr("d", arc)
            .style("fill", function(d, i){
              return color(i);
            })
            ;

          pie.append("rect")
          	.attr("x", 150)
          	.attr("y", function(d, i){
          		return i * 20 - 50;
          	})
          	.attr("width", 20)
          	.attr("height", 20)
          	.style("fill", function(d, i){
          		return color(i);
          	})

          pie.append("text")
            .attr("transform", function(d, i){
              return "translate(180," + (i * 20 - 38) + ")";
            })
            .style("text-anchor", "left")
            .style("stroke", "white")
            .text(function(d){
              return d.data.legend;
            })
          

          // pie chart 2
          var color = d3.scale.category20();
          var g_pie = svg.append("g")
            .attr("width", 350)
            .attr("height", 200)
            .attr("transform", "translate(630, 1500)");
          var arc = d3.svg.arc()
            .outerRadius(100)
            .innerRadius(50);
          var pieValue = d3.layout.pie()
            .sort(null)
            .value(function(d){
              return d.value;
            });

          var pie = g_pie.selectAll(".fan")
            .data(pieValue(disadv))
            .enter()
            .append("g")
            .attr("transform", "translate(50, 100)")
            .attr("class", "fan");

          pie.append("path")
            .attr("d", arc)
            .style("fill", function(d, i){
              return color(i);
            })
            .on("mouseover", function(d){
          	  d3.select(this).transition()
        		.duration(750)
        		.style("opacity", 1.5);
              div.transition()    
                .duration(200)    
                .style("opacity", .9);    
              div.html(
                "<strong>Weight:</strong> <span>" + d + "</span>"
                )
                .style("left", (d3.event.pageX) + "px")  .style("top", (d3.event.pageY - 58) + "px");  
            });
            

          pie.append("rect")
          	.attr("x", 150)
          	.attr("y", function(d, i){
          		return i * 20 - 50;
          	})
          	.attr("width", 20)
          	.attr("height", 20)
          	.style("fill", function(d, i){
          		return color(i);
          	});

          pie.append("text")
            .attr("transform", function(d, i){
              return "translate(180," + (i * 20 - 38) + ")";
            })
            .style("stroke", "white")
            .style("text-anchor", "left")
            .text(function(d){
              return d.data.legend;
            });
          
}
     