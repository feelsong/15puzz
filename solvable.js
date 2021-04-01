
function getRandomPos() {
  let arr = shuffleArray([...Array(16).keys()]);
  return shuffleArray(arr);
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
}

function findBlankRowIfEven(input) {
  var index = input.indexOf(15);
  var row = Math.floor(index/4);
  return !(row%2);
}

function findNumberOfInversion(input) {
  input = input.filter(i => i !== 15)
  let l = input.length;
  let numOfInversion = 0;
  input.forEach((el,i) => {
    if (i!==l-1) {
      for (let j = i+1; j < l;  j++) {
        if (el > input[j]) {
          numOfInversion++;
        }
      }
    }
  });
  return numOfInversion;
}
function findSolvable(input) {
  var numInversion = findNumberOfInversion(input);
  // console.log('numInversion', numInversion);
  var evenInversion = !(numInversion % 2) ;
  // console.log('numInversion', numInversion, 'is Even?', evenInversion);
  if (findBlankRowIfEven(input)) {
    return !evenInversion;
  } else {
    return evenInversion;
  }
}

[12,1,9,2,0,11,7,3,4,15,8,5,14,13,10,6]
[5,12,6,9,7,8,10,15,14,1,11,4,13,2,0,3]
[2,8,0,14,13,10,3,5,12,15,9,11,1,6,7,4]

findSolvable([12,1,9,2,0,11,7,3,4,15,8,5,14,13,10,6]);
findSolvable([5,12,6,9,7,8,10,15,14,1,11,4,13,2,0,3]);
findSolvable([2,8,0,14,13,10,3,5,12,15,9,11,1,6,7,4]);

findBlankRowIfEven([12,1,9,2,0,11,7,3,4,15,8,5,14,13,10,6]);
findBlankRowIfEven([5,12,6,9,7,8,10,15,14,1,11,4,13,2,0,3]);
findBlankRowIfEven([2,8,0,14,13,10,3,5,12,15,9,11,1,6,7,4]);
