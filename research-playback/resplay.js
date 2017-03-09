// 300 ms 
var speed = 300;
var paused = false;

// Global timer
var timer;

var test    = 1;
var potions = 0;
var close   = 0;
var empty   = 0;

var count   = 0;

// Array for all results
var lines = [];

// 3d array for data
// db[m][o][h]

var db = new Array(54);
for (var i = 0; i < 54; i++) {
    db[i] = new Array(23);
    for (var j = 0; j < 23; j++) {
        db[i][j] = new Array(29);
        for (var k = 0; k < 29; k++) {
            db[i][j][k] = ' ';  
        }
    }
}

// Took arrays from Ggrs alchtool
// http://tnsp.org/~ccr/bat/alchtool/
var  minerals = [
    "adamantium",   "aluminium",    "anipium",      "batium",   "brass",        "bronze",
    "cesium",       "chromium",     "cobalt",       "copper",   "darksteel",    "diggalite",
    "dukonium",     "duraluminium", "durandium",    "electrum", "gold",
    "graphite",     "hematite",     "highsteel",    "illumium", "indium",       "iridium",
    "iron",         "kryptonite",   "lead",         "magnesium", "mithril",     "molybdenum",
    "mowgles",      "mowglite",     "nickel",       "nullium",  "osmium",       "palladium",
    "pewter",       "platinum",     "potassium",    "pyrite",   "quicksilver", "rhodium",
    "silicon",      "silver",       "starmetal",    "steel",    "tadmium",      "tin", "titanium",
    "tormium",      "tungsten",     "uranium",      "vanadium", "zhentorium", "zinc"
];

var organs = [
    "antenna", "arm", "beak", "bladder", "brain", "ear", "eye", "foot",
    "gill", "heart", "horn", "kidney", "leg", "liver", "lung", "nose",
    "paw", "snout", "spleen", "stomach", "tail", "tendril", "wing"
];  

var herbs = [
    [ "apple",       "wormwood" ],       [ "barberry",    "yarrow" ],
    [ "blueberry",   "wolfbane" ],       [ "burdock",     "chickweed" ],
    [ "cabbage",     "arnica" ],         [ "carrot",      "thistle" ],
    [ "cauliflower", "costmary" ],       [ "chicory",     "borage" ],
    [ "cotton",      "mysticspinach" ],  [ "crystalline", "jaslah" ],
    [ "elder",       "honeysuckle" ],    [ "foxglove",    "holly" ],
    [ "garlic",      "nightshade" ],     [ "ginseng",     "mistletoe" ],
    [ "hemlock",     "tomato" ],         [ "henbane",     "jimsonweed" ],
    [ "lettuce",     "water_lily" ],     [ "lobelia",     "comfrey" ],
    [ "mushroom",    "mangrel" ],        [ "onion",       "moss" ],
    [ "pear",        "boneset" ],        [ "plum",        "sweetflag" ],
    [ "potato",      "mandrake" ],       [ "raspberry",   "bloodroot" ],
    [ "rhubarb",     "soapwort" ],       [ "spinach",     "hcliz" ],
    [ "strawberry",  "mugwort" ],        [ "turnip",      "mysticcarrot" ],
    [ "vine_seed",   "lungwort"]
];

function addResult( min, org, herb, result) {

    // Get indexes for ingredients
    var mi = minerals.indexOf(min);
    var oi = organs.indexOf(org);
    var hi = 0;

    // Herb has 2d array
    for (var x = 0;x < herbs.length;x++) {
        if (herbs[x][0] == herb || herbs[x][1] == herb ) {
            hi = x;
        };
    }

    //console.log("vars: " + min + " : " + org + ": " + herb + ": " + result);
    //console.log("add: " + mi + " : " + oi + ": " + hi);

    // If no result, fill mineral and herb with -
    if (result == "-") {
        for (var j = 0;j < minerals.length; j++) {
            db[j][oi][hi] = "-";
        }

        for (var i = 0;j < herbs.length; i++) {
            db[mi][oi][i] = "-";
        }
    }

    db[mi][oi][hi] = result;

    //console.log("db: " + db[mi][oi][hi]);

}

// Calculate empty cells in array
function getCount() {

    var count = 0;

    for (var i = 0; i < 54; i++) {
        for (var j = 0; j < 23; j++) {
            for (var k = 0; k < 29; k++) {
                if (db[i][j][k] != " ") {
                    count++;
                }  
            }
        }
    }
   
    return count;
}


function intoArray(linesTemp){

    function notEmpty(value) {
        if (value !== "") {
            return value;
        }
    }

    // Split lines into array and remove empty lines
    lines = linesTemp.split('\n').filter(notEmpty);
}   

function getData(){       //this will read file and send information to other function

       var xmlhttp;
       if(window.XMLHttpRequest){
           xmlhttp = new XMLHttpRequest();
       } else {
           xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
       }

       xmlhttp.onreadystatechange = function(){
           if(xmlhttp.readyState == 4){
             var linesTemp = xmlhttp.responseText;    //here we get all lines from text file*
             intoArray(linesTemp);
           }
       }
         xmlhttp.open("GET", "results.txt", true);
         xmlhttp.send();
}

var parseLine = function() {

    // Stop execution when we run out of lines
    if (test >= lines.length - 1) {
        document.getElementById("info").innerHTML = "Donezo!";
        stopTimer();
        return;
    }

    // Split line by whitespace and try to get last result
    var [min, org, her, result] = lines[test].split(/\s+/);

    addResult(min, org, her, result);

    var info = "";

    // Empty result
    if (result == "-") {
        empty++;
    } else if (result.charAt(0) == "!") {
        potions++;
        // potion name without first char, !
        info = "Found potion: " + result.substr(1);
    } else if (result.charAt(0) == "?") {
        close++;
        if (result.length > 1) {
            info = "Close: " + result.substr(1);
        }
    }
    updateStats();
    addLine(info);
}

function updateStats() {

    document.getElementById("count").innerHTML = test;
    document.getElementById("potions").innerHTML = potions;
    document.getElementById("close").innerHTML = close;
    document.getElementById("empty").innerHTML = empty;

    document.getElementById("combos").innerHTML = getCount();        

}

function addLine(info) {

    var area = document.getElementById("output");
    area.value += lines[test] + "\n";

    // Scroll textarea to bottom
    area.scrollTop = area.scrollHeight;
    test++;

    if (info) {
        document.getElementById("info").innerHTML = info;
    }
}

function togglePause() {

    var button = document.getElementById("pausebutton");

    if (!paused) {
        // Stop timer and change button text
        button.innerText = "Continue";
        stopTimer();
        paused = true;
    } else {
        // Start timer and change button text
        button.innerText = "Pause";
        startTimer(speed);
        paused = false;
    }
}

function setSpeed(nspeed) {

    if (nspeed == null) {
        speed = document.getElementById("speedrange").value;
    } else {
        speed = nspeed;
        document.getElementById("speedrange").value = speed;
    }
    console.log("Change speed to " + speed);

    var output = speed + "ms";

    // Show seconds if speed is over 1000 ms
    if (speed > 1000) {
        output = speed / 1000 + "s";
    }

    stopTimer();
    startTimer(speed);

    document.getElementById("speedtext").innerHTML = "Delay: " + output;
}

function startTimer(speed) {
    timer = setInterval(parseLine, speed);
}

function stopTimer() {
    clearInterval(timer);
}

function setup() {

    // Clear textarea
    document.getElementById("output").value = "";

    getData();

    setSpeed(speed);
}

window.onload = setup();