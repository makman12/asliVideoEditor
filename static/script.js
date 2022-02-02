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

let fix;
const loader = document.getElementById("loader");
cropBtn.addEventListener("click", function (e) {
  let kes = false;
  if (y2 != 0) {
    kes = [x1, x2, y1, y2];
  }
  if (fix == "") {
    fix == false;
  }
  loader.className = "loader";
  axios
    .post("times", { data: getTimes(), kes: kes, fixed: fix })
    .then((res) => {
      console.log(res.data);
      for (let i of res.data.data) {
        downloadURI(i);
      }
      loader.className = "";
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

let x1 = 0;
let x2 = 0;
let y1 = 0;
let y2 = 0;
function selectPoints(e) {
  e.preventDefault();
  // Get the target
  const target = e.target;

  // Get the bounding rectangle of target
  const rect = target.getBoundingClientRect();

  // Mouse position
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;
  x = x / e.currentTarget.offsetWidth;
  y = y / e.currentTarget.offsetHeight;
  if ((x1 == 0) & (y1 == 0)) {
    x1 = x;
    y1 = y;
  } else if ((x2 == 0) & (y2 == 0)) {
    x2 = x;
    y2 = y;
    aud.removeEventListener("click", selectPoints, true);
    aud.controls = true;
  }
  console.log(x, y);

  let state3 = "Please click on <b>bottom-right</b> corner on Video";
  let state2 = "Please click on <b>top-left</b> corner on Video";
  if (kesp.innerHTML == state3) {
    kesp.innerHTML = "Saved!";
    aud.style.cursor = "";
    kesbtn.innerHTML = "Click to re-crop";
  } else if (kesp.innerHTML == state2) {
    kesp.innerHTML = state3;
  }
}

const kesbtn = document.getElementById("kesbtn");
const kesp = document.getElementById("kesp");

let CropPositions = [];
kesbtn.addEventListener("click", (e) => {
  if (kesp.innerHTML == "Saved!") {
    x1 = 0;
    x2 = 0;
    y1 = 0;
    y2 = 0;
    kesbtn.innerText = "Crop";
  }
  let state2 = "Please click on <b>top-left</b> corner on Video";
  kesp.innerHTML = state2;
  aud.controls = false;
  aud.addEventListener("mousedown", selectPoints);
  aud.style.cursor = "crosshair";
});

const fixedTime = document.getElementById("fixedTime");

fixedTime.addEventListener("change", (e) => {
  let val = fixedTime.value;
  fix = val;
  if (val == 0) {
    fix = "";
    fixedTime.placeholder = "Desired Fixed Time In Seconds";
  } else {
    fixedTime.placeholder = "Clips Fixed to " + val + " Seconds";
  }
  fixedTime.value = "";
});
