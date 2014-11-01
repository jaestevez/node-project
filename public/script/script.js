var socket = io.connect();
var distancias;
var dato_recibido = 0.0;
var color = 'blue';
var color_linea_divr = 'red';
var color_grilla = 'lightblue';
var id = 'dibujo';
var id_text_left = 'eje_y';
var id_text_down = 'eje_x';
var lineas_verticales;
var tipo_letra_inf = 'italic 10pt Calibri';
var tipo_letra_lt = 'italic 8pt Calibri';
var tipo_text = 'italic 42pt Calibri';
var texto_inf = "Temperatura en °C";
var linea_division;

//var cont_select1 = 'opcion-led13'
function request_led()
{   
    var context_select = document.getElementById('opcion-led');
    var led = (context_select.value == 'Encender')?'1':'0';
    var context_select = document.getElementById('n-led');
    var ports = context_select.value;
    var req = 'l'+ports+led;
     console.log(req);
    socket.emit('led',req);

}
function loadValues()
{
    linea_division = document.getElementById('dibujo').height;
    lineas_verticales  = document.getElementById('dibujo').width/50 + 1;
    distancias = new Array(lineas_verticales);
}

function inicio()
{
    var dbj, lienzo;
    dbj = document.getElementById(id);
    lienzo = dbj.getContext("2d");
    dibujarGrilla(lienzo);
}
function borde(lienzo)
{
    var ancho = document.getElementById(id).width;
    var alto = document.getElementById(id).height;
    lienzo.strokeStyle = color;
    lienzo.beginPath()
    lienzo.moveTo(0,0);

    lienzo.lineTo(0,alto);
    lienzo.lineTo(ancho,alto);
    lienzo.lineTo(ancho,0);
    lienzo.lineTo(0,0);
    lienzo.closePath();
    lienzo.stroke();
}
function dibujarGrilla(lienzo)
{
    var ancho = document.getElementById(id).width;
    var alto = document.getElementById(id).height;
    var distancia = 50;
    limpiarCanvas();
    borde(lienzo);
    lienzo.beginPath();
    lienzo.lineWidth = 1;
    lienzo.strokeStyle = color_grilla;
    for(var linea = 0;linea<=ancho;linea+=distancia)
    {
        lienzo.moveTo(linea,0);
        lienzo.lineTo(linea,alto);
        lienzo.stroke();
    }
    for(var linea = 0;linea<=alto;linea+=distancia)
    {
        if(linea_division == linea)
            continue;

        lienzo.moveTo(0,linea);
        lienzo.lineTo(ancho,linea);
        lienzo.stroke();
    }
    lienzo.beginPath();
    lienzo.moveTo(0,linea_division);
    lienzo.lineTo(ancho,linea_division);
    lienzo.strokeStyle = color_linea_divr;
    lienzo.stroke();
    lienzo.closePath();
    
    punto_grafica();
    grafica(lienzo);
}
function limpiarCanvas()
{
    var canvas = document.getElementById(id);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
}
function grafica(lienzo)
{
    lienzo.beginPath();
    lienzo.strokeStyle = color;
    lienzo.lineWidth = 2;
    for(var i = 0,x = 0;i<distancias.length - 1 && x<=document.getElementById(id).width;i++,x+=50)
    {
        lienzo.moveTo(x,(linea_division)-distancias[i]);
        lienzo.lineTo(x+50,(linea_division)-distancias[i+1]);
        lienzo.stroke();
    }
    lienzo.closePath();
}

function punto_grafica()
{
    eliminar(); 
    distancias.push(dato_recibido.toFixed(2));
    canvas = document.getElementById("display");
    lienzot = canvas.getContext("2d");
    lienzot.clearRect(0, 0, canvas.width, canvas.height);
    lienzot.font = tipo_text;
    lienzot.fillText(String((dato_recibido/10).toFixed(2))+'°',0,60);
}
function texto()
{
    lineas_horizontales = document.getElementById(id).height;
    lienzo = document.getElementById(id_text_left).getContext("2d");
    lienzo.font = tipo_letra_lt;
    for(var i = linea_division,num = 0;i>0;i -=50, num += 5)
    {
        lienzo.fillText(num.toString()+"°",5,i);
    }
    lienzo = document.getElementById(id_text_down).getContext("2d");
    lienzo.font = tipo_letra_inf;
    lienzo.fillText(texto_inf,25,document.getElementById(id_text_down).height/1.5);
}
function eliminar()
{
    var size = distancias.length;
    for(var i =0;i<size-1;i++){
        distancias[i] = distancias[i+1];
    }
    distancias.pop();
}
function data_received()
{
    socket.emit('dato', true, function(data){
        if(dato_recibido != parseFloat(data)*10){
            if(parseFloat(data) >40)data = 40;
            if(parseFloat(data) <0 )data = 0;
            dato_recibido = parseFloat(data)*10;
            console.log('data received: '+ dato_recibido/10);
        }
  });
    
}