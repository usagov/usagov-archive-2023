/*
TODO: Eliminate extra tooltip classes

.tooltip-left is used in the FBO intro and on content pages.
In the FBO intro, the tooltip is centered under the icon which at some screen sizes, is very close to the side of the viewport.
It has a special breakpoint in the FBO styles that aligns it to the left side.

On content pages, the tooltip is centered under the span containing the term and icon.
This extra width gives it more space to fit in, but with short terms, is is similar to being centered on the icon.

.tooltip is used in the FBO set-aside-types. These are in a box with enough margin to remain one size

.tooltip2 is used in FBO Results. These generally have enough margin to remain one size

*/


jQuery(document).ready(function() {
  jQuery.fn.tooltipify = function(){
  	var tooltip=jQuery(this);
    tooltip.clickable=true;

    tooltip.init.prototype.tooltipopen = function(event) {
      if( this.attr('aria-expanded')!="true" ){
        this.attr('aria-expanded', 'true');
        this.find('.tooltiptext, .tooltip-left-text').attr('aria-hidden', 'false');
        var labelledby=this.parents('article').attr('aria-labelledby');
        if(labelledby && labelledby.slice(0,5)=="item-"){
          var tooltipText = this.find('.tooltiptext, .tooltip-left-text')[0].innerHTML;
          var tooltipAsset= this.parents('article').attr('aria-labelledby').slice(5);
          dataLayer.push({ 'event' : 'toolTipOpened', 'toolTipText':tooltipText, 'toolTipAsset':tooltipAsset });
        }
      }
    };
    tooltip.init.prototype.tooltipclose = function(event) {
      if( this.attr('aria-expanded')=="true" ){
        //console.log("CLOSE");
        this.attr('aria-expanded', 'false');
        this.find('.tooltiptext, .tooltip-left-text').attr('aria-hidden', 'true');
        var labelledby=this.parents('article').attr('aria-labelledby');
        if(labelledby && labelledby.slice(0,5)=="item-"){ //This IF omits the FBO page from these datalayer events.
          var tooltipText = this.find('.tooltiptext, .tooltip-left-text')[0].innerHTML;
          var tooltipAsset= this.parents('article').attr('aria-labelledby').slice(5);
          dataLayer.push({ 'event' : 'toolTipClosed', 'toolTipText':tooltipText, 'toolTipAsset':tooltipAsset });
        }
      }
    };
    tooltip.init.prototype.tooltiptoggle = function(event) {
      if(this.attr('aria-expanded')=="true"){
        this.tooltipclose(event);
      }else{
        this.tooltipopen(event);
      }
    };
    if(!tooltip.hasClass('tooltip-init')){
      jQuery(document).on('touchend',function(event) { /*iOS does not send mouseout
        or blur events so we must detect a touchend event outside the tooltip to
        determine that the user has tapped somewhere else*/
        if(!jQuery(event.target).closest('.tooltip, .tooltip-left, .tooltip2').length) {
          tooltip.tooltipclose(event);
        }
      });
    	tooltip.click(
        function(event) {
          if(tooltip.clickable){
            tooltip.tooltiptoggle(event);
          }
          tooltip.clickable=true;
        }
      ).on('touchend',
        function(event) {
          tooltip.tooltiptoggle(event);
          tooltip.clickable=false; /*On Android we need to supress the click
          behavior after touchend because other events fire earlier which open
          the tooltip and then the click event fires and toggles the tooltip
          from open to closed when we expect it to be open.*/
        }
      ).on('mouseenter focus', function(event) {
        tooltip.tooltipopen(event);
      }).on('mouseleave blur', function(event) {
        tooltip.tooltipclose(event);
      }).keydown(
        function(event) {
          switch(event.keyCode) {
            case 27://Escape Key
              tooltip.tooltipclose(event);
              break;
            case 13://Enter Key
            case 32://Spacebar
              tooltip.tooltiptoggle(event);
              break;
          }
        }
      ).addClass('tooltip-init');
    }
  };
  //Run the following after any new tooltips are added to the page
  jQuery('.tooltip, .tooltip-left, .tooltip2').each(function(){ //TODO eliminate extra tooltip classes
    $(this).tooltipify();
  });
});
