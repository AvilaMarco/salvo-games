fetch('http://localhost:8080/api/games',{
	method: 'GET',
	}).then(function(response){if(response.ok){return response.json()}
	}).then(function(JSON){
	games = JSON;
    runWeb();
});

function gameView(gamePlayer_Id){
fetch('http://localhost:8080/api/gp/'+gamePlayer_Id,{
	method: 'GET',
	}).then(function(response){if(response.ok){return response.json()}
	}).then(function(JSON){
	mostrarweb(JSON)
});
}

function querysUrl(search) {
  var obj = {};
  var reg = /(?:[?&]([^?&#=]+)(?:=([^&#]*))?)(?:#.*)?/g;

  search.replace(reg, function(match, param, val) {
    obj[decodeURIComponent(param)] = val === undefined ? "" : decodeURIComponent(val);
  });

  return obj;
}

let direccion = window.location.href

let games = [];
let table = document.querySelector("#tableGames");
let title = document.querySelector("#duelo")

function mostrarweb(json){

    title.innerHTML +=`
    <span>${json.gamePlayers[0].email}(you)</span> vs <span>${json.gamePlayers[1].email}</span>
    `
    for(let i = 0; i < json.ships.length;i++){
        let location = json.ships[i].locations[0]
        let orientation = json.ships[i].locations[0].substring(1) == json.ships[i].locations[1].substring(1) ? 'vertical' : 'horizontal'
        let type = json.ships[i].type_Ship
        let tamaño = json.ships[i].locations.length
        createShips(type, tamaño, orientation, document.getElementById('ships'+location),true)
    }
}

function runWeb(){
gameView(querysUrl(direccion).gp)
for(let i = 0;i<games.length;i++){
    table.innerHTML +=`
    <tr>
        <td>
            <p>${games[i].id}</p>
        </td>
        <td>
            <p>${games[i].created}</p>
        </td>
        <td>
            <p>${games[i].players[0].id}</p>
        </td>
        <td>
            <p>${games[i].players[1].id}</p>
        </td>
    </tr>`
}
}