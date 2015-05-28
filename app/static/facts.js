$( document ).ready(function() {
	var newColor;
	backgrounds = ['#3584A2','#4cbde7','#64b278','#77b23e','#e7764c','#f0aa8f','#774ce7','#aa8ff0']
	var clicks = 0;
	var visited = new Array();
	visited.push(factID);

	// The next button. Adds a click and then kicks off the changing of the fact
	$(document).on( 'click', '.next', function(e) {
		clicks++;
		ga('send', 'event', 'Curious City Facts', 'click', 'still curious', {'page': '/'+factID});	
		$('.fact').animate({
    		opacity:0, 
    	}, 250, function(){
			changeFact();
		});
	});

	// Checks number of clicks to see if a callout shoud happen. If not, get a new fact
    function changeFact(){
    	console.log(clicks+' '+count);
		if (clicks % count == 0){
			visited = [];
		};
		if ((clicks % 10) == 0 && clicks > 0) {
			visited.push('donate');
			history.pushState({path:'donate'}, '', 'donate');
			updateTemplate('donate');
			// send ga pageview
			ga('send', 'pageview', '/donate');
		} else {
			getNewFact();
		};
	};

	// Calls for a new fact, checks if it's already been seen. If not, update the template, if so, get another
	function getNewFact(callback){
		$.get('/random',function(data){
			if ($.inArray(data,visited) != -1 || data == 'donate') {
				getNewFact();
			} else {
				visited.push(data);
				history.pushState({path:data}, '', data);
				updateTemplate(data);
				// send ga pageview
				ga('send', 'pageview', '/'+data);
			}
		});
	};

	// Take a fact ID and update the template
	function updateTemplate(entryID){
		newColor = backgrounds[Math.floor((Math.random()*backgrounds.length))];
		$('.card').load("/html/"+entryID,function(){
			$(".fa-refresh, .footer").hover(
				function(){$('.fa-refresh').css('color',newColor)},
				function(){$('.fa-refresh').css('color','white')}
			);
			
			$(".story").hover(
				function(){$('.story').css('color',newColor)},
				function(){$('.story').css('color','white')}
			);
			$(".social .fa").hover(
				function(){$(this).css('color',newColor)},
				function(){$(this).css('color','white')}
			);
			$(".fa-camera").hover(
				function(){$(this).css('color',newColor)},
				function(){$(this).css('color','white')}
			);
			$('body,.modal-content').css({
	        	'background-color': newColor
	    	});
	    	$('.next').trigger('mouseenter');

	    	$('.fa-camera').click(function(){
				var image = $(this).data("image") 
				$('#photoModal .modal-content').css('background-image', 'url(' + image + ')');
				$('#photoModal').modal()
			});

	    	// Set meta properties to share the fact
    		$('meta[property=twitter\\:url]').attr('content', window.location.href);
			$('meta[property=twitter\\:description]').attr('content',"{{data['Readable Slug']}}");
			$('meta[property=twitter\\:image]').attr('content',"https://s3.amazonaws.com/wbez-assets/curiousfacts/shareimages/{{data.ID}}.png");

			$('meta[property=og\\:url]').attr('content', window.location.href);
			$('meta[property=og\\:description]').attr('content',"{{data.FactTweet|e}}");
			$('meta[property=og\\:image]').attr('content',"https://s3.amazonaws.com/wbez-assets/curiousfacts/shareimages/{{data.ID}}.png");

			resizeText();
				
		});
		
	};
	
	$('.story').click(function() {
		// send analytics event when clicking to full story or donation page
		if (factID == "donate") {
			gaLabel = "donate";
		} else {
			gaLabel =	"full story";		
		}
		ga('send', 'event', 'Curious City Facts', 'click', gaLabel, {'page': '/'+factID});
	})
	
	$('.fa-twitter').click(function() {
		// send analytics event when clicking to share via twitter
		ga('send', 'event', 'Curious City Facts', 'click', 'twitter', {'page': '/'+factID});		
	});
	
	$('.fa-facebook').click(function() {
		// send analytics event when clicking to share via facebook
		ga('send', 'event', 'Curious City Facts', 'click', 'facebook', {'page': '/'+factID});		
	});	
	
	$('.fa-envelope').click(function() {
		// send analytics event when clicking to share via email
		ga('send', 'event', 'Curious City Facts', 'click', 'email', {'page': '/'+factID});		
	});

	$('.modal-btn').click(function(){
		$('.modal').modal('toggle');
	})

	$('.fa-camera').click(function(){
		var image = $(this).data("image"); 
		$('#photoModal .modal-content').css('background-image', 'url(' + image + ')');
		$('#photoModal').modal();
		// send analytics event when clicking on image modal
		ga('send', 'event', 'Curious City Facts', 'click', 'picture modal', {'page': '/'+factID});		
	});

	var resizeText = function() {

		var cheight = $(window).outerHeight() - $('.header').outerHeight( true ) - $('.logo').outerHeight( true ) - $('.social').outerHeight( true ) - $('.next').outerHeight( true );

		heightBuffer = cheight-(cheight/4);

		// Resize if text is bigger than div
	    while( ($('.fact').outerHeight() > cheight) && (cheight > 0) && (parseInt($('.fact').css('font-size'))>8)) {
	        $('.fact').css('font-size', (parseInt($('.fact').css('font-size')) - 1) + "px" );
	    }
	    // Resize if text is smaller than div - buffer
	    while( ($('.fact').outerHeight() < heightBuffer) && (cheight > 0) && (parseInt($('.fact').css('font-size'))<64)) {
	        $('.fact').css('font-size', (parseInt($('.fact').css('font-size')) + 1) + "px" );
	    }
	};

	resizeText();

	var resizePhoto = function () {
		var cwidth = $('.container').width();
		var cheight = $(window).height() - $('.header').outerHeight( true ) - $('.logo').outerHeight( true ) - $('.next').outerHeight( true ) - $('.social').outerHeight( true );
		var ratio = $('.fact-photo').height()/$('.fact-photo').width();
		if (cheight > cwidth) {
			$('.fact-photo').width(cwidth);
			$('.fact-photo').height(cwidth*ratio);
		} else {
			$('.fact-photo').width(cheight/ratio);
			$('.fact-photo').height(cheight);
		}
	};

	$('.initiator').on('mouseenter mouseleave', function(e) {
	    $('.receiver').trigger(e.type);
	})

	$( window ).resize(function() {
		resizeText();
	});

	window.addEventListener('popstate', function(event) {
	  updateTemplate(event.state.path)
	});

});