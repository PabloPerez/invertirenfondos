const urlParams = new URLSearchParams(window.location.search)
var pos = urlParams.get('pos') || 0;
let isin = getFundIsinFromUrl(window.location.href)
let fundData;
populatePositions(isin);

let pageWidth = window.innerWidth || document.body.clientWidth;
let treshold = Math.max(1 , Math.floor(0.3 * (pageWidth)));
let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;

let first = true;

const limit = Math.tan(45 * 1.5 / 180 * Math.PI);
const gestureZone = document.getElementById('positions-table');

gestureZone.addEventListener('touchstart', function(event) {
    touchstartX = event.changedTouches[0].screenX;
    touchstartY = event.changedTouches[0].screenY;
}, false);

gestureZone.addEventListener('touchend', function(event) {
    touchendX = event.changedTouches[0].screenX;
    touchendY = event.changedTouches[0].screenY;
    handleGesture(event);
}, false);

function showTrimester(trimester) {
    [...document.querySelectorAll(".trimester")].forEach(e => document.body.removeChild(e));
    const element = document.createElement("div");
    element.innerText = trimester;
    element.className = "trimester";
    document.body.appendChild(element);
    element.addEventListener("animationend", ()=>document.body.removeChild(element))
}

function handleGesture(e) {
    let x = touchendX - touchstartX;
    let y = touchendY - touchstartY;
    let xy = Math.abs(x / y);
    let yx = Math.abs(y / x);
    if (Math.abs(x) > treshold || Math.abs(y) > treshold) {
        if (yx <= limit) {
            if (x < 0) {
                pos--
                populatePositions(isin, true)
            } else {
                pos++
                populatePositions(isin, true)
            }
        }
    } else {
        console.log("tap");
    }
}


document.querySelector('#previous-quarter').addEventListener("click", function () {
    pos++
    populatePositions(isin)
})
document.querySelector('#next-quarter').addEventListener("click", function() {
    pos--
    populatePositions(isin)
})

function getFundIsinFromUrl(url) {
    let urlParts = url.split('/');
    return urlParts[urlParts.length - 1].split('.')[0];

}

async function populatePositions(fundIsin, isDragging=false) {
    if (pos >= 0){
        if (!fundData) {
            fundData = await axios.get(`../assets/json/funds/${fundIsin}.json`)
            .then(response => {
                return response.data;
            })
            .catch(error => console.error(error));
         }
        if (pos >= fundData.historico_periodos.length){
            pos = fundData.historico_periodos.length - 1;
            return
        }
    } else {
        pos = 0;
        return
    }

    isDragging && !first && showTrimester(fundData.historico_periodos[pos].periodo)
    first=false

    let turnoverRate = fundData.historico_periodos[pos].indice_rotacion;
    document.querySelector('#turnover-rate').innerHTML = turnoverRate;
    let assets = fundData.historico_periodos[pos].patrimonio;
    document.querySelector('#assets').innerHTML = `${assets.toLocaleString()} €`;
    let participants = fundData.historico_periodos[pos].participes;
    document.querySelector('#participants').innerHTML = participants;

    let returns = fundData.historico_periodos[pos].rentabilidad
    if (returns){
        document.querySelector('#returns').innerHTML = returns;
        document.querySelector('#returns-row').style.display = 'table-row';
    }
    let expenses = fundData.historico_periodos[pos].gastos
    if (expenses){
        document.querySelector('#expenses').innerHTML = expenses;
        document.querySelector('#expenses-row').style.display = 'table-row';
    }
    let liquidity = fundData.historico_periodos[pos].liquidez
    if (liquidity){
        document.querySelector('#liquidity').innerHTML = `${liquidity.toLocaleString()} %`;
        document.querySelector('#liquidity-row').style.display = 'table-row';
    }
    document.querySelector('#previous-quarter').style.visibility = "visible";
    document.querySelector('#next-quarter').style.visibility = "visible";    

    let positions = fundData.historico_periodos[pos].posiciones;
    let previous_positions = []
    let previous_quarter

    if (pos == 0) {
        document.querySelector('#next-quarter').style.visibility = "hidden";
    }
    if (pos == fundData.historico_periodos.length - 1) {
        document.querySelector('#previous-quarter').style.visibility = "hidden";
        document.querySelector('#sold-positions').style.display = "none";
    } else {
        previous_quarter = fundData.historico_periodos[pos + 1].periodo
        previous_positions = fundData.historico_periodos[pos + 1].posiciones
        document.querySelector('#sold-positions').style.display = "block";
    }

    tableBody = document.querySelector('#positions-table tbody')
    tableBody.innerHTML = ''

    positions.forEach(position => {
        let name = position.nombre;
        let percentage = position.porcentaje;
        let isin = position.isin;
        let amount = position.cantidad;
        let isNew = previous_positions.length && !previous_positions.some(p => p.isin === isin)

        let currency = position.moneda;
        if (currency.toLowerCase() == "euro" || currency.toLowerCase() == "eur") {
            currency = "€"
        } else if (currency.toLowerCase() == "dolar" || currency.toLowerCase() == "dollar") {
            currency = "$"
        }

        let tr = document.createElement('tr');
        if (isNew){
            tr.classList.add("table-success")
        }

        let nametd = document.createElement('td');
        nametd.innerText = name;
        let isintd = document.createElement('td');
        isintd.innerText = isin
        isintd.classList.add("isintd")
        let percentagetd = document.createElement('td');
        percentagetd.classList.add("percentagetd")
        percentagetd.innerText = percentage
        let amounttd = document.createElement('td');
        amounttd.classList.add("amounttd")
        amounttd.innerHTML = `${amount.toLocaleString()} ${currency}`;
    
        
        tr.addEventListener("click", function() {
            window.location.href = `../activos/${isin}.html`
        })

        tr.appendChild(nametd);
        tr.appendChild(isintd);
        tr.appendChild(percentagetd);
        tr.appendChild(amounttd);

        tableBody.appendChild(tr)
    
    });
    soldTableBody = document.querySelector('#sold-positions-table tbody')
    soldTableBody.innerHTML = ''
    previous_positions.forEach(position => {
        let isin = position.isin;
        if (!positions.some(p => p.isin === isin)) {
            let name = position.nombre;
            let percentage = position.porcentaje;

            let tr = document.createElement('tr');

            let nametd = document.createElement('td');
            nametd.innerText = name;
            let isintd = document.createElement('td');
            isintd.innerText = isin
            isintd.classList.add("isintd")
            let percentagetd = document.createElement('td');
            percentagetd.classList.add("percentagetd")
            percentagetd.innerText = percentage
            let sincetd = document.createElement('td');
            sincetd.classList.add("sincetd")
            sincetd.innerText = position.desde

            tr.addEventListener("click", function() {
                window.location.href = `../activos/${isin}.html`
            })

            tr.appendChild(nametd);
            tr.appendChild(isintd);
            tr.appendChild(percentagetd);
            tr.appendChild(sincetd);

            soldTableBody.appendChild(tr)
        }
    });

    document.querySelector('#quarter-date').innerHTML = fundData.historico_periodos[pos].periodo;
}