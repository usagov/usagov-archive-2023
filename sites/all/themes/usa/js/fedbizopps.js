var data;
var maincontainer;
var record_size = 5;

jQuery(document).ready(function() {
    maincontainer = jQuery('#main-list-container');
    jQuery('#FacetedSearchReset').on('click', function() {
        jQuery('#errorList').remove();
        jQuery('#business-search').val("");
        jQuery('#stateselect').val("");
        jQuery('#monthselect').val("");
        jQuery('#dayselect').val("");
        jQuery('#yearselect').val("");
        jQuery('#addition').removeAttr('checked');
        jQuery('#errorList').remove();

        if (!jQuery('#filter3').hasClass("no-error")){
            jQuery('#filter3').addClass("no-error").addClass("no-future-date-error");
        }

        if (!jQuery('#filter4').hasClass('no-error')) {
            jQuery('#filter4').addClass("no-error").addClass("no-future-date-error");
        }
        setTimeout(function(){
            jQuery('#filter4').find('[type="checkbox"]').prop('checked', false);
        }, 10);

    });

    // Removed inFocus variable
    // inFocus = false;
    // jQuery('#apply-selected-filter').click(function() {
    //     inFocus = true;
    // });

    jQuery(".kpdd").on('keydown',function(event){
        if(event.keyCode == 13) {

            validateForm();

            if (jQuery('form[name="facetedSearchForm"]').hasClass('form-validated')) {
                jQuery('#cind').val(1);
                var pagination_default = 0;
                _sendajaxreq(pagination_default, 1, 0, 0);
            }
            event.preventDefault();
        }
    });
    jQuery('#filter4 input[type="checkbox"]').on('keydown',function(event){
        if(event.keyCode == 13) {
            event.preventDefault();
            return;
        }
    });

    jQuery('#cind').val(1);
    // after load

    //_sendajaxreq(page=0, scrolll=0, paginated=0, init=2 means not initialized?);
    _sendajaxreq(0, 0, 0, 2);

}); /*Document ready closes*/

function validateForm(form, event, scroll){
    //if(!document.business_search_form.query.value.includes('business'))document.business_search_form.query.value+=' business'

    var month = jQuery('#monthselect');
    var monthVal = parseInt(month.val());
    var day = jQuery('#dayselect');
    var dayVal = parseInt(day.val());
    var year = jQuery('#yearselect');
    var yearVal = parseInt(year.val());

    var submit = jQuery('[name="apply_selected_filters"]');

    if ( jQuery('form[name="facetedSearchForm"]').hasClass('form-validated')) {
        jQuery('form[name="facetedSearchForm"]').removeClass('form-validated');
    }

    month.parents(".usa-input-error").addClass("no-error");
    day.parents(".usa-input-error").addClass("no-error");
    year.parents(".usa-input-error").addClass("no-error");
    month.removeAttr("aria-describedby");
    day.removeAttr("aria-describedby");
    year.removeAttr("aria-describedby");

    submit.parents(".usa-input-error").addClass("no-error").addClass("no-date-error").addClass("no-future-date-error");
    jQuery('#filter3').addClass("no-error").addClass("no-future-date-error");

    var errorList="";
    jQuery('#errorList').remove();

    if(monthVal || dayVal || yearVal){
        // at least one date field is set. Show errors for any date field left blank.
        var errorExists=false;
        if(!monthVal){
            month.parents(".usa-input-error").removeClass("no-error");
            submit.parents(".usa-input-error").removeClass("no-error").removeClass("no-date-error");
            errorExists=true;
            errorList+="<li id='monthli'><a href=\"#monthselect\">To search by posted date, you must select a month</li>";
        }
        if(!dayVal){
            day.parents(".usa-input-error").removeClass("no-error");
            submit.parents(".usa-input-error").removeClass("no-error").removeClass("no-date-error");
            errorExists=true;
            errorList+="<li id='dayli'><a href=\"#dayselect\">To search by posted date, you must select a day</li>";
        }
        else if(dayVal == 31 && monthVal % 2 == 0 && monthVal != 2)
        {
            day.val(30);
        }
        else if (monthVal == 2){

            if (dayVal > 29 && yearVal % 4 ==0){
                day.val(29);
            }
            else if (dayVal > 28 && yearVal % 4 !=0) {
                day.val(28);
            }
        }

        if(!yearVal){
            year.parents(".usa-input-error").removeClass("no-error");
            submit.parents(".usa-input-error").removeClass("no-error").removeClass("no-date-error");
            errorExists=true;
            errorList+="<li id='yearli'><a href=\"#yearselect\">To search by posted date, you must select a year</li>";
        }
        if(errorExists){
            //There is at least one value missing, the errors are showing.
            //When user changes something, revalidate.
            month.change(function() {
                //validateForm(form, event, false);
                jQuery('#filter3').addClass("no-error").addClass("no-future-date-error");
                jQuery('#monthli').remove();
                if (jQuery( "#errul li" ).size() == 0){
                    jQuery('#errorList').remove();
                }
            });
            day.change(function() {
                //validateForm(form, event, false);
                jQuery('#filter3').addClass("no-error").addClass("no-future-date-error");
                jQuery('#dayli').remove();
                if (jQuery( "#errul li" ).size() == 0){
                    jQuery('#errorList').remove();
                }
            });
            year.change(function() {
                //validateForm(form, event, false);
                jQuery('#filter3').addClass("no-error").addClass("no-future-date-error");
                jQuery('#yearli').remove();
                if (jQuery( "#errul li" ).size() == 0){
                    jQuery('#errorList').remove();
                }
            });

            //if panel is not opened, open it
            //TODO: Create function for opening panels
            var datePanel=jQuery('#filter3');
            if(datePanel.attr('aria-hidden')){
                datePanel.attr('aria-hidden','false');
                jQuery('[aria-controls="filter3"]').attr('aria-expanded','true');
            }

        }else{
            //All date values are set
            var dateToday = new Date();
            var date = new Date(monthVal+" "+dayVal+", "+ yearVal);

            if(date.getTime()>dateToday.getTime()){
                //The Date is in the future, the errors are showing.
                //When user changes something, revalidate.
                submit.parents(".usa-input-error").removeClass("no-error").removeClass("no-future-date-error");
                jQuery('#filter3').removeClass("no-error").removeClass("no-future-date-error");

                month.attr("aria-describedby", "future-date-error-message");
                day.attr("aria-describedby", "future-date-error-message");
                year.attr("aria-describedby", "future-date-error-message");

                errorList+="<li><a href=\"#monthselect\">You must select a date in the past to search by posted date.</li>";

                year.change(function() {
                    //validateForm();
                });
                month.change(function() {
                    //validateForm();
                });
                day.change(function() {
                    //validateForm();
                });

                //if panel is not opened, open it
                //TODO: Create function for opening panels
                var datePanel=jQuery('#filter3');
                if(datePanel.attr('aria-hidden')){
                    datePanel.attr('aria-hidden','false');
                    jQuery('[aria-controls="filter3"]').attr('aria-expanded','true');
                }
            }else{
                // All fields set. Valid. Unbind change action to prevent abnoxious error messages on change.
                month.unbind( "change" );
                day.unbind( "change" );
                year.unbind( "change" );
                month.removeAttr("aria-describedby");
                day.removeAttr("aria-describedby");
                year.removeAttr("aria-describedby");
            }
            jQuery('form[name="facetedSearchForm"]').addClass('form-validated'); //TODO: return true when the form submit action is ready.
        }
    }else{
        // No fields set. Valid. Unbind change action to prevent abnoxious error messages on change.
        month.unbind( "change" );
        day.unbind( "change" );
        year.unbind( "change" );
        month.removeAttr("aria-describedby");
        day.removeAttr("aria-describedby");
        year.removeAttr("aria-describedby");

        submit.parents(".usa-input-error").addClass("no-error");//todo:need this line?
        jQuery('form[name="facetedSearchForm"]').addClass('form-validated');
    }

    jQuery('#filter4').addClass('no-error');
    if(noSetasideSelected()){ //TODO
        jQuery('form[name="facetedSearchForm"]').removeClass('form-validated');
        //no setasides are selected, show error message
        jQuery('#filter4').removeClass('no-error');
        errorList+="<li><a href=\"#8a\">At least one Special Business Label (Set-Aside Type) box must be checked in order to possibly get results.</li>";

        jQuery('#filter4 input[type="checkbox"]').change(function() {
            //validateForm(form, event, false);
        });

        //if panel is not opened, open it
        //TODO: Create function for opening panels
        var datePanel=jQuery('#filter4');
        if(datePanel.attr('aria-hidden')){
            datePanel.attr('aria-hidden','false');
            jQuery('[aria-controls="filter4"]').attr('aria-expanded','true');
        }
    }else{
        //at least one setaside selected, unbind change action to prevent error messages on change
        jQuery('#filter4 input[type="checkbox"]').unbind( "change" );
        jQuery('#filter4 input[type="checkbox"]').removeAttr("aria-describedby");
    }

    if(errorList!=""){
        var errorList = jQuery("<div id=\"errorList\" tabindex=\"-1\"><header ><h2>Attention: Your request has the following error(s)</h2></header><ul id='errul'>"+errorList+"</ul></div>");
        jQuery('[name="facetedSearchForm"]').prepend(errorList);

        //if panel is not opened, open it
        //TODO: Create function for opening panels
        jQuery('#errorList [href="#monthselect"], #errorList [href="#dayselect"], #errorList [href="#dayselect"]').click(function() {
            var datePanel=jQuery('#filter3');
            if(datePanel.attr('aria-hidden')){
                datePanel.attr('aria-hidden','false');
                jQuery('[aria-controls="filter3"]').attr('aria-expanded','true');
            }
        });
        //if panel is not opened, open it
        //TODO: Create function for opening panels
        jQuery('#errorList [href="#8a"]').click(function() {
            var datePanel=jQuery('#filter4');
            if(datePanel.attr('aria-hidden')){
                datePanel.attr('aria-hidden','false');
                jQuery('[aria-controls="filter4"]').attr('aria-expanded','true');
            }
        });

        if(scroll){
            goToByScroll("#secondpara");
            jQuery('#errorList').focus();
        }
        // if it has error
        if (jQuery('form[name="facetedSearchForm"]').hasClass('form-validated')){
            jQuery('form[name="facetedSearchForm"]').removeClass('form-validated');
        }
        dataLayer.push({'event' : 'formSubmitInvalid'});
    }
    else{
        dataLayer.push({'event' : 'formSubmitted'});
    }

    if (jQuery('form[name="facetedSearchForm"]').hasClass('form-validated') /*&& inFocus*/){
        jQuery('#cind').val(1);
        jQuery('#storeuserinput').val(1);
        var pagination_default = 0;

        _sendajaxreq(pagination_default,1, 0, 0);
    }
    return false;
}
function goToByScroll(id){
    if (jQuery(id).length > 0 ) {
        jQuery('html,body').animate({
            scrollTop: jQuery(id).offset().top
        });
        return false;
    }
}

function noSetasideSelected(){
    return jQuery('#filter4 input[type="radio"]:checked').length==0;
}

/*
_sendajaxreq

ARGS:
p = page
scrolll = scroll level? length? '1' means scrollto top of results, otherwise 0
paginated '1' means pagination triggered this request, otherwise expect 0
init '2' means onReady triggered this request, otherwise expect 0
*/
function _sendajaxreq(p, scrolll, paginated, init) {
    var maincontainer = jQuery('#main-list-container');
    var record_size = 5;
    var val = [];
    var k=0;
    jQuery(':radio:checked').each(function(i){
        if (jQuery(this).val()=="smbiz"){
            val[k] = 'Total Small Business';
            k++;
            val[k] = 'Partial Small Business';
            k++;
        }
        else if (jQuery(this).val()=="womensmbiz"){
            val[k] = 'Woman Owned Small Business';
            k++;
            val[k] = 'Economically Disadvantaged Women-Owned Small Business';
            k++;
        }
        else if (jQuery(this).val()=="indianeco"){
            val[k] = 'Indian Economic Enterprises';
            k++;
            val[k] = 'Indian Small Business Economic Enterprises';
            k++;
        }
        else {
            val[k] = jQuery(this).val();
            k++;
        }
    });
  /**   var apiSource='';
    switch (window.location.host) {
        case 'usa-stg.gsa.ctacdev.com':
            apiSource='stg';
            break;
        case 'usa-test.gsa.ctacdev.com':
        case 'd348vilzsmy03l.cloudfront.net':
            apiSource='test';
            break;
        default:
            apiSource='prod';
            break;
  } **/
    //var apiUrl='https://api.sam.gov/prod/opportunities/v1/search?limit=10&api_key=9zg7A5iGbmBE0F8X0ufgU0xwm279YpXivZ8q50wO&posted';

    var currentDate = new Date(); //use your date here
    var fromDate = currentDate.toLocaleDateString('en-US');
    var toDate = currentDate.setFullYear(currentDate.getFullYear(), currentDate.getMonth() - 11);
    var minusDate = currentDate.toLocaleDateString('en-US');
    var ptype='';
    var formData = {
        'keyword': jQuery('#business-search').val(),
        'state': jQuery('select[name=stateselect]').val(),
        //'postedFrom': jQuery('select[name=yearselect]').val() + '-' + jQuery('select[name=monthselect]').val() + '-' + jQuery('select[name=dayselect]').val(),
        'postedFrom': jQuery('select[name=dayselect]').val() + '/' + jQuery('select[name=monthselect]').val()  + '/' + jQuery('select[name=yearselect]').val(),
        'postedTo': jQuery('select[name=yearselect_a]').val() + '-' + jQuery('select[name=monthselect_a]').val() + '-' + jQuery('select[name=dayselect_a]').val(),
        'setAside': jQuery('input[name="setAside"]').val(),
        'do_index': parseInt(jQuery('#storeuserinput').val()),
        'from':p
    };

    var params_array =[];
   //params_array.push('do_index='+parseInt(jQuery('#storeuserinput').val()));
  // params_array.push('from='+p);
   console.log(params_array);
   if (jQuery('#storeuserinput').val().length > 0){
    params_array.push('ptype=p,k,r','active=yes');
    }
    if (jQuery('#business-search').val().length > 0){
        params_array.push('title='+jQuery('#business-search').val());
    }
    if (jQuery('select[name=stateselect]').val().length > 0){
        params_array.push('state='+jQuery('select[name=stateselect]').val());
    }
    /*if(jQuery('select[name=monthselect]').val().length > 0 && jQuery('select[name=dayselect]').val().length > 0 && jQuery('select[name=yearselect]').val().length > 0){
        params_array.push('postedFrom='+jQuery('select[name=monthselect]').val() + '/' + jQuery('select[name=dayselect]').val() + '/' + jQuery('select[name=yearselect]').val());
    }
    if(jQuery('select[name=monthselect_a]').val().length > 0 && jQuery('select[name=dayselect_a]').val().length > 0 && jQuery('select[name=yearselect_a]').val().length > 0){
        params_array.push('postedTo='+jQuery('select[name=monthselect_a]').val() + '/' + jQuery('select[name=dayselect_a]').val() + '/' + jQuery('select[name=yearselect_a]').val());
    }*/
    if(jQuery('input[name="setAside"]').val().length > 0){
       params_array.push('typeOfSetAside='+jQuery('input[name="setAside"]:checked').val());
     }
    if(paginated==1){
        params_array.push( 'offset=' + jQuery("#cind").val() );
    }

    maincontainer.html('');
    maincontainer.addClass('loading');
    jQuery.ajax({
        type: "GET",
        'postedTo': jQuery('select[name=yearselect_a]').val() + '-' + jQuery('select[name=monthselect_a]').val() + '-' + jQuery('select[name=dayselect_a]').val(),
        url: "https://api.sam.gov/prod/opportunities/v1/search?limit=5&api_key=9zg7A5iGbmBE0F8X0ufgU0xwm279YpXivZ8q50wO&" + "postedFrom=" + minusDate + "&" + "postedTo=" + fromDate + "&" + params_array.join("&"),
        dataType: "json",
        success: function (d) {
            //console.log(this.url);
            data=d;
            renderResults(p, scrolll, paginated, init);
            getDescriptions();
        },
        error: function (data) {
            maincontainer.html("<div class='usa-input-error'><h2>We're sorry, we cannot complete your search right now.</h2>"+
            "<span class='usa-input-error-message'>We're having an unexpected technical problem with the system. We\'re working to fix the issue. Please try your search again later. You can also try visiting <a href=\"https://www.fbo.gov/\">FedBizOpps.gov</a> to complete your search.</span></div>");
            maincontainer.removeClass('loading');
            if(scrolll) {
                goToByScroll("#main-list-container");
            }
        }
    });
}

//TODO: Stop passing all these arguments from _sendajaxreq
function renderResults(p, scrolll, paginated, init){
    if (data.totalRecords > 0) {
        var html_list = '';
        var pagination = '';
        var start = p;
        var end = p + data.limit;
        var html_pagination_li = '';
        var cls = '';
        var aa = '';
        var prev_btn = '';
        var sspan = '';
        var cur_ind = 1;
        var keyword = jQuery('#business-search').val();


        if (p == 0) {
            start = 1;
        }
        else {
            jQuery('#cind').val(start/5);
        }

        if (data.totalRecords < data.limit || end > data.totalRecords) {
            end = data.totalRecords;
        }

        var pind = parseInt(data.totalRecords / data.limit); // total pagination
        if (data.totalRecords % data.limit  > 0){
            pind = parseInt(data.totalRecords / data.limit) + 1;
        }
        var si = 1;
        var ei = 5;

        //console.log('CIND: ' + jQuery('#cind').val() + ' SISISI:' + si + 'EIEIEI: ' + ei + ' PIND:' + pind );

        if (jQuery('#cind').val() > 2 && pind > 5){
            // set new start and end based on current pagination
            si = parseInt(jQuery('#cind').val()) - 1;
            ei = parseInt(jQuery('#cind').val()) + 3;

        }
        if (si == 0) si = 1;

        if (ei >= pind || pind < 5 ) {
            ei=pind;
        }

        //if (si != ei && si > 0) { // only one pagination
        for (var i = si; i <= ei; i++) {

            if ((i == 1 && p == 0) || (p > 0 && (start / data.limit + 1) == i)) {
                cls = 'current';
                cur_ind = i;
                aa = '<span class="usa-sr-only">Curent page</span>'+i;
                jQuery('#cind').val(i);
            }
            else {
                var focusme = '';
                if ((cur_ind+1) == i && cur_ind>1){
                    focusme = 'focusme';
                }
                cls = 'pager-item';
                sspan = '<span class="usa-sr-only">Go to page </span>';
                aa = '<a class="pagination_anchor '+focusme+'" id="pagination' + i + '" href="#">' + sspan + i + '</a>';
            }
            html_pagination_li += '<li class="' + cls + '">' + aa + '</li>';
        }
        //}

        // next button
        if ((parseInt(jQuery('#cind').val())) < Math.round(ei)){
            html_pagination_li += '<li class="pager-ellipsis">…</li><li class="next last"><a href="#" role="button" title="Go to page '+(parseInt(jQuery('#cind').val())+1)+'" class="next">next<img src="./sites/all/themes/usa/images/arrow_next.png" alt=""></a></li>';
        }

        // previous button
        if (cur_ind > 1){
            prev_btn = '<li class="previous first"><a title="Go to page ' + (cur_ind-1) + '" class="prev" role="button" href="#"><img src="./sites/all/themes/usa/images/arrow_previous.png" alt="">previous</a></li>';
        }

        var tmp508 = '';
        if (paginated){
            tmp508 = 'role="alert"';
        }

        if (data.totalRecords != 0) {
            var html_pagination = '<section><div class="usa-grid" ><div><header id="searchresultheader"><h2 class="searchresulttitle">Search Results</h2></header>' +
                '<div class="item-list2" id="nav-page" aria-labelledby="nav-page-label"><span class="pager-dscrpt" id="nav-page-label" for="current_pagination" '+tmp508+' class="pager-dscrpt">Viewing '+start+'-'+end+' of '+data.totalRecords+' results</span><ul class="pagination">'+prev_btn+'<li class="pager-dscrpt2">Viewing '+start+'-'+end+' of '+data.totalRecords+' results</li>'+html_pagination_li+'</ul></div></div></div></section>';
        }
        var len = data.opportunitiesData.length -1;
        for (opp in data.opportunitiesData) {

            ddate = data.opportunitiesData[opp].postedDate;
            if (data.opportunitiesData[opp].archiveDate != null){
                ddate += ' to '+ data.opportunitiesData[opp].archiveDate;
            }


            var opptypetooltip = '';
            var setasidetypetooltip = '';


            if (data.opportunitiesData[opp].baseType == 'Presolicitation') {
                opptypetooltip = 'This is a notice about a future contract. It may ask interested businesses for information.';
                data.opportunitiesData[opp].baseType = 'Presolicitation';
            }
            else if(data.opportunitiesData[opp].baseType == 'Combined Synopsis/Solicitation' || data.opportunitiesData[opp].baseType == 'Combined Synopsis/Solicitation') {
                opptypetooltip = 'This is a description of a currently open contract.';
                data.opportunitiesData[opp].type = 'Combined Synopsis/Solicitation';
            }
            else if(data.opportunitiesData[opp].baseType == 'Sources Sought' || data.opportunitiesData[opp].baseType == 'Sources Sought') {
                opptypetooltip = 'This is a request for information about a potential contract.';
                data.opportunitiesData[opp].type = 'Sources Sought';
            }



            if (data.opportunitiesData[opp].typeOfSetAside == 'SBA'){
                setasidetypetooltip = 'For small businesses. Must meet SBA size standards.';
            }
            else if (data.opportunitiesData[opp].typeOfSetAside == 'SBP'){
                setasidetypetooltip ='For small businesses. Must meet SBA size standards.';
            }
            else if (data.opportunitiesData[opp].typeOfSetAside == '8A'){
                setasidetypetooltip ='For small socially and economically disadvantaged businesses. Must apply through SBA.';
            }
            else if (data.opportunitiesData[opp].typeOfSetAside == 'HZC'){
                setasidetypetooltip ='For small businesses in specific rural and urban communities. Must apply through SBA.';
            }
            else if (data.opportunitiesData[opp].typeOfSetAside == 'SDVOSBC'){
                setasidetypetooltip ='For small socially and economically disadvantaged businesses. Must apply through SBA.';
            }
            else if (data.opportunitiesData[opp].typeOfSetAside == 'WOSB'){
                setasidetypetooltip ='For small socially and economically disadvantaged businesses. Must apply through SBA.';
            }
            else if (data.opportunitiesData[opp].typeOfSetAside == 'EDWOSB'){
                setasidetypetooltip ='For small socially and economically disadvantaged businesses. Must apply through SBA.';
            }
            else if (data.opportunitiesData[opp].typeOfSetAside == 'IEE'){
                setasidetypetooltip ='For small socially and economically disadvantaged businesses. Must apply through SBA.';
            }
            else if (data.opportunitiesData[opp].typeOfSetAside == 'ISBEE'){
                setasidetypetooltip ='For small socially and economically disadvantaged businesses. Must apply through SBA.';
            }
            else if (data.opportunitiesData[opp].typeOfSetAside == 'VSA'){
                setasidetypetooltip ='For small socially and economically disadvantaged businesses. Must apply through SBA.';
            }
            else if (data.opportunitiesData[opp].typeOfSetAside == 'VSS'){
                setasidetypetooltip ='For small socially and economically disadvantaged businesses. Must apply through SBA.';
            }
            else if (data.opportunitiesData[opp].typeOfSetAside == 'LAS'){
                setasidetypetooltip ='For small socially and economically disadvantaged businesses. Must apply through SBA.';
            }

            if (data.opportunitiesData[opp].officeAddress == null){
                data.opportunitiesData[opp].officeAddress = 'N/A';
            }

            if (data.opportunitiesData[opp].officeAddress.zipcode == null){
                data.opportunitiesData[opp].officeAddress.zipcode = 'N/A';
            }

            if (jQuery('#business-search').val().length > 0){
                var descUrl = data.opportunitiesData[opp].description + '&api_key=9zg7A5iGbmBE0F8X0ufgU0xwm279YpXivZ8q50wO' +  '&keyword=' + keyword;;
            }
            var descUrl = data.opportunitiesData[opp].description + '&api_key=9zg7A5iGbmBE0F8X0ufgU0xwm279YpXivZ8q50wO';


            html_list += '<section><div class="section-box">';

            html_list += '<div class="result-details">';
            html_list += '<div class="result-details-column"> <span><strong><a target="_blank" href="'+data.opportunitiesData[opp].uiLink+'" >'+data.opportunitiesData[opp].title+'</a></strong><br>'+data.opportunitiesData[opp].solicitationNumber+'</span> </div>';
            html_list += '<div class="result-details-column"> <span><strong>Opportunity Type:</strong><br>'+data.opportunitiesData[opp].baseType;
            html_list += '<span class="tooltip2" role="tooltip" tabindex="0"> <img class="tooltip-icon2" src="../images/Icon_Tooltip.png" alt="tooltip" aria-hidden="true" ><span class="tooltiptext">'+opptypetooltip+'</span><span aria-label="Tooltip - '+opptypetooltip+'"></span></span> </span>';
            html_list += '<div><strong>Set-Aside Type:</strong><br>'+data.opportunitiesData[opp].typeOfSetAside +'<span class="tooltip2" role="tooltip" tabindex="0"> <img class="tooltip-icon2" src="../images/Icon_Tooltip.png" alt="tooltip" aria-hidden="true" ><span class="tooltiptext">'+setasidetypetooltip+'</span><span aria-label="Tooltip - '+setasidetypetooltip+'"></span></span> </div>';
            html_list += '<div><strong>Posted:</strong><br>'+ ddate +'<span class="tooltip2" role="tooltip" tabindex="0"> <img class="tooltip-icon2" src="../images/Icon_Tooltip.png" alt="tooltip" aria-hidden="true" ><span class="tooltiptext">The date range an opportunity is open. Some do not have closing dates.</span><span aria-label="Tooltip - The date range an opportunity is open. Some do not have closing dates."></span></span> </div>';
            html_list += '</div>'; //result-details-column close

            html_list += '<div class="result-details-column"><address><strong>Agency:</strong><br>'+data.opportunitiesData[opp].department+'<br>';
            html_list += '<strong>Office:</strong><br>'+data.opportunitiesData[opp].office+'<br>';
            html_list += '<strong>ZIP Code:</strong><br>'+data.opportunitiesData[opp].officeAddress.zipcode+'<br>';
            html_list += '<strong>State:</strong><br>'+data.opportunitiesData[opp].officeAddress.state+'</address> </div></div>'; // result-details-column and result-details

            html_list += '<div class="usa-grid"><div class="usa-width-one-whole"> <div class="usa-accordion"><div class="filter-box">';
            html_list += '<button class="usa-accordion-button ttt" aria-expanded="false" aria-controls="result'+opp+'"><span class="element-invisible">'+data.opportunitiesData[opp].title+'</span>Description of Opportunity</button>';
            html_list += '<div id="result'+opp+'" class="usa-accordion-content" aria-hidden="true">';

            html_list += '<p class="description">loading...</p>';
            html_list += '<p><strong><a target="_blank" href="'+data.opportunitiesData[opp].uiLink+'"><span class="element-invisible">The view contact and bid information for opportunity will open in a new window.</span>View any uploaded documents, contact information, and bidding requirements <span class="element-invisible">'+data.opportunitiesData[opp].subject+'</span></a></strong></p>';
            html_list += '</div></div></div></div></div>';

            html_list += '</div>';
            html_list += '</section>';

            if (len == opp) {
                html_list +='<section ><div class="usa-grid" ><div>' +
                '<div class="item-list2" id="nav-page2" aria-labelledby="nav-page-label2"><span class="pager-dscrpt" id="nav-page-label2">Viewing '+start+'-'+end+' of '+data.totalRecords+' results</span><ul class="pagination">'+prev_btn+'<li class="pager-dscrpt2">Viewing '+start+'-'+end+' of '+data.totalRecords+' results</li>'+html_pagination_li+'</ul></div></div></div></section>';
            }

            html_list += '<br><br>';

        }

        maincontainer.removeClass('loading');
        maincontainer.html( html_pagination +  html_list );

        jQuery('.ttt').click(function(){

            if(jQuery(this).attr("aria-expanded") == 'false'){
                jQuery(this).attr('aria-expanded', 'true');
                jQuery('#' + jQuery(this).attr("aria-controls")).attr('aria-hidden', 'false');

            }else{
                jQuery(this).attr('aria-expanded', 'false');
                jQuery('#' + jQuery(this).attr("aria-controls")).attr('aria-hidden', 'true');
            }

        });
        // jQuery('.tooltip, .tooltip-left, .tooltip2').each(function(){ //TODO eliminate extra tooltip classes
        // $(this).tooltipify();
        // });

        // pagination click handler
        jQuery('.pagination_anchor').click(function (e) {
            jQuery(this).find('span').remove();
            lp = (jQuery(this).text() - 1) * record_size;
            jQuery('#storeuserinput').val(0);
            // about to send next ajax
            _sendajaxreq(lp,1,1, 0);
            e.preventDefault();
        })
        // next button
        jQuery('.next').click(function (e) {
            lp = (jQuery('#cind').val()) * record_size;
            jQuery('#storeuserinput').val(0);
            // about to send next ajax
            _sendajaxreq(lp,1,1, 0);
            e.preventDefault();
        })
        // prev button
        jQuery('.prev').click(function (e) {
            lp = (jQuery('#cind').val() - 2) * record_size;
            jQuery('#storeuserinput').val(0);
            // about to send next ajax
            _sendajaxreq(lp, 1,1, 0);
            e.preventDefault();
        })

        jQuery('.focusme').first().focus();

    }
   /* else {
        maincontainer.html("<section><div class='usa-grid' ><div><header id='searchresultheader'><h2 class='searchresulttitle'>Search Results</h2></header><div class='usa-input-error'>"
        +"<span class='usa-input-error-message'>Attention: We cannot find any opportunities that match your search. Try any of these options and search again:</span>"
        +"<ul><li>If you used the Keyword Search, enter a different keyword or phrase. Tip: Try entering a keyword or phrase that is shorter or less specific. </li>"
        +"<li>Select an earlier Posted Date</li>"
        +"<li>Try different Set-Aside Type selections</li>"
        +"<li>Use fewer filters or a different combination of filters</li></ul>"
        +"</div></div></div></section>");
        dataLayer.push({'event' : 'FBOzeroResults'});
        maincontainer.removeClass('loading');
        jQuery("#searchresultheader").attr('tabindex', -1);
        jQuery('#searchresultheader').focus();
        goToByScroll('#searchresultheader');
    }
    if(scrolll) {
        goToByScroll("#main-list-container");
    }

    if (init != 2) {
        jQuery("#searchresultheader").attr('tabindex', -1);
        jQuery('#searchresultheader').focus();
        goToByScroll('#searchresultheader');
    } */
}

function getDescriptions(){
    for(var i=0; i<data.opportunitiesData.length; i++){
        jQuery.ajax({
            type: "GET",
            index: i,
            url: data.opportunitiesData[i].description + "&api_key=9zg7A5iGbmBE0F8X0ufgU0xwm279YpXivZ8q50wO",
            error: function(d){
                data.opportunitiesData[this.index].descriptionContent="NA";
                jQuery("#result" + this.index + " .description").html("NA");
            },
            success: function(d){
                data.opportunitiesData[this.index].descriptionContent=d.description;
                jQuery("#result" + this.index + " .description").html(d.description);
            }
        });
    }
}