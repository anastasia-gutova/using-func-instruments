var tab1Array;

function forEach(arraySet, callback) {
  for(let i=0; i<arraySet.length; i += 1) {
    callback(i);
  }
}

function createArrayCopy(array) {
  var copyArray = new Array(array.length);
  forEach(copyArray, function(index){
    copyArray[index] = array[index].slice();
  })
  return copyArray
}

function getAllRowInputsByRowNum(num) {
  return $("[id*='floatInput" + num + "']")
}

function getInputByRowAndColumn(rowNum, colNum) {
  return $("[id='floatInput" + rowNum + "_" + colNum + "']")
}
function getTotalByRowNum(rowNum) {
  return $("[id='totalRoad" + rowNum + " ']")
}

function getInputValue(inputSelector) {
  return $(inputSelector).val();
}

function setInputValue(inputSelector, newValue) {
  $(inputSelector).val(newValue);
}

function tableRowsProcessing() {
  tab1Array = fillArray(cleanArray());

  forEach([1, 2, 3, 4, 5], function (index) {
    getAllRowInputsByRowNum(index + 1).each(function (column, el) {
      inputsActions(el, tab1Array, index, column);
    });
  });
}

function inputsActions(el, array, rowIndex, column) {
  $(el).click(function () { tableOnElementClick(this) });
  $(el).change(function () { tableOnElementChange(this) });
  $(el).keyup(function () { tableOnElementKeyUp(this, array, rowIndex, column) });
}

function tableOnElementKeyUp(element, array, rowIndex, column) {
    array = updateArrayCell(element, array, rowIndex, column);
    updateConnectedCells(array, rowIndex, column);
}

function fillArray(array) {
  var arrayCopy = createArrayCopy(array);
  forEach([1, 2, 3, 4, 5], function (index) {
    getAllRowInputsByRowNum(index + 1).each(function (column, el) {
      arrayCopy[index][column] = parseFloat(getInputValue(el));
    });
  });
  return arrayCopy;
}

// Очищение массива значений
function cleanArray() {
  var array = new Array(5);
  array[0] = new Array(10);
  array[1] = new Array(10);
  array[2] = new Array(10);
  array[3] = new Array(10);
  array[4] = new Array(10);
  return array;
}

// Метод для очищения нулевого значения в input
function tableOnElementClick(element) {
  if (getInputValue(element) == 0) {
    setInputValue(element, '');
  }
}

function isAddZero(value) {
  return value.indexOf('.') == 0 || value.length == 0
}

// Дописывает 0 для ситуации ввода числа ".5"
function tableOnElementChange(element) {
  var currentElementValue = getInputValue(element);
  if (isAddZero(currentElementValue)) {
    setInputValue(element, "0" + currentElementValue);
  }
}

// Обновляет элементы массива
function updateArrayCell(element, array, rowIndex, column) {
  var arrayCopy = createArrayCopy(array);
  arrayCopy[rowIndex][column] = parseFloat(getInputValue(element));
  return arrayCopy;
}

function getArrayValue(array, row, col) {
  return array[row][col];
}

function setArrayValue(array, row, col, newValue) {
  var copyArray = createArrayCopy(array);
  copyArray[row][col] = newValue;
  return copyArray;
}

function updateConnectedCells(array, rowIndex, column) {
  var arrayCopy = createArrayCopy(array);
  if (rowIndex == 0 || rowIndex == 2 || rowIndex == 4) {
    var columnNum = (column + 1);
    var resultRow2 = getNewCalculatedValues(getArrayValue(arrayCopy, 0, column), getArrayValue(arrayCopy, 2, column), getArrayValue(arrayCopy, 4, column), 0);
    var resultRow4 = getNewCalculatedValues(getArrayValue(arrayCopy, 0, column), getArrayValue(arrayCopy, 2, column), getArrayValue(arrayCopy, 4, column), 1);
    setInputValue(getInputByRowAndColumn(2, columnNum), resultRow2);
    setInputValue(getInputByRowAndColumn(4, columnNum), resultRow4);

    arrayCopy = setArrayValue(arrayCopy, 1, column, resultRow2);
    arrayCopy = setArrayValue(arrayCopy, 3, column, resultRow4);
  }
  return arrayCopy
}

function getNewCalculatedValues(valueRow1, valueRow3, valueRow5, parType) {
  if (parType == 0) {
    var notNanValue1 = isNaN(valueRow1) ? 0 : valueRow1;
    var notNanValue3 = isNaN(valueRow3) ? 0 : valueRow3;
    var result2 = notNanValue1 / notNanValue3;
    return getNonFinite(result2);
  } else if (parType == 1) {
    var notNanValue1 = isNaN(valueRow1) ? 0 : valueRow1;
    var notNanValue5 = isNaN(valueRow5) ? 0 : valueRow5;
    var result2 = notNanValue1 / notNanValue3;
    var result4 = result2 - (notNanValue1 / notNanValue5);
    return getNonFinite(result4)
  }
}

// Возвращает конечное число
function getNonFinite(result) {
  return isFinite(result) ? Math.round(result) : 0;
}

// Суммирование элементов строки
function getSumRow(array, rowNum) {
  var sum = 0;
  forEach(array[rowNum - 1], function(index){
    sum += isNaN(array[rowNum - 1][index]) ? 0 : array[rowNum - 1][index];
  })
  return sum
}

