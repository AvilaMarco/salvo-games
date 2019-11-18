//cargar datos
let games = [];
let players = [];
let masx,masy = false
let playerData = {}
reloadInfo()
function reloadInfo() {
    fetch('/api/games',{
        method: 'GET',
    })
    .then(function(response){if(response.ok){return response.json()}
    })
    .then(function(json){
        if(json.player.nacion != null){
            inMenu(json)
        }else{
            chooseNation()
        }
        let games = json.games.filter(e=>e.direccion!="00")
        if (games.length!=0){
            console.log(games)
            crearJuegosMap(games)
        }
        players = json.playerScore;
        playerData = json.player;
    });
}

function crearJuegosMap(games) {
    games.forEach(e=>{
        if (e.gameplayers[0].Score == null) {
            let areahtml = document.querySelector("#"+e.direccion)
            let div = document.createElement("div")
                div.dataset.name = "game"
                div.dataset.gameid = e.id
                div.dataset.gpid = e.gameplayers[0].id
                div.style.top = parseInt(areahtml.coords.split(",")[1])-30+"px"
                div.style.left = parseInt(areahtml.coords.split(",")[0])-35+"px"
                div.style.width = "90px"
                div.style.height = "90px"
                div.classList.add("icono"+areahtml.dataset.location)
                div.style.position ="absolute"
                div.style.zIndex = 99
                div.dataset.location = areahtml.dataset.location
                div.id = areahtml.id
                div.addEventListener('click',isJoinGame)
            document.querySelector("#pivotMap").appendChild(div)
            let textoPlayer1 = document.createElement("p")
                textoPlayer1.name = "texto"
                textoPlayer1.classList.add("bg-color-"+e.ubicacion)
                textoPlayer1.classList.add("textomapa")
                textoPlayer1.innerText = e.gameplayers[0].player.email
            div.appendChild(textoPlayer1)  
        }
    // let textoPlayer2 = document.createElement("p")
    // textoPlayer2.innerText = e.gameplayers
    })
}

function setNacionPlayer(nacion) {
    fetch('/api/setNacionPlayer/'+nacion,{
        method: 'POST',
    }).then(function(response){
        if(response.ok){
            fetch('/api/games',{
                method: 'GET',
            })
            .then(function(response){if(response.ok){return response.json()}
            })
            .then(function(json){
                console.log(json.player.nacion)
                inMenu(json)
            });
        }
    })
}
    

function chooseNation() {
    document.querySelector("#inicoNacion").classList.remove("d-none")
}
function inMenu(json) {
    document.querySelector("#inicoNacion").classList.add("d-none")
    document.querySelector("#Player").classList.add("iconTransparent"+json.player.nacion) 
    document.querySelector("#webGames").classList.remove("d-none")
    document.querySelector("#botonera").classList.remove("d-none")
}

function verdatos(elementhtml) {
   console.log(elementhtml)
   addmodal()
   if (elementhtml.id=="Player"){
    verDatosUser()
   }else if(elementhtml.id=="info"){
    verTutorial()
   }else if(elementhtml.id=="ladder"){
    createTableRanking()
   }
}
function nomodal(){
    document.querySelector("#modal").classList.add("modalAnimationout")
    document.querySelector("#modal").classList.remove("modalAnimation")
    document.querySelector("#container").style.opacity = 1;
}

function addmodal(){
    document.querySelector("#modal").classList.remove("modalAnimationout")
    document.querySelector("#container").style.opacity = 0.2
    document.querySelector("#modal").classList.remove("d-none")
    document.querySelector("#modal").classList.add("modalAnimation")
}

function verDatosUser() {
   let modalDiv = document.querySelector(".div-modal")
    modalDiv.innerHTML = "" 
    modalDiv.classList.add("bg"+playerData.nacion)
    modalDiv.style.height = "80vh"
    let div = document.createElement("div")
}

function verTutorial(argument) {
   let modalDiv = document.querySelector(".div-modal")
    modalDiv.innerHTML = ""
}
//referencias al DOM
let tablegame = document.querySelector("#game-body");
let tableranking = document.querySelector("#ranked-body");
let modal = document.querySelector("#registre");
let container = document.querySelector(".container");
let modalRegistre = document.querySelector("#modal-registre");
let logout = document.querySelector("#logout")
let verMapa = document.querySelector("#verMapa")
let play = document.querySelector("#play")
let info = document.querySelector("#info")
//botones eventlistener
logout.addEventListener('click',logoutFunction)
verMapa.addEventListener('click',viewMapa)
play.addEventListener('click',entergame)
/*CONFIGURACION MAPA PARA ELEGIR EL LUGAR DE JUEGO*/
ubicacionesMap.forEach(area=>{
    let areahtml = document.createElement("area");
    areahtml.dataset.location = area.location
    areahtml.id = area.id
    areahtml.shape = "circle"
    areahtml.alt = "aremap"
    areahtml.title = "hola"
    areahtml.addEventListener("click",selectGame)
    areahtml.coords = area.x+","+area.y+","+area.r
    document.querySelector("map[name*=mapeo]").appendChild(areahtml)
})

function entergame() {
    let datos = document.querySelector("div[data-name*='selectGame']")
    let datosjoingame = document.querySelector("div.selectGame")
    let isPlayerCreator
    if (null != document.querySelector("div.selectGame")) {
        isPlayerCreator = document.querySelector("div.selectGame").firstElementChild.innerText == playerData.email
    }else{
        isPlayerCreator = false
    }
    if (datos!=null && datosjoingame==null && !isPlayerCreator) {
        // crear juegos
        crearjuego(datos.dataset.location,datos.id)
        console.log(datos)
        // fetch('/api/games/'+datos.dataset.location+'/'+datos.id,{
        //     method:'POST'
        // })
        // .then(function(response){
        //     if(response.ok){
        //         return response.json()
        //     }else{
        //         throw new Error(response.json());
        //     }
        // })
        // .then(function(JSON){
        //     console.log("entrar al juego")
        //     console.log(JSON.gpid)
        //     console.log(JSON.gameid)
        //     location.assign("/web/game.html?gp="+JSON.gpid);
        // })
        // .catch(error => error)
        // .then(json => console.log(json))
    }else if(datos==null && datosjoingame!=null && !isPlayerCreator){
        // unirse a juego
        // datosjoingame.dataset.gameid
        console.log(parseInt(datosjoingame.dataset.gameid))
        joinGame(parseInt(datosjoingame.dataset.gameid))
    }else if(isPlayerCreator && datos==null && datosjoingame!=null){
        // volver al juego
        location.assign("/web/game.html?gp="+datosjoingame.dataset.gpid);
        console.log(parseInt(datosjoingame.dataset.gameid))
    }
    else{
        console.log("elegir una ubicacion en el mapa")
    }
}

function joinGame(gameid){
    fetch('/api/game/'+gameid+'/players',{
    method: 'POST',
    }).then(function(response){if(response.ok){return response.json()}
    }).then(function(json){
        location.assign("/web/game.html?gp="+json.gpid);
        console.log(json.gpid)
    }).catch(function(error) {
  console.log('Hubo un problema con la petición Fetch:' + error.message);
});
}

// function enterGame(event){
//     fetch('/api/games',{
//     method: 'GET',
//     }).then(function(response){if(response.ok){return response.json()}
//     }).then(function(JSON){
//         if (JSON.player != "guest") {
//             let game = JSON.games.filter(e=>e.id == event.target.dataset.gameid); 
//             if (event.target.dataset.players.includes((""+JSON.player.id))) {
//                 let gp = game[0].gameplayers.filter(e=>e.player.id == JSON.player.id)
//                 location.assign("/web/game.html?gp="+gp[0].id);
//                 console.log(gp[0].id)
//             }else if (game[0].gameplayers.length == 1) {
//                 joinGame(game[0].id)
//             }else{
//                 alert("you can't join the game")
//             }
//         }else{
//             alert("Login to join or create a game")
//         }
//     });
// }

function crearjuego(location,ubicacion) {
    fetch('/api/games/'+location+'/'+ubicacion,{
        method:'POST'
    })
    .then(function(response){
        if(response.ok){
            return response.json()
        }else{
            throw new Error(response.json());
        }
    })
    .then(function(JSON){
        console.log("entrar al juego")
        console.log(JSON.gpid)
        location.assign("/web/game.html?gp="+JSON.gpid);
    })
    .catch(error => error)
    .then(json => console.log(json))
}

//cuando existe algun juego
function isJoinGame(event) {
    if (document.querySelector("div[data-name*='selectGame']")!=null) {
        document.querySelector("#pivotMap").removeChild(document.querySelector("div[data-name*='selectGame']"))
    }
    let click = event.target
    document.querySelectorAll("div[data-name*='game']").forEach(e=>e.classList.remove("selectGame"))
    if (click.name == "texto"){
        click.parentNode.classList.add("selectGame")
    }else{
        click.classList.add("selectGame")
    }
    console.log(event.target)
}

//crear juego
function selectGame(event) {
    document.querySelectorAll("div[data-name*='game']").forEach(e=>e.classList.remove("selectGame"))
    let area = event.target
    if (document.querySelector("div[data-name*='selectGame']")!=null) {
        document.querySelector("#pivotMap").removeChild(document.querySelector("div[data-name*='selectGame']"))
    }
    let div = document.createElement("div")
    div.dataset.name = "selectGame"
    div.style.top = parseInt(area.coords.split(",")[1])-30+"px"
    div.style.left = parseInt(area.coords.split(",")[0])-35+"px"
    div.style.width = "90px"
    div.style.height = "90px"
    div.classList.add("icono"+area.dataset.location)
    div.style.position ="absolute"
    div.style.zIndex = 99
    div.dataset.location = area.dataset.location
    div.id = area.id
    document.querySelector("#pivotMap").appendChild(div)
    console.log(div)
}

function viewMapa(event)
{
    let divselect = document.querySelector("div[data-name*='selectGame']")
    let y,x = null
    if (divselect!=null){
        y = parseInt(divselect.style.top.split("px")[0])
        x = parseInt(divselect.style.left.split("px")[0])
    }
    let marginMap = document.querySelector("#mapa").style
    if (event.target.innerText == "Map") {
        event.target.innerText = "Menu"
        document.querySelectorAll("button[name*='botonesMenu']").forEach(e=>e.classList.add("d-none"))
        document.querySelector("#mapabg").classList.add("d-none")
        if (divselect!=null) {
            document.querySelector("#mapa").style.marginLeft = "0"
            document.querySelector("#mapa").style.marginTop = "0"
            if (masx) {
                divselect.style.left = x - 150 + "px"
            }else if(masy){
                divselect.style.top = y - 150 + "px"
            }
        }
    }else{
       event.target.innerText = "Map"
        document.querySelector("#mapabg").classList.remove("d-none")
        document.querySelectorAll("button[name*='botonesMenu']").forEach(e=>e.classList.remove("d-none"))
        if (divselect!=null) {
            if (y < 100) {
                divselect.style.top = y + 150 + "px"
                marginMap.marginTop = "150px"
                masy = true
            }else if (x < 100) {
                divselect.style.left = x + 150 + "px"
                marginMap.marginLeft = "150px"
                masx = true
            }
        }     
    }
}
//runweb
function runweb(json){
    document.querySelector("#Player").classList.add("iconTransparent"+json.player.nacion)
    // crear si existen juegos en el mapa
    // mapaGames()
    // createTableRanking()
    // createTableGames();
}
//LOGOUT
function logoutFunction()
{
    fetch('/api/logout',{
    method:'POST',
    })
    .then(function(response){
        location.assign("/");
    })
}

//TABLE RANKED
function createTableRanking(){
    players.forEach(e=>{e.total=0;e.Won=0;e.Lost=0;e.Tied=0})
    for(let i=0; i < players.length; i++){
        for(let j = 0; j < players[i].scores.length; j++){
            players[i].total+=players[i].scores[j]
            switch(players[i].scores[j]){
                case 3:
                    players[i].Won += 1;
                    break;
                case 1:
                    players[i].Tied += 1;
                    break;
                case 0:
                    players[i].Lost += 1;
                    break;
            }
        }
    }
    players.sort(function(a, b) {return b.total - a.total;});
    let modalDiv = document.querySelector(".div-modal")
    modalDiv.innerHTML = ""
    modalDiv.classList.remove("bg"+playerData.nacion)
    let body = ``
    body += `
    <table class="table theadBlack">
        <thead class="">
            <tr>
                <th>Player</th>
                <th>Score</th>
                <th>Win</th>
                <th>Lose</th>
                <th>Tied</th>
            </tr>
        </thead>
        <tbody id="ranked-body">
    `
    for (var i = 0; i < players.length; i++) {
        if (players[i].scores.length != 0) {
            body +=`<tr>
            <td>
                <p>${players[i].email}</p>
            </td>
            <td>
                <p>${players[i].total}</p>
            </td>
            <td>
                <p>${players[i].Won}</p>
            </td>
            <td>
                <p>${players[i].Lost}</p>
            </td>
            <td>
                <p>${players[i].Tied}</p>
            </td>
        </tr>`
        }
    }
    body +=`</tbody></table>`
    modalDiv.innerHTML += body
}
//TABLE GAMES
function createTableGames(){
    let player;
    fetch('/api/games',{
    method: 'GET',
    }).then(function(response){if(response.ok){return response.json()}
    }).then(function(json){
    games = json.games;
    player = json.player
    tablegame.innerHTML = "";
    let tabla = "";
    for(let i = 0;i<games.length;i++){
        tabla +=`<tr>
        <td>
            <p>${games[i].id}</p>
        </td>
        <td>
            <p>${games[i].created}</p>
        </td>`
        if (games[i].gameplayers[0].Score != null) {
            tabla +=`<td><p>Finish</p></td>`
        }else{
            tabla +=`<td><p>in Game</p></td>`
        }
        if (player != "guest") {
            if (games[i].gameplayers.map(e=>e.player.id).includes(player.id) && games[i].gameplayers[0].Score == null) {
               tabla +=`
                <td>
                    <button id="entergame" data-players="${games[i].gameplayers.map(e=>e.player.id)}" data-gameid="${games[i].id}">enter game</button>
                </td>
                <td>
                    <p>${(games[i].gameplayers.length==2?
                        (games[i].gameplayers[1].player.id == player.id?games[i].gameplayers[0].player.id:games[i].gameplayers[1].player.id) : "non-rival")}</p>
                </td>`
            }else if(games[i].gameplayers.length==1){
                tabla +=`
                <td>
                   <p>${games[i].gameplayers[0].player.id}</p> 
                </td>
                <td>
                    <button id="joingame" data-players="${games[i].gameplayers.map(e=>e.player.id)}" data-gameid="${games[i].id}">join game</button>
                </td>`
            }else{
                tabla +=`
                <td>
                   <p>${games[i].gameplayers[0].player.id}</p> 
                </td>
                <td>
                    <p>${games[i].gameplayers[1].player.id}</p>
                </td>`
            }
        }else{
            tabla +=`
                <td>
                   <p>${games[i].gameplayers[0].player.id}</p> 
                </td>
                <td>
                    <p>${(games[i].gameplayers.length==2?games[i].gameplayers[1].player.id : "non-rival")}</p>
                </td>`
        }

    }    
tablegame.innerHTML = tabla
    document.querySelectorAll('#entergame').forEach(e=>e.addEventListener('click',enterGame))
    document.querySelectorAll('#joingame').forEach(e=>e.addEventListener('click',joinGame))
    });
}

// function createGame(){
//     fetch('/api/games',{
//         method:'POST'
//     })
//     .then(function(response){
//         if(response.ok){
//             createTableGames()
//             return response.json()
//         }else{
//             throw new Error(response.json());
//         }
//     })
//     .then(function(JSON){
//         console.log("entrar al juego")
//         console.log(JSON.gpid)
//         location.assign("/web/game.html?gp="+JSON.gpid);
//     })
//     .catch(error => error)
//     .then(json => console.log(json))
// }

