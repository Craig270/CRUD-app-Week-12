$.get('https://disease.sh/v3/covid-19/all' , (cases) => display(cases));
function display(cases){
    console.log(cases)
     for(let i =0;i<cases.length;i++){
     let cases = `<tr><td>${cases[i].cases}</td><td>${cases[i].recovered}</td><td>${cases[i].deaths}</td><td>${cases[i].tests}</td></tr>`;
    $('#covid-table').append(cases)

     }
};

/*testing adding comment to js file*/

/*testing adding comment to js file*/
