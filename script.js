$( document ).ready(function(){
    applyClickHandler();
});
var scoreBoard = [[0,0,0,0,0],
                   [0,0,0,0,0],
                   [0,0,0,0,0],
                   [0,0,0,0,0],
                   [0,0,0,0,0]];
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
      initScoreReaders();
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
var initScoreReaders = function(){
    if(scoreReader(winHandler,"horizontal")){
        return;
    }
    if(scoreReader(winHandler,"vertical")){
        return true;
    }
    diagonalScoreReader(winHandler);
};
var scoreReader = function(winHandler,checkType){
    for(var i = 0; i < scoreBoard.length; i++){
      var sum = 0;
      for(var j = 0; j < scoreBoard.length; j++){
          switch (checkType){
              case "horizontal":
                  sum += scoreBoard[i][j];
                  break;
              case "vertical":
                  sum += scoreBoard[j][i];
                  break;
          }
          if(sum == scoreBoard.length || sum == -1*scoreBoard.length ){
              winHandler(sum,checkType);
              return true;
          }
      }
  }
};
var diagonalScoreReader = function(winHandler){
    var sum1 = 0;
    var sum2 = 0;
    var i;
    var col = scoreBoard.length-1;
    for(i = 0;i <scoreBoard.length; i++){
        sum1 += scoreBoard[i][i];
        sum2 += scoreBoard[i][col-i];
        if(sum1 == scoreBoard.length || sum1 == -1*scoreBoard.length){
            winHandler(sum1,"top left to bottom right");
            return true;
        }else if(sum2 == -1*scoreBoard.length || sum2 == scoreBoard.length){
            winHandler(sum2,"top right to bottom left");
            return true;
        }
    }
};

var winHandler = function(winnerScore, winningMethod){
  if(winnerScore > 0){
      console.log('gold won by '+ winningMethod);
  }else if(winnerScore < 0){
      console.log('blue won by '+ winningMethod);
  }
};