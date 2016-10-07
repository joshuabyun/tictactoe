$( document ).ready(function(){
    applyClickHandler();
});
var scoreBoard = [[0,0,0],
                   [0,0,0],
                   [0,0,0]];
var counter = 0;
var applyClickHandler = function(){
  $('.tictactoeCell').click(function(){
      if($(this).hasClass('clicked')){
          console.log('previously clicked');
          return;
      }
      var player = checkWhosTurn(counter);
      changeScoreBoard($(this).parent().index(),$(this).index(),player);
      changeCellColor(this,player);
      differentiateClickedCell(this);
      initScoreSpecifiedScoreReaders($(this).parent().index(),$(this).index(),player);
      counter++;
  });
};
var differentiateClickedCell = function(clickedCell){
    $(clickedCell).addClass('clicked');
};
var checkWhosTurn = function(counter){
    var check = counter%2;
    var returnVal;
    switch (check){
        case 0 :
            returnVal = 1;
            break;
        case 1 :
            returnVal = -1;
            break;
    }
    return returnVal;
};
var changeScoreBoard = function(parentPos,childPos,player){
    scoreBoard[parentPos][childPos] = player;
    console.log(scoreBoard);
};
var changeCellColor = function(clickedCell,player){
    var background = ['gold','blue'];
    switch (player){
        case 1:
            $(clickedCell).css({'background-color':background[0]});
            break;
        case -1:
            $(clickedCell).css({'background-color':background[1]});
            break;
    }
};
var initScoreSpecifiedScoreReaders = function(rowIndex,colIndex){
    var clickedPos = [rowIndex,colIndex];
    var centerPos = [Math.floor(scoreBoard.length/2)-1,Math.floor(scoreBoard.length/2)-1];
    var rowSum;
    var colSum;
    var diagonal1Sum;
    var diagonal2Sum;
    switch(clickedPos){
        case [0,0]:
            rowSum = checkHorizontalRow(clickedPos[0]);
            colSum = checkVerticalCol(clickedPos[1]);
            diagonal1Sum = diagonalTopLeftBtmRht();
            break;
        case [0,scoreBoard.length-1]:
            rowSum = checkHorizontalRow(clickedPos[0]);
            colSum = checkVerticalCol(clickedPos[1]);
            diagonal2Sum =diagonalTopRhtBtmLeft();
            break;
        case [scoreBoard.length-1,0]:
            rowSum = checkHorizontalRow(clickedPos[0]);
            colSum = checkVerticalCol(clickedPos[1]);
            diagonal2Sum = diagonalTopRhtBtmLeft();
            break;
        case [scoreBoard.length-1,scoreBoard.length-1]:
            rowSum = checkHorizontalRow(clickedPos[0]);
            colSum = checkVerticalCol(clickedPos[1]);
            diagonal1Sum = diagonalTopLeftBtmRht();
            break;
        case centerPos:
            rowSum = checkHorizontalRow(clickedPos[0]);
            colSum = checkVerticalCol(clickedPos[1]);
            diagonal1Sum = diagonalTopLeftBtmRht();
            diagonal2Sum = diagonalTopRhtBtmLeft();
            break;
        default :
            rowSum = checkHorizontalRow(clickedPos[0]);
            colSum = checkVerticalCol(clickedPos[1]);
        }
        checkForWinner(rowSum,colSum,diagonal1Sum,diagonal2Sum);
};
var checkForWinner = function(rowSum,colSum,diagonal1Sum,diagonal2Sum){
    if(rowSum == scoreBoard.length || colSum == scoreBoard.length || diagonal1Sum == scoreBoard.length || diagonal2Sum == scoreBoard.length){
        //gold wins
        console.log('gold wins');
    }else if(rowSum == -1*scoreBoard.length || colSum == -1*scoreBoard.length || diagonal1Sum == -1*scoreBoard.length || diagonal2Sum == -1*scoreBoard.length){
        //blue wins
        console.log('blue wins');
    }
};
var diagonalTopLeftBtmRht = function(){
    var sum = 0;
    for(var i = 0;i <scoreBoard.length; i++){
        sum += scoreBoard[i][i];
    }
    return sum;
};
var diagonalTopRhtBtmLeft = function(){
    var sum = 0;
    var col = scoreBoard.length-1;
    for(var i = 0;i <scoreBoard.length; i++){
        sum += scoreBoard[i][col-i];
    }
    return sum;
};
var checkHorizontalRow = function(rowIndex){
    var sum =0;
    scoreBoard[rowIndex].forEach(function(currentValue){
        sum +=currentValue;
    });
    return sum;
};
var checkVerticalCol = function(colIndex){
    var sum = 0;
    scoreBoard.forEach(function(currentValue,index){
        sum += scoreBoard[index][colIndex]
    });
    return sum;
};
var aiFindBestCellPos = function(){

};