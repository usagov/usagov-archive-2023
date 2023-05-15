
window.onpageshow = function (event) {
  if (event.persisted) {
    closeNav();
  }
};


var tabletBreakpoint = 991; // width where the page switches between mobile/desktop
var mobileBreakpoint = 768;
var width, prevWidth, mobile; // width and prevWidth determine current breakpoint and if a change is needed
var toggles;


jQuery(function(){
	// Vidoe Transcript
   jQuery('#fea-container h3').bind('click', function(){acordionNav2(this);}); //Video Transcript Box
  function acordionNav2(este){
	jQuery('.transcript').slideToggle(300, function(){
		var transcriptIcon = jQuery(this).prev().find('span');
		if(transcriptIcon.attr('class')=='arrowUp'){
			transcriptIcon.removeClass('arrowUp');
			transcriptIcon.text(jQuery('html').attr('lang')=="en" ? "Show Video Transcript" : "Mostrar la transcripci\u00F3n del video");
		}else{
			transcriptIcon.addClass('arrowUp');
			transcriptIcon.text(jQuery('html').attr('lang')=="en" ? "Hide Video Transcript" : "Ocultar la transcripci\u00F3n del video");
		}
	});
  }
});


function viewportWidth() {
  return window.innerWidth || document.body.clientWidth;//Must use document.body.clientWidth for browser support.
}
/***********************
Initialize
***********************/
jQuery( document ).ready(function(){

  var mobileNav = document.getElementById('mobile-nav');

  var current_pages = mobileNav.querySelectorAll('a[data-current-page]:not([data-href])');
  //Any current pages that are not expandable
  //for(var current_page of current_pages){
  for( var i=0; i< current_pages.length ; i++){
    const current_page=current_pages[i];
    current_page.addEventListener("click", function(event){
      event.preventDefault();
      closeNav();
    });
  }

  
  var buttons = mobileNav.querySelectorAll('a[data-href]');
  //for(var button of buttons){
  for( var i=0; i< buttons.length ; i++){
    const button=buttons[i];
    button.addEventListener("click", function(event){
      
      //collect info about the initial state of the menu
      var target=button.parentNode;

      //reset parent buttons (if clicked button was "sr-next")
      if(button.getAttribute("aria-describedby").indexOf("sr-next")>=0){
        event.preventDefault();
        //sr-next -> sr-expanded remove aria-axpanded
        button.setAttribute("aria-describedby", "sr-expanded");
        button.removeAttribute("aria-expanded");
        button.setAttribute("href", button.getAttribute("data-href"));
        target.classList.add("open");
        //parent,parent,parent addClass(has-open-item)
        var parentItem=button.parentNode.parentNode.parentNode;
        var parentButton=parentItem.querySelector("a");
        parentItem.classList.add("has-open-item");
        //parent,parent,parent.a sr-expanded -> sr-previous  href -> "#" aria-expanded="false"
        parentButton.setAttribute("aria-describedby", "sr-previous");
        parentButton.setAttribute("href", "#");
        parentButton.setAttribute("aria-expanded", "false");

      }else if(button.getAttribute("aria-describedby").indexOf("sr-previous")>=0){
        event.preventDefault();

        //reset children buttons (if clicked button was "sr-previous")
        var closingItems=target.parentNode.querySelectorAll('.open, .has-open-item');
        //for(closingItem of closingItems){
        for( var i=0; i< closingItems.length ; i++){
          var closingItem=closingItems[i];
          closingItem.classList.remove('open', 'has-open-item');
        }
        var closingItems=target.querySelector('ul').querySelectorAll('a[data-href]');
        //for(closingItem of closingItems){
        for( var i=0; i< closingItems.length ; i++){
          var closingItem=closingItems[i];
          closingItem.setAttribute("aria-describedby", "sr-next");
        }
        //sr-previous -> sr-expanded remove aria-axpanded
        button.setAttribute("aria-describedby", "sr-expanded");
        button.removeAttribute("aria-expanded");
        button.setAttribute("href", button.getAttribute("data-href"));
        target.classList.add("open");
        target.classList.remove("has-open-item");
        target.parentNode.parentNode.classList.add("has-open-item");

        
      }else if(button.getAttribute("aria-describedby").indexOf("sr-expanded")>=0){
        
        //Current Page
        if(button.hasAttribute("data-current-page")){
          event.preventDefault();
          closeNav();
        }
      }
      //Reset current page state
      var currents=mobileNav.querySelectorAll("[data-current-page]");
      //for(current of currents){
      for( var i=0; i< currents.length ; i++){
        var current=currents[i];
        if( !current.getAttribute("aria-describedby").indexOf("sr-current-page")>=0 ){
          current.setAttribute("aria-describedby", current.getAttribute("aria-describedby")+" sr-current-page");
        }
      }
      
      document.querySelector(".usa-nav").scrollTo(0,0);
      button.focus();
    });
  }

  //add menu toggles
  jQuery('#header>.container').append('<div id="toggles">'+
      '<button id="search-toggle" role="button" aria-haspopup="true" aria-controls="search" aria-expanded="false">'+
      '<span class="icon-search searcher">Search</span>'+
      '<span class="icon-close closer">Close</span>'+
      '</button>'+
      '<button id="nav-toggle" role="button" aria-haspopup="true" aria-controls="mnnav" aria-expanded="false">'+
      '<span class="menuer">Menu</span>'+
      '<span class="icon-close closer">Close</span>'+
    '</button>'+
  '</div>');

  width=prevWidth=viewportWidth();
  mobile=false;
  if(width <= tabletBreakpoint){
    if(width<mobileBreakpoint)
      mobile=true;
    goMobile();
  }else{
    goDesktop();
  }

  jQuery("#mnnav a").keydown(function(e) {
    if(e.keyCode==40){
      jQuery(this).parent().next().find('a').focus();
    }
    if(e.keyCode==38){
      jQuery(this).parent().prev().find('a').focus();
    }
  });
});
/***********************
Window resize
***********************/
jQuery(window).resize(function() {
  width=viewportWidth();

  if(width<=mobileBreakpoint && prevWidth>mobileBreakpoint){
    mobile=true;
    goMobile();
  }else if(width<=tabletBreakpoint && prevWidth>tabletBreakpoint ||
           width>mobileBreakpoint && prevWidth<=mobileBreakpoint){
    mobile=false;
    goMobile();
  }else if(width>tabletBreakpoint && prevWidth<=tabletBreakpoint){ //screen is now wide
    mobile=false;
    goDesktop();
  }
  
  if(width<=tabletBreakpoint && prevWidth>tabletBreakpoint){
    goMobileHP();
  }else if(width>tabletBreakpoint && prevWidth<=tabletBreakpoint){ //screen is now wide
    goDesktopHP();
  }

  prevWidth=width;
});
function goMobile() {
  jQuery('#header .container.group').append(toggles);
  initializeToggles();
  var navOpen=jQuery('#nav-toggle').hasClass('current');
  var searchOpen=jQuery('#search-toggle').hasClass('current');

  jQuery('#nav-toggle').attr('aria-expanded', navOpen);
  jQuery('#search-toggle').attr('aria-expanded', searchOpen);
  jQuery('#search').attr('aria-expanded', (searchOpen && !mobile) || (navOpen && mobile));
  jQuery('#search').attr('aria-hidden', !((searchOpen && !mobile) || (navOpen && mobile)));
  jQuery('#mnnav').attr('aria-hidden', !navOpen);
  jQuery('#mnnav').removeAttr('aria-label');
  jQuery('.navItems').attr('aria-hidden', !navOpen);
  jQuery('.navItems').attr('aria-expanded', navOpen);
  jQuery('.navItems').attr('role', 'menu');
  jQuery('.navItems').attr('aria-live', 'polite');
  jQuery('.navItems').removeClass('group');
  jQuery('.navItems li a').attr('role', 'menuitem');

  if(mobile){
    jQuery('.searchbkgnd').remove().insertBefore('#mnmenu');
  }else{
    jQuery('.searchbkgnd').remove().insertAfter('#header');
  }
}
function goDesktop() {
  toggles=jQuery('#toggles').remove();
  jQuery('#search').removeAttr('aria-expanded');
  jQuery('#search').removeAttr('aria-hidden');
  jQuery('#nav-toggle').removeAttr('aria-expanded');
  jQuery('#search-toggle').removeAttr('aria-expanded');
  jQuery('#mnnav').removeAttr('aria-hidden');
  jQuery('#mnnav').attr('role', 'navigation');
  jQuery('#mnnav').attr('aria-label', 'Site-wide');
  jQuery('.navItems').removeAttr('aria-hidden');
  jQuery('.navItems').removeAttr('aria-expanded');
  jQuery('.navItems').removeAttr('role');
  jQuery('.navItems').removeAttr('aria-live');
  jQuery('.navItems').addClass('group');
  jQuery('.navItems li a').removeAttr('role');
}
function goMobileHP() {
  
}
function goDesktopHP() {
  
}
function initializeToggles() {
  jQuery( "#nav-toggle").unbind( "click" );
  jQuery('#nav-toggle').click(function(){
    jQuery(this).toggleClass('current');
    if(jQuery(this).hasClass('current')){
      jQuery('body').addClass('show-nav');
      jQuery('.navItems').attr( "aria-expanded", "true" );
      jQuery('.navItems').attr( "aria-hidden", "false" );
      jQuery('#mnnav').attr( "aria-hidden", "false" );
      jQuery(this).attr( "aria-expanded", "true" );
      jQuery('#search').attr( "aria-expanded", mobile );
      jQuery('#search').attr( "aria-hidden", !mobile );
    }else{
      jQuery('body').removeClass('show-nav');
      jQuery('.navItems').attr( "aria-expanded", "false" );
      jQuery('.navItems').attr( "aria-hidden", "true" );
      jQuery('#mnnav').attr( "aria-hidden", "true" );
      jQuery(this).attr( "aria-expanded", "false" );
      jQuery('#search').attr( "aria-expanded", false );
      jQuery('#search').attr( "aria-hidden", true );
    }
    jQuery('body').removeClass('show-search');
    jQuery('#search-toggle').attr( "aria-expanded", "false" );
    jQuery('#search-toggle').removeClass('current');
  });
  jQuery( "#search-toggle").unbind( "click" );
  jQuery('#search-toggle').click(function(){
    jQuery(this).toggleClass('current');
    if(jQuery(this).hasClass('current')){
      jQuery('body').addClass('show-search');
      jQuery('#search').attr( "aria-expanded", "true" );
      jQuery('#search').attr( "aria-hidden", "false" );
      jQuery(this).attr( "aria-expanded", "true" );
    }else{
      jQuery('body').removeClass('show-search');
      jQuery('#search').attr( "aria-expanded", "false" );
      jQuery('#search').attr( "aria-hidden", "true" );
      jQuery(this).attr( "aria-expanded", "false" );
    }
    jQuery('body').removeClass('show-nav');
    jQuery('.navItems').attr( "aria-expanded", "false" );
    jQuery('.navItems').attr( "aria-hidden", "true" );
    jQuery('#mnnav').attr( "aria-hidden", "true" );
    jQuery('#nav-toggle').attr( "aria-expanded", "false" );
    jQuery('#nav-toggle').removeClass('current');
  });
  //added by bj for leftnav
  jQuery( "#lefnav-toggle").unbind( "click" );
  jQuery('#leftnav-toggle').click(function(){
    jQuery(this).toggleClass('slctd');
    if(jQuery(this).hasClass('slctd')){
      jQuery('.shade').attr( "aria-expanded", "true" );
	  jQuery('.shade').attr( "aria-hidden", "false" );
    }else{
      jQuery('.shade').attr( "aria-expanded", "false" );
	  jQuery('.shade').attr( "aria-hidden", "true" );
    }
  });
}