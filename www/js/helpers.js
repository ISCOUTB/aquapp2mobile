/*PETICIONES*/
const URLS = {
    nodes: `http://aquapp.utb.services/api/v1/nodes`,
    mapLayer : 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
    nodeType: `http://aquapp.utb.services/api/v1/node-types/`,
    data : `http://aquapp.utb.services/api/v1/data`
};

let peticion = (url, method = 'GET')=>{
    
    return new Promise((resolve, reject)=>{

        let xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = () => {

            if (xmlHttp.readyState === 4) {
                xmlHttp.status === 200 && resolve(JSON.parse(xmlHttp.responseText));
                reject(xmlHttp.status +  " state: " + xmlHttp.readyState);
            }
        };

        xmlHttp.open(method, url, true);
        xmlHttp.send();
    });
    
};

/*OBTENER COLOR DE POLIGONOS EN EL MAPA E INFORMACION*/
const getRange = (d,e) => {
    return  d > 90 ? {color: '#0032FF', status: e? 'Optimal' : 'Óptima'  } :
            d > 70 ? {color: '#49C502', status: e? 'Adequate': 'Adecuada' } :  
            d > 50 ? {color: '#F9F107', status: e? 'Acceptable': 'Aceptable'} : 
            d > 25 ? {color: '#F57702', status: e? 'Inadequate': 'Inadecuada' }: 
                     {color: '#FB1502', status: e? 'Appalling': 'Pésima' } ;
}

/*HELPERS PARA GRAFICAR DATOS */
const mapData = data => {
    
    if(data.length > 3000){
        let range = Math.floor( Math.log(data.length) );
        data = data.filter((a,index)=> index % range === 0 );
    }

    return data
    .map(a=> [ new Date( a.timestamp ) , a.value ] )
    .sort((a,b)=>a[0]-b[0]);
}

/*Gráfica :v*/
Highcharts.setOptions({ global: { useUTC: false } });
const drawGraph = (node_name, name, unit, start_date, end_date, values)=>{

    let grafica = document.querySelector('#graph');
    grafica.style.minHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) + 'px';
    grafica.style.minWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) + 'px';
       
    new Highcharts.chart('graph', {
        chart: { type: 'spline', inverted: true },
        title: { text: node_name },
        subtitle: { text: start_date + ' - ' + end_date },
        tooltip: { enabled: false },
        xAxis: { type: 'datetime' },
        plotOptions: {
            series: {
                animation: false,
                states: {
                    hover: { enabled: false }
                }
            }
        },
        yAxis : {
            title: {
                text: name + ' (' + unit + ')',
                style: { color: '#e00822' }
            },
            labels: {
                format: '{value} ' + unit,
                style: { color: '#e00822' }
            }
        },
        series: [{
            name,
            data: values,
            color: '#e00822'
        }]
    });

    let imgCerrar = document.createElement('img');
    imgCerrar.src = 'img/iconos/cerrar.png';
    imgCerrar.setAttribute('id', 'cerrarGrafica');
    grafica.appendChild(imgCerrar);
    grafica.style.display = 'block';

    imgCerrar.addEventListener('click', ()=>{
        grafica.style.display= 'none';
        grafica.firstChild.remove();
    });

}

//TOAST
class Toast{
    
    show(text, time= 5000){

        var toast = document.createElement('div');
        toast.setAttribute('id', 'toast');

        toast.appendChild(
            document.createTextNode(text)
        );

        document.body.appendChild(toast);
        setTimeout(()=>{toast.remove()}, time)
    }
    
}