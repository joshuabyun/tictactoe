$(document).ready(function(){
   var gameBoard = new gameTemplate();
   gameBoard.gameTempInit(playerInfo);
   gameBoard.createCell(3);
});

var gameTemplate = function(){
    this.domElement;
    this.playerInfo = [];
    this.childrenObj = [];
    this.gameCount = 0;
    this.numRow;
    this.gameTempInit = function(playerInfo){
      this.createDomElement();
      this.createPlayerInfo(playerInfo);
    };
    this.createPlayerInfo = function(playerInfo){
      var playerObjs = playerInfo;
      for(index in playerObjs){
          this.playerInfo.push(playerObjs[index]);
      }
    };
    this.createDomElement = function(){
        this.domElement = $('<div>').addClass('gameBoard');
        $('body').append(this.domElement);
    };
    this.createCell = function(numberOfRows){
        this.numRow = numberOfRows;
        var numberOfCells = Math.pow(this.numRow, 2);
        for(var i = 0;i<numberOfCells;i++){
            var cell = new cellTemplate(this);
            var cellObj = cell.gameCellInit(i);
            this.domElement.append(cellObj.domElement);
            this.childrenObj.push(cellObj);
        }
    };
    this.handleClick = function(child){
        if(child.playerPoint != undefined){
            console.log('cell already clicked, choose another cell');
            return;
        }
        var player = this.determineTurn();
        child.changeDom(player);
        this.runWinningCondFunc();
    };
    this.determineTurn = function(){
        var playerTurn = this.gameCount%2; //returns 1 or 0
        var player = this.playerInfo[playerTurn];
        this.gameCount++;
        return player;
    };
    this.runWinningCondFunc = function(){
        this.performRowCheck();
        this.performColCheck();
        this.performDiagonalCheck();
    };
    this.performRowCheck = function(){
        for(var i =0; i< this.childrenObj.length-1;i += this.numRow){
            var pointSum = null;
            for(var j =i; j < i+this.numRow; j++){
                console.log("pos "+j+" score : "+this.childrenObj[j].playerPoint);
                pointSum += this.childrenObj[j].playerPoint
            }
            this.checkWhoWon(pointSum);
            console.log('row : '+i+" Sum : "+pointSum);
        }
    };
    this.performColCheck =function(){
        for(var i = 0; i < this.numRow; i++){//012
            var pointSum = null;
            for(var j = i; j < this.childrenObj.length; j+=this.numRow){
                pointSum += this.childrenObj[j].playerPoint;
            }
            this.checkWhoWon(pointSum);
            console.log('col : '+i+" Sum : "+pointSum);
        }
    };
    this.performDiagonalCheck = function(){
        var diagonalPointSum = null;
        var invDiagoanlPointSum = null;
        for(var i = 0, j = this.numRow-1; i < this.childrenObj.length, j < this.childrenObj.length-1; i+=this.numRow+1, j+=this.numRow-1){ //0
            diagonalPointSum += this.childrenObj[i].playerPoint; //top left to bottom right
            invDiagoanlPointSum += this.childrenObj[j].playerPoint; //bottom left to top right
        }
        console.log('diagonal : '+ diagonalPointSum);
        console.log('inverse diagonal : '+ invDiagoanlPointSum);
        this.checkWhoWon(diagonalPointSum);
        this.checkWhoWon(invDiagoanlPointSum);
    };
    this.checkWhoWon = function(pointSum){
        switch(pointSum){
            case 10*this.numRow:
                this.handleGameOver(this.playerInfo[0]);
                this.gameCount = 0;
                break;
            case -10*this.numRow:
                this.handleGameOver(this.playerInfo[1]);
                this.gameCount = 0;
                break;
            default :
                if(this.gameCount == Math.pow(this.numRow,2)){
                    this.handleGameOver('tie');
                    this.gameCount = 0;
                }
                else{
                    return;
                }
        }
    };
    this.handleGameOver = function(winningPlayer){
        if(typeof(winningPlayer) == 'string'){
            console.log('game tie!')
        }
        else{
            console.log(winningPlayer.logo+" is the winner!");
        }
        for(var i = 0 ; i < this.childrenObj.length; i++){
            this.childrenObj[i].reset();
            console.log('slot'+i+" resetted");
            }
    }
};
var cellTemplate = function(parent){
    this.parent = parent;
    this.domElement;
    this.playerLogo;
    this.playerPoint;
    var cellOrder;
    this.gameCellInit = function(order){
        return this.createDomElement(order);
    };
    this.createDomElement = function(order){
        cellOrder = order;
        var self = this;
        this.domElement = $('<div>').attr({'name':'div'+order,'class':'tictactoeCell'}).html(cellOrder);
        this.domElement.click(function(){
            self.parent.handleClick(self);
        });
        return this;
    };
    this.changeDom = function(playerObj){
        this.playerLogo = playerObj.logo;//player object with logo and point
        this.playerPoint = playerObj.point;
        this.domElement.html(this.playerLogo).css({
            'background-color' : playerObj.backgroundColor
        });
    };
    this.reset = function(){
        this.playerLogo = null;
        this.playerPoint = null;
        this.domElement.html(cellOrder).css({
            'background-color' : 'white'
            });
    }
};
var playerInfo = {
  player1 : {
      logo : 'O',
      point : 10,
      backgroundColor : 'blue'
  }, 
  player2 : {
      logo : 'X',
      point : -10,
      backgroundColor : 'green'
  }
};
