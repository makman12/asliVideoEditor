var aud = document.getElementById("video");
let file = document.getElementById("file");
console.log("start");
file.addEventListener("change", (e) => {
  console.log("yey");
  let videoFile = file.files[0];
  let name = file.files[0].name;
  console.log(name);
  var formData = new FormData();
  formData.append("file", videoFile);
  formData.append("name", name);
  axios
    .post("/postdata", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      console.log(res);
      aud.src = "/static/" + res.data;
      document.getElementById("clearbtn").click();
    });
});

let timebtn = document.getElementById("timebtn");
timebtn.addEventListener("wheel", inceAyar);
let buttonDiv = document.getElementById("btnDiv");

function oldButton(e) {
  e.preventDefault();
  aud.currentTime = parseFloat(e.currentTarget.innerText);
  console.log(aud.currentTime);
  if (
    e.currentTarget.nextElementSibling.className ==
    "btn col s3 red darken-3 offset-s2"
  ) {
    console.log("başlangıç");
    aud.play();
    let sontime = e.currentTarget.nextElementSibling.innerText;
    let thisEvent = function () {
      if (aud.currentTime >= sontime) {
        aud.pause();
        aud.removeEventListener("timeupdate", thisEvent);
      }
    };
    aud.addEventListener("timeupdate", thisEvent);
  } else if (
    e.currentTarget.nextElementSibling.className ==
    "btn col s3 green darken-3 offset-s2"
  ) {
    console.log("son");
    aud.pause();
  }
}

function oldButtonRight(e) {
  e.preventDefault();
  e.currentTarget.innerText = aud.currentTime;
}

function buttonAction(e) {
  e.currentTarget.innerText = aud.currentTime;
  let newButton = document.createElement("a");
  if (buttonDiv.childElementCount % 2 == 0) {
    newButton.className = "btn col s3 green darken-3 offset-s2";
  } else {
    newButton.className = "btn col s3 red darken-3 offset-s2";
  }
  newButton.innerText = "Click Here";
  newButton.addEventListener("click", buttonAction);
  newButton.addEventListener("wheel", inceAyar);
  buttonDiv.appendChild(newButton);
  e.currentTarget.removeEventListener("click", buttonAction);
  e.currentTarget.addEventListener("click", oldButton);
  e.currentTarget.addEventListener("contextmenu", oldButtonRight);
}

function inceAyar(e) {
  e.preventDefault();
  console.log(e.deltaY);

  if (e.deltaY > 0) {
    e.currentTarget.innerText = (
      parseFloat(e.currentTarget.innerText) + 0.05
    ).toFixed(3);
  } else {
    e.currentTarget.innerText = (
      parseFloat(e.currentTarget.innerText) - 0.05
    ).toFixed(3);
    if (parseFloat(e.currentTarget.innerText) < 0) {
      e.currentTarget.innerText = 0;
    }
  }
  aud.currentTime = parseFloat(e.currentTarget.innerText);
}

timebtn.addEventListener("click", buttonAction);

function getTimes() {
  let result = [];
  let allnodes = buttonDiv.childNodes;
  for (let i of allnodes) {
    if ((i.nodeType != 3) & (parseFloat(i.innerText) > 0)) {
      result.push(i.innerText);
    }
  }
  return {
    data: result,
  };
}

document.getElementById("clearbtn").addEventListener("click", (e) => {
  buttonDiv.innerHTML = `<a class="btn col s3 offset-s2 green darken-3" id="timebtn">Save the Time</a>`;
  let timebtn = document.getElementById("timebtn");
  timebtn.addEventListener("click", buttonAction);
  timebtn.addEventListener("wheel", inceAyar);
});

let cropBtn = document.getElementById("times");

cropBtn.addEventListener("click", function (e) {
  axios.post("times", getTimes()).then((res) => {
    console.log(res.data);
    for (let i of res.data.data) {
      downloadURI(i);
    }
  });
});

function downloadURI(uri, name) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}
