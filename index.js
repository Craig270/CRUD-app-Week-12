"use strict";

$.get("https://disease.sh/v3/covid-19/states", (cases) => display(cases));

function display(cases) {
  console.log(cases);
  for (let i = 0; i < cases.length; i++) {
    let cases = `<tr><td>${cases[i].cases}</td><td>${cases[i].recovered}</td><td>${cases[i].deaths}</td><td>${cases[i].tests}</td></tr>`;
    $("#covid-table").append(cases);
  }
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
    let index = this.location.indexOf(locations);
    this.locations.splice(index, 1);
  }
}

// I think the functions used to create the forms/lists in previous assignment are not needed but keeping for now
// let lists = [];
// let listsId = 0;

// window.onload = function() {
//   document.getElementById("new-list-name").focus();
// }

// function onClick(id, action){
//   let element = document.getElementById(id);
//   element.addEventListener("click", action);
//   return element;
// }

// /*Some sort of jQuery like this-- ($("#entry").checkValidity()); -- to be incorporated to keep onClick from overridng HTML 'required'*/

// onClick("new-list", () => {
//   lists.push(new MyTrackingList(listId++, getValue("new-list-name")));
//   drawDOM();
// });

// function getValue(id) {
//   return document.getElementById(id).value;
// }

// function clearElement(element) {
//   while(element.firstChild) {
//     element.removeChild(element.firstChild);
//   }
// }


//send data entered to an API
class CovidTracking {
  static url = "";//need to find location to send info to//

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

  static getAllLists() {
    CovidTracking.getAllLists().then(lists => this.render(lists));
  }

  static render(lists) {
    this.lists = lists;
    $("#trackApp").empty();
    for (let list of lists) {
      $("#trackApp").prepend(
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
        </div>`
      );
    }
  }

}


