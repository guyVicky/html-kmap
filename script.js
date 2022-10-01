console.log("hello, kmap");

document.querySelectorAll("td").forEach((item) => {
  item.addEventListener("click", function (event) {
    changeValue(event.target);
  });
});

function changeValue(element) {
  let num = Number(element.textContent);
  element.textContent = num ? 0 : 1;
}
