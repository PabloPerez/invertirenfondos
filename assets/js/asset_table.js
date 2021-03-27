---
---

document.querySelector('#asset-input').addEventListener("input", searchAssets)

function searchAssets(e) {
    resetTable();
    inputVal = document.querySelector('#asset-input').value.toUpperCase();
    if (inputVal.length > 3) {
        for (const k in ASSETS) {
            if (k.includes(inputVal) || ASSETS[k].nombre.includes(inputVal)) {
                addAssetToTable(k, ASSETS[k].nombre, ASSETS[k].gestora)
            }
        }
    }
}

function resetTable() {
    document.querySelector('#asset-table tbody').innerHTML = '';
}

async function addAssetToTable(assetIsin, assetName) {
    tableBody = document.querySelector('#asset-table tbody')
    let tr = document.createElement('tr');

    let isintd = document.createElement('td');
    isintd.innerText = assetIsin;
    let assetNametd = document.createElement('td');
    assetNametd.innerText = assetName

    tr.addEventListener("click", function() {
        window.location.href = `./activos/${assetIsin}.html`
    })

    tr.appendChild(isintd);
    tr.appendChild(assetNametd);

    tableBody.appendChild(tr)

}
