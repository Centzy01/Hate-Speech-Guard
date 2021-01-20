


// // var audio = new Audio('beep.mp3');
$(document).ready(function () {

  $('#optionBtn').click(function () {
    chrome.runtime.openOptionsPage();
  });

  $('#getUrl').click(function () {

    // document.getElementById('log').textContent = "hello";

    getCurrentTabUrl(function (url) {
      console.log("hhhh")
      fetchURL(url);
      // fetchURLA(url);
      // test();
      // testa();
      // testb();
      // process_video();
      // renderURL(url);
    });
  })
  $('#stop').click(function () {

    audio.pause();
  });
});


// });
// function assa(e){
//   chrome.tabs.executeScript(null,
//       {code:"document.querySelector('#input').value='123123';"});


// }


// document.addEventListener('DOMContentLoaded',function(){
//  var btn01 = document.querySelector('#stop');
//  console.log("hh")
//  btn01.addEventListener("click",assa);

// });
// document.addEventListener('DOMContentLoaded', function() {
//     document.getElementById("getUrl").addEventListener('click', process_video);
// });
function process_video() {
  chrome.tabs.executeScript(null, { file: 'hello.js' });
}
// $(function(){
//     $('#stop').click(function(){

//     });
// });


// function test(){
//     console.log("heeloheelo")
//     chrome.tabs.executeScript(null,
//         {code:"document.querySelector('#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > button').click()"});
//         // #container > h1 > yt-formatted-string

// }
function testb() {
  console.log("testb")
  chrome.tabs.executeScript(null, { file: 'hello.js' });
  // document.getElementById('log').textContent = 'hello';
  // var text = document.querySelector('#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > div > span.ytp-time-duration');

  // console.log(text.getAttribute)
  //let current = document.querySelector('#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > div.ytp-time-display.notranslate > span.ytp-time-current').innerText;

  //document.getElementById('log').textContent = tt;

}
function testa() {


  audio.currentTime = 6;
  audio.volume = 0.3;
  audio.play();



}

function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function (tabs) {
    var tab = tabs[0];
    var url = tab.url;
    callback(url);
  });
}

function renderURL(statusText) {
  document.getElementById('urls').textContent = statusText;
}

function test(data) {
  console.log("heeloheelo")
  console.log(data[0])
  testb()


  // #container > h1 > yt-formatted-string

}
function fetchURLA(url) {
  console.log("helloWorld");
  var urlInfo = {
    url: url
  }

  fetch('http://hsg.centralus.cloudapp.azure.com:3000/api/video', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(urlInfo)
  }).then(function (response) {
    return response.json()
  })
    .then((result) => {
      console.log("Fetch Success")
      // console.log(result[0])
      // console.log(result.length);
      chrome.storage.sync.set({ data: result }, function () {
            console.log(result[0]);
          });
          chrome.storage.sync.get(['data'], function (result) {
            console.log(result.data[1]);
          });


          chrome.storage.local.set({data: result}, function() {
            console.log('Value is set to ' + value);
          });
                chrome.tabs.executeScript(null, { file: 'test.js' });

      // test(result);
    })
    .catch((error) => document.getElementById('log').textContent = error)
}

function fetchURL(url) {
  console.log("helloWorld");
  var urlInfo = {
    url: url
  }

  fetch('http://localhost:5000/api/video', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(urlInfo)
  }).then(function (response) {
    return response.json()
  })
    .then((result) => {
      console.log("Fetch Success")
      // console.log(result[0])
      // console.log(result.length);
      chrome.storage.sync.set({ data: result }, function () {
            console.log(result[0]);
          });
          chrome.storage.sync.get(['data'], function (result) {
            console.log(result.data[1]);
          });


          chrome.storage.local.set({data: result}, function() {
            console.log('Value is set to ' + value);
          });
                chrome.tabs.executeScript(null, { file: 'test.js' });

      // test(result);
    })
    .catch((error) => document.getElementById('log').textContent = error)
}
