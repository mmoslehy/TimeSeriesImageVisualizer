$GP.m_app.messages.subscribe("displayOnMap", function (messageParams) {
    if (messageParams.mapComponentId !== "map1")
        return;

    var wmsUrl = "/api/v1/services/ogc/wms/" + messageParams.publicationProperties.serviceName,
        legendDefinition = {
            definitionName: "MAppPlatformWms",
            url: wmsUrl,
            id: messageParams.publicationProperties.catalogItemId,
            name: messageParams.publicationProperties.capabilitiesTitle,
            bbox:  messageParams.catalogItemProperties.footprint.envelope.slice(0, 4),
            bboxCrs: messageParams.catalogItemProperties.footprint.envelope[4],
            supportedCrses: messageParams.publicationProperties.outputCSList
        };

    $GP.legend.add(legendDefinition, function () {
        var bottomLeftCorner = { x: legendDefinition.bbox[0], y: legendDefinition.bbox[1] },
            topRightCorner = { x: legendDefinition.bbox[2], y: legendDefinition.bbox[3] };

        $GP.crs.transform({
            points: [bottomLeftCorner, topRightCorner],
            sourceCrsId: legendDefinition.bboxCrs,
            targetCrsId: $GP.crs.getCurrent()
        }, function (transformationResult) {
            var points = transformationResult.points,
                bbox = [points[0].x, points[0].y, points[1].x, points[1].y];

            $GP.map.zoom({
                bbox: bbox
            });
        });
    });
});
/**
 * Created by ascieszk on 21.06.2016.
 */

//START M.APP DESIGN

var transformedCoords = [];
var lastEventGeometryLength = 0;
var drawnPolygon = false;

var enablePolygonDrawingBtn;

gsp.ui.toolbar.add({
    id: "tool-enable",
    style: "background-position: 0px -288px;",
    title: "Start polygon drawing"
}, function(ret) {
    enablePolygonDrawingBtn = ret.div;
    enablePolygonDrawingBtn.addEventListener("click", onEnablePolygonDrawingBtnClick);
});

function onEnablePolygonDrawingBtnClick() {
    disableBtn(enablePolygonDrawingBtn);
    startPolygonDrawing();
}

function startPolygonDrawing() {
    gsp.map.draw.start(function() {
        setPolygonDrawType(onPolygonDrawSet);
    }, onError);
}

function setPolygonDrawType(callback) {
    gsp.map.draw.setType({ type: "polygon" }, callback, onError);
}

function onPolygonDrawSet() {
    $GP.ui.info("Draw polygon to measure (double click to end).");
    
    console.log("Clearing transformedCoords... from " + transformedCoords);
    transformedCoords = [];
    console.log("Now transformedCoords is: ");
    console.log(transformedCoords);
    
    if(!drawnPolygon)
    gsp.events.map.draw.geometryDrawn.register(measureArea, onError);
    
    drawnPolygon = true;
}

function measureArea(event) {
    console.log("About to start forloop, length of event.geometry.coordinates[0] is " + event.geometry.coordinates[0].length + " and lastEventGeometryLength is " + lastEventGeometryLength);
    lastEventGeometryLength = event.geometry.coordinates[0].length;
    for(var i=0; i<lastEventGeometryLength; i++){
        coords = event.geometry.coordinates[0].pop();
        console.log(coords);
        gsp.crs.transform({
            sourceCrsId: gsp.crs.getCurrent(),
            targetCrsId: "EPSG:32614",
            points: [{
                x: coords[0],
                y: coords[1],
            }]
        }, pushCoords,
            function(err) {
                console.error(err.msg);
            });
    }
}

function pushCoords(result){
    console.log("pushing in transformedCoords");
    transformedCoords.push([result.points[0].x, result.points[0].y]);
    
    console.log("transformedCoords.length = " + transformedCoords.length + " and lastEventGeometryLength = " + lastEventGeometryLength)
    if(transformedCoords.length == lastEventGeometryLength){
        console.log("Calling onMeasureResult()");
        onMeasureResult();
    }
}

function onMeasureResult() {
    //TEMP
    /*gsp.map.draw.end(function() {
        console.log("in onMeasureResult()... transformedCoords incoming");
        console.log(transformedCoords);
        downloadShp(transformedCoords);
    }, onError);*/
    enableBtn(enablePolygonDrawingBtn);
    if(!downloadShp(transformedCoords))
      gsp.map.draw.end(function() {}, onError);
}

function onError(error) {
    console.error(error);
}

function enableBtn(btn) {
    btn.style.pointerEvents = "auto";
    btn.style.opacity = 1;
}

function disableBtn(btn) {
    btn.style.pointerEvents = "none";
    btn.style.opacity = 0.4;
}


function downloadShp(coords){
    
	var graphic = 
		{	
		geometry: 
			{
			rings: [coords],
			type: "polygon"
			}
		}
		
	var fileName = prompt("Input a file name for the shp files");
	if(fileName === null) return false;
	if(fileName.length < 1)
    	fileName = "polygonShp";
	
        var shapewriter = new Shapefile();
		shapewriter.addESRIGraphics([graphic]);
		var res = shapewriter.getShapefile("POLYGON");
		// res is object with properties "successful" and "shapefile"
		if (res.successful) {
			var shapefile = res['shapefile'];
			// shapefile is object with properties "shp", "shx" and "dbf" - use these names as file extensions
			var saver = new BinaryHelper();
			for (var actualfile in shapefile) {
				if (shapefile.hasOwnProperty(actualfile)) {
				    //SKIP DBF FILE
				    if(actualfile === "dbf") continue;
					saver.addData({
						filename: fileName,
						extension: actualfile,
						datablob: shapefile[actualfile]
					});
				}
			}
			
			//ADD PRJ FILE
			
			var prjData = 'PROJCS["WGS_1984_UTM_Zone_14N",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["false_easting",500000.0],PARAMETER["false_northing",0.0],PARAMETER["central_meridian",-99.0],PARAMETER["scale_factor",0.9996],PARAMETER["latitude_of_origin",0.0],UNIT["Meter",1.0]]';
			
            var prjBuf = new ArrayBuffer(prjData.length*2); // 2 bytes for each char
            var bufView = new Uint16Array(prjBuf);
            for (var i=0, strLen=prjData.length; i<strLen; i++) {
                bufView[i] = prjData.charCodeAt(i);
            }
			
			var prjBb = saver.createBlob();
			prjBb.append(prjBuf);
			
			var prjFakeBlob = prjBb.getBlob();
			prjFakeBlob.data = encodeURIComponent(prjData);
			prjFakeBlob.encoding = "URI";
			
			saver.addData({
			filename: fileName,
			extension: "prj",
			datablob: prjFakeBlob})
			// btn will be created either as normal HTML button that calls saveNative (in Chrome),
			// or flash look-a-like which uses downloadify to save 
			
			saver._saveNative();
			// in the case of Chrome we could also call saver.saveNative() programatically at this point 
			// without need for user interaction, but downloadify can only save in response to 
			// actual click event on its button	
			return true;
		}
		else {
			console.error("Error generating shapefile");
			return false;
		}
	}