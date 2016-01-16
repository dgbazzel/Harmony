/*!
 * Copyright 2013 Justinmind. All rights reserved.
 */

(function(window, undefined) {
    /*********************** START LOCAL METHOD DEFINITION ************************/
	function highLight(value, fired) {
		//Obtain elements to highlight
		var elements = jQuery("#simulation " + value)
		var shape_elements = elements.filter(function (index, element) {
												if (element.tagName == "path" || element.tagName == "ellipse") return true;
												return false;
											});
		elements = elements.not(':hidden').not('.shapewrapper .content');
		var zoom = jimUtil.getZoom() * (1/jimUtil.getDivZoom());
		
		var rects = [];
		if (elements.length > 0 && fired) $(document.body).addClass("highlightTransition");
		for (var i = 0; i < elements.length + shape_elements.length; ++i) {
			//Obtain info about the element
			var el;
			var shape = false;
			if (i < elements.length) el = $(elements[i]);
			else {
				el = selectShapeWrapper(shape_elements[i - elements.length]);	
				shape = true;
			}
			
			var bb = el[0].getBoundingClientRect();
			var absolutePos = $(el).css("position") == "absolute";
			
			//Create element that contains the rectangle
			var newElement = $('<div />', {"class": 'highlightEffect'})
			newElement.css({"position": "absolute", "width": bb.width*zoom - 4, "height": bb.height*zoom - 4});
			newElement.bind('click', function() {event.stopPropagation();});
			if (absolutePos) newElement.css({"top": $(el).css("top"), "left": $(el).css("left")});
			
			//Create the wrapper if the element is not a cell
			if ($(el).is("td") || $(el).is("tr")) $(el).append(newElement);
			else $(el).parent().append(newElement);
			
			fixRectanglePosition($(el), newElement, zoom, shape);
			rects.push(newElement);
		}
		
		//Animate the rectangle and restore the initial state
		rects = $(rects).map (function () {return this.toArray(); } );	
		rects.animate({opacity: 1}, 500, function() {	
			rects.animate({ opacity: 0 }, 500, function() {
				rects.remove();
				if (fired) $(document.body).removeClass("highlightTransition");
	        });			
		});
	}
	
	//Given a shape returns the shapewrapper div
	function selectShapeWrapper(el) {
		while (!$(el).hasClass("shapewrapper") && el.tagName != "BODY") 
			el = $(el).parent();
		
		return el;
	}
	
	//This function fixes any difference between the highlight rectangle and the element positions.
	function fixRectanglePosition(el, rect, zoom, shape) {
		var rpos = rect.offset();
		var epos = el.offset();
		var panel = (el.hasClass('panel'));
		var angle = (panel) ? getRotationDegrees(el.parent().parent()) : getRotationDegrees(el);
		var addAngle = jimUtil.getAdditiveRotationDegrees(el);
		
		if (addAngle == 0) {
			if (rpos.left != epos.left) rect.css({"left": (epos.left - rpos.left)*zoom});
			if (rpos.top != epos.top) rect.css({"top": (epos.top - rpos.top)*zoom});
		}
		else {
			//Special treatment for rotated elements
			var border = (shape || panel) ? 4 : 0;
			var left = parseInt(el.css('left'));
			var top = parseInt(el.css('top'));

			if (!isNaN(left) && !isNaN(top)) rect.css({"left": left*zoom, "top": top*zoom});
			rect.css({ "width":parseInt(el.css('width')) - border, "height":parseInt(el.css('height'))-border});
			
			if(!(panel)) {				
				var ebb = el[0].getBoundingClientRect();
				var rbb = rect[0].getBoundingClientRect();
				left = (ebb.left + (ebb.width)/2 - el.jimOuterWidth()/2) - (rbb.left + (rbb.width)/2 - rect.jimOuterWidth()/2);
				top = (ebb.top + (ebb.height)/2 - el.jimOuterHeight()/2) - (rbb.top + (rbb.height)/2 - rect.jimOuterHeight()/2);
				
				var parentAngle = addAngle - angle;
				var tString = "rotate(" + -parentAngle + "deg)" +
							  "translate(" + left*zoom + "px," + top*zoom + "px)" +
							  "rotate(" + (parentAngle+angle) + "deg)";
				rect.css({ "-webkit-transform": tString, 
					   "-moz-transform": tString,
			           "transform": tString});
			}
			else 
				el.parent().css({"width":parseInt(el.css('width')), "height":parseInt(el.css('height'))});
			
		}
	}

    function addHighlightListenerLocal() {
	jQuery("#highlight-select li").mouseup(function () {
			var $option = $(this);
			var value = $option[0].attributes[0].value;
			highLight(value, false);
		});
    }

    /* START MAIN */
    addHighlightListenerLocal();
    /* END MAIN */

    var jimHighlight = {
		"highLightAll" : function() {
			if (!$(document.body).hasClass("noHighlight") && !$(document.body).hasClass("highlightTransition") && !jQuery("#comments-switch-img").hasClass(commentOnClass)) {
				var value = ".click, .toggle";
				highLight(value, true);
			}
		}
    }
    
    function isInteractiveSrcElement(e) {
    	var el = e.srcElement;
    	if (el != undefined) {
    	  	var tag = el.tagName;
    	  	if (tag == "INPUT" || tag == "SELECT" || tag == "TEXTAREA" || $(el).hasClass("option") || $(el).hasClass("treeicon")) return true;
    	}
    	
    	return false;
    }
      
	function hasFirerDataRow(e) {
		if (e.srcElement != undefined) {
			var dr = $(e.srcElement).closest("tr.datarow");
			if (dr != undefined && $(dr).hasClass("click")) return true;
		}
		return false;
	}
			  
	$('#simulation').bind('click', function (event, handled) {
		if ((handled == undefined || !handled) && !isInteractiveSrcElement(event) && !hasFirerDataRow(event))
			jimHighlight.highLightAll();
	});

	window.jimHighlight = jimHighlight;
})(window);

