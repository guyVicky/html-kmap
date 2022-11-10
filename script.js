const chars = ["A", "B", "C", "D"];
let kmap = {};
let kmap4 = {};
let kmap3 = {};
let kmap2 = {};
const indices = [0, 1, 3, 2, 4, 5, 7, 6, 8, 9, 11, 10, 12, 13, 15, 14];

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

class karnaugh {
  type = parseInt(curradio);

  numOne(bits) {
    let n = 0;
    for (let i = 0; i < bits.length; i++) {
      if (bits[i] == "1") n += 1;
    }
    return n;
  }

  convertBin(m) {
    let i = 2 ** this.type;
    let str = "";
    while ((i >>= 1)) {
      if (m & i) str += "1";
      else str += "0";
    }
    return str;
  }

  convertDec(bits) {
    let n = 2 ** this.type;
    let i = 0;
    let ans = 0;
    while ((n >>= 1)) {
      if (bits[i] == 1) ans += n;
      i += 1;
    }
    return ans;
  }

  getResult(bits) {
    let index = 0;
    let str = "";
    for (let i = 0; i < bits.length; i++) {
      if (bits[i] != "-") str += chars[index];
      if (bits[i] == "0") str += "'";
      index += 1;
    }
    return str.length ? str : "1";
  }

  minResult(bits) {
    if (bits.length == 0) return [];
    let terms = [""];
    let termsTemp = new Array();
    for (let i = 0; i < bits.length; i++) {
      if (bits[i] == "-")
        terms.forEach((u) => {
          termsTemp.push(u + "1");
          termsTemp.push(u + "0");
        });
      else
        terms.forEach((u) => {
          termsTemp.push(u + bits[i]);
        });
      terms = termsTemp;
      termsTemp = new Array();
    }
    return terms.map((u) => this.convertDec(u));
  }

  merge(u, v) {
    let flag = false;
    let str = "";
    for (let i = 0; i < u.length; i++) {
      if (u[i] != v[i])
        if (flag) return false;
        else {
          flag = true;
          str += "-";
        }
      else str += u[i];
    }
    return str;
  }

  //Quine-Mckinsey Algorithm
  simplify(positive) {
    let gr = new Array();
    let tmpg = new Array();
    for (let i = 0; i <= this.type; i++) {
      gr[i] = new Map();
      tmpg[i] = new Map();
    }
    let result = new Set();
    positive.forEach((num) => {
      let bits = this.convertBin(num);
      gr[this.numOne(bits)].set(bits, false);
    });
    while (true) {
      let isMerged = false;
      for (let i = 0; i < this.type; i++)
        for (let u of gr[i])
          for (let v of gr[i + 1]) {
            let merged = this.merge(u[0], v[0]);
            if (merged) {
              isMerged = true;
              tmpg[this.numOne(merged)].set(merged, false);
              gr[i].set(u[0], true);
              gr[i + 1].set(v[0], true);
            }
          }
      for (let i = 0; i <= this.type; i++)
        for (let u of gr[i]) if (u[1] == false) result.add(u[0]);
      if (!isMerged) break;

      gr = tmpg;
      tmpg = new Array();
      for (let i = 0; i <= this.type; i++) tmpg[i] = new Map();
    }
    return Array.from(result);
  }

  simplify_prime(ones) {
    let result = this.simplify(ones);
    let simplifiedResult = new Array();

    let gcols = new Set();
    let rowsOfCol = new Array();
    let colsOfRow = new Map();
    ones.forEach((col) => {
      gcols.add(col);
      rowsOfCol[col] = new Array();
    });
    result.forEach((row) => {
      let cols = this.minResult(row);
      let reducedCols = new Array();
      if (reducedCols.length) colsOfRow.set(row, reducedCols);
    });

    rowsOfCol.forEach((row) => {
      if (row.length == 1 && colsOfRow.get(row[0])) {
        simplifiedResult.push(row[0]);
        colsOfRow.get(row[0]).forEach((col) => {
          if (gcols.has(col)) {
            gcols.delete(col);
            rowsOfCol[col] = new Array();
          }
        });
        colsOfRow.delete(row[0]);
      }
    });

    while (gcols.size > 0) {
      let max = 0;
      let rowOfMax = 0;
      colsOfRow.forEach((cols, row) => {
        let length = 0;
        cols.forEach((col) => {
          if (gcols.has(col)) length += 1;
        });
        if (length > max) {
          max = length;
          rowOfMax = row;
        }
      });
      if (max == 0) break;
      simplifiedResult.push(rowOfMax);
      colsOfRow.get(rowOfMax).forEach((col) => {
        if (gcols.has(col)) {
          gcols.delete(col);
          rowsOfCol[col] = new Array();
        }
      });
      colsOfRow.delete(rowOfMax);
    }
    return simplifiedResult.length ? simplifiedResult : result;
  }
}

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
        updateResult();
      });
    });
    table.appendChild(row);
  });
  tableParent.appendChild(table);
}

function updateResult() {
  let kar = new karnaugh();
  let b = new Set();
  for (let i = 0; i < 2 ** curradio; i++) {
    if (kmap.arr.flat()[indices[i]] == "1") {
      b.add(i);
    }
  }
  let result = kar.simplify(b);
  let res = "";
  result.forEach((ele, idx) => {
    res += kar.getResult(ele);
    res += idx ? "+" : "";
  });
  console.log(res);
}
