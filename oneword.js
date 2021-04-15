$.get("https://retoolapi.dev/A3H52c/oneword", (Name,Word,Avatar) => addCustomers(Name,Word,Avatar));

function addCustomers(response) {
    let newRow = "";
    $.each(response, function (i, item) {
        newRow += "<tr><td>" + item.Name + "</td><td>" + item.Avatar + "</td><td>" + item.Word + "</td></tr>"
    });
    console.log(newRow);
    $("#customer-table").append(newRow);
}
