
function alterMediaLinks(linkTemplates) {

    var linkUniqId = 0;
    var linksModCounter = 0;

    for ( key in linkTemplates ) {

        jQuery('#content a[href*=".'+key+'."]').addClass('lnk-media-exclude');

        jQuery('#content a[href*=".'+key+'"]').not('.lnk-media-altered, .lnk-media-exclude, .state_50_url').each( function () {
            var jqThis = jQuery(this);

            if (jqThis.prop('href').toLowerCase().search("\." + key + "([#?]|$)") != null) {

                linkUniqId++;

                jqThis.attr('id', 'usorg' + linkUniqId);
                jqThis.addClass('lnk-media-altered');

                var injectHTML = linkTemplates[key];
                injectHTML = injectHTML.replace('[ID]', linkUniqId);
                injectHTML = injectHTML.replace('[ID]', linkUniqId);

                jqThis.after(' ' + injectHTML);
                linksModCounter++;
            }
        });
    }

    return linksModCounter;
}