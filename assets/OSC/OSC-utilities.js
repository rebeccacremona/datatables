OSC.breaks_to_br = function(data){
  if (data) {
    return data.replace(/\n/gi, '<br>');
  } else {
    return
  }
};

OSC.regex_escape = function(str) {
    
    // courtesy of:
    // http://stackoverflow.com/questions/2593637/how-to-escape-regular-expression-in-javascript
    return (str+'').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");

}

OSC.html_escape = function(str) {
    
  var escaped = str
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

     return String(escaped);
};

OSC.html_unescape = function(str) {
    
  var unescaped = str
              .replace(/&amp;/g, '&')
              .replace(/&quot;/g, '"')
              .replace(/&#39;/g, '\'')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>');

      return String(unescaped);
};

OSC.parse_URL = function(){
    var queryString = window.location.search.substring(1);
    if (queryString){
      var queries = queryString.split("&");
      var queryArray = {};
      for( i = 0; i < queries.length; i++ ) {
          split = queries[i].split('=');
          queryArray[split[0]] = split[1];
      }
      return queryArray;
    } else {
      return {};
    }
};

OSC.parse_tags = function(str) {

  try {
    var array = str.split(","); 
    var composed = [];

    for (i = 0; i < array.length; i++) {  
      if (array[i]!=""){
        composed.push("<span>" + array[i].trim() + "</span>");
      }
    }

    // Sort now instead of initally, because this uses the trimmed version of the tags
    var html = composed.sort().join(" ")

    return html ;
  } catch (err) {
    return "";
  }

}

OSC.reverse_parse_tags = function(string){
  return string.replace(/<span>/g, "").replace(/<\/span>/g, ",");
}

OSC.load_css = function(filepath){
  var fileref = document.createElement("link");
  fileref.setAttribute("rel", "stylesheet");
  fileref.setAttribute("href", filepath);
  if (typeof fileref!="undefined"){
        document.getElementsByTagName("head")[0].appendChild(fileref);
  }
}