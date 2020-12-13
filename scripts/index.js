//                       _                               
//    ___ _ __ ___  __ _| |_ ___   _ __ ___   __ _ _ __  
//   / __| '__/ _ \/ _` | __/ _ \ | '_ ` _ \ / _` | '_ \ 
//  | (__| | |  __/ (_| | ||  __/ | | | | | | (_| | |_| |
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
var firebase_data;
function get_firebase_data()
{
    firebase_data = JSON.parse(GetData("https://chalmers-signal.firebaseio.com/Shelters.json"))
}
get_firebase_data()

console.log("firebase_data");
console.log(firebase_data);

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
// TODO: Rename to shelter_dot
var shelter_circles = [];
class Shelter {
    constructor(shelter_name, shelter_data) {
        this.name = shelter_name;
        this.data = shelter_data;

        this.circle = L.circle(
            [
                this.data.Shelter_Properties.latitude, 
                this.data.Shelter_Properties.latitude
            ] ,
            {
                color : "rgb(0,0,0,0)",
                fillColor: "rgb(0,0,0,0)",
                fillOpacity: 0.5,
                radius: 0
            }
        )
    }
    
    //
    // basically map() from p5.js
    //
    scale = (num, in_min, in_max, out_min, out_max) => {
        return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }
    
    //
    // colors the shelter_circles based on how full shelters are
    //
    get color() {
        return this.set_color(this.data.Service_Status.Firecode_Space.Firecode_Occupancy, this.data.Service_Status.Firecode_Space.Firecode_Capacity);
    }
    set_color(occupancy, capacity, alpha = 1) {
        var red = this.scale(occupancy, 0, capacity, 0, 255);
        var green = this.scale(occupancy, 0, capacity, 255, 0);
        return "rgb(" + red + "," + green + "," + "0" + "," + alpha + ")";
    }
    
    set_circle_radius(this.circle) {
        var current_zoom = chalmers_map.getZoom();
        this.circle.setRadius((scale(current_zoom, 20, 0, 1, 300)));
        var last_zoom = current_zoom;
    }


    update()
    {   
        // console.log( this.set_circle_radius() );
        console.log(this.circle);
        return "hello!";
    }
}

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
var shelters = [];
function create_and_update_shelters(create_shelters)
{
    get_firebase_data();
    
    if (create_shelters == true)
    {
        for (var shelter_data in firebase_data) {
            var shelter = new Shelter(shelter_data, firebase_data[shelter_data])
            shelters.push(shelter);
        }
    } else
    {
        for (var i = 0; i < shelters.length; i++)
        {
            shelters[i].circle.addTo(chalmers_map);
            console.log(shelters[i].update());
            // console.log(shelters[i])
        }
        
    }
    
    // // Object.assign(shelter_obj, shelter_data)
    // console.log("shelter_obj");
    // console.log(shelter);
    // console.log(shelter.color);
    // console.log(shelters);
}

//                   _         _                   
//   _ __ ___   __ _(_)_ __   | | ___   ___  _ __  
//  | '_ ` _ \ / _` | | '_ \  | |/ _ \ / _ \| '_ \ 
//  | | | | | | (_| | | | | | | | (_) | (_) | |_) |
//  |_| |_| |_|\__,_|_|_| |_| |_|\___/ \___/| .__/ 
//                                          |_|    
// pull_data_from_firebase();
create_and_update_shelters(true); //instatiate the shelters
var interval = setInterval(function () { create_and_update_shelters(false); }, 1000); //update the shelters

