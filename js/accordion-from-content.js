
/*
Questions
what will the content structure be?
What are the various expectations?
Will there ever be content that is not part of the accordion, but is between 2 accordion dropdowns? Ex: Back to Top Links

Ideal Targets:
* An element which contains the entire accordion - This would help determine where an accordion begins and ends
* Header elements that become the accordion buttons - These are easiest to guess.
* An element paired with each header which contains the dropdown content - Without this, it is tricky to guess which content to include in each dropdown

*/

/* Example of code used to initiallize the accordion from content.

<script type="text/javascript" src="../../js/accordion-from-content.js"></script>
<script type="text/javascript">
$(document).ready(function(){
  accordionify();
  accordionify({
      id: "item-118"
  });
  accordionify({
      id: "#item-34912"
  });
});

*/

function accordionify(){
	var openAllText = "Open All";
	var closeAllText = "Close All";
	if(document.documentElement.lang == "es"){
		openAllText = "Abrir todos";
		var closeAllText = "Cerrar todos";
	}

	if(arguments[0]){
		var assetID=arguments[0].id;
		if(assetID.charAt(0)=="#"){
			assetID = assetID.substring(1);
		}
		var assetHeading=jQuery((assetID.charAt(0)=="#"?"":"#")+assetID)[0];
		if (!$(assetHeading).hasClass("accordionified")) {

			$(assetHeading).addClass("accordionified");

			var level=3;
			var headingLevel="h3";
			var headingLevelOrLower="h3, h2, h1";
			if(assetHeading.nodeName.match(/[h]\d/i)){
				level=parseInt(assetHeading.nodeName.charAt(1))+1;
				headingLevel = "h"+level;
				headingLevelOrLower="";
				//build list of headings that should separate our accordions
				for (level; level > 0; level--) {
					headingLevelOrLower += "h"+level + ", header h"+level + (level>1 ? ", " : "");
				}
			}

			var asset=$(assetHeading).parents("article")[0];
			var uaid;//uniqueAccordionID
			var accordion,ul;

			var panelCount=0;
			var panels=$(asset).find(headingLevel);
			if(panels.length>1){
				panels.each(function(){
					uaid="accordion-"+assetID+'-'+panelCount;
					var buttonBase=jQuery(this);
					var buttonContent=buttonBase.text();
					if(buttonBase.parent("header").length){
						buttonBase=buttonBase.parent("header");
					}
					var li=jQuery("<li></li>");
					var button=jQuery(`
						<${headingLevel} class="accordion-heading">
							<button class="usa-accordion-button" aria-expanded="false" aria-label="${buttonContent}" aria-controls="${uaid}">${buttonContent}</button>
						</${headingLevel}>
					`);
					if(panelCount==0){
						accordion=jQuery('<div id="accordion-'+assetID+'" class="usa-accordion-bordered usa-accordion-from-content usa-accordion-toggle" data-multiselectable="true"></div>');
						ul=jQuery('<ul></ul>');
						buttonBase.before(accordion);
						accordion.append(ul);
					}
					if (panelCount==1) {
						var openAll=jQuery('<button id="'+assetID+'-all" class="usa-accordion-toggle-all" data-toggledText="'+closeAllText+' -" data-initialText="'+openAllText+' +" aria-expanded="false" aria-controls="accordion-'+assetID+'" aria-labelledby="'+assetID+' '+assetID+'-all">'+openAllText+' +</button>');
						accordion.prepend(openAll);
					}
					ul.append(li);
					li.append(button);
					
					var content=jQuery('<div id="'+uaid+'" class="usa-accordion-content" aria-hidden="true"></div>');
					li.append(content);
					
					var next=buttonBase.next();
					
					//Loop until no-next or backtotop or share or headingLevelOrLower or headeing>headingLevelOrLower
					while(next.length && !( next.is( '#sm-share, '+headingLevelOrLower ) ) ){
						content.append(next.remove());
						next=buttonBase.next();
					}

					panelCount++;
					buttonBase.remove();
				
				});
			}
		}
	}else{
		$(".rightnav [id^=item-]").each(function(){
			var itemid = $(this).attr("id");
			accordionify({id:itemid})
		});
	}
}