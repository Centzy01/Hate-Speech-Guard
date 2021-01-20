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
    } else {
      var tag_list = "h2, p";

      chrome.tabs.executeScript(
        {
          code:
            "var nodeList = document.querySelectorAll(" +
            JSON.stringify(tag_list) +
            ");" +
            "nodeList.length",
        },
        function (length) {
          for (var i = 0; i < length; i++) {
            chrome.tabs.executeScript(
              {
                code:
                  "var nodeList = document.querySelectorAll(" +
                  JSON.stringify(tag_list) +
                  ");" +
                  "var info = [nodeList[" +
                  JSON.stringify(i) +
                  "].innerText," +
                  JSON.stringify(i) +
                  "];" +
                  "info",
              },
              doMasking
            );
          }
        }
      );
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

function doMasking(info) {
  console.log(info[0][0]);
  var textInfo = {
    text: info[0][0],
    num: info[0][1],
  };

  fetch("http://hsg.centralus.cloudapp.azure.com:3000/api/text", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(textInfo),
  })
    .then(function (response) {
      return response.json();
    })
    .then((result) => {
      console.log("Fetch Success");
      console.log(result);
      chrome.tabs.executeScript({
        code:
          "var nodeList = document.querySelectorAll(" +
          JSON.stringify(tag_list) +
          ");" +
          "nodeList[" +
          JSON.stringify(info[0][1]) +
          "].innerText" +
          " = " +
          JSON.stringify(result) +
          ";",
      });
    })

    .catch((error) => console.log(error));
}

// fetch('http://localhost:5000/api/video', {
// fetch('http://hsg.centralus.cloudapp.azure.com:3000/api/video', {
