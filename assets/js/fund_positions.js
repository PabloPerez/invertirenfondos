const urlParams = new URLSearchParams(window.location.search)
var pos = urlParams.get('pos') || 0;
let isin = getFundIsinFromUrl(window.location.href)
let fundData;
populatePositions(isin)

document.querySelector('#previous-quarter').addEventListener("click", function () {
    populatePositions(isin, ++pos) 
})
document.querySelector('#next-quarter').addEventListener("click", function() {
    populatePositions(isin, --pos)
})

function getFundIsinFromUrl(url) {
    let urlParts = url.split('/');
    return urlParts[urlParts.length - 1].split('.')[0];

}

async function populatePositions(fundIsin) {
    if (pos >= 0){
        if ("fundData") {
            fundData = await axios.get(`/assets/json/funds/${fundIsin}.json`)
            .then(response => {
                return response.data;
            })
            .catch(error => console.error(error));
         }
        if (pos >= fundData.historico_periodos.length){
            pos = fundData.historico_periodos.length - 1;
        }
    } else {
        pos = 0;
    }
    let turnoverRate = fundData.historico_periodos[pos].indice_rotacion;
    document.querySelector('#turnover-rate').innerHTML = turnoverRate;
    let assets = fundData.historico_periodos[pos].patrimonio;
    document.querySelector('#assets').innerHTML = `${assets.toLocaleString()} €`;
    let participants = fundData.historico_periodos[pos].participes;
    document.querySelector('#participants').innerHTML = participants;
    let positions = fundData.historico_periodos[pos].posiciones;

    tableBody = document.querySelector('#positions-table tbody')
    tableBody.innerHTML = ''

    positions.forEach(position => {
        let name = position.nombre;
        let percentage = position.porcentaje;
        let isin = position.isin;
        let amount = position.cantidad;

        let currency = position.moneda;
        if (currency == "euro") {
            currency = "€"
        } else if (currency == "dolar") {
            currency = "$"
        }

        let tr = document.createElement('tr');

        let nametd = document.createElement('td');
        nametd.innerText = name;
        let isintd = document.createElement('td');
        isintd.innerText = isin
        let percentagetd = document.createElement('td');
        percentagetd.innerText = percentage
        let amounttd = document.createElement('td');
        amounttd.innerHTML = `${amount.toLocaleString()} ${currency}`;
    
        tr.appendChild(nametd);
        tr.appendChild(isintd);
        tr.appendChild(percentagetd);
        tr.appendChild(amounttd);

        tableBody.appendChild(tr)
    
    });

    document.querySelector('#quarter-date').innerHTML = fundData.historico_periodos[pos].periodo;
}