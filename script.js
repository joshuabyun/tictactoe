$(document).ready(function(){
   var gameBoard = new gameTemplate();
   gameBoard.gameTempInit(playerInfo);
   gameBoard.createCell(3);
});

var gameTemplate = function(){
    this.domElement;
    this.playerInfo = []; //to hold basic player info
    this.childrenObj = []; //holds children objects, but have not been used once.
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
        console.log('this.childrenObj : ',this.childrenObj);
    };
    this.handleClick = function(child){
        var playerObj = this.determineTurn();
        child.changeDom(playerObj);
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
    this.checkWhoWon = function(pointSum){
        switch(pointSum){
            case 10*this.numRow:
                console.log('player1 won');
                break;
            case -10*this.numRow:
                console.log('player2 won');
                break;
                return;
        }
    };
    this.performRowCheck = function(){
        for(var i =0; i< this.childrenObj.length-1;i += this.numRow){
            var pointSum = null;
            for(var j =i; j < i+this.numRow; j++){
                pointSum += this.childrenObj[j].playerPoint
            }
            this.checkWhoWon(pointSum);
        }
    };
    this.performColCheck =function(){
        for(var i = 0; i < this.numRow; i++){//012
            var pointSum = null;
            for(var j = i; j < this.childrenObj.length; j+=this.numRow){
                pointSum += this.childrenObj[j].playerPoint;
            }
            this.checkWhoWon(pointSum);
        }
    };
    this.performDiagonalCheck = function(){
        var diagonalPointSum = null;
        var invDiagoanlPointSum = null;
        for(var i = 0, j = this.numRow-1; i < this.childrenObj.length, j < this.childrenObj.length-1; i+=this.numRow+1, j+=this.numRow-1){ //0
            diagonalPointSum += this.childrenObj[i].playerPoint; //top left to bottom right
            invDiagoanlPointSum += this.childrenObj[j].playerPoint; //bottom left to top right
        }
        this.checkWhoWon(diagonalPointSum);
        this.checkWhoWon(invDiagoanlPointSum);
    }

};

var cellTemplate = function(parent){
    this.parent = parent;
    this.domElement;
    this.playerLogo;
    this.playerPoint;
    this.gameCellInit = function(order){
        return this.createDomElement(order);
    };
    this.createDomElement = function(order){
        var self = this;
        this.domElement = $('<div>').attr({'name':'div'+order,'class':'tictactoeCell'}).html(order);
        this.domElement.click(function(){
            self.parent.handleClick(self);
        });
        return this;
    };
    this.changeDom = function(playerObj){
        this.playerLogo = playerObj.logo;//player object with logo and point
        this.playerPoint = playerObj.point;
        var playerImg = playerObj.logo;
        console.log('hello this is div name', this.domElement.attr('name'));
        this.domElement.html(playerImg);

    }
};
var playerInfo = {
  player1 : {
      logo : 'O',
      point : 10
  }, 
  player2 : {
      logo : 'X',
      point : -10
  }
};
