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

    // let isintd = document.createElement('td');
    // isintd.classList.add("isintd")
    // isintd.innerText = fundIsin;
    let fundNametd = document.createElement('td');
    fundNametd.innerText = fundName
    let fundDatetd = document.createElement('td');
    // replace date format from DD/MM/YYYY to DD/MM/YY
    let dateParts = fundDate.split("/");
    fundDate = `${dateParts[0]}/${dateParts[1]}/${dateParts[2].slice(-2)}`;
    fundDatetd.innerHTML = fundDate
    let fundLasttd = document.createElement('td');
    fundLasttd.innerHTML = `${fundLast.toFixed(2)}%`
    let fundYTDtd = document.createElement('td');
    fundYTDtd.innerHTML = `${fundYTD.toFixed(2)}%`
    let fundPricetd = document.createElement('td');
    fundPricetd.innerHTML = `${fundPrice.toFixed(2)}`
    fundPricetd.classList.add("pricetd")
    let fundAssetstd = document.createElement('td');
    fundAssetstd.innerHTML = fundAssets === null ? '-' : `${fundAssets.toLocaleString()}€`
    fundAssetstd.classList.add("assetstd")
    let fundParticipantstd = document.createElement('td');
    // if participants is 0, show '-'
    fundParticipantstd.innerHTML = fundParticipants == 0 ? '-' : `${fundParticipants.toLocaleString()}`
    fundParticipantstd.classList.add("participanttd");

    // Add event listeners to table headers for sorting
    document.querySelectorAll('#daily-data-funds-table th').forEach((header, index) => {
        header.addEventListener('click', () => {
            const keyMap = ['nombre', 'fecha', 'variacion', 'ytd', 'valor_liquidativo', 'patrimonio', 'participes'];
            const key = keyMap[index];
            const sortedFunds = sortByKey(funds, key);
            const tableBody = document.querySelector('#daily-data-funds-table tbody');
            tableBody.innerHTML = ''; // Clear existing rows
            sortedFunds.forEach(fund => {
                addFundToTable('#daily-data-funds-table tbody', fund.isin, fund.nombre, fund.fecha, fund.variacion, fund.ytd, fund.valor_liquidativo, fund.patrimonio, fund.participes);
            });
        });
    });
    if (fundIsin.startsWith("ES")) {
        tr.addEventListener("click", function() {
            window.location.href = `./fondos/${fundIsin}.html`
        })    
    }

    // tr.appendChild(isintd);
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