/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        //app.receivedEvent('deviceready');
        getMostriDaTasca();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

class MonsterCandy {
    constructor (id, lat, lon, type, size, name) {
        this.id = id;
        this.lat = lat;
        this.lon = lon;
        this.type = type;
        this.size = size;
        this.name = name;
    }

    get MonsterCandyId() {
        return this.id;
    }

    get MonsterCandyLat() {
        return this.lat;
    }

    get MonsterCandyLon() {
        return this.lon;
    }

    get MonsterCandyType() {
        return this.type;
    }

    get MonsterCandySize() {
        return this.size;
    }

    get MonsterCandyName() {
        return this.name;
    }

}

class User {
    constructor (name, image, xp, lifepoints) {
        this.name = name;
        this.image = image;
        this.xp = xp;
        this.lifepoints = lifepoints;

    }

    get UserName() {
        return this.name;
    }

    get UserImage() {
        return this.image;
    }

    get UserXp() {
        return this.xp;
    }

    get UserLifepoints() {
        return this.lifepoints;
    }

}

class Model {
    constructor() {
        this.users = new Array();
        this.monsterscandies = new Array();
    }

    addUser(newUser) {
        this.users.push(newUser);
    }

    getUsers() {
        return this.users;
    }

    populateUsers(result) {
        for (let i=0; i<result.ranking.length; i++) {
            let newUser = new User(result.ranking[i].username, result.ranking[i].img, result.ranking[i].xp, result.ranking[i].lp);
            model.addUser(newUser);
        }
    }

    depopulateUsers() {
        for (let i=this.users.length-1; i>=0; i--) {
            this.users.pop()[i];
        }
    }

    addMonsterCandy(newMonsterCandy) {
        this.monsterscandies.push(newMonsterCandy);
    }

    getMonstersCandies() {
        return this.monsterscandies;
    }

    populateMonstersCandies(result) {
        for (let i=0; i<result.mapobjects.length; i++) {
            let newMonsterCandy = new MonsterCandy(result.mapobjects[i].id, result.mapobjects[i].lat, result.mapobjects[i].lon, result.mapobjects[i].type, result.mapobjects[i].size, result.mapobjects[i].name);
            model.addMonsterCandy(newMonsterCandy);
        }
    }

    depopulateMonstersCandies() {
        for (let i=this.monsterscandies.length-1; i>=0; i--) {
            this.monsterscandies.pop()[i];
        }
    }

}

var model = new Model();

var session_id = "";

var map;

var userName, userImage, userXp, userLifepoints, userLat, userLon;

function getMostriDaTasca() {

    $("#mostridatasca").show();
    $("#mostridatasca").append("<img id='mostridatasca-logo' src='img/mostri_da_tasca.png'>");

    setTimeout(getSession, 3000);
}

function getSession() {

    $("#mostridatasca").hide();
    $("#mostridatasca").empty();

    const TEST_SESSION_ID = "5mRtRRlne8usc6Cg";

    //session_id = TEST_SESSION_ID;   

    if (session_id == "") {
        if (localStorage.getItem('session_id') == null) {  
            
            loadMap();
            getRegister();

        } else {                                          
            session_id = localStorage.getItem('session_id');

            console.log("session_id: " + session_id);

            loadMap();
            getMain();

        }
    } else {

        loadMap();
        getMain();

    }

    
}

function loadMap() {

    $("#map").show();

    // MapBox Token
    mapboxgl.accessToken = 'pk.eyJ1IjoiZmFzb3h5IiwiYSI6ImNrMzcyenJoYzA1a3MzZHFsNmdwaWswbTUifQ.NhDg1pENhLDS5KwpexZLhQ';

    // MapBox Map
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v10',
        center: [9.191383, 45.464211],
        zoom: 10,
    });

    // MapBox User Location Button
    map.addControl(
        new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true
        })
    );

    // MapBox User Location Update
    navigator.geolocation.watchPosition(onSuccess, onError, { timeout: 1000 });

    function onSuccess(position) {
        userLat = position.coords.latitude;
        userLon = position.coords.longitude;
        console.log("userLat: "  + userLat);
        console.log("userLon: "  + userLon);
    }

    function onError() {
        console.log("Error");
    }

    if (localStorage.getItem('session_id') != null) {
        getMap();
        setInterval(getMap, 10000);
    }
 
}

function getRegister() {

    $("#register").append("<div id='register-button'><span id='register-button-text'>PLAY NOW</span></div>");

    $("#register-button").click(function() {
        $.ajax({
            method: 'post', url: "https://ewserver.di.unimi.it/mobicomp/mostri/register.php",
            dataType: 'json',
            success: function (result) {
                session_id = result["session_id"];

                console.log("session_id" + session_id);
            },
            complete: function() {
                localStorage.setItem('session_id', session_id); 
                
                $('#register').empty();
                $('#register').hide();

                $('#map').empty();
                $('#map').hide();

                getLogin();
                       
            },
            error: function (error) {
                console.error(error);
            }
        });     
    });
}

function getLogin() {

    $("#login").append("<img id='login-user-image' src='img/user_default_image.png'><form><input id='login-user-name' type='text'></form><div id='login-button'><span id='login-button-text'>LOGIN</span></div>");
    
    $("#login-user-image").click(function() {
        console.log("login-user-image clicked");

        getImage();

    });

    $("#login-button").click(function() {
        console.log("login-user-name clicked");

        userName = $("#login-user-name").val();
        setUserName(userName);

        $('#login').empty();
        $('#login').hide();

        getSession();

    });

    function setUserName(userName) {
        $.ajax({
            method: 'post', 
            url:"https://ewserver.di.unimi.it/mobicomp/mostri/setprofile.php",
            data: JSON.stringify({session_id : session_id, username : userName}),
            dataType: 'json',
                success: function(result) {
                    console.log(result);        
                },
                complete: function() {
                    alert("UserName Changed!");
                },
                error: function(error) { 
                    console.error(error);
                }
        });
    }

    function setOptions(srcType) {
        var options = {
            quality: 20,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: srcType,
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            allowEdit: true,
            correctOrientation: true  
        };
        return options;
    }
    
    function getImageInBase64(path, callback){
        window.resolveLocalFileSystemURL(path, gotFile, fail);
    
        function fail(e) {
            alert('Cannot found requested file');
        }
    
        function gotFile(fileEntry) {
            fileEntry.file(function(file) {
                var reader = new FileReader();
                reader.onloadend = function(e) {
                    var content = this.result;
                    callback(content);
                };
                reader.readAsDataURL(file);
            });
        }
    }
    
    function getImage() {
        $(".cordova-camera-select").remove();   
    
        var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
        var options = setOptions(srcType);
    
        navigator.camera.getPicture(
            function cameraSuccess(imageUri) {
                console.log("Imaged Loaded: " + imageUri);
    
                if (imageUri.substr(0, 5) == 'file:') {
    
                    console.log("Android Upload");
    
                    getImageInBase64(imageUri, function (imgBase64) {

                        $("#login-user-image").attr("src", imgBase64);
                        setUserImage(imgBase64.split(",")[1]);

                    });
    
                } else {
    
                    console.log("Browser Upload");
    
                    $("#login-user-image").attr("src", "data:image/jpeg;base64, " + imageUri);
                    setUserImage(imageUri);
                    
                }
        
            }, function cameraError(error) {
                console.debug("Unable to obtain picture: " + error, "app");
            }, 
        options);
    
    }
    
    function setUserImage(imageUri) {
        $.ajax({
            method: 'post', 
            url:"https://ewserver.di.unimi.it/mobicomp/mostri/setprofile.php",
            data: JSON.stringify({session_id : session_id, img : imageUri}),
            dataType: 'json',
                success: function(result) {
                    console.log(result);        
                },
                complete: function() {
                    alert("UserImage Changed!")
                },
                error: function(error) { 
                    console.error(error);
                }
        });
    }
}

function getMap() {

    $(".marker").remove();

    model.depopulateMonstersCandies();

    $.ajax({
        method: 'post', 
        url:"https://ewserver.di.unimi.it/mobicomp/mostri/getmap.php",
        data: JSON.stringify({session_id : session_id}),
        dataType: 'json',
            success: function(result) {

                model.populateMonstersCandies(result);

            },
            complete: function() {

                for (let i=0; i<model.getMonstersCandies().length; i++) {
                    let monstercandy = model.getMonstersCandies()[i];
                    setIcon(monstercandy);
                }

            },
            error: function(error) { 
                console.error(error);
            }
    });

    function setIcon(monstercandy) {
        let monstercandyGeoJson = {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'properties': {
                        'id': monstercandy.id,
                        'lat': monstercandy.lat,
                        'lon': monstercandy.lon,
                        'type': monstercandy.type,
                        'size': monstercandy.size,
                        'name': monstercandy.name

                    },
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [monstercandy.lon, monstercandy.lat]
                    }
                }
            ]
        };

        monstercandyGeoJson.features.forEach(function(marker) {

            let monstercandyIcon = document.createElement('div');

            monstercandyIcon.className = 'marker';
            
            switch (monstercandy.type) {
                case 'MO':
                    switch (monstercandy.size) {
                        case 'S':
                            monstercandyIcon.style.backgroundImage = 'url(./img/small_monster_icon.png)';
                            break;
                        case 'M':
                            monstercandyIcon.style.backgroundImage = 'url(./img/medium_monster_icon.png)';
                            break;
                        case 'L':
                            monstercandyIcon.style.backgroundImage = 'url(./img/large_monster_icon.png)';
                            break;
                    }
                    break;
                case "CA":
                    switch (monstercandy.size) {
                        case 'S':
                            monstercandyIcon.style.backgroundImage = 'url(./img/small_candy_icon.png)';
                            break;
                        case 'M':
                            monstercandyIcon.style.backgroundImage = 'url(./img/medium_candy_icon.png)';
                            break;
                        case 'L':
                            monstercandyIcon.style.backgroundImage = 'url(./img/large_candy_icon.png)';
                            break;
                    }
                    break;
            }
                  
            monstercandyIcon.style.width = '25px';
            monstercandyIcon.style.height = '25px';
            monstercandyIcon.style.backgroundSize = 'contain';
    
            monstercandyIcon.addEventListener('click', function() {
                getPopUp(marker);
            });
    
            new mapboxgl.Marker(monstercandyIcon)
                .setLngLat(marker.geometry.coordinates)
                .addTo(map);
        });
    }

}

function getPopUp(marker) {

    $('#popup').show();

    let monstercandyId = marker.properties.id;
    let monstercandyLat = marker.properties.lat;
    let monstercandyLon = marker.properties.lon;
    let monstercandyType = marker.properties.type;
    let monstercandySize = marker.properties.size;
    let monstercandyName = marker.properties.name;

    let monstercandyImage;

    $.ajax({
        method: 'post', 
        url:"https://ewserver.di.unimi.it/mobicomp/mostri/getimage.php",
        data: JSON.stringify({session_id : session_id, target_id : monstercandyId}),
        dataType: 'json',
            success: function(result) {
                
                monstercandyImage = result.img;

            },
            complete: function() {

                let userLocation = new mapboxgl.LngLat(userLon, userLat);
                let monstercandyLocation = new mapboxgl.LngLat(monstercandyLon, monstercandyLat)

                let distance = userLocation.distanceTo(monstercandyLocation);

                $("#popup").append("<img id='popup-back-button-icon' src='img/back_button_icon.png'><img id='popup-monstercandy-image' src='data:image/png;base64, " + monstercandyImage + "'><div style='text-align:center;'><span id='popup-monstercandy-name'>" + monstercandyName + "</span></div><img id='popup-level-icon' src='img/level_icon.png'><span id='popup-monstercandy-size'>" + monstercandySize + "</span><img id='popup-range-icon' src='img/range_icon.png'><span id='popup-monstercandy-range'>" + Math.floor(distance) + "</span><div id='popup-fighteat-button'><img id='popup-fighteat-button-icon' src='" + (monstercandyType == "MO" ? "img/fight_icon.png" : "img/eat_icon.png") + "'></div>");

                /*if (monstercandyType == "MO") {
                    $("#popup-fighteat-button-icon").attr("src", "img/fight_icon.png");
                } else if (monstercandyType == "CA") {
                    $("#popup-fighteat-button-icon").attr("src", "img/eat_icon.png");
                }
                */
                
                $("#popup-back-button-icon").click(function() {
                    console.log("popup-back-button clicked");

                    $('#popup').empty();
                    $('#popup').hide();

                });

                $("#popup-fighteat-button").click(function() {
                    console.log("popup-fighteat-button clicked");

                    if (distance <= 50) {
                        fighteat(monstercandyId, monstercandyType);

                        $('#popup').empty();
                        $('#popup').hide();

                    } else {
                        alert("Too far from the target!")
                    }
                    
                });

            },
            error: function(error) { 
                console.error(error);
            }
    });

    function fighteat(monstercandyId, monstercandyType) {

        let userDied;
        let userXpBefore;
        let userXpAfter;
        let userLifepointsBefore;
        let userLifepointsAfter;
    
        $.ajax({
            method: 'post', 
            url:"https://ewserver.di.unimi.it/mobicomp/mostri/fighteat.php",
            data: JSON.stringify({session_id : session_id, target_id : monstercandyId}),
            dataType: 'json',
                success: function(result) {
        
                    userDied = result.died;
                    userXpBefore = userXp;
                    userXpAfter = result.xp;
                    userLifepointsBefore = userLifepoints;
                    userLifepointsAfter = result.lp;
    
                },
                complete: function() {
    
                    getPopUpResult(monstercandyType, userDied, userXpBefore, userXpAfter, userLifepointsBefore, userLifepointsAfter);
    
                    $("#main").empty();
                    $("#main").hide();
    
                    getMain();
    
                },
                error: function(error) { 
                    console.error(error);
                }
        });
    }
}

function getPopUpResult(monstercandyType, userDied, userXpBefore, userXpAfter, userLifepointsBefore, userLifepointsAfter) {

    $('#result-popup').show();

    $("#result-popup").append("<img id='result-popup-xp-icon' src='img/xp_icon.png'><span id='result-popup-user-xp'>" + (parseInt(userXpAfter - userXpBefore) >= 0 ?  "+" + parseInt(userXpAfter - userXpBefore) : parseInt(userXpAfter - userXpBefore)) + "</span><img id='result-popup-lifepoints-icon' src='img/lifepoints_icon.png'><span id='result-popup-user-lifepoints'>" + (parseInt(userLifepointsAfter - userLifepointsBefore) >= 0 ? "+" + parseInt(userLifepointsAfter - userLifepointsBefore) : parseInt(userLifepointsAfter - userLifepointsBefore)) + "</span><div id='result-popup-back-button'><img id='result-popup-back-button-icon' src='img/back_button_icon.png'></div>");

    if (monstercandyType == "MO") {
        if (userDied == false) {
            $("#result-popup").append("<span id='result-popup-victory'>VICTORY</span>");
        } else if (userDied == true) {
            $("#result-popup").append("<span id='result-popup-defeat'>DEFEAT</span>");
        }
    } else if (monstercandyType == "CA") {
        $("#result-popup").append("<span id='result-popup-eaten'>EATEN</span>");
    }

    /*
    if (parseInt(userXpAfter - userXpBefore) >= 0) {
        $("#result-popup-user-xp").html("+" + parseInt(userXpAfter - userXpBefore));
    } else {
        $("#result-popup-user-xp").html(parseInt(userXpAfter - userXpBefore));
    }

    if (parseInt(userLifepointsAfter - userLifepointsBefore) >= 0) {
        $("#result-popup-user-lifepoints").html("+" + parseInt(userLifepointsAfter - userLifepointsBefore));
    } else {
        $("#result-popup-user-lifepoints").html(parseInt(userLifepointsAfter - userLifepointsBefore));
    }
    */

    $("#result-popup-back-button").click(function() {
        console.log("result-popup-back clicked");

        $('#result-popup').empty();
        $('#result-popup').hide();

        getMap();

    });

}

function getMain() {

    $("#map").show();
    $("#main").show();

    $.ajax({
        method: 'post', 
        url:"https://ewserver.di.unimi.it/mobicomp/mostri/getprofile.php",
        data: JSON.stringify({session_id : session_id}),
        dataType: 'json',
            success: function(result) {

                userName = result.username;
                userImage = result.img;
                userXp = result.xp;
                userLifepoints = result.lp;

                $("#main").append("<div id='main-user'><img id='main-user-image' src='" + (userImage != null ? "data:image/png;base64," + userImage : "img/user_default_image.png") + "'><span id='main-user-name'>" + userName + "</span><img id='main-xp-icon' src='img/xp_icon.png'><span id='main-user-xp'>" + userXp + "</span><img id='main-lifepoints-icon' src='img/lifepoints_icon.png'><progress id='main-user-lifepoints' max='100' value='" + userLifepoints + "'></progress></div>");

                $("#main").append("<div id='main-ranking'><img id='main-ranking-icon' src='img/ranking_icon.png'></div>");

                $("#main-user").click(function() {
                    console.log("#main-user clicked");

                    $("#map").hide();

                    $("#main").empty();
                    $("#main").hide();

                    getProfile();
                });
                
                $("#main-ranking").click(function() {
                    console.log("main-ranking clicked");

                    $("#map").hide();

                    $("#main").empty();
                    $("#main").hide();

                    getRanking();
                });

            },
            error: function(error) { 
                console.error(error);
            }
    });
}

function getProfile() {

    $("#profile").show();

    $.ajax({
        method: 'post', 
        url:"https://ewserver.di.unimi.it/mobicomp/mostri/getprofile.php",
        data: JSON.stringify({session_id : session_id}),
        dataType: 'json',
            success: function(result) {

                userName = result.username;
                userImage = result.img;
                userXp = result.xp;
                userLifepoints = result.lp;                
            },
            complete: function() {

                $("#profile").append("<img id='profile-user-image' src='" + (userImage != null ? "data:image/png;base64," + userImage : "img/user_default_image.png") + "'><form><input id='profile-user-name' type='text' placeholder='" + userName + "'></form><img id='profile-modify-icon' src='img/modify_icon.png'><img id='profile-xp-icon' src='img/xp_icon.png'><span id='profile-user-xp'>" + userXp + "</span><img id='profile-lifepoints-icon' src='img/lifepoints_icon.png'><progress id='profile-user-lifepoints' value='" + userLifepoints + "' max='100'></progress><div id='profile-back-button'><img id='profile-back-button-icon' src='img/back_button_icon.png'></div>");

                $("#profile-back-button-icon").click(function() {
                    console.log("profile-back-button clicked");
                    
                    $("#profile").empty();
                    $("#profile").hide();

                    getMain();
                });

                $("#profile-modify-icon").click(function() {
                    console.log("profile-modify-user-name clicked");

                    userName = $("#profile-user-name").val();
                    setUserName(userName);

                });

                $("#profile-user-image").click(function() {
                    console.log("profile-modify-user-image clicked");

                    getImage();

                });

            },
            error: function(error) { 
                console.error(error);
            }
    });

    function setUserName(userName) {
        $.ajax({
            method: 'post', 
            url:"https://ewserver.di.unimi.it/mobicomp/mostri/setprofile.php",
            data: JSON.stringify({session_id : session_id, username : userName}),
            dataType: 'json',
                success: function(result) {
                    console.log(result);        
                },
                complete: function() {
                    alert("userName changed");
                },
                error: function(error) { 
                    console.error(error);
                }
        });
    }

    function setOptions(srcType) {
        var options = {
            quality: 20,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: srcType,
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            allowEdit: true,
            correctOrientation: true  
        };
        return options;
    }
    
    function getImageInBase64(path, callback){
        window.resolveLocalFileSystemURL(path, gotFile, fail);
    
        function fail(e) {
            alert('Cannot found requested file');
        }
    
        function gotFile(fileEntry) {
            fileEntry.file(function(file) {
                var reader = new FileReader();
                reader.onloadend = function(e) {
                    var content = this.result;
                    callback(content);
                };
                reader.readAsDataURL(file);
            });
        }
    }
    
    function getImage() {
        $(".cordova-camera-select").remove();   
    
        var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
        var options = setOptions(srcType);
    
        navigator.camera.getPicture(
            function cameraSuccess(imageUri) {
                console.log("Imaged loaded: " + imageUri);
    
                if (imageUri.substr(0, 5) == 'file:') {
    
                    console.log("Android upload");
    
                    getImageInBase64(imageUri, function (imgBase64) {

                        $("#profile-user-image").attr("src", imgBase64);
                        setUserImage(imgBase64.split(",")[1]);

                    });
    
                } else {
    
                    console.log("Browser upload");
    
                    $("#profile-user-image").attr("src", "data:image/jpeg;base64, " + imageUri);
                    setUserImage(imageUri);
                    
                }
        
            }, function cameraError(error) {
                console.debug("Unable to obtain picture: " + error, "app");
            }, 
        options);
    
    }
    
    function setUserImage(imageUri) {
        $.ajax({
            method: 'post', 
            url:"https://ewserver.di.unimi.it/mobicomp/mostri/setprofile.php",
            data: JSON.stringify({session_id : session_id, img : imageUri}),
            dataType: 'json',
                success: function(result) {
                    console.log(result);        
                },
                complete: function() {
                    alert("userImage changed!")
                },
                error: function(error) { 
                    console.error(error);
                }
        });
    }

}

function getRanking () {

    $("#ranking").show();

    model.depopulateUsers();

    $.ajax({
        method: 'post', 
        url:"https://ewserver.di.unimi.it/mobicomp/mostri/ranking.php",
        data: JSON.stringify({session_id : session_id}),
        dataType: 'json',
            success: function(result) {

                model.populateUsers(result);

            },
            complete: function() {

                $("#ranking").append("<ul id='ranking-list'></ul>");

                for (let i=0; i<model.users.length; i++) {
                    $('#ranking-list').append("<li><div id='ranking-user'><div id='ranking-position'>" + parseInt(i + 1) + "</div><div id='ranking-divider'></div><img id='ranking-user-image' src='" + (model.users[i].image != null ? "data:image/png;base64," + model.users[i].image : "img/user_default_image.png") + "'><span id='ranking-user-name'> " + model.users[i].name + "</span><img id='ranking-xp-icon' src='img/xp_icon.png'><span id='ranking-user-xp'>" + model.users[i].xp + "</span><img id='ranking-lifepoints-icon' src='img/lifepoints_icon.png'><progress id='ranking-user-lifepoints' value='" + model.users[i].lifepoints + "' max='100'></progress></div></li>");
                }

                $("#ranking").append("<div id='ranking-back-button'><img id='ranking-back-button-icon' src='img/back_button_icon.png'></div>");

                $("#ranking-back-button-icon").click(function() {
                    console.log("ranking-back-button clicked");
                    
                    $("#ranking").empty();
                    $("#ranking").hide();

                    getMain();

                });

            },
            error: function(error) { 
                console.error(error);
            }
    });

}




