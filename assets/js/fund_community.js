---
---


function populateTable() {
    let funds = [];
    Object.entries(COMMUNITY_FUNDS).forEach(([key, value]) => {
        value.isin = key;
        funds.push(value);
    })
    fundsByVariacion = sortByKey(funds, 'variacion');
    fundsByVariacion.forEach(fund => {
        addFundToTable('#daily-data-funds-table tbody', fund.isin, fund.nombre, fund.fecha, fund.variacion, fund.ytd, fund.valor_liquidativo, fund.patrimonio, fund.participes)
    })
}

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
}

async function addFundToTable(selector, fundIsin, fundName, fundDate, fundLast, fundYTD, fundPrice, fundAssets, fundParticipants) {
    tableBody = document.querySelector(selector)
    let tr = document.createElement('tr');

    let isintd = document.createElement('td');
    isintd.classList.add("isintd")
    isintd.innerText = fundIsin;
    let fundNametd = document.createElement('td');
    fundNametd.innerText = fundName
    let fundDatetd = document.createElement('td');
    fundDatetd.innerHTML = fundDatetd
    let fundLasttd = document.createElement('td');
    fundLasttd.innerHTML = `${fundLast.toFixed(2)}%`
    let fundYTDtd = document.createElement('td');
    fundYTDtd.innerHTML = `${fundYTD.toFixed(2)}%`
    let fundPricetd = document.createElement('td');
    fundPricetd.innerHTML = `${fundPrice.toFixed(2)} €`
    let fundAssetstd = document.createElement('td');
    fundAssetstd.innerHTML = `${fundAssets.toLocaleString()} €`
    let fundParticipantstd = document.createElement('td');
    fundParticipantstd.innerHTML = fundParticipants.toLocaleString()

    tr.addEventListener("click", function() {
        window.location.href = `./fondos/${fundIsin}.html`
    })

    tr.appendChild(isintd);
    tr.appendChild(fundNametd);
    tr.appendChild(fundDatetd);
    tr.appendChild(fundLasttd);
    tr.appendChild(fundYTDtd);
    tr.appendChild(fundPricetd);
    tr.appendChild(fundAssetstd);
    tr.appendChild(fundParticipantstd);

    tableBody.appendChild(tr)

}

populateTable()