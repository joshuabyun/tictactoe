$(document).ready(function(){
   var gameBoard = new gameTemplate();
   gameBoard.gameTempInit(playerInfo);
   gameBoard.createCell(4);
});

var gameTemplate = function(){
    this.domElement;
    this.playerInfo = []; //to hold basic player info
    this.childrenObj = []; //holds children objects, but have not been used once.
    this.gameCount = 0;
    this.gameTempInit = function(playerInfo){
      this.createDomElement();
        this.createPlayerInfo(playerInfo);
    };
    this.createPlayerInfo = function(playerInfo){
      var playerObjs = playerInfo;
      for(index in playerObjs){
          this.playerInfo.push(playerObjs[index]);
      }
      console.log('this.playerInfo',this.playerInfo);
    };
    this.createDomElement = function(){
        this.domElement = $('<div>').addClass('gameBoard');
        $('body').append(this.domElement);
    };
    this.createCell = function(numberOfRows){
        var numberOfCells = numberOfRows * numberOfRows;
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
        this.checkWinningCondition();
    };
    this.determineTurn = function(){
        console.log("current gameCount : ",this.gameCount);
        if(this.gameCount%2 == 0){
            var firstPlayer = this.playerInfo[0];
            this.gameCount++;
            return firstPlayer;
        }
        else{
            var secondPlayer = this.playerInfo[1];
            this.gameCount++;
            return secondPlayer;
        }
    };
    this.checkWinningCondition = function(){
        
    }
};

var cellTemplate = function(parent){
    this.parent = parent;
    this.domElement;
    this.player
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
        this.player = playerObj;
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
