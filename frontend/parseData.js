var API_KEY = "RGAPI-48368D89-F4C8-4979-9973-EE735761DD42";
var participant_attr = ['kill', 'death', 'level'];
var team_attr = ['gold', 'dragon', 'baron', 'inner_and_outer_turret', 'base_and_nexus_turret', 'inhibitor', 'ward'];
var itemId = [];
var itemId_mapping = {};
var matchId = [];
var match_count = 0;
var final_result = {};

// load item id
d3.csv("item.csv", function(error, data){
	data.forEach(function(d, i) {
        itemId.push(d.id);
        itemId_mapping[d.id] = i;
    });
});

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
            result[i.toString()] = timeline;
            end += 5;
        }
	}
	return result;
}
























