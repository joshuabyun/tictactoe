$( document ).ready(function(){
    initSettingClickHandlers();
});
var scoreBoard = null;
var counter = 0;
var background = null;
//----------------------------setting/reset functions --------------------------------------------
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
        // var numberOfPlayers = Number($('.player-buttons:checked').val());
        var gameBoardSize = Number($('.game-size:checked').val());
        var p1Image = $('.player1Char > .selected').css('background-image');
        var p2Image = $('.player2Char > .selected').css('background-image');
        $('.gameBoard *').remove();
        // initGame(numberOfPlayers,gameBoardSize,p1Image,p2Image);
        initGame(null,gameBoardSize,p1Image,p2Image);
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
  apply2PGameBoardClickHandler(gameBoardSize);
  // if(numberOfPlayers === 1){
  //     apply1PGameBoardClickHandler(gameBoardSize);
  // }else if(numberOfPlayers === 2){
  //     apply2PGameBoardClickHandler(gameBoardSize);
  // }
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
var apply2PGameBoardClickHandler = function(gameBoardSize){
  $('.tictactoeCell').click(function(){
      if($(this).hasClass('clicked')){
          console.log('previously clicked');
          return;
      }
      var player = checkWhosTurn(counter);
      changeScoreBoard($(this).parent().index(),$(this).index(),player);
      changeCellColor(this,player);
      differentiateClickedCell(this);
      checkCorrectScoreReader($(this).parent().index(),$(this).index(),gameBoardSize);
      counter++;
  });
};
var apply1PGameBoardClickHandler = function(gameBoardSize){
    $('.tictactoeCell').click(function(){
        if($(this).hasClass('clicked')){
            console.log('previously clicked');
            return;
        }
        var player = checkWhosTurn(counter); //if returns -1, AI's turn
        if(player == -1){
            console.log('AI\'s turn');
            return;
        }
        changeScoreBoard($(this).parent().index(),$(this).index(),player);
        changeCellColor(this,player);
        differentiateClickedCell(this);
        checkCorrectScoreReader($(this).parent().index(),$(this).index(),gameBoardSize);
        counter++;
    });
};
//----------------------------AI-----------------------------------------------------
var initAi = function(gameBoardSize){
    aiFindBestPosInBoard();
    // changeScoreBoard($(clickedElement).parent().index(),$(clickedElement).index(),-1);
    // changeCellColor(clickedElement,-1);
    // differentiateClickedCell(clickedElement);
    // checkCorrectScoreReader($(clickedElement).parent().index(),$(clickedElement).index(),gameBoardSize);
    // counter++;
};
var aiFindBestPosInBoard = function(){
  //will return an array of [row,col]
  //look for any row/col/dia with -2
  //look for any row/col/dia with 2
  //look for any row/col/dia with -1
  //look for any row/col/dia with 1
  //random
  checkVerticalCol(colIndex);
  checkHorizontalRow(rowIndex);
  diagonalTopRhtBtmLeft();
  diagonalTopLeftBtmRht();
    
    
    
  var checkList = [-2,2,-1,1];
  for(var i = 0; i < checkList.length;i++){
      diagonalTopRhtBtmLeft();
      diagonalTopLeftBtmRht();
      rowCheck(checkList[i]);
      colCheck(checkList[i]);
  }
};
var rowCheck = function(targetRowValue){
  //return an obj {rowPos: x,  emptySlot:[a,b]  } //if more than 1 empty random
  for(var i = 0 ; i < scoreBoard.length ; i++){
      var row = checkHorizontalRow(i);
      
  }
};
var colCheck = function(targetColValue){
    //return an obj {colPos: x,  emptySlot:[a,b]  } //if more than 1 empty random
    for(var i = 0 ; i < scoreBoard.length ; i++){
        var col = checkVerticalCol(i);
        var row = checkHorizontalRow(i);

    }
};
//----------------------------AI----------------------------------------------------
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
//---------------------------------checking for winning condition ------------------------------------------------
var checkCorrectScoreReader = function(rowIndex,colIndex,gameBoardSize){
    switch(gameBoardSize){
        case 5 :
            initSize5ScoreReaders(rowIndex,colIndex);
            break;
        default :   // gameBoardSize = 3
            initSize3ScoreReaders(rowIndex,colIndex);
    }
};
var initSize5ScoreReaders = function(rowIndex,colIndex){
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
    }else if((rowIndex == 0 && colIndex == 0) || (rowIndex == 1 && colIndex == 1) || (rowIndex == scoreBoard.length-1 && colIndex == scoreBoard.length-1) || (rowIndex == scoreBoard.length-2 && colIndex == scoreBoard.length-2)){
        diagonal1 = diagonalTopLeftBtmRht();
        row = checkHorizontalRow(rowIndex);
        col = checkVerticalCol(colIndex);
    }else if((rowIndex == 0 && colIndex == scoreBoard.length-1) || (rowIndex == 1 && colIndex == scoreBoard.length-2) || (rowIndex == scoreBoard.length-1 && colIndex == 0) || (rowIndex == scoreBoard.length-2 && colIndex == 1)){
        diagonal2 = diagonalTopRhtBtmLeft();
        row = checkHorizontalRow(rowIndex);
        col = checkVerticalCol(colIndex);
    }else{
        row = checkHorizontalRow(rowIndex);
        col = checkVerticalCol(colIndex);
    }
    checkForWinner(row,col,diagonal1,diagonal2);
};
var initSize3ScoreReaders = function(rowIndex,colIndex){
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
        resetGame('Player 1');
        return;
    }else if(rowSum == -1*scoreBoard.length || colSum == -1*scoreBoard.length || diagonal1Sum == -1*scoreBoard.length || diagonal2Sum == -1*scoreBoard.length){
        console.log('blue won');
        resetGame('Player 2');
        return;
    }
    if(counter == Math.pow(scoreBoard.length,2)-1){
        console.log('Tie');
        resetGame('Tie');
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
//------------------------game end msg/reset --------------------------------------------
var createWinnerMsg = function(winner){
    var msg;
    var msg2;
    switch(winner){
        case 'Tie':
            msg = $('<div>').attr({'id':'winnerMsg'}).text(winner+"!");
            msg2 = $('<div>').attr({'id':'winnerMsgNotification'}).text("PLEASE CHECK ALL SETTINGS AND PRESS START FOR REPLAY");
            $('.gameBoard').append(msg,msg2);
            break;
        default:
            msg = $('<div>').attr({'id':'winnerMsg'}).text(winner+" Won!");
            msg2 = $('<div>').attr({'id':'winnerMsgNotification'}).text("PLEASE CHECK ALL SETTINGS AND PRESS START FOR REPLAY");
            $('.gameBoard').append(msg,msg2);
    }
};
var resetGame = function(winner){ 
    $('.tictactoeCell').addClass('clicked');
    createWinnerMsg(winner);
    initSettingClickHandlers();
    counter = -1;
    scoreBoard = null;
    background = null;
};


