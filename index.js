

"use strict";

$.get("https://disease.sh/v3/covid-19/states{colorado}", (cases) =>
  display(cases)
);

function display(cases) {
  console.log(cases);
  for (let i = 0; i < cases.length; i++) {
    let cases = `<tr><td>${cases[i].cases}</td><td>${cases[i].recovered}</td><td>${cases[i].deaths}</td><td>${cases[i].tests}</td></tr>`;
    $("#covid-table").append(cases);
  }
}
=======
=======

$.get('https://disease.sh/v3/covid-19/all' , (cases) => display(cases));
function display(cases){
    console.log(cases)
     for(let i =0;i<cases.length;i++){
     let cases = `<tr><td>${cases[i].cases}</td><td>${cases[i].recovered}</td><td>${cases[i].deaths}</td><td>${cases[i].tests}</td></tr>`;
    $('#covid-table').append(cases)

     }
};

/*testing adding comment to js file*/


let newVarb = "This is crazy";
let newVarb2 = [ 1, 2 ,3 ,4, 5];
=======

// this is meraki11 branch on 4/12/21

/*testing adding comment to js file*/


