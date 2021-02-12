(function(){
  var storage = chrome.storage;

  var listElementTemplate = '<li id="{{ id }}" class="list__item">' +
                                '<label class="label--checkbox">' +
                                  '<input type="checkbox" class="checkbox" {{ checked }}>' +
                                  '{{ el }}' +
                                '</label>' +
                              '</li>';

  var tableHead = '<tr class="head">' +
                    '<th>Website</th>' +
                    '<th class="table-cross">Delete</th>' +
                  '</tr>';

  var tableElementTemplate = '<tr id="{{ id }}">' +
                                '<td>{{ el }}</td>' +
                                '<td  class="table-cross disable-select">x</td>' +
                              '</tr>';

  /* Fill a template with the data dictionnary passed*/
  function fillTemplate(template, data){
    var result = template;

    for(var el in data){
      var mark = "{{ " + el + " }}";
      result = result.replace(mark, data[el]);
    }

    return result;
  }

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

  /* Load the default and custom list from chrome storage */
  function loadWebsites(){
    storage.local.get(["customWebsites"], function(items){
      /* Default websites loading */

      if(items.customWebsites !== undefined){
        var customWebsites = items.customWebsites;
        var table = document.getElementById("customTable");
        table.innerHTML = tableHead;

        for(var index in customWebsites){
          var website = customWebsites[index];
          var checked = website.on ? "checked" : "";
          var element = fillTemplate(tableElementTemplate, {"id": "custom"+index, "el": website.url, "checked": checked});

          table.innerHTML += element;
        }

        attachEvents();
      }
    });
  }

 


  function addCustomWebsite(e){
    if(e.keyCode === 13){
      var input = document.getElementById("addingInput");

      if(input.value.length === 0){
        return;
      }

      storage.local.get("customWebsites", function(items){
        if(items !== undefined){
          var array = items.customWebsites;

          array.push({"url": input.value, "on": true});

          storage.local.set({"customWebsites": array}, function(){
            loadWebsites();
          });

          input.value = "";
        }
      });
    }
  }

  function deleteCustomWebsite(e){
    var id = this.parentElement.id.replace("custom", "");

    storage.local.get("customWebsites", function(items){
      if(items.customWebsites !== undefined){
        var newArray = items.customWebsites;
        newArray.splice(id, 1);

        storage.local.set({"customWebsites": newArray}, function(){
          loadWebsites();
        });
      }
    });
  }

  function attachEvents(){
    /* Deleting event */
    var crosses = document.getElementsByClassName("table-cross");

    /* Skip the first element because we don't want to affect the first line */
    for(var i = 1; i < crosses.length; i++){
      crosses.item(i).addEventListener("click", deleteCustomWebsite);
    }

    /* Checking event */
    

    var customCheckboxes = document.getElementById("customTable").getElementsByClassName("checkbox");

    for(i = 0; i < customCheckboxes.length; i++){
      customCheckboxes.item(i).addEventListener("change", toogleCustomElement);
    }
  }
  function onButtonClick(){
    storage.local.get(["on", "blocked"], function(item){
      console.log(item.on);
      var on;
      if(onButton.innerText === "TURN OFF?"){
        on = false;
      }
      else if(item.on === undefined || item.on === false || item.on === "hello"){
        on = true;
      }
      else {
        on = "hello";
      }

      storage.local.set({"on": on, "blocked": 0});

      updateOnButton();
      updateIcon();
    });
  }


  function updateOnButton(){
    var onButton = document.getElementById("pressButt");

    storage.local.get("on", function(item){
      if(item.on === true){
        onButton.innerText = "ON";
      }
      else if(item.on === false){
        onButton.innerText = "OFF";
      }
      else {
        onButton.innerText = 60;
        var count = 60, timer = setInterval(function() {
          onButton.innerText = count--;
          if(count == 1){
            clearInterval(timer);
            onButton.innerText = "TURN OFF?"
          } 
        }, 1000);
      }
    });
  }

  function updateIcon(){
    storage.local.get("on", function(item){
      if(item.on === false){
        chrome.browserAction.setIcon({"path": "../images/bear_icon3.png"});
      }
      else {
        chrome.browserAction.setIcon({"path": "../images/bear_icon.png"});
      }
    });
  }
  if ('addEventListener' in window) {
    window.addEventListener('load', function() { document.body.className = document.body.className.replace(/\bis-preload\b/, ''); });
    document.body.className += (navigator.userAgent.match(/(MSIE|rv:11\.0)/) ? ' is-ie' : '');
  }
  
  changeIcon();
  updateOnButton();
  loadWebsites();
  document.getElementById("addingInput").addEventListener("keypress", addCustomWebsite);

  var onButton = document.getElementById("pressButt");
  onButton.addEventListener("click", onButtonClick);
})();