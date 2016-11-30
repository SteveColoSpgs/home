var ajaxUrl = "scripts/l.json"
//var ajaxUrl = "http://maps.usgs.gov/wis/scripts/l.json"
var data;
function ajax_get(url, cb) {

    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log('responseText:' + xmlhttp.responseText);
            try {
                data = JSON.parse(xmlhttp.responseText);
            } catch(err) {
                console.log(err.message + " in " + xmlhttp.responseText);
                return; //This means that there is a problem with .json file syntax
            }
            cb(data);
        }
    };
    
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function MarkerLib() {
}
// Named-index array of all marker objects, icons, and text content
// index is Dnum, eg  D29, D7456
// marker content loaded as json
var markerLib = new MarkerLib();

// marker made with dnum, latitude, and longitude
// returns marker object
function makeMarker(d,lt,ln) {
    //make Icon 
    var iHtml = '<img src="images/smallRedDot.png"/>' + d;
    var aIcon = L.divIcon({iconSize: [8, 8], iconAnchor: [4,4], className: 'mIcon', html: iHtml});
    
    // make Marker
    var aMarker = L.marker([lt,ln],{icon:aIcon, title: d});
    aMarker.on('click', showMarker)
    return aMarker
}

function paintWait() {
    document.getElementById("wait").style.visibility = "visible";
}

function removeWait() {
    document.getElementById("wait").style.visibility = "hidden";
}

function buildJSONl(d) {
    var str;
    var idxs = new Array();
    //alert(d.features[0].attributes["Formation"]);    // renders "Formation" field correctly
    for (var l=0; l < d.features.length; l++){
        var obj = d.features[l].attributes;            // << pulls out one record used to create marker and related info for Dnum
        var dn = obj.Dnum;
        // - Pull Index_Foss value make into handle and check to see if needed
        var idxFsl = obj["Index_Foss"].split(" ");
        idxFsl = idxFsl[0].substring(0,1) + idxFsl[1]; // If more than one, take the first one only
        idxFsl = idxFsl.toLowerCase();
        
        if (handles.indexOf(idxFsl) > 0) {  // keep the record and add to markers, make display doc, pull formation info, etc.
            markerLib[dn] = obj;   // put marker in the markerLib at index of Dnum
            markerLib[dn].marker = makeMarker(obj.Dnum, obj.Lat_Pub, obj.Long_Pub); // create leaflet marker object
            shoreLib[idxFsl].markers.addLayer(markerLib[dn].marker); // add marker object to marker group for the index fossil
            shoreLib[idxFsl].initInfo = dn; // set the default displayed initial marker info
            shoreLib[idxFsl].rocks += updateRocks(obj.Dnum, obj.State, obj.County, obj.Formation);
        }
    } // end for loop to process markers
} // end function


