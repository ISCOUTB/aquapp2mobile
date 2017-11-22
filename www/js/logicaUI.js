//SIDE MENU
(()=>{
    //horrible, pero no me importa ='v
    let sideMenu = document.getElementById('sideMenu');
    let contenedor = document.getElementById('contenedor');
    let iconoMenu = document.getElementById('iconoMenu');

    //ABRIR Y CERRAR MENÚ
    //abrir menú
    iconoMenu.addEventListener('click', ()=>{
        
        if( contenedor.classList.contains('abierto') )
            contenedor.classList.remove('abierto');
        else
            contenedor.classList.add('abierto');    
        
    });

    //cerrar menú
    let coordenadaX;
    sideMenu.addEventListener("touchstart", e => {coordenadaX = e.changedTouches[0].clientX});
    sideMenu.addEventListener("touchend", e => {
        
        if(coordenadaX-e.changedTouches[0].clientX > 60)
            contenedor.classList.remove('abierto');

    });
       
    //CLICK EN ITEMS DEL MENU (CAMBIAR VISTA ACTUAL)
    //agregar el evento al contenedor padre...en lugar de a cada uno de sus hijos
    let currentKey = 'map';
    sideMenu.addEventListener("click", e => {
            
        let key = e.target.getAttribute('key');
        if(!key) return;

        if(key !== currentKey){
            contenedor.querySelector('#'+currentKey).classList.remove('seccionSelected');
            contenedor.querySelector('#'+key).classList.add('seccionSelected');
            currentKey = key;
        }

        contenedor.classList.remove('abierto');

    });

})();
 
//MODAL
(()=>{
    
    let modal =  document.getElementById('modal');

    document
    .getElementById('closeModal')
    .addEventListener('click', ()=>{
        modal.classList.remove('modalOpen');
    });

})();

//POP UP
(()=>{

    let popup =  document.querySelector('.popup');

    popup.addEventListener('click', ()=>{
        popup.style.display = 'none';
    });

})();

//MIRAR SI SE ESTÁ EN LINEA
((e)=>{

    //la forma correcta, es horrible :T ... damnit, bro
    let mensajeOffline = document.createElement('div');
    mensajeOffline.setAttribute('id', 'offline');

    let img = document.createElement('img');
    img.setAttribute('src', 'img/iconos/wifi.png');

    let texto = document.createTextNode(e?"You're offline." : 'Estás offline.');

    mensajeOffline.appendChild(img);
    mensajeOffline.appendChild(texto);

    addEventListener('offline',()=>{ 
        document.body.appendChild(mensajeOffline);
        document.getElementById('app').classList.add('blancoNegro');
    });

    addEventListener('online',()=>{
        mensajeOffline.remove();
        document.getElementById('app').classList.remove('blancoNegro');
    });
    
})( localStorage.getItem('lang') !== 'es');

//SUBMIT DEL FORM
document.getElementById('form')
.addEventListener('submit' , e => {

    e.preventDefault();

    //show loader
    document.getElementById('awesomeFullScreenLoaderxD').style.display = 'block';

    //Crea un objeto con los valores imput y select del form
    let query = {string:[]};
    e.target.querySelectorAll('select, input')
    .forEach(a=>{
        let value  = a.value.replace(/(\d{4})-(\d{2})-(\d{2})/g, '$2/$3/$1' );
        query[a.name] = value;
        query.string += `${a.name}=${value}&`;
    });

    //nombre de estación y la unidad de medida
    let station = document.querySelector('#station');
    station = station.options[station.selectedIndex].innerText;

    let unit = document.querySelector('#parameter');
    unit = unit.options[unit.selectedIndex].innerText.match(/\((.*)\)/)[1]; //lo que esté dentro del parentesis

    //make request
    peticion( URLS.data + '?'+ query.string ).then( info => {

        if(!info.data.length)
            new Toast().show('No hay información disponible', 2000);
        else
            drawGraph(station , query.variable, unit, query.start_date, query.end_date , mapData(info.data) );

    })
    .catch((e)=>{ 
        new Toast().show('Intente más tarde', 2000);
        document.querySelector('#graph').style.display = 'none'
    })
    .then(()=>{
        document.getElementById('awesomeFullScreenLoaderxD').style.display = 'none'; //hide loader
    })

})