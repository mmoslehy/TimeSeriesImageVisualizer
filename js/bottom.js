var arrayBuffer = new ArrayBuffer();
var currentFocus;

function handleFileSelect(evt) {

var f = evt.target.files[0]; // FileList object

// Only process dbf files.
    if (!f.name.endsWith(".dbf")) {
		var extension = f.name.split('.')[f.name.split('.').length-1];
		alert("File type \"." + extension + "\" is not supported by this program, please try again using a DBF file");
        return;
    }

var dbf = {};

var reader = new FileReader();

// Closure to capture the file information.
reader.onload = function(evt) {
	arrayBuffer = evt.target.result;
};

reader.onloadend = loadBuffer;


reader.readAsArrayBuffer(f);
}

document.getElementById('file').addEventListener('change', handleFileSelect, false);

function loadBuffer(){
	if(arrayBuffer.byteLength>0){
	DBFParser.load("someFileName", arrayBuffer, onSuccess, onErr);
	}
else alert("Buffer is empty");
}

var max=[];
var min=[];
var mean=[];
var differenceMean=[];
var differenceMinMax=[];


function onSuccess(dbf){
this.dbf = dbf;

var i=0;
var y=0;
var x=0;
var z=0;
max[i++]=dbf.records[0].Max1;
max[i++]=dbf.records[0].Max2;
max[i++]=dbf.records[0].Max3;
max[i++]=dbf.records[0].Max4;
max[i++]=dbf.records[0].Max5;
max[i++]=dbf.records[0].Max6;
max[i++]=dbf.records[0].Max7;
max[i++]=dbf.records[0].Max8;
max[i++]=dbf.records[0].Max9;
max[i++]=dbf.records[0].Max10;
max[i++]=dbf.records[0].Max11;
max[i++]=dbf.records[0].Max12;
max[i++]=dbf.records[0].Max13;
max[i++]=dbf.records[0].Max14;
max[i++]=dbf.records[0].Max15;
max[i++]=dbf.records[0].Max16;
max[i++]=dbf.records[0].Max17;



min[x++]=dbf.records[0].Min_1;
min[x++]=dbf.records[0].Min_2;
min[x++]=dbf.records[0].Min_3;
min[x++]=dbf.records[0].Min_4;
min[x++]=dbf.records[0].Min_5;
min[x++]=dbf.records[0].Min_6;
min[x++]=dbf.records[0].Min_7;
min[x++]=dbf.records[0].Min_8;		
min[x++]=dbf.records[0].Min_9;
min[x++]=dbf.records[0].Min_10;
min[x++]=dbf.records[0].Min_11;
min[x++]=dbf.records[0].Min_12;
min[x++]=dbf.records[0].Min_13;
min[x++]=dbf.records[0].Min_14;
min[x++]=dbf.records[0].Min_15;
min[x++]=dbf.records[0].Min_16;
min[x++]=dbf.records[0].Min_17;



mean[y++]=dbf.records[0].Mean_1;
mean[y++]=dbf.records[0].Mean_2;
mean[y++]=dbf.records[0].Mean_3;
mean[y++]=dbf.records[0].Mean_4;
mean[y++]=dbf.records[0].Mean_5;
mean[y++]=dbf.records[0].Mean_6;
mean[y++]=dbf.records[0].Mean_7;
mean[y++]=dbf.records[0].Mean_8;
mean[y++]=dbf.records[0].Mean_9;
mean[y++]=dbf.records[0].Mean_10;
mean[y++]=dbf.records[0].Mean_11;
mean[y++]=dbf.records[0].Mean_12;
mean[y++]=dbf.records[0].Mean_13;
mean[y++]=dbf.records[0].Mean_14;
mean[y++]=dbf.records[0].Mean_15;
mean[y++]=dbf.records[0].Mean_16;
mean[y++]=dbf.records[0].Mean_17;
z=0;
	for(var dm = 0; dm < 16; dm++){
	differenceMean[dm] = ((Number) (mean[dm+1])) - ((Number) (mean[dm]));
	}
	
	for(var minMax=0; minMax<=17;minMax++){
	    differenceMinMax[minMax]= ((Number) (max[minMax])) - ((Number) (min[minMax]));
	}

i=0,z=0,y=0,i=0;


}

function onErr(err){
console.error(err);
}



			var data2 = {
			  // A labels array that can contain any sort of values
			  labels: ['1', '2', '3', '4', '5','6','7','8','9','10','11','12','13','14','15','16','17'],

			  // Our series array that contains series objects or in this case series data arrays
			  series: [
			  max,
			  min,
			  mean
			  ]
			};
			
				var data = {
			  // A labels array that can contain any sort of values
			  labels: ['1', '2', '3', '4', '5','6','7','8','9','10','11','12','13','14','15','16','17'],

			  // Our series array that contains series objects or in this case series data arrays
			  series: [
			      differenceMean
			  ]
			};
				var dataMinMax = {
			  // A labels array that can contain any sort of values
			  labels: ['1', '2', '3', '4', '5','6','7','8','9','10','11','12','13','14','15','16','17'],

			  // Our series array that contains series objects or in this case series data arrays
			  series: [
			      differenceMinMax
			  ]
			};
			
			
			
			
			var options = {
			  fullWidth: true,
			  chartPadding: {
			  right: 40
			  }
			};

		// Create a new line chart object where as first parameter we pass in a selector
		// that is resolving to our chart container element. The Second parameter
		// is the actual data object.
		var chart = new Chartist.Line('.ct-chart', data);
		var chart2 = new Chartist.Line('.ct-chart-line', data2);
		var chartMinMax = new Chartist.Bar('.ct-chart-bar', dataMinMax);



var modal = document.getElementById('myModal');

var modal2 = document.getElementById('myModal2');
var modal3 = document.getElementById('myModal3');

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
var span2 = document.getElementsByClassName("close")[1];
var span3 = document.getElementsByClassName("close")[2];



function modal1function(){

    currentFocus = modal;
    modal.style.display = "block";
	chart.update();
}
function modal2function(){

    currentFocus = modal2;
    modal2.style.display = "block";
	chart2.update();
}
function modal3function(){

    currentFocus = modal3;
    modal3.style.display = "block";
	chartMinMax.update();
}

// When the user clicks the button, open the modal
btn.onclick = function() {
	modal1function();
modal2function();
modal3function();
console.log(max[0]);

}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}
span2.onclick=function(){
	modal2.style.display="none"
}
span3.onclick=function(){
	modal3.style.display="none"
}


// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (currentFocus == modal && event.target == modal){
        modal.style.display = "none";
		console.log("Closed modal");
    }
	else if (currentFocus == modal2 && event.target == modal2){
		modal2.style.display = "none";
		console.log("Closed modal2");
		console.log(currentFocus);
		currentFocus = modal;
	}
	else if(currentFocus == modal3 && event.target == modal3){
		modal3.style.display = "none";
		console.log("Closed modal3");
		console.log(currentFocus);
		currentFocus = modal2;
	}
}