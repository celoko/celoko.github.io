// 1000 ms 
var speed = 1000;

// Global timer
var timer;

var test    = 1;
var potions = 0;
var close   = 0;
var empty   = 0;

// Array for all results
var lines = [];

function intoArray(linesTemp){

   // splitting all text data into array "\n" is splitting data from each new line
   //and saving each new line as each element*
   lines = linesTemp.split('\n'); 
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

    // Split line by whitespace and try to get last result
    var result = lines[test].split(/\s+/)[3];

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

    interval = setTimeout(parseLine, speed);
}

function updateStats() {

    document.getElementById("count").innerHTML = test;
    document.getElementById("potions").innerHTML = potions;
    document.getElementById("close").innerHTML = close;
    document.getElementById("empty").innerHTML = empty;
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

function pauseTimer() {
    document.getElementById("pausebutton").disabled = true;
    document.getElementById("startbutton").disabled = false;

    clearTimeout(interval);
}

function startTimer() {
    document.getElementById("startbutton").disabled = true;
    document.getElementById("pausebutton").disabled = false;

    interval = setTimeout(parseLine, speed);
}


function setSpeed() {

    speed = document.getElementById("speedrange").value;
    console.log("Change speed to " + speed);

    document.getElementById("speedtext").innerHTML = "Speed: " + speed + "ms";
}


function setup() {

    // Clear textarea
    document.getElementById("output").value = "";

    getData();

    setSpeed();
}

window.onload = setup();

document.getElementById("startbutton").disabled = true;
document.getElementById("pausebutton").disabled = false;

var interval = setTimeout(parseLine, speed);



