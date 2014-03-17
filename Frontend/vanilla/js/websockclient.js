var WebSockClient = (function(){
  function WebSockClient(){
  }
  WebSockClient.prototype.getUrl = function(){
    return "http://miyataroid999.sakura.ne.jp/try/CustomerHack/Backend/CustomerHackSoap.cgi";
  };
  WebSockClient.prototype.getMethodName = function(){
    return this.methodName;
  };
  WebSockClient.prototype.createRequest = function(methodName ,param){
    //SOAPに投げるXML作成(methodNameとparamを上手い具合になんとかする)
    var request = 
       '<?xml version="1.0" encoding="utf-8"?>' + 
       '<soap:Envelope ' + 
         'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' + 
         'xmlns:xsd="http://www.w3.org/2001/XMLSchema" ' + 
         'xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">'+
         '<soap:Body>' +
         '<m:' + methodName + ' xmlns:m="http://miyataroid999.sakura.ne.jp/CustomerHackSoap/">' + 
         param + 
         '</m:' + methodName + '>' +
         '</soap:Body>'+ 
       '</soap:Envelope>';
    return request;
  };
  WebSockClient.prototype.createParamData = function(pw,param){
    var paramxml = "";
    for (var keyString in param) {
      paramxml = paramxml + '<m:' + keyString + '>' + param[keyString] + '</m:' + keyString + '>';
    } 
    paramxml = "<params>" + paramxml + "</params>";

    return paramxml;
  };
  WebSockClient.prototype.onMesssage= function(data){
    this.getResponseData = data;
  };
  WebSockClient.prototype.sendRequest = function(method ,param){
    this.methodName = method;
    var url = this.getUrl();
    var soapRequest = this.createRequest(method,param);
    $.ajax({
      type: "POST",
      url: url,
      contentType: "text/xml",
      contentType: 'text/xml; charset="utf-8"',
      dataType: "xml",
      data: soapRequest,
      success: webSockClientOnSucceed,
      error: webSockClientOnError
     });
  };
  WebSockClient.prototype.getCustomerList = function(){
    this.sendRequest('getCustomerList','');
  };
  WebSockClient.prototype.doTest = function(){
    this.sendRequest('doTest','');
  };
  return WebSockClient;
})();
