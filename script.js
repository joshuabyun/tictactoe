
var gameTemplate = function(){
    this.domElement;
    this.playerInfo = [];
    this.childrenObj = [];
    this.gameCount = 0;
    this.gameTempInit = function(playerInfo){
      this.createDomElement();
        this.createPlayerInfo(playerInfo);
    };
    this.createPlayerInfo = function(playerInfo){
      var playerObjs = playerInfo;
      for(index in playerObjs){
          this.playerInfo.push(playerObjs[index]);
      };
      console.log(this.playerInfo);
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
        var playerImg = this.determineTurn();
        child.changeDom(playerImg);
        this.checkWinningCondition();
    };
    this.determineTurn = function(){
        if(this.gameCount%2 == 0){
            var firstPlayer = this.playerInfo[0].logo;
            this.gameCount++;
            return firstPlayer;
        }
        else{
            var secondPlayer = this.playerInfo[1].logo;
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
    this.gameCellInit = function(order){
        return this.createDomElement(order);
    };
    this.createDomElement = function(order){
        var self = this;
        this.domElement = $('<div>').addClass('tictactoeCell').attr({'name':'div'+order});
        this.domElement.click(function(){
            self.parent.handleClick(self);
        });
        return this;
    };
    this.changeDom = function(img){
        console.log('hello this is div name', this.domElement.attr('name'));
        this.domElement.html(img);
    }
};
var playerInfo = {
  player1 : {
      logo : 'O'
  }, 
  player2 : {
      logo : 'X'
  }
};
