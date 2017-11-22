( function(e) { //e -> true si está en ingles, false otherwise

let getIcon = (iniciales, [s] /*status first letter*/ ) => {
    return L.divIcon({
        className : `markerL-${s}`,
        iconAnchor: [14, 41],
        iconSize: new L.Point(28, 41),
        html: iniciales
    });
};
//++++++++++++++++++++++++++++++++++iniciar mapa+++++++++++++++++++++++++++++++++++
var mapa = L.map('map', { zoomControl:false }).setView([10.425765, -75.532980], 14);
L.tileLayer(URLS.mapLayer, {
    maxZoom: 18,
    id: 'mapbox.streets'
})
.once('load', ()=>{

    document.querySelector('#map a[href="http://leafletjs.com"]').remove();
    let splash = document.getElementById("splashscreen");
    splash.style.opacity = 0;
    setTimeout(()=>{ splash.remove(); }, 500);

}).addTo(mapa);
//+++++++++++++++++++obtener nodos y renderizar en mapa+++++++++++++++++++++++++++++
let ObtenerNodos = ()=>{
    
    return Promise.all([peticion(URLS.nodes), peticion(URLS.nodeType)])
    .then( ([nodos , nodetype ])=> {

        nodetype = nodetype.reduce((ant,c)=> (ant[c._id] = c, ant)  , {});
        nodos.forEach(nodo=>{
            nodo.node_type = nodetype[nodo.node_type_id];

            nodo.iniciales = nodo.node_type.name.split(' ')
                            .slice(0,2) //dos iniciales
                            .map(l=>l[0])
                            .join('');
        });

        return [nodos, nodetype];
    });

};

let renderNodos = (nodos)=>{

    let modal = document.getElementById('modal');
    //iterar sobre cada nodo y agregar al mapa junto a su popup y tal
    return nodos.map( node => {
        
        const parametros = node.node_type.sensors.map(a=>` ${a.variable} (${a.unit})`);
        
        //Dios, perdoname porque he pecado ='v 
        const texto =
            `<h1>${node.name}</h1>
            <p>${node.location}

            <b>Latitud${e?'e':''}:</b> ${node.coordinates[0]}
            <b>Longitud${e?'e':''}:</b> ${node.coordinates[1]}

            <b>${e?'Type of node':'Tipo de nodo'}</b>
            ${node.node_type.name}
            ${node.status}

            <b>${e?'Parameters':'Parametros'}</b>
            <span>${parametros}</span></p>`;

        return L.marker(node.coordinates, { icon: getIcon(node.iniciales, node.status) }).on('click',()=>{
            modal.querySelector('#contenido').innerHTML = texto;
            modal.classList.add('modalOpen');
        }).addTo(mapa);
        
    }); 

};

ObtenerNodos()
.then( ([nodos, nodetype])=>{

    renderNodos(nodos); //muestra nodos en el mapa.
    
    //PONER INFORMACION EN EL FORM
    let selectStation = document.getElementById('station');
    let selectParameter = document.getElementById('parameter');
    
    let parametros = {};

    //rellenar la lista de Parametros en el FROM
    Object.entries(nodetype).forEach( ([id , {name, sensors}])=>{
        
        let optGroup = document.createElement('optgroup');
        optGroup.setAttribute('label', name);

        sensors.forEach( ({ variable , unit })=>{
            
            let option = document.createElement('option');
            option.setAttribute('value', variable);
            option.innerText = `${variable} (${unit})`;
            optGroup.appendChild(option);

        });

        parametros[id] = optGroup;

    });

    // rellenar parametros (lista de nodos) en el FROM
    nodos.forEach(({_id:id = '', name = '', node_type_id = ''}, index)=>{
        
        let option = document.createElement('option');
        option.setAttribute('value', id);
        option.setAttribute('id', node_type_id);
        option.innerText = name;
        selectStation.appendChild(option);
        index == 0 && selectParameter.appendChild(parametros[node_type_id]); //pone el primero como default

    });

    //actualizar una lista cuando cambie la otra :thinking:
    selectStation.addEventListener('change', e=>{
        
        let id = e.target.selectedOptions[0].id;
        selectParameter.firstChild && selectParameter.firstChild.remove();
        selectParameter.appendChild(parametros[id]);
    
    });
    
})
.catch((e)=>{new Toast().show('Error...', 3000);})

//++++++++++++++++++++++ Agregar poligonos al mapa +++++++++++++++++++++++++++++++++++++++
for(let p in poligonos){

    let i = getRange(Math.random()*100, e); //helper

    let texto =
    `<h1>${poligonos[p].nombre}</h1>
    <p><i style="background: ${i.color}"></i>20.32% - <b>${i.status}</b></p>`;

    L.polygon(poligonos[p].c, {
        fillColor: i.color,
        weight: 2,
        opacity: 1,
        color: '#fff',
        dashArray: '4',
        fillOpacity: 0.9
    })
    .on('click', ()=>{

        document.querySelector('.popup div').innerHTML = texto;
        document.querySelector('.popup').style.display = 'block';
        
    }).addTo(mapa);

}
})( localStorage.getItem('lang') !== 'es' );


