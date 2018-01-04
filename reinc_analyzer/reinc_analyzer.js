var input = document.querySelector('input');

input.addEventListener('change', loadFile);

function loadFile() {
    var curFiles = input.files;

    if (curFiles.length === 0) {
        console.log("No file selected.");
    } else {
        console.log(curFiles[0].name + " loaded.");
        parseFile(curFiles[0]);
    }
}

function parseFile(file) {
    var reader = new FileReader();

    reader.onload = function(event){
        
        var result = JSON.parse(event.target.result);
        processData(result);
    };
    reader.readAsText(file);
}

function processData(result){
    var popularGuilds = mostPopularGuild(result);
    var popularWeekday = mostPopularWeekday(result);

    addListNameCount("Most popular guilds", popularGuilds);
    addListNameCount("Most popular weekday", popularWeekday);
};

function readLocalData(){       //this will read file and send information to other function

    var xmlhttp;
    if(window.XMLHttpRequest){
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function(){
        if(xmlhttp.readyState == 4){
            var result = JSON.parse(xmlhttp.responseText);
            processData(result);
        }
    }
      xmlhttp.open("GET", "bat_reinc_data_1.json", true);
      xmlhttp.send();
}

/*
Most popular reinc combo
most popular guild -bgs -societys
most popular bg
most reinc day, month, year
reincs per month


longest reinc
shortest reinc

most exp made
least exp made
*/

// When given title and array of objects {"name": name, "count": count}
// Adds new list to site
function addListNameCount(title, arr) {

    var newDiv = document.createElement("div");
    var newUl = document.createElement("ul");
    newUl.style.listStyle = "None";

    newDiv.innerHTML = "<H2>" + title + "</H2>";
    
    for (var a in arr) {
        var newLi = document.createElement("li");
        newLi.innerHTML += arr[a].count + " " + arr[a].name;
        newUl.appendChild(newLi);
    }

    // add the newly created element and its content into the DOM 
    var currentDiv = document.getElementById("output"); 

    newDiv.appendChild(newUl);
    currentDiv.appendChild(newDiv);

}

function mostPopularGuild(obj) {

    var o = {};

    // Count occurances
    for (var item in obj) {
        for (var i of obj[item].guilds) {
            if (typeof o[i.name] == 'undefined') { 
                o[i.name] = 1;
            } else {
                o[i.name] += 1;
            }
        }
    }

    // get keys and indexes and sort by key
    var keysSorted = Object.keys(o).sort(function(a,b){
        return o[b]-o[a];
    });

    //console.log(keysSorted);

    var popGuilds = [];

    // Iterate keys and add to array
    for (var x=0;x<keysSorted.length;x++) {
        var t = {"name": keysSorted[x], "count": o[keysSorted[x]]};
        popGuilds[x] = t;
    }

    //console.log(keysSorted);
    //console.dir(popGuilds);
    return popGuilds;
}

function mostPopularWeekday(obj) {
    var o = {};

    // Count occurances
    for (var item in obj) {
        if (typeof o[obj[item].weekDay] == 'undefined') { 
            o[obj[item].weekDay] = 1;
        } else {
            o[obj[item].weekDay] += 1;
        }
    }

    // get keys and indexes and sort by key
    var keysSorted = Object.keys(o).sort(function(a,b){
        return o[b]-o[a];
    });

    //console.log(keysSorted);

    var popWeekday = [];

    // Iterate keys and add to array
    for (var x=0;x<keysSorted.length;x++) {
        var t = {"name": keysSorted[x], "count": o[keysSorted[x]]};
        popWeekday[x] = t;
    }

    //console.log(keysSorted);
    //console.dir(popWeekday);
    return popWeekday;    

}


function printSome(obj) {
    // create a new div element 
    var newDiv = document.createElement("div"); 
    // and give it some content 
    newDiv.innerHTML = obj.weekDay + " " + obj.day + " " + obj.month + " " + obj.year;
    newDiv.innerHTML += " " + obj.hour + ":" + obj.minute + ":" + obj.second + "<br>";
    newDiv.innerHTML += obj.level + " " + obj.race + " " + obj.exp + obj.ext + "<br>";
    newDiv.innerHTML += "Duration: " + obj.dyears + " years, " + obj.ddays + " days, ";
    newDiv.innerHTML += obj.dhours + " hours, " + obj.dmins + " minutes" + obj.dsecs + " seconds.<br>";

    for (var guild of obj.guilds) {
        //console.log(guild + " " + obj.guilds[guild]);
        newDiv.innerHTML += guild.name + " " + guild.level + " ";
    }

    // add the newly created element and its content into the DOM 
    var currentDiv = document.getElementById("output"); 
    document.body.insertBefore(newDiv, currentDiv);

}