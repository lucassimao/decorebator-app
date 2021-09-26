$(document).ready(function() {
	
    /* ======= FAQ accordion ======= */
    $('.card-toggle').on('click', function () {
      if ($(this).find('svg').attr('data-icon') == 'plus-square' ) {
        $(this).find('svg').attr('data-icon', 'minus-square');
      } else {
        $(this).find('svg').attr('data-icon', 'plus-square');
      };
    });
    
    
	/* ======= Play/Stop Video in Bootstrpa Modal  ======= */
	/* ======= Note: Chrome 66+ doesn't allow vimeo video auto play (https://github.com/vimeo/player.js/issues/199) ====== */

    $('.video-play-trigger ').on('click', function() {
        
        var theModal = $(this).data("target");
        var theVideo = $(theModal + ' iframe').attr('src');
        var theVideoAuto = theVideo + "?autoplay=1";
        
        $(theModal).on('shown.bs.modal', function () {
            $(theModal + ' iframe').attr('src', theVideoAuto);
        });
        
        $(theModal).on('hide.bs.modal', function () {
            $(theModal + ' iframe').attr('src', '');
        });
        
        $(theModal).on('hidden.bs.modal', function () {
            $(theModal + ' iframe').attr('src', theVideo);
        });
 
    });
    

});