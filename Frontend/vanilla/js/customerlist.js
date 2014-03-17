var latestWebMethod = '';
var customerListDataArray = new Array(); 
var choicedRowIndex;

function addEventCustomerList(obj,evt, func, cap) {
  if (obj.addEventListener){
    obj.addEventListener(evt, func, cap);
  }else if (obj.attachEvent){
    obj.attachEvent('on' + evt, func);
  }
}
addEventCustomerList(window,'load', onWindowLoad, false);
function onWindowLoad(){
  var btnReload = document.getElementById('btnReload');
  addEventCustomerList(btnReload, 'click' ,btnReloadOnClick , false);
  callCustomerList();
  choicedRowIndex = -1;
}

function btnReloadOnClick(){
  callCustomerList();
}
function choiceDataOnClick(){
  var idx; 
  for(var i = 0 ; i < this.parentElement.childNodes.length; i++){
    if( this.parentElement.childNodes[i].getAttribute("name") == "hidIndex"){
      idx = this.parentElement.childNodes[i].value;
      break;
    }
  } 
  clearChoicerow(choicedRowIndex);
  choicedRowIndex = idx;
  choiceRow(idx);
}

function callCustomerList(){
  var webSockClient = new WebSockClient();
  webSockClient.getCustomerList();
  latestWebMethod  = 'getCustomerList';
}

function webSockClientOnSucceed(data , status , req){
  if (status != "success"){
    webSockClientOnError(data , status , req);
  }

  if( latestWebMethod == 'getCustomerList'){
    getCustomerListAfter(req.responseText);
  }
}
function webSockClientOnError(data , status , req){
  alert(req);
}

function getCustomerListAfter(xml){
  var parser = new DOMParser();
  var domroot = parser.parseFromString(xml, "text/xml");
  var response = domroot.getElementsByTagName("getCustomerListResponse")[0];

  var dom = parser.parseFromString(response.outerHTML, "text/xml");
  var errcode = dom.getElementsByTagName('errcode')[0].textContent;
  var errmsg = dom.getElementsByTagName('errmsg')[0].textContent;
  var customerListElements = dom.getElementsByTagName('customerlist');

  var divListData = document.getElementById('divListData'); 
  while(divListData .firstChild) 
    divListData.removeChild(divListData.firstChild);

  if( errmsg != '') {
    alert(errmsg);
    return;
  }

  for(var i = 0 ;i < customerListElements.length; i++){

    
    var row = document.createElement("div");
    row.className = "listDataRow";
    dom = parser.parseFromString(customerListElements[i].outerHTML, "text/xml");

    var divChoiceColumn = document.createElement("div");
    divChoiceColumn.className = "listDataColumn choiceColumn choiceDataColumn";
    addEventCustomerList(divChoiceColumn,'click', choiceDataOnClick, false);
    row.appendChild(divChoiceColumn);

    var divIdColumn = document.createElement("div");
    divIdColumn.className = "listDataColumn idColumn idDataColumn";
    divIdColumn.innerHTML = dom.getElementsByTagName('id')[0].textContent;
    row.appendChild(divIdColumn);

    var divNameColumn = document.createElement("div");
    divNameColumn.className = "listDataColumn nameColumn nameDataColumn";
    divNameColumn.innerHTML = dom.getElementsByTagName('customer_name')[0].textContent;
    row.appendChild(divNameColumn);

    var divSexColumn = document.createElement("div");
    divSexColumn.className = "listDataColumn sexColumn sexDataColumn";
    divSexColumn.innerHTML = dom.getElementsByTagName('sex_name')[0].textContent;
    row.appendChild(divSexColumn);

    var divZipColumn = document.createElement("div");
    divZipColumn.className = "listDataColumn zipColumn zipDataColumn";
    divZipColumn.innerHTML = dom.getElementsByTagName('zipcode')[0].textContent;
    row.appendChild(divZipColumn);

    var divAdddateColumn = document.createElement("div");
    divAdddateColumn.className = "listDataColumn adddateColumn adddateDataColumn";
    divAdddateColumn.innerHTML = dom.getElementsByTagName('adddate')[0].textContent;
    row.appendChild(divAdddateColumn);

    var divModdateColumn = document.createElement("div");
    divModdateColumn.className = "listDataColumn moddateColumn moddateDataColumn";
    divModdateColumn.innerHTML = dom.getElementsByTagName('moddate')[0].textContent;
    row.appendChild(divModdateColumn);

    var hidIndex = document.createElement("input");
    hidIndex.name = "hidIndex" 
    hidIndex.type = "hidden";
    hidIndex.value = i;
    row.appendChild(hidIndex);

    divListData.appendChild(row);
  }
  return true;
}

function choiceRow(idx){
  if (idx < 0) return;
  var divListData = document.getElementById('divListData'); 
  var divListDataRow = divListData.childNodes[idx];
  for(var i = 0 ; i < divListDataRow.childNodes.length; i++){
    divListDataRow.childNodes[i].className = divListDataRow.childNodes[i].className.replace("listDataColumn","listDataChoicedColumn");
  } 
}

function clearChoicerow(idx){
  if (idx < 0) return;
  var divListData = document.getElementById('divListData'); 
  var divListDataRow = divListData.childNodes[idx];
  for(var i = 0 ; i < divListDataRow.childNodes.length; i++){
    divListDataRow.childNodes[i].className = divListDataRow.childNodes[i].className.replace("listDataChoicedColumn","listDataColumn");
  } 
}
