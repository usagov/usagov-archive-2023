var xmlHttp = new XMLHttpRequest();

xmlHttp.onreadystatechange = function() { 
  if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
    var response = JSON.parse(xmlHttp.response);
    var url = new URL(response.data.expand[0].long_url);
    //console.log(url);
    var top_level_domain = url.host.substr(url.host.length - 4);
    if (top_level_domain==".gov") {
      //console.log("This appears to be a governement website.");
      window.location = url.href;
    }else{
      //console.log("This appears to be a non-governement website.");
    }
  }
}
//TODO: use a USAgov access token
//TODO: hide the access token
//TODO: use bit.ly api v4
xmlHttp.open("GET", "https://api-ssl.bitly.com/v3/expand?access_token=2e6a189419bdf1ec318bcfb87d1803de1f5a0038&hash="+window.location.pathname.substring(1), true);
xmlHttp.send(null);