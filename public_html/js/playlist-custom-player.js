$(document).ready(function(){	
	$.vegas({src:'img/bg0.jpg'});
    $.vegas('overlay', { src:'js/vegas/overlays/01.png',opacity:0.9});

	cargaEstacion("3","central jazz");
	cargaListaEstaciones();

	$('#jp_container_1').fadeIn();

	$(".jp-cog").click(function(){
		$(".secondary-row").slideToggle();
	});

	
});

var cargaEstacion = function(IdEstacion,DescEstacion){
	
	setTituloEstacion("Cargando... "+DescEstacion);
	setStatus("Cargando... "+DescEstacion);	
	
	var cssSelector = {
		jPlayer: "#jquery_jplayer_1", 
		cssSelectorAncestor: "#jp_container_1",
		cssSelector: {
			play: ".jp-play",
			pause: ".jp-pause",
			stop: '.jp-stop',
			seekBar: '.jp-seek-bar',
			playBar: '.jp-play-bar',
			mute: '.jp-mute',
			unmute: '.jp-unmute',
			currentTime: '.jp-current-time',
			duration: '.jp-duration',
			title: '.jp-title',
			artist: '.jp-artist'
		}
	};

	var playlist = []; // Empty playlist

	var playlistOptions = {
		playlistOptions: {
			autoPlay: true,
			enableRemoveControls: true
		}
	};

	var options = {
		swfPath: "../bower_components/jplayer/jquery.jplayer/",
		supplied: "mp3",
		wmode: "window",
		smoothPlayBar: true,
		keyEnabled: true
	};

	var myPlaylist = new jPlayerPlaylist(cssSelector, playlist, playlistOptions, options);
	var param = (IdEstacion)?"estacion="+IdEstacion:null;

	spinerToggle(1);
	
	$.getJSON("http://accentus.mx/speakker/jplaylist.php?"+param,function(data){		
		console.log(JSON.stringify(data));
	})
	.done(function(data) { 
		if(data) {
			console.info('playlist->begin-get');
			myPlaylist.remove(); 
			$.each(data,function(index,value){
				myPlaylist.add(value);

			});
			console.info('playlist->get-success');
			myPlaylist.play(); 
			console.info('playlist->play!');
			setStatus("Escuchas "+(DescEstacion).toUpperCase());
			spinerToggle(0);
		} else {
			setStatus("La estacion no puede cargarse, intente mas tarde.");
		}		
	})
	.fail(function(jqXHR, textStatus, errorThrown) { console.log('getJSON [jplaylist] request failed! ' + textStatus); })
	.always(function() { console.log('getJSON request ended!'); });	

};

var cargaListaEstaciones = function(){

	$.getJSON("http://accentus.mx/webradio/public_html/getlista.php",function(data){
		console.log(JSON.stringify(data));
	})
	.done(function(data) { 
		if(data) {
			console.info('getlista->begin-get');
			var targetObj = $('#menu-estaciones');
			$.each(data,function(index,value){
				targetObj.append('<li><a class="estacionitem" href="javascript:;" value="'+$.trim(value['id'])+'">'+$.trim(value['desc']).toLowerCase()+'</a></li>');			
			});

			console.info('getlista->get-success');		

			$(".estacionitem").click(function(){			
				cargaEstacion($(this).attr('value'),$(this).text());
				console.log("carga-estacion->" + $(this).attr('value')+"<-");
			});
		} else {
			setStatus("Las estaciones no pueden cargarse, intente mas tarde.");
		}		
	})
	.fail(function(jqXHR, textStatus, errorThrown) { console.log('getJSON [getlista] request failed! ' + textStatus); })
	.always(function() { console.log('getJSON request ended!'); });

}

var setTituloEstacion = function(titulo){
	var t = $('.jp-title');
	t.text(titulo);
}

var setStatus = function(status){
	var s = $('.status');
	s.text(status);
}

var spinerToggle = function(status){
	


	switch(status) {
	    case 0:			
			$("#r01").css({ 'color': '#0FB66A'});	
			$(".spinner").remove();	
			console.log("spinner on");
	        break;

	    case 1:
	    	var target = document.getElementById('r01')
	
			var opts = {
					  lines: 7, // The number of lines to draw
					  length: 8, // The length of each line
					  width: 2, // The line thickness
					  radius: 10, // The radius of the inner circle
					  corners: 1, // Corner roundness (0..1)
					  rotate: 0, // The rotation offset
					  direction: 1, // 1: clockwise, -1: counterclockwise
					  color: '#0FB66A', // #rgb or #rrggbb or array of colors
					  speed: 0.8, // Rounds per second
					  trail: 50, // Afterglow percentage
					  shadow: false, // Whether to render a shadow
					  hwaccel: false, // Whether to use hardware acceleration
					  className: 'spinner', // The CSS class to assign to the spinner
					  zIndex: 2e9, // The z-index (defaults to 2000000000)
					  top: '50%', // Top position relative to parent
					  left: '50%' // Left position relative to parent
					};					
	    	var spinner = new Spinner(opts).spin(target);
	        $("#r01").css({ 'color': 'white'});
	        break;	        
	    default:
	    	console.log("obj");
	        
	}
}