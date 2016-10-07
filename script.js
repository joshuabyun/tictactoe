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
      initScoreScoreReaders($(this).parent().index(),$(this).index(),player);
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
var initScoreScoreReaders = function(rowIndex,colIndex){
    var center = Math.floor(scoreBoard.length);
    var row;
    var col;
    var diagonal1;
    var diagonal2;
    if(rowIndex == center && colIndex == center){
        diagonal1 = diagonalTopLeftBtmRht();
        diagonal2 = diagonalTopRhtBtmLeft();
        row = checkHorizontalRow(rowIndex);
        col = checkVerticalCol(colIndex);
    }else if((rowIndex == 0 && colIndex == 0) || (rowIndex == scoreBoard.length-1 && colIndex == scoreBoard.length-1)){
        diagonal1 = diagonalTopLeftBtmRht();
        row = checkHorizontalRow(rowIndex);
        col = checkVerticalCol(colIndex);
    }else if((rowIndex == 0 && colIndex == scoreBoard.length-1) || (rowIndex == scoreBoard.length-1 && colIndex == 0)){
        diagonal2 = diagonalTopRhtBtmLeft();
        row = checkHorizontalRow(rowIndex);
        col = checkVerticalCol(colIndex);
    }else{
        row = checkHorizontalRow(rowIndex);
        col = checkVerticalCol(colIndex);
    }
    checkForWinner(row,col,diagonal1,diagonal2);
};
var checkForWinner = function(rowSum,colSum,diagonal1Sum,diagonal2Sum){
    if(rowSum == scoreBoard.length || colSum == scoreBoard.length || diagonal1Sum == scoreBoard.length || diagonal2Sum == scoreBoard.length){
        console.log('gold won');
        resetGame();
        return;
    }else if(rowSum == -1*scoreBoard.length || colSum == -1*scoreBoard.length || diagonal1Sum == -1*scoreBoard.length || diagonal2Sum == -1*scoreBoard.length){
        console.log('blue won');
        resetGame();
        return;
    }
    if(counter == Math.pow(scoreBoard.length,2)-1){
        console.log('draw');
        resetGame();
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
var resetGame = function(){
    $('.tictactoeCell').addClass('clicked');
    setTimeout(function(){
        counter = 0;
        scoreBoard = [[0,0,0],[0,0,0],[0,0,0]];
        $('.tictactoeCell').css({"background-color":"white"}).removeClass('clicked');
    },3000);
};

var evaluateMiniMax = function(){
  //always start with -1 and alternate  
};
var callAi = function(){
    var currentScoreBoard = createScoreBoardCopy();
    //loopThrough all 0 value position of the scoreboard.
    for(var i = 0; i < currentScoreBoard.length; i++){
        for(var j = 0; j < currentScoreBoard.length; j++){
            if(currentScoreBoard[i][j] == 0){
                //evaluate 
            }
        }
    }
    //evaluate each position - needs to return list of initial input position that returns -3
};
var createScoreBoardCopy = function(){
    var currentScoreBoard = [];
    for(var i = 0; i < scoreBoard.length;i++){
        var innerArr = [];
        for(var j = 0; j < scoreBoard.length; j++){
            var num = scoreBoard[i][j];
            innerArr.push(num);
        }
        currentScoreBoard.push(innerArr);
    }
    return currentScoreBoard;
};