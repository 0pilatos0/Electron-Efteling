const rp = fetch("request-promise");
let url =
  "https://www.efteling.com/nl/park/reserveer-bezoek/abonnementhouders/beschikbare-tijdsloten";
let submit = document.getElementById("submit");
let audioTo = document.getElementById("switch");
let enableTime = document.getElementById("switch2");
let enabled = false;
let things = [];
let times = [];
let snd = new Audio("effect.mp3"); // buffers automatically when created

let timeDiv = document.getElementById("exact");
timeDiv.style.display = "none";

check();

enableTime.onclick = function () {
  if (enableTime.checked == true) {
    timeDiv.style.display = "block";
  } else {
    timeDiv.style.display = "none";
  }
};

submit.onclick = function () {
  if (enabled == false) {
    submit.innerHTML = "Uitzetten";
    things = $("#search").val().split("\n");
    things = things.filter((item) => item);

    if (enableTime.checked == true) {
      times = $("#timeBox").val().split("\n");
      times = times.filter((item) => item);
    }

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
        if (enableTime.checked == true) {
          for (let i = 0; i < things.length; i++) {
            things[i] =
              `<td class="pl pv- palm-pv-- palm-full-width uc--first-letter">` +
              things[i] +
              `</td>
                                                    <td data-label="Tijdslot" class="pl pv- palm-pv--">` +
              times[i] +
              `</td>`;
          }
        }
        console.log(things);

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
