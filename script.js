let kmap = {};
let kmap4 = {};
let kmap3 = {};
let kmap2 = {};

kmap2.arr = [
  [0, 0],
  [0, 0],
];

kmap2.headers = ["AB", "0", "1"];

kmap3.arr = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

kmap3.headers = ["AB", "00", "01", "11", "10"];

kmap4.arr = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

kmap4.headers = ["AB", "00", "01", "11", "10"];
curradio = "2";

// console.log("hello, kmap");
// let arr = new Array(5);
// arr.forEach((x) => (x = new Array(5)));
document.querySelectorAll('input[name="kmap-type"]').forEach((x) => {
  x.addEventListener("click", (event) => {
    curradio = event.target.id;
    genTable();
  });
});

document.getElementById("2").click();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function changeValue(element) {
  let num = Number(element.textContent);
  element.textContent = num ? 0 : 1;
  let k;
  switch (curradio) {
    case "2":
      k = kmap2;
      break;
    case "3":
      k = kmap3;
      break;
    case "4":
      k = kmap4;
      break;
    default:
      break;
  }
  k.arr[element.parentNode.rowIndex - 1][element.cellIndex - 1] = parseInt(
    element.textContent
  );
}

function genTable() {
  switch (curradio) {
    case "2":
      kmap = kmap2;
      break;
    case "3":
      kmap = kmap3;
      break;
    case "4":
      kmap = kmap4;
      break;
    default:
      break;
  }

  let tableParent = document.querySelector(".stuff");
  tableParent.innerHTML = "";
  let table = document.createElement("table");
  table.id = "kmap";
  //Top row append karne ke liye
  let headerRow = document.createElement("tr");
  kmap.headers.forEach((x) => {
    let el = document.createElement("th");
    let text = document.createTextNode(x);
    el.appendChild(text);
    headerRow.appendChild(el);
  });
  table.appendChild(headerRow);
  // Baki ki rows append karne ke liye
  kmap.arr.forEach((x, i) => {
    let row = document.createElement("tr");
    let vhead = document.createElement("th");
    let text =
      curradio == 3
        ? document.createTextNode(parseInt(kmap.headers[i + 1]))
        : document.createTextNode(kmap.headers[i + 1]);
    vhead.appendChild(text);
    row.appendChild(vhead);
    x.forEach((y) => {
      let val = document.createElement("td");
      let text = document.createTextNode(y);
      val.appendChild(text);
      row.appendChild(val);
      val.addEventListener("click", function (event) {
        changeValue(event.target);
      });
    });
    table.appendChild(row);
  });
  tableParent.appendChild(table);
}

function getArray() {
  console.log("yoooo");
}

function loop() {
  let area = document.querySelectorAll("td");
  area.forEach(async (ele) => {
    await sleep(1000);
    let prev = ele.style.background;
    ele.style.background = "#d44d2e";
    await sleep(1000);
    ele.style.background = prev;
  });
}
