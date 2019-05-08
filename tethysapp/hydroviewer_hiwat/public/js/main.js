

let $loading = $('#view-file-loading');

let base_layer = new ol.layer.Tile({
	source: new ol.source.BingMaps({
		key: 'eLVu8tDRPeQqmBlKAjcw~82nOqZJe2EpKmqd-kQrSmg~AocUZ43djJ-hMBHQdYDyMbT-Enfsk0mtUIGws1WeDuOvjY4EXCH-9OK3edNLDgkc',
		imagerySet: 'Road'
	})
});


//let bangladesh_rivers = new ol.layer.Vector({
//    source: new ol.source.Vector({
//        format:new ol.format.GeoJSON(),
//        url:'workspaces/app_workspace/rivers_not_transboundary.geojson'
//    })
//})

let bangladesh_rivers = new ol.layer.Image({
	source: new ol.source.ImageWMS({
		url: 'https://tethys.byu.edu/geoserver/Bangladesh_Hydroviewer/wms',
//		params: { 'LAYERS': 'rivers_not_transboundary' },
		params: { 'LAYERS': 'bangladesh-highres-drainage_line1' },
		serverType: 'geoserver',
		crossOrigin: 'Anonymous'
	})
});


let feature_layer = bangladesh_rivers;

let bangladesh_rivers_trans = new ol.layer.Image({
	source: new ol.source.ImageWMS({
		url: 'https://tethys.byu.edu/geoserver/Bangladesh_Hydroviewer/wms',
		params: { 'LAYERS': 'transboundary_rivers' },
		serverType: 'geoserver',
		crossOrigin: 'Anonymous'
	})
});

bangladesh_rivers_trans.setOpacity(0.8);


let map = new ol.Map({
	target: 'showMapView',
	layers: [base_layer, bangladesh_rivers, bangladesh_rivers_trans],
	view: new ol.View({
		center: ol.proj.fromLonLat([90.7, 24.5]),
		zoom: 6.5
	})
});



function get_hiwat (comid,startdate) {
	$('#hiwat-loading').removeClass('hidden');
	$.ajax({
        url: '/apps/hydroviewer-hiwat/get-hiwat/',
        type: 'GET',
        data: {
            'comid' : comid,
            'startdate': startdate
        },
        error: function () {
            $('#info').html('<p class="alert alert-danger" style="text-align: center"><strong>An unknown error occurred while retrieving the data</strong></p>');
            $('#info').removeClass('hidden');

            setTimeout(function () {
                $('#info').addClass('hidden')
            }, 5000);
        },
        success: function (data) {
            if (!data.error) {
                $('#hiwat-loading').addClass('hidden');
                $('#dates').removeClass('hidden');
//                $('#obsdates').removeClass('hidden');
                $loading.addClass('hidden');
                $('#hiwat-chart').removeClass('hidden');
                $('#hiwat-chart').html(data);

                //resize main graph
                Plotly.Plots.resize($("#hiwat-chart .js-plotly-plot")[0]);

                let params = {
                    comid: comid,
                    //adding this ...
                    startdate: startdate
                };

                $('#submit-download-hiwat').attr({
                    target: '_blank',
                    href: '/apps/hydroviewer-hiwat/download-hiwat?' + jQuery.param(params)
                });

                 $('#download-hiwat').removeClass('hidden');

            } else if (data.error) {
            	$('#info').html('<p class="alert alert-danger" style="text-align: center"><strong>An unknown error occurred while retrieving the Data</strong></p>');
            	$('#info').removeClass('hidden');

            	setTimeout(function() {
            		$('#info').addClass('hidden')
                }, 5000);

            } else {
            	$('#info').html('<p><strong>An unexplainable error occurred.</strong></p>').removeClass('hidden');
            }
        }
    });
}

function get_historic (comid) {

	$('#historic-loading').removeClass('hidden');
	$.ajax({
        url: '/apps/hydroviewer-hiwat/get-historic/',
        type: 'GET',
        data: {'comid' : comid},
        error: function () {
            $('#info').html('<p class="alert alert-danger" style="text-align: center"><strong>An unknown error occurred while retrieving the data</strong></p>');
            $('#info').removeClass('hidden');

            setTimeout(function () {
                $('#info').addClass('hidden')
            }, 5000);
        },
        success: function (data) {
            if (!data.error) {
                $('#historic-loading').addClass('hidden');
                $('#dates').removeClass('hidden');
//                $('#obsdates').removeClass('hidden');
                $loading.addClass('hidden');
                $('#historic-chart').removeClass('hidden');
                $('#historic-chart').html(data);

                //resize main graph
                Plotly.Plots.resize($("#historic-chart .js-plotly-plot")[0]);

                let params = {
                    comid: comid,
                };

                $('#submit-download-historic').attr({
                    target: '_blank',
                    href: '/apps/hydroviewer-hiwat/download-historic?' + jQuery.param(params)
                });

                 $('#download-historic').removeClass('hidden');

            } else if (data.error) {
            	$('#info').html('<p class="alert alert-danger" style="text-align: center"><strong>An unknown error occurred while retrieving the Data</strong></p>');
            	$('#info').removeClass('hidden');

            	setTimeout(function() {
            		$('#info').addClass('hidden')
                }, 5000);

            } else {
            	$('#info').html('<p><strong>An unexplainable error occurred.</strong></p>').removeClass('hidden');
            }
        }
    });
}
function get_available_dates(comid) {
      console.log("entering get_available_dates_javascript");
       $.ajax({
           type: 'GET',
           url: '/apps/hydroviewer-hiwat/get-available-dates/',
           dataType: 'json',
           data: {
               'comid': comid
           },
           error: function() {
               $('#dates').html(
                   '<p class="alert alert-danger" style="text-align: center"><strong>An error occurred while retrieving the available dates</strong></p>'
               );

               setTimeout(function() {
                   $('#dates').addClass('hidden')
               }, 5000);
           },
           success: function(dates) {
               console.log(dates);
               datesParsed = JSON.parse(dates.available_dates);
               $('#datesSelect').empty();

               $.each(datesParsed, function(i, p) {
                   //var val_str = p.slice(1).join();
                   var val_str = p;
                   console.log(val_str);
                   $('#datesSelect').append($('<option></option>').val(val_str).html(p));
               });

           }
       });

}

function get_return_periods(comid) {
    console.log('entering get_return_periods_function ..')
    $.ajax({
        type: 'GET',
        url: '/apps/hydroviewer-hiwat/get-return-periods/',
        dataType: 'json',
        data: {
            'comid': comid
        },
        error: function() {
            $('#info').html(
                '<p class="alert alert-warning" style="text-align: center"><strong>Return Periods are not available for this dataset.</strong></p>'
            );

            $('#info').removeClass('hidden');

            setTimeout(function() {
                $('#info').addClass('hidden')
            }, 5000);
        },
        success: function(data) {
            console.log(data);
            console.log(typeof(data))
            $("#hiwat-chart").highcharts().yAxis[0].addPlotBand({
                from: parseFloat(data.return_periods.twenty),
                to: parseFloat(data.return_periods.max),
                color: 'rgba(128,0,128,0.4)',
                id: '20-yr',
                label: {
                    text: '20-yr',
                    align: 'right'
                }
            });
            $("#hiwat-chart").highcharts().yAxis[0].addPlotBand({
                from: parseFloat(data.return_periods.ten),
                to: parseFloat(data.return_periods.twenty),
                color: 'rgba(255,0,0,0.3)',
                id: '10-yr',
                label: {
                    text: '10-yr',
                    align: 'right'
                }
            });
            $("#hiwat-chart").highcharts().yAxis[0].addPlotBand({
                from: parseFloat(data.return_periods.two),
                to: parseFloat(data.return_periods.ten),
                color: 'rgba(255,255,0,0.3)',
                id: '2-yr',
                label: {
                    text: '2-yr',
                    align: 'right'
                }
            });
        }
    });
}


map.on('pointermove', function(evt) {
	if (evt.dragging) {
		return;
	}
	let pixel = map.getEventPixel(evt.originalEvent);
	let hit = map.forEachLayerAtPixel(pixel, function(layer) {
		if (layer == feature_layer) {
			current_layer = layer;
			return true;
		}
	});
	map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});

map.on("singleclick", function(evt) {

	if (map.getTargetElement().style.cursor == "pointer") {

		let view = map.getView();
		let viewResolution = view.getResolution();
		let wms_url = current_layer.getSource().getGetFeatureInfoUrl(evt.coordinate, viewResolution, view.getProjection(), { 'INFO_FORMAT': 'application/json' });

		if (wms_url) {

			$("#graph").modal('show');
			$('#hiwat-chart').addClass('hidden');
			$('#historical-chart').addClass('hidden');
			$('#hiwat-loading').removeClass('hidden');
			$('#historical-loading').removeClass('hidden');
			$("#stream-info").empty()
			//$('#download_hiwat').addClass('hidden');
			//$('#download_historical').addClass('hidden');

			$.ajax({
				type: "GET",
				url: wms_url,
				dataType: 'json',
				success: function (result) {
					comid = result["features"][0]["properties"]["COMID"];
					countryname = 'Bangladesh';
					model = 'Hiwat';
					$("#stream-info").append('<h3 id="Country-Tab">Country: '
						+ countryname + '</h3><h5 id="Model">Model: '+ model
						+ '</h5><h5 id="COMID">COMID: '+ comid + '</h5>');
					get_hiwat (comid,'0')
					get_historic (comid)
					get_available_dates(comid)
//					get_return_periods(comid)

					 $('#datesSelect').change(function() { //when date is changed
                        var sel_val = ($('#datesSelect option:selected').val()).split(',');
                        var index=$('#datesSelect').find(':selected').index();
                        var indexString=index.toString();
                        console.log("check");
                        console.log(index);
                        console.log(typeof index);
                        console.log($('#datesSelect option:selected').val());
                        console.log(sel_val);
                        var startdate = indexString;
                        $loading.removeClass('hidden');
                        get_hiwat(comid, startdate);
                        //get_return_periods(comid)

                       // get_forecast_percent(comid, startdate);
                     });

				}
			});


		}
	};
});

function resize_graphs() {
    $("#hiwat_tab_link").click(function() {
        Plotly.Plots.resize($("#hiwat-chart .js-plotly-plot")[0]);
    });
    $("#historic_tab_link").click(function() {
        Plotly.Plots.resize($("#historic-chart .js-plotly-plot")[0]);
    });
};

