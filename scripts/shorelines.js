// All enabled shorelines by handle
var handles = new Array;
//handles[66]="jnebrascensis";

//handles[65]="hnicolletii";
//handles[64]="hbirkelundae";
handles[63]="bclinolobatus";
handles[62]="bgrandis";
handles[61]="bbaculus";

//handles[60]="beliasi";
handles[59]="bjenseni";
handles[58]="breesidei";
handles[57]="bcuneatus";
handles[56]="bcompressus";
handles[55]="dcheyennense";
//handles[54]="ejennyi";
//handles[53]="dstevensoni";
handles[52]="dnebrascense";
handles[51]="bscotti";

//handles[50]="breduncus";
//handles[49]="bgregoryensis";
handles[48]="bperplexus";
//handles[47]="bspsmooth";
handles[46]="basperiformis";
//handles[45]="bmaclearni";
handles[44]="bobtusus";
//handles[43]="bspweak";
//handles[42]="bspsmooth";

handles[40]="shippocrepis";

//handles[38]="sleei";
handles[37]="dbassleri";
//handles[36]="derdmanni";
handles[35]="cchoteauensis";
handles[34]="cvermiformis";
handles[33]="csaxitonianus";
handles[32]="sdepressus";
handles[31]="sventricosus";

//handles[30]="spreventricosus";
//handles[29]="smariasensis";
handles[28]="pgermari";
//handles[27]="snigricollensis";
handles[26]="swhitfieldi";
handles[24]="swarreni";
//handles[23]="pmacombi";
handles[22]="phyatti";
//handles[21]="cpraecox";

handles[20]="cwoollgari";
//handles[19]="mnodosoides";
handles[18]="vbirchbyi";
//handles[17]="pflexuosum";
//handles[16]="wdevonense";
//handles[15]="nscotti";
handles[14]="njuddii";
//handles[13]="bclydense";
//handles[12]="esptemseriatum";
//handles[11]="vdiartianum";

handles[10]="dconditum";
handles[9]="dalbertense";
//handles[8]="dproblematicum";
handles[7]="dpondi";
handles[6]="pwyomingense";
handles[5]="aamphibolum";
//handles[4]="abellense";
handles[3]="amuldoonense";
//handles[2]="agranerosense";
//handles[1]="ctarrantense";

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
        }       
        currentLine = f;  // the selected line becomes current
        lineList.push(currentLine);  // put the currentline on the line list
        shoreLib[currentLine].shoreline.addTo(map);  // put the currentline on the map
        shoreLib[currentLine].shoreline.setStyle({color:"#000000"});  // highlight the current line
        shoreLib[currentLine].markers.addTo(map);  // add markers for the index fossil
        document.getElementById("localityInfo").innerHTML = renderInfo(shoreLib[currentLine].initInfo); // prime the localityInfo
        document.getElementById("lithoArea").innerHTML = shoreLib[currentLine].gallery + shoreLib[currentLine].rocksTable();
        document.getElementById(currentLine + "Cell").style = "background-color: #AAAAAA";
    }
    else {
        if (f == currentLine) {                  // turn off currentline
            map.removeLayer(shoreLib[f].markers)
            document.getElementById("localityInfo").innerHTML = "";
            document.getElementById("lithoArea").innerHTML = "";
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
        return;  // currentLine is active, so do nothing
    }
    else  // line is not currentLine
    {
        if (currentLine != '') {  // disable the currentLine markers and lighten the line and cell
            map.removeLayer(shoreLib[currentLine].markers);
            shoreLib[currentLine].shoreline.setStyle({color:"#4682B4"});
            document.getElementById(currentLine + "Cell").style = "background-color: #D4E4F3"
        }
    } 
        // make currentLine h and highlight
    currentLine = h;
    shoreLib[currentLine].shoreline.setStyle({color:"#000000"});  // highlight the current line
    document.getElementById(currentLine + "Cell").style = "background-color: #AAAAAA";  // highlight the cell to match
    shoreLib[currentLine].markers.addTo(map);  // add markers for the index fossil
    document.getElementById("localityInfo").innerHTML = renderInfo(shoreLib[currentLine].initInfo);  // load the default locality info
    document.getElementById("lithoArea").innerHTML = shoreLib[currentLine].rocksTable();  // load the resume of rocks for the shoreline
}

function photoClick(h) {
    document.getElementById("gallery").innerHTML = shoreLib[h].gallery;
    document.getElementById(h + "Imgs").click();
}


function showMarker(e) {  // event comes in
    var d = e.target.options.title  // pull out the title which is the Dnum
    document.getElementById("localityInfo").innerHTML = renderInfo(d);
}

// render field notes, relevant data of locality and what was collected
function renderInfo(d) {
    var iStr = '<table border=1 style="font-family:Arial,Verdana,Times;font-size:10px;text-align:left;width:100%;border-spacing:0px;padding:3px">';
    iStr += '<tbody style="background-color:white"><tr bgcolor="#D4E4F3">';
    iStr += '<td style="width:50%">Denver Mesozoic Locality</td><td>' + markerLib[d].Dnum + '</td></tr>';
    iStr += '<tr><td>Index Fossil</td><td>' + markerLib[d].Index_Foss + '</td></tr>';
    iStr += '<tr bgcolor="#D4E4F3"><td valign="top">Resume of Fauna</td><td>' + markerLib[d].Resume_of_ + '</td></tr>';
    iStr += '<tr><td>County</td><td>' + markerLib[d].County + '</td></tr>';
    iStr += '<tr bgcolor="#D4E4F3"><td>State</td><td>' + markerLib[d].State + '</td></tr>';
    iStr += '<tr><td>Formation</td><td>' + markerLib[d].Formation + '</td></tr>';
    iStr += '<tr bgcolor="#D4E4F3"><td>Member</td><td>' + markerLib[d].Member + '</td></tr>';
    iStr += '<tr><td>Age</td><td>' + markerLib[d].Age + '</td></tr>';
    iStr += '<tr bgcolor="#D4E4F3"><td>Stage</td><td>' + markerLib[d].Stage + '</td></tr>';
    iStr += '<tr><td>Age Date</td><td>' + markerLib[d].Age_Date_M + '</td></tr>';
    iStr += '<tr bgcolor="#D4E4F3"><td>Collector</td><td>' + markerLib[d].Collector + '</td></tr>';
    iStr += '<tr><td>Date collected</td><td>' + markerLib[d].Date + '</td></tr>';
    iStr += '<tr bgcolor="#D4E4F3"><td>Reference</td><td>' + markerLib[d].Reference + '</td></tr></tbody></table>';
    return iStr;
}