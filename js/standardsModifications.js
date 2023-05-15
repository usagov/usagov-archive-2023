var navBreakpoint = 950; // width where the page switches between mobile/desktop
var width, uprevWidth, mobile; // width and uprevWidth determine current breakpoint and if a change is needed
var wasdesktop=false;

jQuery(function(){

var beta_equivalent = document.querySelector('meta[name="beta-equivalent"]');
var beta_link = document.querySelector('#beta-link');
var pagelevel_beta_link = document.querySelector('#pagelevel-beta-link');
if(beta_equivalent){
	if(beta_link){
		beta_link.href = beta_equivalent.content;
	}
	if(pagelevel_beta_link){
		pagelevel_beta_link.href = beta_equivalent.content;
	}
}

	width=uprevWidth=viewportWidth();
  mobile=false;
  if(width <= navBreakpoint){
		mobile=true;
    mobileNav();
  }else{
    desktopNav();
  }
	
	jQuery('.hptoggles').focusin(function(){
		closeNav();
	});

	jQuery('.usa-nav-close').click(function(){
		closeNav();
		jQuery('.usa-menu-btn').focus();
	});
	jQuery('.usa-menu-btn').click(function(){
		jQuery('.usa-menu-button').attr('aria-expanded', 'true');
		jQuery('.usa-nav').attr('aria-hidden', 'false');
		jQuery('.usa-nav').addClass('is-visible');
		jQuery('.usa-overlay').addClass('is-visible');
		jQuery('body').addClass('usa-mobile_nav-active');
		jQuery('.usa-nav-close').focus();
	});

});

function closeNav(){
	jQuery('.usa-accordion-button').attr('aria-expanded', 'false');
	jQuery('.usa-nav-submenu').attr('aria-hidden', 'true');
	jQuery('.usa-menu-button').attr('aria-expanded', 'false');
	jQuery('.usa-nav').attr('aria-hidden', 'true');
	jQuery('.usa-nav').removeClass('is-visible');
	jQuery('.usa-overlay').removeClass('is-visible');
	jQuery('body').removeClass('usa-mobile_nav-active');
	if(mobile){
		untabbable();
	}
	var alltpcs=document.getElementById('MobileMenuAllTopics');
	if (alltpcs.hasAttribute('aria-expanded')) {
		alltpcs.click();
	}
	var nodes = document.querySelectorAll('[data-critical-path]');
	//for (var node of nodes) {
	for( var i=0; i< nodes.length ; i++){
		var node=nodes[i];
		node.click();
	}
}

function viewportWidth() {
  return window.innerWidth || document.body.clientWidth;//Must use document.body.clientWidth for browser support.
}
jQuery(window).resize(function() {
  width=viewportWidth();
  if(width<=navBreakpoint
		 && uprevWidth>navBreakpoint
	){
    mobile=true;
    mobileNav();
  }else if(width>navBreakpoint 
		 && uprevWidth<=navBreakpoint
	){
    mobile=false;
    desktopNav();
  }

  uprevWidth=width;
  //updateStickies
  if(jQuery('#backToTop').length>0)
	jQuery('#backToTop').updateSticky();
});
jQuery(window).scroll(function() {
  scrollTop=$(window).scrollTop();
  //updateStickies
  if(jQuery('#backToTop').length>0)
	jQuery('#backToTop').updateSticky();
  if(jQuery('.usa-header').length>0)
	jQuery('.usa-header').updateSticky();
});

function tabbable() {
	jQuery('.usa-nav a, .usa-nav button, .usa-nav input').removeAttr('tabindex');
}
function untabbable() {
	jQuery('.usa-nav a, .usa-nav button, .usa-nav input').attr('tabindex', -1);
}
function mobileNav() {
	if(jQuery('.usa-nav').hasClass('is-visible')){
		tabbable();
	}else{
		untabbable();
	}
	//jQuery('.usa-menu-btn, .usa-nav-close').unbind( "click" );
	jQuery('.usa-menu-btn, .usa-nav-close').on('click', function(){
		if(jQuery('.usa-nav').hasClass('is-visible')){
			if(wasdesktop){
				tabbable();
			}else{
				untabbable();
				setTimeout(function() { jQuery('.usa-menu-btn').focus(); }, 20);
			}
		}else{
			if(wasdesktop){
				untabbable();
			}else{
				tabbable();
			}
		}
	});
}

function desktopNav() {
	tabbable();
	wasdesktop=true;
}

// Togglify is a function that can be added to any usa-accordion from the
// US Web Design Standards. It requires the class 'usa-accordion-toggle'
// to be added to the accordion element. It also requires a button with 
// the class 'usa-accordion-toggle-all' and data attribute, 'data-toggledText'
// (the text for the toggled state) to be added within the accordion.
jQuery.fn.togglify = function() {
	var accordion=jQuery(this);
	this.find('.usa-accordion-toggle-all').each(function(){
		var toggle=jQuery(this);
		toggle.on('click', function() {
			var isToggled=toggle.attr("aria-expanded");
			//console.log(isToggled=="true");
			if(isToggled=="true"){
				toggle.text(toggle.attr("data-initialText"));
				toggle.attr('aria-expanded', 'false');
			}else{
				toggle.text(toggle.attr("data-toggledText"));
				toggle.attr('aria-expanded', 'true');
			}
			var accordion=jQuery('#' + toggle.attr('aria-controls'));
			accordion.find('.usa-accordion-button').each(function(){
				var accordionButton=jQuery(this);
				if(isToggled=="true"){
					accordionButton.attr('aria-expanded', 'false');
					jQuery('#' + accordionButton.attr('aria-controls')).attr('aria-hidden', 'true');
				}else{
					accordionButton.attr('aria-expanded', 'true');
					jQuery('#' + accordionButton.attr('aria-controls')).attr('aria-hidden', 'false');
				}
			});
	  });
	});
	this.find('.usa-accordion-button').not( ".initialized" ).each(function(){
		var togglebtn=jQuery(this);
		togglebtn.on('click', function() {
			var expanded = togglebtn.attr("aria-expanded");
			if(expanded === 'false') {
				togglebtn.attr("aria-expanded",true);
				jQuery('#' + togglebtn.attr('aria-controls')).attr('aria-hidden', 'false');
			} else {
				togglebtn.attr("aria-expanded",false);	
				jQuery('#' + togglebtn.attr('aria-controls')).attr('aria-hidden', 'true');	
			}
		});
		togglebtn.on('keydown', function( event ) {
			//console.log('you keyed me!');
			//console.log(event.type + ": " +  event.which);
			// get target
			var target = $(event.target);			
			var index = $('.usa-accordion-button').index(target);
			//console.log('index ' + index);
			var key = event.which.toString();
			// Up/ Down arrow and Control + Page Up/ Page Down keyboard operations
			// 38 = Up, 40 = Down
			if (key.match(/38|40|37|39/)) {
				var direction = (key.match(/39|40/)) ? 1 : -1;
				$('.usa-accordion-button').eq(index+direction).focus();
				event.preventDefault();
			}
			else if (key.match(/35|36/)) {
				// 35 = End, 36 = Home keyboard operations
				switch (key) {
					// Go to first accordion
					case '36':
						accordion.find('.usa-accordion-button').first().focus();
						break;
					// Go to last accordion
					case '35':
						accordion.find('.usa-accordion-button').last().focus();
						break;
				}				
				event.preventDefault();	
			}		
		});
		
		togglebtn.addClass('initialized');//Mark as initialized so we only run once
	});
};

jQuery.fn.updateSticky = function() {
	var sticky=jQuery(this);
	var diff=$(window).scrollTop() - sticky.attr('data-stickyheight');
	if(diff > 0){
		sticky.addClass('stuck');
	}
	if(diff < -18){
		sticky.removeClass('stuck');
	}
};
jQuery(document).ready(function(){
	// if a user tabs to a focusable element that is hidden behind the sticky nav, scroll the element into view
  jQuery("a, input, button, .err-label").focus(function(e){
    var viewportOffset = e.target.getBoundingClientRect();
		var top = viewportOffset.top;
    if(top<108){
      window.scrollTo(0, window.pageYOffset - (108-top));
    }
  });
});

jQuery(function(){
	if(jQuery('.usa-accordion-toggle').length>0)
		jQuery('.usa-accordion-toggle').togglify();
	if(jQuery('#backToTop').length>0)
		jQuery('#backToTop').updateSticky();
});

