
//                       _                               
//    ___ _ __ ___  __ _| |_ ___   _ __ ___   __ _ _ __  
//   / __| '__/ _ \/ _` | __/ _ \ | '_ ` _ \ / _` | '_ \ 
//  | (__| | |  __/ (_| | ||  __/ | | | | | | (_| | |_) |
//   \___|_|  \___|\__,_|\__\___| |_| |_| |_|\__,_| .__/ 
//                                                |_|    
//
var chalmers_map = L.map('mapid').setView([43.6492, -79.3995], 17);
L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '<a href="https://chalmerscards.com">Chalmers Map</a> + &copy; <a href="https://stadiamaps.com/">Stadia  Maps</a>, &copy; <a href="https://openmaptiles.org/ ">OpenMapTiles</a> &copy; <a href="http://  openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(chalmers_map);
// sets default map view to above st felix augusta
chalmers_map.setView([43.6492, -79.3995], 14);

//               _ _    __                     
//   _ __  _   _| | |  / _|_ __ ___  _ __ ___  
//  | '_ \| | | | | | | |_| '__/ _ \| '_ ` _ \ 
//  | |_) | |_| | | | |  _| | | (_) | | | | | |
//  | .__/ \__,_|_|_| |_| |_|  \___/|_| |_| |_|
//  |_|                                        
//    __ _          _                    
//   / _(_)_ __ ___| |__   __ _ ___  ___ 
//  | |_| | '__/ _ \ '_ \ / _` / __|/ _ \
//  |  _| | | |  __/ |_) | (_| \__ \  __/
//  |_| |_|_|  \___|_.__/ \__,_|___/\___|
//
function GetData(url) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, false);
    xmlhttp.send(null);
    return xmlhttp.responseText;
}
var shelters_json, shelter_names, current_shelter_info, current_shelter_name, current_shelter_occupancy, current_shelter_capacity, current_circle_color;
function pull_data_from_firebase() {
    //Get Firebase Data
    shelters_json = JSON.parse(GetData("https://chalmers-signal.firebaseio.com/Shelters.json"));
    shelter_names = Object.keys(shelters_json);
}
var occupacy, capacity;
function pull_shelter_info(shelter_names, shelters_json, i) {
    current_shelter_name = shelter_names[i];
    current_shelter_info = shelters_json[current_shelter_name];
    occupacy = current_shelter_info.Service_Status.Firecode_Space.Firecode_Occupancy;
    capacity = current_shelter_info.Service_Status.Firecode_Space.Firecode_Capacity;
}

//    ___ _ __ ___  __ _| |_ ___ 
//   / __| '__/ _ \/ _` | __/ _ \
//  | (__| | |  __/ (_| | ||  __/
//   \___|_|  \___|\__,_|\__\___|
//       _          _ _            
//   ___| |__   ___| | |_ ___ _ __ 
//  / __| '_ \ / _ \ | __/ _ \ '__|
//  \__ \ | | |  __/ | ||  __/ |   
//  |___/_| |_|\___|_|\__\___|_|   
//        _          _           
//    ___(_)_ __ ___| | ___  ___ 
//   / __| | '__/ __| |/ _ \/ __|
//  | (__| | | | (__| |  __/\__ \
//   \___|_|_|  \___|_|\___||___/
//     
var shelter_circles = [];

//        _          _            _         _      
//    ___(_)_ __ ___| | ___   ___| |_ _   _| | ___ 
//   / __| | '__/ __| |/ _ \ / __| __| | | | |/ _ \
//  | (__| | | | (__| |  __/ \__ \ |_| |_| | |  __/
//   \___|_|_|  \___|_|\___| |___/\__|\__, |_|\___|
//                                    |___/        

//
// colors the shelter_circles based on how full shelters are
//
var set_circle_color = function (occupacy, capacity) {
    var red = scale(occupacy, 0, capacity, 0, 255);
    var green = scale(occupacy, 0, capacity, 255, 0);
    return "rgb(" + red + "," + green + "," + 0 + ")";
}

//
// function for sizing circles as map is zoomed in/out
//
var radius_min, radius_max;
const scale = (num, in_min, in_max, out_min, out_max) => {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
function set_circle_radius(circle_radius) {
    var current_zoom = chalmers_map.getZoom();
    circle_radius = current_zoom*2;
    return circle_radius;
}

//        _          _                                      
//    ___(_)_ __ ___| | ___   _ __   ___  _ __  _   _ _ __  
//   / __| | '__/ __| |/ _ \ | '_ \ / _ \| '_ \| | | | '_ \ 
//  | (__| | | | (__| |  __/ | |_) | (_) | |_) | |_| | |_) |
//   \___|_|_|  \___|_|\___| | .__/ \___/| .__/ \__,_| .__/ 
//                           |_|         |_|         |_|    
//

//
// creates string of populations served 
// for shelter info popup
//
function display_populations_served(client_properties) {
    populations_served_string = "";
    for (var key of Object.keys(client_properties)) {
        if (client_properties[key]) {
            populations_served_string = populations_served_string + key;
        }
        populations_served_string = populations_served_string + " ";
    }
    return populations_served_string;
}

//
// Attaches Shelter info popup to Circles
// And styles the popup
//
function bindPopup(current_shelter_circle) {
    current_shelter_circle.bindPopup(
        "<h3>" +
        current_shelter_info.Shelter_Contact.friendly_name +
        "</h3>" +
        "<h4>Occupancy</h4>"
        + "<p>" + current_shelter_occupancy + "    " + "/" + "    " + current_shelter_capacity + "</p>" +
        "<h4>Phone Number</h4>" +
        "<p>" + current_shelter_info.Shelter_Contact.phone_number + "</p>" +
        "<h4>Populations Served</h4>" +
        "<p>" + display_populations_served(current_shelter_info.Client_Properties) + "</p>"
    );
}

//                       _              _          _      
//    ___ _ __ ___  __ _| |_ ___    ___(_)_ __ ___| | ___ 
//   / __| '__/ _ \/ _` | __/ _ \  / __| | '__/ __| |/ _ \
//  | (__| | |  __/ (_| | ||  __/ | (__| | | | (__| |  __/
//   \___|_|  \___|\__,_|\__\___|  \___|_|_|  \___|_|\___|
//                                                               
var current_shelter_circle,
    current_shelter_map_coordinates,
    current_circle_options;
function draw_shelter_circle(current_shelter_map_coordinates, current_circle_options, current_shelter_circle) {
    //
    // set circle location
    //
    current_shelter_map_coordinates =
        [
            current_shelter_info.Shelter_Properties.latitude, current_shelter_info.Shelter_Properties.longitude
        ];

    //
    // set circle style
    //
    current_circle_options = {
        color: set_circle_color(occupacy, capacity),
        fillColor: set_circle_color(occupacy, capacity),
        fillOpacity: 0.5,
        radius: 80
    };


    //
    // instatiate circle as Leaflet circle
    //
    current_shelter_circle = L.circle(
        current_shelter_map_coordinates,
        current_circle_options
    ).addTo(chalmers_map);
    set_circle_radius(current_shelter_circle);
    //
    // bind popup to circle
    //
    bindPopup(current_shelter_circle);

    //
    // add circle to list of all circles
    //
    shelter_circles.push(current_shelter_circle);
}

//                   _       _              _          _      
//   _   _ _ __   __| | __ _| |_ ___    ___(_)_ __ ___| | ___ 
//  | | | | '_ \ / _` |/ _` | __/ _ \  / __| | '__/ __| |/ _ \
//  | |_| | |_) | (_| | (_| | ||  __/ | (__| | | | (__| |  __/
//   \__,_| .__/ \__,_|\__,_|\__\___|  \___|_|_|  \___|_|\___|
//        |_|                                                 
//
function update_shelter_circle(i) {
    current_shelter_circle = shelter_circles[i];
    
    console.log();
    console.log(shelter_names[i]);
    console.log(current_shelter_circle);
    console.log("CURRENT CIRCLE RADIUS: " + current_shelter_circle.radius);

    current_shelter_circle.radius = set_circle_radius(current_shelter_circle.radius);
    current_shelter_circle.setStyle(current_circle_options);
    //Bind That Cirlce to PopUp
    bindPopup(current_shelter_circle);
}

//   _       _                             _       
//  (_)_ __ | |_ ___ _ __ _ __ _   _ _ __ | |_ ___ 
//  | | '_ \| __/ _ \ '__| '__| | | | '_ \| __/ __|
//  | | | | | ||  __/ |  | |  | |_| | |_) | |_\__ \
//  |_|_| |_|\__\___|_|  |_|   \__,_| .__/ \__|___/
//                                  |_|            
var map_zoomend = false;
chalmers_map.on('zoomend', function () {
    map_zoomend = true;
});

//       _                      _                   
//    __| |_ __ __ ___      __ | | ___   ___  _ __  
//   / _` | '__/ _` \ \ /\ / / | |/ _ \ / _ \| '_ \ 
//  | (_| | | | (_| |\ V  V /  | | (_) | (_) | |_) |
//   \__,_|_|  \__,_| \_/\_/   |_|\___/ \___/| .__/ 
//                                           |_|    
//

// the create_shelters variable is a boolean which tells us 
// if shelters need to be created for the first time, 
// or if they can just be updated
function render_shelters(create_shelters) {
    pull_data_from_firebase();
    // Get List of Shelters Names and create a circle for each one
    // Attach details to each Shelter-Name-with-circle
    for (var i = 0; i < shelter_names.length; i++) {        
        // Parse a Shelter's Information
        pull_shelter_info(shelter_names, shelters_json, i);

        // TODO: Check if new shelters have come online since site loaded
        // if true destroy all shelter_circles and recreate all of them 
        // to update the shelter_circles array
        /*
            if (firebase_data.shelter_names[] > local_data.shelter_names[])
            {
                create_shelters == true
            }
        */

        // Update the Circles. Else, create all the circles
        if (create_shelters == false){
            update_shelter_circle(i);
        } else {
            draw_shelter_circle(current_shelter_map_coordinates, current_circle_options, current_shelter_circle);
        }
        // update shelter circles
        if (map_zoomend == true) {
            update_shelter_circle(i);
            console.log("updating shelters");
            map_zoomend = false;
        }
    }    
}


//                   _         _                   
//   _ __ ___   __ _(_)_ __   | | ___   ___  _ __  
//  | '_ ` _ \ / _` | | '_ \  | |/ _ \ / _ \| '_ \ 
//  | | | | | | (_| | | | | | | | (_) | (_) | |_) |
//  |_| |_| |_|\__,_|_|_| |_| |_|\___/ \___/| .__/ 
//                                          |_|    
// pull_data_from_firebase();
render_shelters(true); //instatiate the shelters
var interval = setInterval(function () { render_shelters(false); }, 1000); //update the shelters