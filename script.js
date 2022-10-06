let arr4 = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

// console.log("hello, kmap");
// let arr = new Array(5);
// arr.forEach((x) => (x = new Array(5)));

document.querySelectorAll("td").forEach((item) => {
  item.addEventListener("click", function (event) {
    changeValue(event.target);
  });
});

function changeValue(element) {
  let num = Number(element.textContent);
  element.textContent = num ? 0 : 1;
}

function getArray() {
  console.log(arr4);
}
