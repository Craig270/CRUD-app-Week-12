$.get("https://retoolapi.dev/wjOUHo/oneword?Name=value", (data) => addCustomers(data.data));

//also tried "https://retoolapi.dev/wjOUHo/oneword" but I'm still not calling the data names correctly
function addCustomers(response) {
    let newRow = "";
    $.each(response, function (i, item) {
        newRow += "<tr><td>" + item.Name + "</td><td>" + item.Avatar + "</td><td>" + item.WhatisyourOneWord + "</td></tr>"
    });
    console.log(newRow);
    $("#customer-table").append(newRow);
}
