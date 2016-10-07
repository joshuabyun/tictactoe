$( document ).ready(function(){
    initSettingClickHandlers();
});
var scoreBoard = null;
var counter = 0;
var background = null;
//----------------------------reset functions --------------------------------------------
var initSettingClickHandlers = function(){
    applyClickToCharImg();
    applyClickToStart();
};
var applyClickToCharImg = function(){
    $('.characters').on('click','.charImg',function(){
        $(this).siblings().removeClass('selected');
        $(this).addClass('selected');
    })
};
var applyClickToStart = function(){
    $('#settingsButtons').on('click','#start',function(){
        var numberOfPlayers = Number($('.player-buttons:checked').val());
        var gameBoardSize = Number($('.game-size:checked').val());
        var p1Image = $('.player1Char > .selected').css('background-image');
        var p2Image = $('.player2Char > .selected').css('background-image');
        $('#startNotification').remove();
        initGame(numberOfPlayers,gameBoardSize,p1Image,p2Image);
        removeClickOnSetting();
    })};
var removeClickOnSetting = function(){
      $('.characters, #settingsButtons').off("click");
};
//----------------------------actual game play functions ---------------------------------

var initGame = function(numberOfPlayers,gameBoardSize,p1Image,p2Image){
  background = [p1Image,p2Image];
  createGameBoard(gameBoardSize);
  scoreBoard = createScoreBoard(gameBoardSize);
  applyGameBoardClickHandler();
};
var createScoreBoard = function(gameBoardSize){
    switch(gameBoardSize){
        case 5 :
            return [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
        default :   // gameBoardSize = 3
            return [[0,0,0],[0,0,0],[0,0,0]]
    }
};
var createGameBoard = function(gameBoardSize){
    var dimension = getCssDimensionForGameBoard(gameBoardSize);
    for(var i = 0;i < gameBoardSize;i++){
        var cellContainer = $('<div>').addClass('cellContainer').css({'height' : dimension[0]+"%"});
        for(var j = 0; j < gameBoardSize; j++){
            var tictactoeCell = $('<div>').addClass('tictactoeCell').css({'width' : dimension[1]+"%"});
            tictactoeCell.appendTo(cellContainer);
        }
        cellContainer.appendTo($('.gameBoard'));
    }
};
var getCssDimensionForGameBoard = function(gameBoardSize){
    if(gameBoardSize == 3){
        var cellContainerHeight = 30;
        var tictactoeCellWidth = 30;
    }else if(gameBoardSize == 5){
        var cellContainerHeight = 20;
        var tictactoeCellWidth = 20;
    }
    return [cellContainerHeight,tictactoeCellWidth];
};

var applyGameBoardClickHandler = function(){
  $('.tictactoeCell').click(function(){
      if($(this).hasClass('clicked')){
          console.log('previously clicked');
          return;
      }
      var player = checkWhosTurn(counter);
      console.log($(this).parent().index());
      console.log($(this).index());
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
    console.log(scoreBoard);
    scoreBoard[parentPos][childPos] = player;
};
var changeCellColor = function(clickedCell,player){
    switch (player){
        case 1:
            $(clickedCell).css({
                'background-image':background[0],
                'background-position': 'center',
                'background-repeat': 'no-repeat',
                'background-size': 'contain'
            });
            break;
        case -1:
            $(clickedCell).css({
                'background-image':background[1],
                'background-position': 'center',
                'background-repeat': 'no-repeat',
                'background-size': 'contain'
            });
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
var resetGame = function(){ //////////////////////////////////need to fix for setTimeout
    $('.tictactoeCell').addClass('clicked');
    setTimeout(function(){
        counter = 0;
        scoreBoard = null;
        background = null;
        initSettingClickHandlers
        $('.gameBoard *').remove();

    },3000);
};
// ------------------------------------------------------------------------
// var evaluateMiniMax = function(){
//   //always start with -1 and alternate
// };
// var callAi = function(){
//     var currentScoreBoard = createScoreBoardCopy();
//     //loopThrough all 0 value position of the scoreboard.
//     for(var i = 0; i < currentScoreBoard.length; i++){
//         for(var j = 0; j < currentScoreBoard.length; j++){
//             if(currentScoreBoard[i][j] == 0){
//                 //evaluate
//             }
//         }
//     }
//     //evaluate each position - needs to return list of initial input position that returns -3
// };
// var createScoreBoardCopy = function(){
//     var currentScoreBoard = [];
//     for(var i = 0; i < scoreBoard.length;i++){
//         var innerArr = [];
//         for(var j = 0; j < scoreBoard.length; j++){
//             var num = scoreBoard[i][j];
//             innerArr.push(num);
//         }
//         currentScoreBoard.push(innerArr);
//     }
//     return currentScoreBoard;
// };