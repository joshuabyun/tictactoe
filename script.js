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
    horizontalScoreReader(winHandler);
    verticalScoreReader(winHandler);
    diagonalScoreReader(winHandler);
};
var horizontalScoreReader = function(winHandler){
  for(var row = 0; row < scoreBoard.length; row++){
      var sum = 0;
      for(var col = 0; col < scoreBoard.length; col++){
          sum += scoreBoard[row][col];
          if(sum == scoreBoard.length || sum == -1*scoreBoard.length ){
              winHandler(sum,'horizontal');
          }
      }
  }
};
// var verticalScoreReader = function(winHandler){
//     var sum = 0;
//     for(var col = 0; col < scoreBoard.length; col++){
//         for(var row = 0; row < scoreBoard.length; row++){
//             sum += scoreBoard[col][row];
//             if(sum == scoreBoard.length || sum == -1*scoreBoard.length ){
//                 winHandler(sum,'vertical');
//             }
//         }
//     }
// };
// var diagonalScoreReader = function(winHandler){
//     var sum1 = 0;
//     var sum2 = 0;
//     var colNum1 = -1;
//     var colNum2 = scoreBoard.length-1;
//     for(var i = 0, j = scoreBoard.length-1; i < scoreBoard.length, j < 0; i++, j--){
//         colNum1++;
//         sum1 += scoreBoard[i][colNum1];
//         sum2 += scoreBoard[j][colNum2];
//         colNum2--;
//         if(sum1 == scoreBoard.length || sum1 == -1*scoreBoard.length){
//             winHandler(sum1,'diagonal top left to bottom right');
//         }else if(sum2 == scoreBoard.length || sum2 == -1*scoreBoard.length){
//             winHandler(sum2, 'diagonal bottom right to top left');
//         }
//     }
// };

var winHandler = function(winnerScore, winningMethod){
  if(winnerScore > 0){
      console.log('gold won by '+ winningMethod);
  }else if(winnerScore < 0){
      console.log('blue won by '+ winningMethod);
  }

};