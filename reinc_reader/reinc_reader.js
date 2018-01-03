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

function count(arr) {
    return arr.reduce((prev, curr) => (prev[curr] = ++prev[curr] || 1, prev), {})
  }

function parseFile(file) {
    var reader = new FileReader();
    var result;

    var cGuilds = [];

    reader.onload = function(event){
        
        result = JSON.parse(event.target.result);

        //console.dir(result);

        for (reinc in result) {
            printSome(result[reinc]);

            for (guild in result[reinc].guilds) {
                    cGuilds.push(guild);
                
            }
            
        }
        console.dir(count(cGuilds));



    };
    reader.readAsText(file);


    //output.value = result;
}

/*
Most popular reinc combo
most popular guild -bgs -societys
most popular bg
most reinc day, month, year

longest reinc
shortest reinc

most exp made
least exp made
*/

function printSome(obj) {
    // create a new div element 
    var newDiv = document.createElement("div"); 
    // and give it some content 
    newDiv.innerHTML = obj.weekDay + " " + obj.day + " " + obj.month + " " + obj.year;
    newDiv.innerHTML += " " + obj.hour + ":" + obj.minute + ":" + obj.second + "<br>";
    newDiv.innerHTML += obj.level + " " + obj.race + " " + obj.exp + obj.ext + "<br>";
    newDiv.innerHTML += "Duration: " + obj.dyears + " years, " + obj.ddays + " days, ";
    newDiv.innerHTML += obj.dhours + " hours, " + obj.dmins + " minutes" + obj.dsecs + " seconds.<br>";

    for (guild in obj.guilds) {
        //console.log(guild + " " + obj.guilds[guild]);
        newDiv.innerHTML += guild + " " + obj.guilds[guild] + " ";
    }

    // add the newly created element and its content into the DOM 
    var currentDiv = document.getElementById("output"); 
    document.body.insertBefore(newDiv, currentDiv);

}