(function(){
  var storage = chrome.storage;

  

  function changeIcon(){
    storage.local.get("on", function(item){
      if(item.on === true){
        chrome.browserAction.setIcon({"path": "../images/bear_icon.png"});
      }
      else {
        chrome.browserAction.setIcon({"path": "../images/bear_icon3.png"});
      }
    });
  }



  function pageLoad(){
    chrome.tabs.create({"url": "html/index.html"});
  }

  changeIcon();

  /* Attach onclick functions */
  var pressButt = document.getElementById("pressButt");
  pressButt.addEventListener("click", pageLoad);
})();