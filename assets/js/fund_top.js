---
---


function populateTopTables() {
    let funds = [];
    Object.entries(FUNDS).forEach(([key, value]) => {
        value.isin = key;
        funds.push(value);
    })
    fundsByAssets = sortByKey(funds, 'patrimonio').slice(0, 20);
    fundsByAssets.forEach(fund => {
        addFundToTable('#top-assets-table tbody', fund.isin, fund.nombre, fund.gestora, fund.patrimonio)
    })
    fundsByParticipants = sortByKey(funds, 'participes').slice(0, 20);
    fundsByParticipants.forEach(fund => {
        addFundToTable('#top-participants-table tbody', fund.isin, fund.nombre, fund.gestora, fund.participes)
    })
}

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
}
    

function resetTable() {
    document.querySelector('#fund-table tbody').innerHTML = '';
}

async function addFundToTable(selector, fundIsin, fundName, fundGestora, amount) {
    tableBody = document.querySelector(selector)
    let tr = document.createElement('tr');

    let isintd = document.createElement('td');
    isintd.classList.add("isintd")
    isintd.innerText = fundIsin;
    let fundNametd = document.createElement('td');
    fundNametd.innerText = fundName
    let fundGestoratd = document.createElement('td');
    fundGestoratd.innerHTML = fundGestora
    let amounttd = document.createElement('td');
    amounttd.innerHTML = selector.includes('participants') ? amount.toLocaleString() : `${amount.toLocaleString()} €`

    tr.addEventListener("click", function() {
        window.location.href = `./fondos/${fundIsin}.html`
    })

    tr.appendChild(isintd);
    tr.appendChild(fundNametd);
    tr.appendChild(fundGestoratd);
    tr.appendChild(amounttd);

    tableBody.appendChild(tr)

}

populateTopTables()