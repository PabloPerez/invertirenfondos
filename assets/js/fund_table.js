document.querySelector('#fund-input').addEventListener("input", searchFunds)

function searchFunds(e) {
    resetTable();
    inputVal = document.querySelector('#fund-input').value.toUpperCase();
    if (inputVal.length > 3) {
        if (!inputVal.startsWith('ES0')) {
            for (const k in FUNDS) {
                if (FUNDS[k].nombre.includes(inputVal)) {
                    addFundToTable(k, FUNDS[k].nombre, FUNDS[k].gestora)
                }
            }
        } else {
            if (inputVal.length > 8) {
                for (const k in FUNDS) {
                    if (k.includes(inputVal)) {
                        addFundToTable(k, FUNDS[k].nombre, FUNDS[k].gestora)
                    }
                }
            }
        }
    }
}

function resetTable() {
    document.querySelector('#fund-table tbody').innerHTML = '';
}

async function addFundToTable(fundIsin, fundName, fundGestora) {
    tableBody = document.querySelector('#fund-table tbody')
    let tr = document.createElement('tr');

    let isintd = document.createElement('td');
    isintd.innerText = fundIsin;
    let fundNametd = document.createElement('td');
    fundNametd.innerText = fundName
    let fundGestoratd = document.createElement('td');
    fundGestoratd.innerHTML = fundGestora

    tr.addEventListener("click", function() {
        window.location.href = `/fondos/${fundIsin}.html`
    })

    tr.appendChild(isintd);
    tr.appendChild(fundNametd);
    tr.appendChild(fundGestoratd);

    tableBody.appendChild(tr)

}
