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
        var numberOfPlayers = Number($('.player-buttons:checked').val());
        var gameBoardSize = Number($('.game-size:checked').val());
        var p1Image = $('.player1Char > .selected').css('background-image');
        var p2Image = $('.player2Char > .selected').css('background-image');
        $('.gameBoard *').remove();
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
  if(numberOfPlayers === 1){
      apply1PGameBoardClickHandler(gameBoardSize);
  }else if(numberOfPlayers === 2){
      apply2PGameBoardClickHandler(gameBoardSize);
  }
};
var createScoreBoard = function(gameBoardSize){
    switch(gameBoardSize){
        case 5 :
            return [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
        default :   // gameBoardSize = 3
            return [[0,0,0],[0,0,0],[0,0,0]];
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
        loadGif();
        if(scoreBoard!=null){
            var sec = Math.floor(Math.random()*2)+1;
            setTimeout(function(){
                removeGif();
                initAi(scoreBoard.length);
            },1000*sec);
        }
    });
};
var loadGif = function(){
    if(scoreBoard == undefined){
        return
    }
    var centerRow = Math.ceil(scoreBoard.length/2);
    $('.cellContainer:nth-child('+centerRow+')').addClass('loadingRow');
    $('<div>').addClass('loading').appendTo($('.loadingRow > .tictactoeCell:nth-child('+centerRow+')'));
};
var removeGif =function(){
    if(scoreBoard.length == undefined){
        return
    }
    if(scoreBoard.length == undefined) return;
    var centerRow = Math.ceil(scoreBoard.length/2);
    $('.loadingRow > .tictactoeCell:nth-child('+centerRow+') > div').remove();
    $('.cellContainer:nth-child('+centerRow+')').removeClass('loadingRow');
};
//----------------------------AI-----------------------------------------------------
var initAi = function(gameBoardSize){
    var aiPosition = aiFindBestPosInBoard(0);//array of ai position
    console.log('scoreBoard : ',scoreBoard);
    console.log('aiposition : ', aiPosition);
    var nthRow = aiPosition[0]+1;
    var nthCol = aiPosition[1]+1;
    changeScoreBoard(nthRow-1,nthCol-1,-1);
    $('.cellContainer:nth-child('+nthRow+')').addClass('randomRow');
    $('.randomRow > .tictactoeCell:nth-child('+nthCol+')').css({
         'background-image':background[1],
         'background-position': 'center',
         'background-repeat': 'no-repeat',
         'background-size': 'contain'
    });
    differentiateClickedCell($('.randomRow > .tictactoeCell:nth-child('+nthCol+')'));
    checkCorrectScoreReader(nthRow-1,nthCol-1,gameBoardSize);
    $('.cellContainer:nth-child('+nthRow+')').removeClass('randomRow');
    counter++;
};
var aiFindBestPosInBoard = function(scoreTargetPos){
    var targetScore = [(scoreBoard.length-1)*-1,scoreBoard.length-1,(scoreBoard.length-2)*-1,scoreBoard.length-2];
    var collectScores = collectCurrentScore();
    console.log("collectScores",collectScores);
    var scoreArr = refineScoreObj(collectCurrentScore(),targetScore[scoreTargetPos]);
    console.log("scoreArr",scoreArr);
    var aiPosition;
    if(scoreArr.length == 0){
        scoreTargetPos++;
        console.log("scoreTargetPos",scoreTargetPos);
        if(scoreTargetPos >= targetScore.length ){
            aiPosition = chooseRandomSlotPos(findOpenSlot());
            return aiPosition;
        }
        aiPosition = aiFindBestPosInBoard(scoreTargetPos);
        return aiPosition;
    }else if(scoreArr.length == 1){
        console.log(scoreArr);
        aiPosition = [scoreArr[0].emptyPos[0][0],scoreArr[0].emptyPos[0][1]];
        return aiPosition;
    }else{//more than 1
        var randomNum = Math.floor(Math.random()*scoreArr.length);
        console.log(scoreArr);
        aiPosition = [scoreArr[randomNum].emptyPos[0][0],scoreArr[randomNum].emptyPos[0][1]];
        return aiPosition;
    }
};
var findOpenSlot = function(){
    var positionArr = [];
    for(var i = 0; i < scoreBoard.length; i++){
        for(var j = 0; j < scoreBoard.length; j++){
            if(scoreBoard[i][j] == 0){
                positionArr.push([i,j]);
            }
        }
    }
    return positionArr;
};
var chooseRandomSlotPos = function(array){ //receives an array as a param return randomly chooses  and return one of its item
    var arrPos = Math.floor(Math.random()*array.length);
    return array[arrPos];
};
var refineScoreObj = function(currentScoreObj,targetScore){
 var returnArr = [];
 for(var each in currentScoreObj){
     if(currentScoreObj[each].sum == targetScore && currentScoreObj[each].emptyPos.length != 0){//scoreBoard.length-1
         returnArr.push(currentScoreObj[each]);
     }
 }
    return returnArr;
};
var collectCurrentScore = function(){
  var returnObj = {};
  returnObj.diagonalObj1 = diagonalTopLeftBtmRht();
  returnObj.diagonalObj2 = diagonalTopRhtBtmLeft();
  for(var i = 0; i < scoreBoard.length; i++){
      returnObj['row'+i] = checkHorizontalRow(i);
      returnObj['col'+i] = checkVerticalCol(i);
  }
  return returnObj;
};
//----------------------------------------------------------------------------------
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
        diagonal1 = diagonalTopLeftBtmRht().sum;
        diagonal2 = diagonalTopRhtBtmLeft().sum;
        row = checkHorizontalRow(rowIndex).sum;
        col = checkVerticalCol(colIndex).sum;
    }else if((rowIndex == 0 && colIndex == 0) || (rowIndex == 1 && colIndex == 1) || (rowIndex == scoreBoard.length-1 && colIndex == scoreBoard.length-1) || (rowIndex == scoreBoard.length-2 && colIndex == scoreBoard.length-2)){
        diagonal1 = diagonalTopLeftBtmRht().sum;
        row = checkHorizontalRow(rowIndex).sum;
        col = checkVerticalCol(colIndex).sum;
    }else if((rowIndex == 0 && colIndex == scoreBoard.length-1) || (rowIndex == 1 && colIndex == scoreBoard.length-2) || (rowIndex == scoreBoard.length-1 && colIndex == 0) || (rowIndex == scoreBoard.length-2 && colIndex == 1)){
        diagonal2 = diagonalTopRhtBtmLeft().sum;
        row = checkHorizontalRow(rowIndex).sum;
        col = checkVerticalCol(colIndex).sum;
    }else{
        row = checkHorizontalRow(rowIndex).sum;
        col = checkVerticalCol(colIndex).sum;
    }
    checkForWinner(row,col,diagonal1,diagonal2);
};
var initSize3ScoreReaders = function(rowIndex,colIndex){
    var center = Math.floor(scoreBoard.length/2);
    var row;
    var col;
    var diagonal1;
    var diagonal2;
    if(rowIndex == center && colIndex == center){
        diagonal1 = diagonalTopLeftBtmRht().sum;
        diagonal2 = diagonalTopRhtBtmLeft().sum;
        row = checkHorizontalRow(rowIndex).sum;
        col = checkVerticalCol(colIndex).sum;
    }else if((rowIndex == 0 && colIndex == 0) || (rowIndex == scoreBoard.length-1 && colIndex == scoreBoard.length-1)){
        diagonal1 = diagonalTopLeftBtmRht().sum;
        row = checkHorizontalRow(rowIndex).sum;
        col = checkVerticalCol(colIndex).sum;
    }else if((rowIndex == 0 && colIndex == scoreBoard.length-1) || (rowIndex == scoreBoard.length-1 && colIndex == 0)){
        diagonal2 = diagonalTopRhtBtmLeft().sum;
        row = checkHorizontalRow(rowIndex).sum;
        col = checkVerticalCol(colIndex).sum;
    }else{
        row = checkHorizontalRow(rowIndex).sum;
        col = checkVerticalCol(colIndex).sum;
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
    var diagonalObj = {checkSlotScore : [],emptyPos : []};
    for(var i = 0;i <scoreBoard.length; i++){
        if(scoreBoard[i][i] == 0){
            diagonalObj.emptyPos.push([i,i]);
        }
        sum += scoreBoard[i][i];
        diagonalObj.checkSlotScore.push(scoreBoard[i][i]);
    }
    diagonalObj.type = 'diagonal';
    diagonalObj.checkingPos = 0;
    diagonalObj.sum = sum;
    return diagonalObj;
};
var diagonalTopRhtBtmLeft = function(){
    var sum = 0;
    var diagonalObj = {checkSlotScore : [],emptyPos : []};
    var col = scoreBoard.length-1;
    for(var i = 0;i <scoreBoard.length; i++){
        if(scoreBoard[i][col-i] == 0){
            diagonalObj.emptyPos.push([i,col-i]);
        }
        sum += scoreBoard[i][col-i];
        diagonalObj.checkSlotScore.push(scoreBoard[i][col-i]);
    }
    diagonalObj.sum = sum;
    diagonalObj.type = 'diagonal';
    diagonalObj.checkingPos = 1;
    return diagonalObj;
};
var checkHorizontalRow = function(rowIndex){
    var sum =0;
    var rowObj = {checkSlotScore : [], emptyPos : []};
    var counter = 0;
    scoreBoard[rowIndex].forEach(function(currentValue){
        if(currentValue == 0){
            rowObj.emptyPos.push([rowIndex,counter])
        }
        sum +=currentValue;
        rowObj.checkSlotScore.push(currentValue);
        counter++;
    });
    rowObj.sum = sum;
    rowObj.type = 'row';
    rowObj.checkingPos = rowIndex;
    return rowObj;
};
var checkVerticalCol = function(colIndex){
    var sum = 0;
    var colObj = {checkSlotScore : [], emptyPos : []};
    scoreBoard.forEach(function(currentValue,index){
        if(scoreBoard[index][colIndex] == 0){
            colObj.emptyPos.push([index,colIndex]);
        }
        sum += scoreBoard[index][colIndex];
        colObj.checkSlotScore.push(scoreBoard[index][colIndex]);
    });
    colObj.sum = sum;
    colObj.type = 'col';
    colObj.checkingPos = colIndex;
    return colObj;
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


