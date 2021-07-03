const rp = fetch("request-promise");
let url =
  "https://www.efteling.com/nl/park/reserveer-bezoek/abonnementhouders/beschikbare-tijdsloten";
let submit = document.getElementById("submit");
let audioTo = document.getElementById("switch");
let enabled = false;
let things = [];
let snd = new Audio("effect.mp3"); // buffers automatically when created
check();

submit.onclick = function () {
  if (enabled == false) {
    submit.innerHTML = "Uitzetten";
    things = $("#search").val().split("\n");
    things = things.filter((item) => item);
    enabled = true;
  } else {
    submit.innerHTML = "Aanzetten";
    enabled = false;
  }
};

function check() {
  setTimeout(() => {
    if (enabled == true) {
      $.get(url, function (response) {
        let checked = checkInput(response, things);
        if (checked == true) {
          sendMessage();
          sendconsole(true);
          snd.pause();
          snd.currentTime = 0;
          if (audioTo.checked == true) {
            snd.play();
          }
        } else {
          sendconsole(false);
        }

        check();
      });
    } else {
      check();
    }
  }, 4000);
}

function sendconsole(params) {
  var today = new Date();
  var time = today.getHours() + ":" + today.getMinutes();
  let box = document.getElementById("output");
  if (params == true) {
    var node = document.createElement("pre");
    var textnode = document.createTextNode(
      "[" + time + "] " + "Tickets gevonden"
    );
    node.appendChild(textnode);
    box.insertBefore(node, box.firstChild);
  } else {
    var node = document.createElement("pre");
    var textnode = document.createTextNode(
      "[" + time + "] " + "Geen tickets gevonden"
    );
    node.appendChild(textnode);
    box.insertBefore(node, box.firstChild);
  }
  console.log(box.childNodes.length);
  if (box.childNodes.length > 200) {
    box.removeChild(box.childNodes[200]);
  }
}
function sendMessage() {
  var request = new XMLHttpRequest();
  request.open(
    "POST",
    "https://discord.com/api/webhooks/850785582119780382/zlmU-GIHPCpzXLYuQChu2eacdQIBeT4OkXEjcz6iNMTcPaWeajUqzca14F0kyxAlTE_M"
  );

  request.setRequestHeader("Content-type", "application/json");

  var params = {
    content:
      "Er zijn Tickets beschikbaar :partying_face: \n https://www.efteling.com/nl/park/reserveer-bezoek/abonnementhouders/last-minute \n\n <@669564704242532374> <@850782537587359804> \n -------------",
  };

  request.send(JSON.stringify(params));
}

function checkInput(input, words) {
  return words.some((word) => input.toLowerCase().includes(word.toLowerCase()));
}
