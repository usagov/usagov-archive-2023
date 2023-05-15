// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

jQuery(function(){
 jQuery('.vidscrpt button').bind('click', function(){acordionNav3(this);}); //Video Transcript Box
  jQuery('.infographicscrpt button').bind('click', function(){acordionNav4(this);}); //Infographic Description Box
  jQuery('.mrtp button').bind('click', function(){acordionNav5(this);}); //Leftnav
  function acordionNav3(este){
	jQuery('.transcript').slideToggle(300, function(){
		var transcriptIcon = jQuery(this).prev().find('span');
		if(transcriptIcon.attr('class')=='arrowDwn'){
			transcriptIcon.removeClass('arrowDwn');
			transcriptIcon.text(jQuery('html').attr('lang')=="en" ? "Hide the Video Transcript" : "Ocultar la transcripci\u00F3n del video");
		}else{
			transcriptIcon.addClass('arrowDwn');
			transcriptIcon.text(jQuery('html').attr('lang')=="en" ? "Show the Video Transcript" : "Mostrar la transcripci\u00F3n del video");
		}
	});
  }
  function acordionNav4(este){
  jQuery('.infographicdesc').slideToggle(300, function(){
    var transcriptIcon = jQuery(this).prev().find('span');
    if(transcriptIcon.attr('class')=='arrowDwn'){
      transcriptIcon.removeClass('arrowDwn');
      transcriptIcon.text(jQuery('html').attr('lang')=="en" ? "Hide Description of Infographic" : "Ocultar descripciÃ³n de la infografÃ­a");
    }else{
      transcriptIcon.addClass('arrowDwn');
      transcriptIcon.text(jQuery('html').attr('lang')=="en" ? "Show Description of Infographic" : "Ver descripciÃ³n de la infografÃ­a");
    }
  });
  }
  function acordionNav5(este){
  jQuery('.shade').slideToggle(300, function(){
    var moreleftIcon = jQuery(this).prev().find('.mrtpc');
    if(moreleftIcon.hasClass('minus')){
      moreleftIcon.removeClass('minus');
    }else{
      moreleftIcon.addClass('minus');
    }
  });
  }

  /*phone number*/
  if (window.innerWidth <= 950) {
    $(".num").replaceWith(function () {
      return $("<a href='tel:" + $(this).html() + "'>" + $(this).html() + "</a>");
    });
  }

  if (window.innerWidth >= 950) {
    $('a[href^="tel:"]').replaceWith(function () {
      return $('<span class="num">'+ $(this).html() + '</span>');
    });
  }

}); 


