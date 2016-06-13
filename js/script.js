(function (global) {

var dc = {};

var friendsDataArray = [];
var favoriteFriendsDataArray = [];
var allfriendsData = "data/friends.json";

var homeHtmlUrl = "pages/about-page.html";
var favoritesTitleHtmlUrl = "pages/favorites-title.html";
var favoritesHtmlUrl = "pages/favorites-page.html";
var friendsHtmlUrl = "pages/friends-page.html";
var friendsTitleHtmlUrl = "pages/friends-title.html";
var searchHtmlUrl = "pages/search-page.html";
var searchTitleHtmlUrl = "pages/search-title.html";
var detailHtmlUrl = "pages/detail-page.html";

var headerHtmlUrl = "pages/header-page.html";
var footerHtmlUrl = "pages/footer-page.html";

function getFriendsList() {
  var jqXHR = $.getJSON(allfriendsData);
  jqXHR.complete(function(response) {
    friendsDataArray = response.responseJSON;
  });
}

function getPagesHtml(link, list) {
  var jqXHR = $.getJSON(link);
  jqXHR.complete(function(response) {
    var html = response.responseText;
    var feedback = buildFriendsListHtml(list, '',html);
    insertHtml("#main-content", feedback);
  });
}

getFriendsList();

var insertHtml = function (selector, html) {
  $(selector).html(html);
};

var showLoading = function (selector) {
  var html = "<div class='text-center'>";
  html += "<img src='images/ajax-loader.gif'></div>";
  insertHtml(selector, html);
};

var insertProperty = function (string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  string = string.replace(new RegExp(propToReplace, "g"), propValue);
  return string;
}

function checkForDuplicate(arr, word) {
  var nameArr = [];
  for (var key in arr) {
    nameArr.push(arr[key].name.toLowerCase());
  }
  if(nameArr.indexOf(word.toLowerCase()) === -1 ){
      return false;
  }
  return true;
}

function deleteFavorite(id, arrayForDelete) {
  for(var index in arrayForDelete){
    if(arrayForDelete[index].id === id){
      arrayForDelete.splice(index, 1);
    }
  }
}

function collapseNavBar(){
      var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    } 
}

$(document).click(function(){
  collapseNavBar();
});

$(document).ready( function (event) {
  
showLoading("#main-content");

$ajaxUtils.sendGetRequest(
  homeHtmlUrl, 
  function (responseText){
    $('#main-content').html(responseText);
  },
  false); 

$ajaxUtils.sendGetRequest(
  headerHtmlUrl, 
  function (responseText){
    $('#header').html(responseText);
  },
  false); 


$ajaxUtils.sendGetRequest(
  footerHtmlUrl, 
  function (responseText){
    $('footer').html(responseText);
  },
  false); 

});

///////////////////////////////////////////////////////////
////////////////////Home page//////////////////////////////
///////////////////////////////////////////////////////////
dc.loadHomePage = function(){
$ajaxUtils.sendGetRequest(
  homeHtmlUrl, 
  function (responseText){
    $('#main-content').html(responseText);
  },
  false); 
};

///////////////////////////////////////////////////////////
////////////////////Favorit list///////////////////////////
///////////////////////////////////////////////////////////
dc.favoritesInFriendsList = function(){
  showLoading("#main-content");
  var jqXHR = $.get(favoritesHtmlUrl);
  jqXHR.complete(function(response) {
    var jqXHR = $.get(favoritesTitleHtmlUrl);
    var html = response.responseText;
    jqXHR.complete(function(response) {
      var title = response.responseText;
      var feedback = buildFriendsListHtml(favoriteFriendsDataArray, title, html);
      insertHtml("#main-content", feedback);
    });
  });
collapseNavBar();
};

dc.favoriteCheckbox = function(status, index, id){
  if(status === true){
    var isDuplicate = checkForDuplicate(favoriteFriendsDataArray, friendsDataArray[index].name);
    if(isDuplicate === false){
       favoriteFriendsDataArray.push(friendsDataArray[index]);
    }else{
      deleteFavorite(id, favoriteFriendsDataArray);
    }
  }else{
      deleteFavorite(id, favoriteFriendsDataArray);
  }
};
///////////////////////////////////////////////////////////
////////////////////SearchPage/////////////////////////////
///////////////////////////////////////////////////////////
dc.searchInFriendsList = function(){
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    allfriendsData, 
    buildAndShowFriendsSearchList);
collapseNavBar();
};

function buildAndShowFriendsSearchList (list){
  $ajaxUtils.sendGetRequest(
    searchTitleHtmlUrl, 
    function (searchTitleHtmlUrl){
      $ajaxUtils.sendGetRequest(
        searchHtmlUrl, function (searchHtmlUrl){
          var friendsList = buildFriendsListHtml(list, searchTitleHtmlUrl, searchHtmlUrl);
          insertHtml("#main-content", friendsList);
        },false);

    },false);
}

dc.lookUpForFriend = function (value) {
  if(value.length >= 2){
    $("#search a").each(function(){
      if($(this).html().toLowerCase().indexOf(value.toLowerCase()) >= 0){
        $(this).parent().show();
      }else {
        $(this).parent().hide();
      }
    });
  }else if(value.length < 2){
    $("#search a").each(function(){$(this).parent().show();});
  }
};

///////////////////////////////////////////////////////////
////////////////////FriendInfoPage/////////////////////////
///////////////////////////////////////////////////////////
dc.openFriendInfo = function (index){
  showLoading("#main-content");
  var jqXHR = $.getJSON(detailHtmlUrl);
  jqXHR.complete(function(response) {
    var html = response.responseText;
    var feedback = buildFriendInfoHtml(friendsDataArray[index], html);
    insertHtml("#main-content", feedback);
  });
collapseNavBar();
};

function buildFriendInfoHtml(obj, template){
    var html = template;
    var id = ''+ obj.id;
    var name = ''+ obj.name;
    var secondName = ''+ obj.secondName;
    var birthDate = ''+ obj.birthDate;
    birthDate = birthDate.split('-').reverse().join('.');
    var city = ''+ obj.city;
    html = insertProperty(html, "id", id);
    html = insertProperty(html, "name", name);
    html = insertProperty(html, "secondName", secondName);
    html = insertProperty(html, "birthDate", birthDate);
    html = insertProperty(html, "city", city);
    return html;
}
///////////////////////////////////////////////////////////
////////////////////FriendListPage/////////////////////////
///////////////////////////////////////////////////////////
dc.loadFriendsList = function (){
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    allfriendsData, 
    buildAndShowFriendsList);
collapseNavBar();
};

function buildAndShowFriendsList (list){
  $ajaxUtils.sendGetRequest(
    friendsTitleHtmlUrl, 
    function (friendsTitleHtmlUrl){
      $ajaxUtils.sendGetRequest(
        friendsHtmlUrl, function (friendsHtmlUrl){
          var friendsList = buildFriendsListHtml(list, friendsTitleHtmlUrl, friendsHtmlUrl);
          insertHtml("#main-content", friendsList);
        },false);

    },false);
}

function buildFriendsListHtml (list, pageTitleHtmlUrl, pageHtmlUrl){
    var finalHtml = pageTitleHtmlUrl;
    finalHtml += "<section class='row text-left'>";
    for(var i = 0; i< list.length; i++){
      var check = checkForDuplicate(favoriteFriendsDataArray, list[i].name);
      if(check === true){
        check='checked';
      }else{
        check='';
      }
      var html = pageHtmlUrl;
      var index = i;
      var id = list[i].id;
      var name = ''+ list[i].name;
      var birthDate = ''+ list[i].birthDate;
      var bd = new Date(birthDate);
      var cur = new Date();
      var diff = cur-bd;
      var age = ' ('+ Math.floor(diff/31536000000) + ')';
      html = insertProperty(html, "index", i);
      html = insertProperty(html, "name", name);
      html = insertProperty(html, "age", age);
      html = insertProperty(html, "checked", check);
      html = insertProperty(html, "id", id);
      finalHtml += html;
    }
  finalHtml += '</section></div></div>';
  return finalHtml;
}

global.$dc = dc;

})(window);