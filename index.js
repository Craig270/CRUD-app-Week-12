"use strict";

//api url
const api_url = "https://disease.sh/v3/covid-19/states";

//Defining async function
async function getapi(url) {
    //Storing response
    const response = await fetch(url);

    //Storing data in the form of JSON
    var data = await response.json();
    console.log(data);
    if (response) {
      hideloader();
    }
    show(data);
}
//Calling that async function
getapi(api_url);

//Function to hide the loader
function hideloader() {
  document.getElementById('loading').style.display = 'none';
}

//Function to define innerHTML for HTML table
function show(data) {
  let tab = 
    `<tr>
      <th>State</th>
      <th>Cases</th>
      <th>Recovered</th>
      <th>Deaths</th>
      <th>Tests</th>
    </tr>`;

  //Loop to access all rows
  for (let i = 0; i < data.length; i++) {
    tab += `<tr
      <td>${i.state}</td>
      <td>${i.cases}</td>
      <td>${i.recovered}</td>
      <td>${i.deaths}</td>
      <td>${i.tests}</td>
    </tr>`;
    console.log(tab);
  };
  //Setting innerHTML as tab variable
  document.getElementById("location-table").innerHTML = tab;
}

// setting up user tracking list
//1b use a form to add new entities: which locations do they want to track
class TrackLocations {
  constructor(location) {
    this.location = location;
    this.stats = [];
  }
}

//1c build a way for users to update entities: which data do they want to track, added the variables indicated in the get above
class TrackTheseStats {
  constructor(cases, recovered, deaths, tests) {
    this.cases = cases;
    this.recovered = recovered;
    this.deaths = deaths;
    this.tests = tests;
  }
}

//1b use a form to add new entities: ability to create multiple named tracking lists
class MyTrackingList {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  addLocation(location) {
    this.locations.push(location);
  }
  
  deleteLocation(location) {
    let index = this.locations.indexOf(location);
    this.locations.splice(index, 1);
  }
}

//send data entered to an API
class CovidTracking {
  static url = "https://";//need to find location to send info to//root URL for all API end points

  static getAllLists() {
    return $.get(this.url);
  }

  static getList(id) {
    return $.get(this.url + `/${id}`);
  }

  static createList(list) {
    return $.post(this.url, list);
  }

  static updateList(list) {
    return $.ajax({
      url: this.url + `/${list.id}`,
      dataType: "json",
      data: JSON.stringify(list),
      contentType: "application/json",
      type: "PUT"
    });
  }

  static deleteList(id) {
    return $.ajax({
      url: this.url + `/${id}`,
      type: "DELETE"
    });
  }
}

//render methods
class DOMManager {
  static lists;

  //get all current lists
  static getAllLists() {
    CovidTracking.getAllLists().then(lists => this.render(lists));
  }

  //create a new list, promise comes back and rerender the DOM
  static createList(name) {
    CovidTracking.createList(new MyTrackingList(name))
    .then(() => { //handle promise
      return CovidTracking.getAllLists();
    })
    .then((lists) => this.render(lists));//rerender the DOM after change
  }

  //delete a list and rerender the DOM
  static deleteList(id) {
    CovidTracking.deleteList(id)
      .then(() => { //handle promise
        return CovidTracking.getAllLists();
      })
      .then((lists) => this.render(lists));//rerender the DOM after change
  }

  static addLocations(id) {
    for (let list of this.lists) {
      if (list._id == id) { //._id is assigned by the API
        list.locations.push(new Location($(`#${list._id}-location-name`).val(), 
        $(`#${list._id}-location-cases`).val(),
        $(`#${list._id}-location-recovered`).val(),
        $(`#${list._id}-location-deaths`).val(),
        $(`#${list._id}-location-tests`).val()));
        CovidTracking.updateList(list) 
          .then(() => { //handle promise
            return CovidTracking.getAllLists();
          })
          .then((lists) => this.render(lists));//rerender the DOM after change
      
      }
    }
  }

  static deleteLocations(listId, locationId) {
    for (let list of this.list) {
      if (list._id == listId) {
        for (let location of list.locations) {
          if (locations._id == locationId) {
            list.locations.splice(list.locations.indexOf(location), 1);
            CovidTracking.updateList(list)
              .then(() => {
                return CovidTracking.getAllLists();
              })
              .then((lists) => this.render(lists));
          }
        }
      }
    }
  }  

  //list interface
  static render(lists) {
    this.lists = lists;
    $('#trackApp').empty();
    for (let list of lists) {
      $('#trackApp').prepend(
        `<div id="${list._id}" class="card">
          <div class="card-header">
            <h2>${list.name}</h2>
            <button class="btn btn-danger" onclick="DOMManager.deleteList('${list._id}')">Delete</button>
          </div>
          <div class="card-body">
            <div class="card">
              <div class="col-sm">
                <input type="text" id="${list._id}-location-name" class="form-control" placeholder="Location Name">
              </div>
              <button id="${list._id}-new-list" onclick="DOMManager.addLocation('${list._id}')" class="btn btn-primary form-control">Add</button>
            </div>
          </div>
        </div><br>`
      );
      for (let location of list.location) {
        $(`#${list._id}`).find('.card-body').append(
          `<p>
            <span id="name-${location._id}"><strong>Location: </strong> ${location.name}</span>
            <span id="name-${location._id}"><strong>Cases: </strong> ${location.cases}</span>
            <span id="name-${location._id}"><strong>Recovered: </strong> ${location.recovered}</span>
            <span id="name-${location._id}"><strong>Deaths: </strong> ${location.deaths}</span>
            <span id="name-${location._id}"><strong>Tests: </strong> ${location.tests}</span>
            <button class="btn btn-danger" onclick="DOMManager.deleteRoom('${list._id}', '${locations._id}')">Delete Location</button>
          </p>`);
        
      }
    }
  }

}

//button code to create new list and set field back to clear
$('#create-new-list').on("click",() => {
  DOMManager.createList($('#new-list-name').val());
  $('#new-list-name').val('');
});

DOMManager.getAllLists();

