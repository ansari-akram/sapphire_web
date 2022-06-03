var running = false;
var pre = [];
var detections = [];
var error_response = 'We think there are some bugs & we are tyring to fix this in no time.<br /><br />Please reload your Browser tab.';
var otherCloth = 'Do you need to search for any other dress or product?';
var thankyou_response = 'Thank You!<br/>If you want anything else just let us know.';
var shop_anything_response = 'Please feel free to shop anything.';
var error_message = 'We did not understand what you are looking for.<br />Try to rephrase your query.';
var no_product_response = "We don't have this product.<br>You can try another if you like.";
var server_api = 'http://127.0.0.1:8000/';
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

function send() {
  if (running == true) return;
  var msg = document.getElementById("message").value;
  if (msg == "") return;
  running = true;
  addMsg(msg);
  //DELAY MESSAGE RESPONSE Echo
  //window.setTimeout(addResponseMsg, 1000, msg);
}

function capitalize(input) {
  var words = input.split(' ');
  var CapitalizedWords = [];
  words.forEach(element => {
    CapitalizedWords.push(element[0].toUpperCase() + element.slice(1, element.length));
  });
  return CapitalizedWords.join(' ');
}

function startSr() {
  const recognition = new SpeechRecognition();
  var speech = true;
  var transcript;

  recognition.interimResults = false;

  recognition.addEventListener('result', e => {
    transcript = Array.from(e.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join('')
    addMsg(transcript);
  });

  if (speech == true) {
    recognition.start();
  }
}

function addMsg(msg) {
  var div = document.createElement("div");
  div.innerHTML =
    "<span style='flex-grow:1'></span><div class='chat-message-sent'>" +
    msg +
    "</div>";
  div.className = "chat-message-div";
  document.getElementById("message-box").appendChild(div);

  //LOADER START
  var loader = document.createElement("div");
  loader.innerHTML = '<div title="getting response..."><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="30px" viewBox="0 0 24 30" style="enable-background:new 0 0 50 50;" xml:space="preserve"><rect x="0" y="10" width="4" height="10" fill="grey" opacity="0.2"><animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0s" dur="0.6s" repeatCount="indefinite" /><animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0s" dur="0.6s" repeatCount="indefinite" /><animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0s" dur="0.6s" repeatCount="indefinite" /></rect><rect x="8" y="10" width="4" height="10" fill="grey"  opacity="0.2"><animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.15s" dur="0.6s" repeatCount="indefinite" /><animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" /><animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" /></rect><rect x="16" y="10" width="4" height="10" fill="grey"  opacity="0.2"><animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.3s" dur="0.6s" repeatCount="indefinite" /><animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" /><animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" /></rect></svg></div>';
  loader.className = "chat-message-received loader";
  document.getElementById("message-box").appendChild(loader);
  document.getElementById("message-box").scrollTop = document.getElementById("message-box").scrollHeight;
  //LOADER END

  //SEND MESSAGE TO API
  document.getElementById("message").value = "";
  document.getElementById("message-box").scrollTop = document.getElementById(
    "message-box"
  ).scrollHeight;

  var prevChatMsg = document.getElementById('message-box').children[document.getElementById('message-box').children.length - 2].textContent;
  // console.log('prev msg', prevChatMsg);

  if (prevChatMsg == otherCloth) {
    if (msg.toLowerCase() == "yes") {
      addResponseMsg(shop_anything_response)
      pre = [];
      detections = [];
    } else if (msg.toLowerCase() == "no") {
      addResponseMsg(thankyou_response)
    } else {
      sendInput(msg);
    }

  } else {
    sendInput(msg);
  }
}

function sendInput(input) {

  // input = capitalize(_input);
  // console.log(input);

  var formdata = new FormData();
  formdata.append("question", input);
  formdata.append("pre", pre);
  formdata.append("detected", detections);
  // formdata.append("type2", type2);
  // formdata.append("type3", type3);
  // formdata.append("type4", type4);

  var requestOptions = {
    method: 'POST',
    body: formdata,
    redirect: 'follow'
  };

  fetch(server_api + "response/", requestOptions)
    .then(response => response.text())
    .then(result => {

      removeLoader();

      var response = JSON.parse(result);

      console.log(response);

      response.pre.forEach(element => {
        if (!pre.includes(element)) pre.push(element);
      });

      response.detection.forEach(element => {
        if (!detections.includes(element)) detections.push(element);
      });

      // console.log(pre, typeof(pre));
      var link = response.link;
      var url = response.image;
      // console.log(link, url);

      if (link != undefined && url != undefined) {
        setTimeout(addResponseMsgWithUrl, 500, link, url);
        pre = [];
        detections = [];
      }
      // type2 = JSON.parse(result).type2;
      // type3 = JSON.parse(result).type3;
      // type4 = JSON.parse(result).type4;

      // if (type1 != '') {
      //   if (type2 != '') {
      //     if (type3 != '') {
      //       if (type4 != '') {
      //         console.log(JSON.parse(result));

      //         if (JSON.parse(result).link == "We don't have this Product.") setTimeout(addResponseMsg, 500, JSON.parse(result).link);
      //         else setTimeout(addResponseMsgWithUrl, 500, JSON.parse(result).link, JSON.parse(result).image);

      //         setTimeout(addResponseMsg, 1000, otherCloth);
      //         type1 = '';
      //         type2 = '';
      //         type3 = '';
      //         type4 = '';

      //       } else setTimeout(addResponseMsg, 500, JSON.parse(result).response);
      //     } else setTimeout(addResponseMsg, 500, JSON.parse(result).response);
      //   } else setTimeout(addResponseMsg, 500, JSON.parse(result).response);
      // } else setTimeout(addResponseMsg, 500, JSON.parse(result).response);
      else {
        if (response.response == 'error') {
          setTimeout(addResponseMsg, 500, error_message);
          pre = [];
          detections = [];
        } else {
          if (response.response == no_product_response) {
            setTimeout(addResponseMsg, 500, no_product_response);
            pre = [];
            detections = [];
          } else {
            setTimeout(addResponseMsg, 500, JSON.parse(result).response);
          }
        }
      }
    })
    .catch(error => {
      removeLoader();
      setTimeout(addResponseMsg, 500, error_response);
    });
}

function onlyAddMsg(msg) {
  var div = document.createElement("div");
  div.innerHTML =
    "<span style='flex-grow:1'></span><div class='chat-message-sent'>" +
    msg +
    "</div>";
  div.className = "chat-message-div";
  document.getElementById("message-box").appendChild(div);
}

function addResponseMsgWithUrl(msg, img) {
  var div = document.createElement("div");
  div.innerHTML = "<div class='chat-message-received'><img class='chatbotImage' src='" + server_api + img + "' /><a class='chatbotLink' href='" + msg + "' target='_blank'><button class='chatbotbutton' style='  width:100%; align-content: justify;line-height: 30px; padding: 2%; margin: 2%; border-radius: 30px;backgroundColor:#000; color:#fff;'>Shop Now</button></a></div>";
  div.className = "chat-message-div";
  document.getElementById("message-box").appendChild(div);
  document.getElementById("message-box").scrollTop = document.getElementById(
    "message-box"
  ).scrollHeight;
  running = false;
}

function addResponseMsg(msg) {
  var div = document.createElement("div");
  div.innerHTML = "<div class='chat-message-received'>" + msg + "</div>";
  div.className = "chat-message-div";
  document.getElementById("message-box").appendChild(div);
  document.getElementById("message-box").scrollTop = document.getElementById(
    "message-box"
  ).scrollHeight;
  running = false;
}

function removeLoader() {
  document.getElementById("message-box").lastChild.remove();
}

document.getElementById("message").addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    send();
  }
});

document.getElementById("chatbot_toggle").onclick = function () {

  if (document.getElementById("chatbot").classList.contains("collapsed")) {
    document.getElementById("chatbot").classList.remove("collapsed")
    document.getElementById("chatbot_toggle").children[0].style.display = "none"
    document.getElementById("chatbot_toggle").children[1].style.display = ""
    document.getElementById("chatbot").children[1].style.display = ""
    document.getElementById("chatbot").children[4].style.display = ""
    document.getElementById("chatbot_toggle").style.backgroundColor = "transparent"
    //  if (checkWelcomeMsg("Hello")) setTimeout(addResponseMsg, 500, "This is Sapphire Chatbot, How can I help you?")
    document.getElementById('message').focus();
  }
  else {
    document.getElementById("chatbot").classList.add("collapsed")
    document.getElementById("chatbot_toggle").children[0].style.display = "inline-block"
    document.getElementById("chatbot_toggle").children[1].style.display = "none"
    document.getElementById("chatbot").children[1].style.display = "none"
    document.getElementById("chatbot").children[4].style.display = "none"
    document.getElementById("chatbot_toggle").style.backgroundColor = "white"
  }
}

function validateEmail2(mail) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return (true)
  }
  return (false)
}

function checkForm() {
  user_name = document.getElementById("user-name").value;
  user_email = document.getElementById("user-email").value;
  user_phone = document.getElementById("user-phone").value;

  if (validateEmail2(user_email)) {
    if (user_name != '' && user_phone != "") {
      if (document.getElementById("cred-form").classList.contains("active")) {

        document.getElementById("cred-form").classList.remove("active")
        document.getElementById("cred-form").classList.add("inactive")
        document.getElementById("chatbot").children[2].style.display = "none"
        document.getElementById("chatbot").children[4].style.display = ""
        document.getElementById("chatbot").children[5].style.display = ""
        document.getElementById("message").focus();

        if (checkWelcomeMsg()) setTimeout(onlyAddMsg, 500, "<b>Name:</b> " + user_name + "<br/><b>Email:</b> " + user_email + "<br /><b>Phone:</b> " + user_phone)
      }
    }
  }
}

function checkWelcomeMsg() {
  var list = document.getElementById("message-box").querySelectorAll('div');
  if (list.length == 0) return true;
  return false;
}

document.getElementById("chatbot_toggle").children[1].style.display = "none"
document.getElementById("chatbot").children[1].style.display = "none"
document.getElementById("chatbot").children[4].style.display = "none"
