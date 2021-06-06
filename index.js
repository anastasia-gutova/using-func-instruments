var tab1Array;

function forEach(arraySet, callback) {
  for(let i=0; i<arraySet.length; i += 1) {
    callback(i);
  }
}

function withArrayCopy(array, callback) {
  var arrayCopy = createArrayCopy(array);
  callback(arrayCopy);
  return arrayCopy;
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
    forEach(getAllRowInputsByRowNum(index + 1), function (column) {
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
    array = setArrayValue( array, rowIndex, column, parseFloat(getInputValue(element)));
    updateConnectedCells(array, rowIndex, column);
}

function fillArray(array) {
  return withArrayCopy(array, function(arrayCopy) {
    forEach([1, 2, 3, 4, 5], function (index) {
      forEach(getAllRowInputsByRowNum(index + 1), function (column) {
        arrayCopy[index][column] = parseFloat(getInputValue(el));
      });
    });
  })
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
  when(getInputValue(element) == 0, function () {
    setInputValue(element, '');
  });
}

function isAddZero(value) {
  return value.indexOf('.') == 0 || value.length == 0
}

// Дописывает 0 для ситуации ввода числа ".5"
function tableOnElementChange(element) {
  var currentElementValue = getInputValue(element);
  when (isAddZero(currentElementValue), function() {
    setInputValue(element, "0" + currentElementValue);
  });
}

function getArrayValue(array, row, col) {
  return array[row][col];
}

function setArrayValue(array, row, col, newValue) {
  return withArrayCopy(array, function (arrayCopy) {
    arrayCopy[row][col] = newValue;
  });
}

function updateConnectedCells(array, rowIndex, column) {
  return withArrayCopy(array, function () {
    when(rowIndex == 0 || rowIndex == 2 || rowIndex == 4, function () {
      var columnNum = (column + 1);
      var resultRow2 = getNewCalculatedValues(getArrayValue(arrayCopy, 0, column), getArrayValue(arrayCopy, 2, column), getArrayValue(arrayCopy, 4, column), 0);
      var resultRow4 = getNewCalculatedValues(getArrayValue(arrayCopy, 0, column), getArrayValue(arrayCopy, 2, column), getArrayValue(arrayCopy, 4, column), 1);
      setInputValue(getInputByRowAndColumn(2, columnNum), resultRow2);
      setInputValue(getInputByRowAndColumn(4, columnNum), resultRow4);
  
      arrayCopy = setArrayValue(arrayCopy, 1, column, resultRow2);
      arrayCopy = setArrayValue(arrayCopy, 3, column, resultRow4);
    });
  })
}

function when(condition, callback) {
  if (condition) {
    return callback();
  } 
}

function IF(condition, callbackTrue, callbackFalse) {
  if (condition) {
    return callbackTrue();
  } else {
    return callbackFalse();
  }
}

function getNewCalculatedValues(valueRow1, valueRow3, valueRow5, parType) {
  return IF(parType == 0,
    function () {
      return getNonFinite(devideTwoNumbers(valueRow1, valueRow3));
  },
    function () {
      return getNonFinite(devideTwoNumbers(valueRow1, valueRow3) - devideTwoNumbers(valueRow1, valueRow5))
  });
}

function devideTwoNumbers (number1, number2) {
  var notNanValue1 = isNaN(number1) ? 0 : number1;
  var notNanValue2 = isNaN(number2) ? 0 : number2;
  return notNanValue1 / notNanValue2;
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

