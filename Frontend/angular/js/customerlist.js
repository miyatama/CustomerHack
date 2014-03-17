var customerList = function($scope){
  $scope.selectIndex = -1;
  $scope.customers = [];
  $scope.clearCustomers = function(){
    $scope.customers = [];
  };
  $scope.addCustomer = function(id, name, sex, zip, adddate, moddate,index){
    $scope.customers.push({
      "id": id
      ,"name": name
      ,"sex": sex
      ,"zip": zip
      ,"adddate": adddate
      ,"moddate": moddate
      ,"index": index
      ,"selected": false
      });
  };
  $scope.setSelect = function(index){
    if( $scope.selectIndex >= 0 ){
      $scope.customers[$scope.selectIndex]["selected"] = false;
    }
    $scope.customers[index]["selected"] = true;
    $scope.selectIndex = index;
  };
}
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

function webSockClientOnSucceed(responseText){

  if( latestWebMethod == 'getCustomerList'){
    getCustomerListAfter(responseText);
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
  angular.element(divListData).scope().clearCustomers();

  if( errmsg != '') {
    alert(errmsg);
    return;
  }

  for(var i = 0 ;i < customerListElements.length; i++){
    
    dom = parser.parseFromString(customerListElements[i].outerHTML, "text/xml");

/*
    var divChoiceColumn = document.createElement("div");
    divChoiceColumn.className = "listDataColumn choiceColumn choiceDataColumn";
    addEventCustomerList(divChoiceColumn,'click', choiceDataOnClick, false);
    row.appendChild(divChoiceColumn);
*/

    var id = dom.getElementsByTagName('id')[0].textContent;
    var name = dom.getElementsByTagName('customer_name')[0].textContent;
    var sex = dom.getElementsByTagName('sex_name')[0].textContent;
    var zip = dom.getElementsByTagName('zipcode')[0].textContent;
    var adddate = dom.getElementsByTagName('adddate')[0].textContent;
    var moddate = dom.getElementsByTagName('moddate')[0].textContent;
    var index = i;
    angular.element(divListData).scope().addCustomer(id, name, sex, zip, adddate, moddate,index);

 //   divListData.appendChild(row);
  }
  angular.element(divListData).scope().$apply();

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
