(function(){

  var storage = chrome.storage;

  /* Load the websites to block and pass it to the callback */
  function loadWebsites(callback){
    /* Set or get the websites to block */
    var websites = [];

    storage.local.get(["customWebsites"], function(items){

      //Then load the customs websites to block
      if(items.customWebsites === undefined){
        storage.local.set({"customWebsites": []});
      }
      else {
        websites = websites.concat(items.customWebsites);
      }

      //Call the callback and pass the resulting array
      if(typeof callback === "function"){
        callback(websites);
      }
    });
  }

  /* Check if the url contains words from the keywords array */
  function urlContains(url, keywords){
    var result = false;

    for(var index in keywords){
      if(keywords[index].on && url.indexOf(keywords[index].url) != -1){
        result = true;
        break;
      }
    }

    return result;
  }

  /* Redirect if necessary */
  function analyzeUrl(details){
    storage.local.get("on", function(item){
      if(item.on === false) return;
      else {

        loadWebsites(function(websites){
          /* FrameId test to be sure that the navigation event doesn't come from a subframe */
          if(details.frameId === 0 && urlContains(details.url, websites)){
            var id = details.tabId;
            var choice = Math.floor(Math.random() * 17);
            var failures = [
            "https://www.powerthesaurus.org/lazy/synonyms",
            "https://translate.google.co.uk/?sl=auto&tl=fr&text=I%20am%20useless.%20I%20am%20lazy.%20I%20am%20an%20idiot.&op=translate",
            "https://www.google.com/search?tbm=isch&q=mirror",
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "https://tenor.com/search/i'm-not-mad-i'm-disappointed-gifs",
            "https://www.oxfordlearning.com/how-to-study-effectively/",
            "https://en.wikipedia.org/wiki/Why",
            "https://www.wikihow.com/Be-Proud-of-Who-You-Are",
            "Whttps://www.myinstants.com/instant/noooo/",
            "https://www.google.com/search?tbm=isch&q=y+u+do+this",
            "https://www.englishclub.com/ref/esl/Conversational_Phrases/W/what_do_you_think_you_re_doing_what_are_you_doing__4439.php",
            "https://www.amazon.com/Study-Skills-Dummies-Doreen-Boulay-ebook/dp/B004OC079Y/",
            "https://www.dummies.com/games/chess/chess-for-dummies-cheat-sheet/",
            "https://www.goodreads.com/book/show/34914739-i-am-watching-you",
            "https://www.brainyquote.com/topics/motivational-quotes",
            "https://www.researchgate.net/publication/264745066_Effects_of_distraction_on_memory_and_cognition_A_commentary",
            "https://www.psychologytoday.com/gb/basics/guilt"
            ];
            chrome.tabs.update(id, {"url": failures[choice]});
          }
        });
      }
    });
  }

  /* Attach event callback */
  chrome.webNavigation.onCommitted.addListener(analyzeUrl);

  storage.local.get("on", function(item){
    if(item.on === undefined){
      /* deactivated by default & set the number of blocked attempts*/
      storage.local.set({"on": false, "blocked": 0});
    }
  });

  /* Load on start */
  loadWebsites();
})();