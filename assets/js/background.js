var tag_list = "p"

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  //alert(changeInfo.url);
  if (
    changeInfo.status == "complete" &&
    tab.status == "complete" &&
    tab.url != undefined
  ) {
    //console.log(changeInfo.url)
    // alert(tab.url)
    url = new String(tab.url);
    if (url.startsWith("https://www.youtube.com/watch?")) {
      console.log("starts with youtube url");
      chrome.storage.sync.set({ data: "" }, function () {
        console.log("Chrome Storage Initialize");
        chrome.storage.sync.get(["data"], function (result) {
          console.log("checkData[1]", result.data);
        });
      });
      fetchURL(url);
    } else if(chrome.runtime.lastError) return;
    else {
      chrome.tabs.executeScript({
        code: 'var nodeList = document.querySelectorAll(' + JSON.stringify(tag_list) + ');' +
            'nodeList.length'
    }, async function (length) {
        if(chrome.runtime.lastError) return;
        for (var i = 0; i < length; i++) {
    
            console.log('******* start one **********')
    
            var text = await promise(i)
    
            console.log('******* end one **********')
    
        }
    
    });

    }
  }
});

function fetchURL(url) {
  console.log("Start function : fetchURL");

  var urlInfo = {
    url: url,
  };

  fetch("http://hsg.centralus.cloudapp.azure.com:3000/api/video", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(urlInfo),
  })
    .then(function (response) {
      return response.json();
    })
    .then((result) => {
      console.log("Fetch Success");
      // console.log(result.length);
      // console.log(result[0])
      storeData(result, function () {
        chrome.storage.sync.get(["data"], function (result) {
          console.log("checkData[1]", result.data[1]);
        });
        chrome.tabs.executeScript(
          null,
          { file: "/assets/js/video.js" },
          (result) => {
            const lastErr = chrome.runtime.lastErr;
            if (lastErr) console.log(lastErr);
          }
        );
      });
    })

    .catch((error) => console.log(error));
}

function storeData(result, callback) {
  console.log("Start function : storeData");

  chrome.storage.sync.set({ data: result }, function () {
    console.log("Python Data Store to Chrome Storage Success");
    callback();
  });
}


var promise = function (i) {

  return new Promise((resolve, reject) => {
      chrome.tabs.executeScript({
          code: 'var nodeList = document.querySelectorAll(' + JSON.stringify(tag_list) + ');' +
              'var r = [nodeList[' + JSON.stringify(i) + '].innerText,' + JSON.stringify(i) + '];' +
              'r'
      },function(r){
        if(chrome.runtime.lastError) return;
        doMasking(r,resolve);
      });

  })
}
//request 보내고 texk masking 처리하는 메소드
function doMasking(info,resolve) {
  console.log(info[0][0])
  var textInfo = {
      text: info[0][0],
      num: info[0][1]
  }

  fetch('http://hsg.centralus.cloudapp.azure.com:3000/api/text', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(textInfo)
  }).then(function (response) {
      return response.json()
  })
      .then((result) => {
          console.log("Fetch Success")
          console.log(result)

          maskingHateSpeech(info[0][1], result);
          resolve()
          return result
      })

      .catch((error) => console.log(error))
}

//masking
function maskingHateSpeech(i, result) {
  chrome.tabs.executeScript({
      code: 'var nodeList = document.querySelectorAll(' + JSON.stringify(tag_list) + ');' +
          'nodeList[' + JSON.stringify(i) + '].innerText' + ' = ' + JSON.stringify(result) + ';'
  });
  console.log("finished")
}


// fetch('http://localhost:5000/api/video', {
// fetch('http://hsg.centralus.cloudapp.azure.com:3000/api/video', {
