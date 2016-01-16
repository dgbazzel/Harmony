(function(window, undefined) {

    /*********************** START STATIC ACCESS METHODS ************************/

    jQuery.extend(jimMobile, {
        "loadScrollBars": function() {
            jQuery(".s-3bebf7a7-5cf0-459f-90a1-dc47dcfca0d7 .ui-page").overscroll({ showThumbs:true, direction:'vertical' });
            jQuery(".s-8bb3fc41-c3c9-4c1e-984b-1d9fb53fb6cb .ui-page").overscroll({ showThumbs:true, direction:'vertical' });
         }
    });

    /*********************** END STATIC ACCESS METHODS ************************/

}) (window);