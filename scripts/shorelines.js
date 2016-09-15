var currentLine = ''; // handle of currently selected line
var lineList = [];    // list of displayed shoreline handles
var markersOn = '';   // markers displayed for currentLine

var infoStr = "Hints:<br/><br/>Click on the map icon <img src='images/map-icon.png' height='20px'>";
infoStr += "next to an index fossil name to see the shoreline for that fossil and time. ";
infoStr += "You can open more than one shoreline at one time to see how the Western Interior Seaway ";
infoStr += "grew (transgression) and shrank (regression) over its life time.<br/><br/>";
infoStr += "The active shoreline also shows the localities from which fossils were collected. <br/>";
infoStr += "Click on a location marker <img src='images/marker.jpg' height='30px'> to see information about fossils collected."

var lithoStr = "Hints:<br/><br/>Click on the camera icon <img src='images/camera-flat.png' height='20px'> ";
lithoStr += "to see pictures of specimens."

// iconClick call comes from chron table; expects true or false return
// enable/disable line display

function iconClick(f){              // f is the fossil for the icon in the chron table
    var lStr = '';
    if (lineList.indexOf(f) < 0) {    // Prepare and turn on the shoreline
        if (currentLine != '') {      // There's already a currentLine: turn off markers and lighten the line
            map.removeLayer(shoreLib[currentLine].markers);
            shoreLib[currentLine].shoreline.setStyle({color:"#4682B4"});
            document.getElementById(currentLine + "Cell").style = "background-color: #D4E4F3";
//            document.getElementById(currentLine + "Photos").style = "visibility: hidden";
        }       
        currentLine = f;  // the selected line becomes current
        lineList.push(currentLine);  // put the currentline on the line list
        shoreLib[currentLine].shoreline.addTo(map);  // put the currentline on the map
        shoreLib[currentLine].shoreline.setStyle({color:"#000000"});  // highlight the current line
        shoreLib[currentLine].markers.addTo(map);  // add markers for the index fossil
        document.getElementById("localityInfo").innerHTML = renderInfo(shoreLib[currentLine].initInfo); // prime the localityInfo
        document.getElementById("lithoArea").innerHTML = shoreLib[currentLine].gallery + shoreLib[currentLine].rocks;
//        if (shoreLib[currentLine].gallery != '') {
//            document.getElementById(currentLine + "Photos").style = "visibility: visible";
//        }
        document.getElementById(currentLine + "Cell").style = "background-color: #AAAAAA";
    }
    else {
        if (f == currentLine) {                  // turn off currentline
            map.removeLayer(shoreLib[f].markers)
            document.getElementById("localityInfo").innerHTML = "";
            document.getElementById("lithoArea").innerHTML = "";
//            document.getElementById(currentLine + "Photos").style = "visibility: hidden";
            currentLine = '';
        }                                        // turn off line and clean up
        map.removeLayer(shoreLib[f].shoreline);
        document.getElementById(f + "Cell").style = "background-color: #FFFFFF";
        lineList.splice(lineList.indexOf(f),1);    // remove the selected handle from the list of displayed lines
        if (lineList.length < 1) {
            document.getElementById("localityInfo").innerHTML = infoStr;
            document.getElementById("lithoArea").innerHTML = lithoStr;
        }
    }
}

function lineClick(h){                       // click line displayed on map, h is the handle for the fossil
    if (h == currentLine) {
        return;
    }
    else
    {
        map.removeLayer(shoreLib[currentLine].markers);
        shoreLib[currentLine].shoreline.setStyle({color:"#4682B4"});
//        document.getElementById(currentLine + "Photos").style = "visibility: hidden";
        document.getElementById(currentLine + "Cell").style = "background-color: #D4E4F3"
    }
    currentLine = h;
    shoreLib[currentLine].shoreline.setStyle({color:"#000000"});  // highlight the current line
    document.getElementById(currentLine + "Cell").style = "background-color: #AAAAAA";
    shoreLib[currentLine].markers.addTo(map);  // add markers for the index fossil
    document.getElementById("localityInfo").innerHTML = renderInfo(shoreLib[currentLine].initInfo);
    
    // load the gallery markup.
    document.getElementById("lithoArea").innerHTML = shoreLib[currentLine].gallery + shoreLib[currentLine].rocks;
//    if (shoreLib[currentLine].gallery != '') {
//        document.getElementById(currentLine + "Photos").style = "visibility: visible";
//    }
}

function photoClick(h) {
    document.getElementById("gallery").innerHTML = shoreLib[h].gallery;
    document.getElementById(h+"Imgs").click();
}

function MarkerLib() {
}
// Named-index array of all marker objects, icons, and text content
// index is Dnum, eg  D29, D7456
// values loaded in separate .js file
// marker content loaded as json
var markerLib = new MarkerLib();

function makeMarker(d,lt,ln) {
    //make Icon 
    var iHtml = '<img src="images/smallRedDot.png"/>' + d;
    var aIcon = L.divIcon({iconSize: [8, 8], iconAnchor: [4,4], className: 'mIcon', html: iHtml});
    
    // make Marker
    var aMarker = L.marker([lt,ln],{icon:aIcon, title: d});
    aMarker.on('click', showMarker)
    return aMarker
}

function showMarker(e) {  // event comes in
    var d = e.target.options.title  // pull out the title which is the Dnum
    document.getElementById("localityInfo").innerHTML = renderInfo(d);
}

function renderInfo(d) {
    var iStr = '<table border=1 style="font-family:Arial,Verdana,Times;font-size:10px;text-align:left;width:100%;border-spacing:0px;padding:3px">';
    iStr += '<tbody style="background-color:white"><tr bgcolor="#D4E4F3">';
    iStr += '<td style="width:50%">Denver Mesozoic Locality</td><td>' + markerLib[d].Dnum + '</td></tr>';
    iStr += '<tr><td>Index Fossil</td><td>' + markerLib[d].Ifossil + '</td></tr>';
    iStr += '<tr bgcolor="#D4E4F3"><td valign="top">Resume of Fauna</td><td>' + markerLib[d].resume + '</td></tr>';
    iStr += '<tr><td>County</td><td>' + markerLib[d].county + '</td></tr>';
    iStr += '<tr bgcolor="#D4E4F3"><td>State</td><td>' + markerLib[d].state + '</td></tr>';
    iStr += '<tr><td>Formation</td><td>' + markerLib[d].formation + '</td></tr>';
    iStr += '<tr bgcolor="#D4E4F3"><td>Member</td><td>' + markerLib[d].member + '</td></tr>';
    iStr += '<tr><td>Age</td><td>' + markerLib[d].age + '</td></tr>';
    iStr += '<tr bgcolor="#D4E4F3"><td>Stage</td><td>' + markerLib[d].stage + '</td></tr>';
    iStr += '<tr><td>Age Date</td><td>' + markerLib[d].ageDate + '</td></tr>';
    iStr += '<tr bgcolor="#D4E4F3"><td>Collector</td><td>' + markerLib[d].collector + '</td></tr>';
    iStr += '<tr><td>Date collected</td><td>' + markerLib[d].date + '</td></tr>';
    iStr += '<tr bgcolor="#D4E4F3"><td>Reference</td><td>' + markerLib[d].reference + '</td></tr></tbody></table>';
    return iStr;
}

function RocksFormation() {
    this.dnum = '';   // dnum string
    this.formation = '';  //formation string
}

function RocksCounty() {
    this.name = '';
    this.formations = []; //array of rocksformation
}

function RocksState() {
    this.name = '';
    this.counties = []; //array of rocksCounty
}

function RocksFossil() {
    this.name = ''; //handle
    this.states = []; //array of rocksState
}

var allRocks = ''; // string for simple table of rocks
function updateRocks(d) {
    allRocks += "<tr><td>" + markerLib[d].Dnum + "</td>";
    allRocks += "<td>" + markerLib[d].state + "</td>";
    allRocks += "<td>" + markerLib[d].county + "</td>";
    allRocks += "<td>" + markerLib[d].formation + "</td></tr>";
}