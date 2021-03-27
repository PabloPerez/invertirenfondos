const urlParams = new URLSearchParams(window.location.search)
var pos = urlParams.get('pos') || 0;
let isin = getAssetIsinFromUrl(window.location.href)
let assetData;
populatePositions(isin);

let pageWidth = window.innerWidth || document.body.clientWidth;
let treshold = Math.max(1 , Math.floor(0.05 * (pageWidth)));
let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;

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

function handleGesture(e) {
    let x = touchendX - touchstartX;
    let y = touchendY - touchstartY;
    let xy = Math.abs(x / y);
    let yx = Math.abs(y / x);
    if (Math.abs(x) > treshold || Math.abs(y) > treshold) {
        if (yx <= limit) {
            if (x < 0) {
                populatePositions(isin, --pos)
            } else {
                populatePositions(isin, ++pos) 
            }
        }
    } else {
        console.log("tap");
    }
}


document.querySelector('#previous-quarter').addEventListener("click", function () {
    populatePositions(isin, ++pos) 
})
document.querySelector('#next-quarter').addEventListener("click", function() {
    populatePositions(isin, --pos)
})

function getAssetIsinFromUrl(url) {
    let urlParts = url.split('/');
    return urlParts[urlParts.length - 1].split('.')[0];

}

async function populatePositions(assetIsin) {
    if (pos >= 0){
        if (!assetData) {
            assetData = await axios.get(`../assets/json/assets/${assetIsin}.json`)
            .then(response => {
                return response.data;
            })
            .catch(error => console.error(error));
         }
        if (pos >= assetData.historico_periodos.length){
            pos = assetData.historico_periodos.length - 1;
        }
    } else {
        pos = 0;
    }

    document.querySelector('#previous-quarter').style.visibility = "visible";
    document.querySelector('#next-quarter').style.visibility = "visible";    

    if (pos == 0) {
        document.querySelector('#next-quarter').style.visibility = "hidden";
    } if (pos == assetData.historico_periodos.length - 1) {
        document.querySelector('#previous-quarter').style.visibility = "hidden";
    } 

    let funds = assetData.historico_periodos[pos].fondos;

    tableBody = document.querySelector('#positions-table tbody')
    tableBody.innerHTML = ''

    funds.forEach(position => {
        let name = position.nombre;
        let percentage = position.porcentaje;
        let isin = position.isin;
        let amount = position.cantidad;
        let since = position.desde;

        let tr = document.createElement('tr');

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
        amounttd.innerHTML = `${amount.toLocaleString()}`;
        let sincetd = document.createElement('td');
        sincetd.classList.add("sincetd");
        sincetd.innerText = since

        tr.addEventListener("click", function() {
            window.location.href = `../fondos/${isin}.html`
        })

        tr.appendChild(nametd);
        tr.appendChild(isintd);
        tr.appendChild(percentagetd);
        tr.appendChild(amounttd);
        tr.appendChild(sincetd);

        tableBody.appendChild(tr)
    
    });

    document.querySelector('#quarter-date').innerHTML = assetData.historico_periodos[pos].periodo;
}