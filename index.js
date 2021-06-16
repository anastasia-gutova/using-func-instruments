function tableRowsProcessing() { // действие
  updateArrayView(DATA);
  DATA.forEach((row, rowIdx) => {
    row.forEach((_el, colIdx) => {
      inputsActions($(`[id="floatInput${rowIdx + 1}_${colIdx + 1}"]`), rowIdx, colIdx);
    });
  });
}

function inputsActions(el, rowIndex, column) { // действие
  $(el).click(function () { tableOnElementClick(rowIndex, column) });
  $(el).change(function () { tableOnElementChange(this, rowIndex, column) });
  $(el).keyup(function () { tableOnElementKeyUp(this, rowIndex, column) });
}

function tableOnElementKeyUp(element, rowIndex, column) { // действие
  DATA = updateArrayValue(rowIndex, column, element.value, DATA);
  DATA = updateConnectedValues(DATA, rowIndex, column);
  updateArrayView(DATA);
}

// Метод для очищения нулевого значения в input
function tableOnElementClick(row, col) { // действие
  if (DATA[row][col] == 0) {
    DATA = updateArrayValue(row, col, '', DATA);
    updateArrayView(DATA);
  }
}

// Дописывает 0 для ситуации ввода числа ".5"
function tableOnElementChange(element, row, col) { // действие
  DATA = updateArrayValue(row, col, element.value, DATA);
  var currentElementValue = DATA[row][col];
  if (isAddZero(currentElementValue)) {
    DATA = updateArrayValue(row, col, "0" + currentElementValue, DATA);
  }
  updateArrayView(DATA);
}

function isAddZero(value) { // вычисление
  return value.startsWith('.') || value.length == 0
}

function updateConnectedValues(array, rowIndex, column) { // вычисление
  return withArrayCopy(array, function (arrayCopy) {
    if (rowIndex == 0 || rowIndex == 2 || rowIndex == 4) {
      arrayCopy[1][column] = getNewCalculatedValues(arrayCopy[0][column], arrayCopy[2][column], arrayCopy[4][column], 0);
      arrayCopy[3][column] = getNewCalculatedValues(arrayCopy[0][column], arrayCopy[2][column], arrayCopy[4][column], 1);
    }
    return arrayCopy
  })
}

function getNewCalculatedValues(valueRow1, valueRow3, valueRow5, parType) { // вычисление
  if (parType == 0) {
    return getNonFinite(devideTwoNumbers(valueRow1, valueRow3));
  } else {
    return getNonFinite(devideTwoNumbers(valueRow1, valueRow3) - devideTwoNumbers(valueRow1, valueRow5))
  }
}

function devideTwoNumbers(number1, number2) { // вычисление
  var notNanValue1 = isNaN(number1) ? 0 : number1;
  var notNanValue2 = isNaN(number2) ? 0 : number2;
  return notNanValue1 / notNanValue2;
}

// Возвращает конечное число
function getNonFinite(result) { // вычисление
  return isFinite(result) ? Math.round(result) : 0;
}

function updateArrayView(array) { // действие
  $('[id*=row]').each((rowNum) => {
    $(`[id*=floatInput${rowNum + 1}]`).each((colNum, el) => {
      if (array[rowNum][rowNum] !== null) {
        el.value = array[rowNum][colNum];
      }
    })
  })
}

let DATA = [
  [547000, 1246000, 829000, 815000, 492000, 186000, null, null, null, null],
  [16136, 34325, 22405, 19878, 11472, 45377, null, null, null, null],
  [33.9, 36.3, 37, 41, 41.9, 41.1, null, null, null, null],
  [3647, 3473, 3435, 2426, 953, 5009, null, null, null, null],
  [43.8, 41.6, 43.7, 46.7, 45.6, 46.2, null, null, null, null],
]


function updateArrayValue(row, col, newValue, array) { // вычисление
  return withArrayCopy(array, function (arrayCopy) {
    arrayCopy[row][col] = newValue;
    return arrayCopy;
  })
}


function withArrayCopy(array, callback) { // вычисление
  const arrayCopy = _.cloneDeep(array)
  return callback(arrayCopy)
}
