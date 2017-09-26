$(document).ready(function(){
  var plTurn = 'X';
  var amdTurn = 'O';
  var winner = null;
  var turn, amdChoice;


  var tempBoardStatus = [];

  gameStart();

  function gameStart(){

    //Player with X goes first;
    if (plTurn === 'X'){
      turn = 'player';
      setMsg("It is your turn");

    }else if(amdTurn === 'X'){
      turn = "amd";
      setMsg("It is the computer's turn");
      amdMove(amdTurn);
      
    }
  } //gameStart

  //PLAYER MOVES

     //current player makes a move
     $('.tile').on('click', function(){

       //if there is not already a winner and it is not the computer's turn
      if (winner === null && turn ==='player'){
        startOverCaption();

        // IF tile is free
        if ($(this).text()===''){

          //Claim tile for player
          $(this).text(plTurn);
          $(this).addClass('yellowText');

          //Check board for a winner
          if (checkWinner(plTurn)){
            setMsg('Congratulations, you win!');
            $('#msg').addClass('redText');
            winner = plTurn;

          //Check for a draw  
          }else if (checkDraw()){
            setMsg("It's a draw!");
            $('#msg').addClass('redText');

          //if no winner nor draw found
          }else{
            changeTurn();
          } // if-else

        // ELSE-IF the tile is taken
        }else{
          setMsg('That tile is already taken. Try another one!');          
        } // if-else
      } //if no winner
    }); //onclick    



//COMPUTER LOGIC

  function amdMove(amdTurn){
    startOverCaption();

    //IF available make a winning move
    if (amdWin(amdTurn)){
      setMsg('Sorry, the computer won.');
      $('#msg').addClass('redText');
      winner = amdTurn;

    //ELSE IF block opponent form winning
    }else if (checkBlock(plTurn, amdTurn)){
      $('#'+amdChoice).text(amdTurn);

      //then check board for draw
      if (checkDraw()){
        setMsg("It's a draw!");
        $('#msg').addClass('redText');
      //if game is not a draw switch turn
      }else{
        changeTurn();
      }
      

     //ELSE pick a corner, center tile or random
    }else{
      pickOther(amdTurn);
      //check if game is a draw
      if (checkDraw()){
        setMsg("It's a draw!");
        $('#msg').addClass('redText');
      }else{
        changeTurn();
      } //if-else
    }//if-else    
  } //amdMove

//COMPUTER WINNING MOVE

  function amdWin(amdTurn){
    var result = false;
    for (var i = 1; i <= 9; i++){
      var tile = $('#' + i);
      if (tile.text() === ""){
        tile.text(amdTurn);

        if(checkWinner(amdTurn)){
          result = true;
          amdChoice = i;
          break;
        }else{
          tile.text('');
        } //if-else
      } //if
    } //for loop
    return result;
  } //amdTurn


    
// COMPUTER OTHER (pick the center tile first, then a corner, then a random free tile)

  function pickOther(amdTurn){

    //IF center tile is open take it
    if ($('#5').text() === ''){
      $('#5').text(amdTurn);

    //ELSE if any corner is free take it
    }else if (freeCorner()){
      console.log('found free corner tile');
      $('#' + amdChoice).text(amdTurn); 

    //ELSE take a random free tile     
    }else{
      var freeTiles = findFreeTiles();
      amdChoice = freeTiles[Math.floor(Math.random() * freeTiles.length)];
      $('#' + amdChoice).text(amdTurn);
    }//if-else
  } //pickCenterOrCorner

  function freeCorner(amdTurn){
    var result = false;
    var corners = [1,3,7,9];
    for (var i = 0; i < corners.length; i++){
        var tileId = corners[i];
        if ($('#'+ tileId).text() === ''){
          amdChoice = tileId;
          result = true;
          break;
        } //if
      } //for
    return result;
  }//freeCorner

 function findFreeTiles(){
    var tilesArr=[];
    for (var i = 1; i <= 9; i++){
      if ($('#'+i).text() === ""){
        tilesArr.push(i);
      }
    } //for loop
    return tilesArr;
  } //findFreeTiles

//SET MESSAGE 
   function setMsg(msg){
      $('#msg').text(msg);
   } //setMsg

//CHANGE TURNS
   function changeTurn(){
      if (turn == 'player'){
        turn = 'amd';
        setMsg("It is the computer's turn");
        amdMove(amdTurn);
      }else if (turn == 'amd'){
        turn = 'player';
        setMsg("It is your turn");
      } //else-if
   } //changeTurn

//CHECK FOR WINNER

 function getTile(num){
    var tileValue = $('#' + num).text();
    return tileValue;   
  }

  function checkRow(a,b,c,val){
    var result = false;
    if (getTile(a) == val && getTile(b) == val && getTile(c) == val){
      result = true;
    }
    return result;
  }

  function checkWinner(turn){
    var result = false;
    if (checkRow(1,2,3, turn)||
       checkRow(4,5,6, turn)||
       checkRow(7,8,9, turn)||
       checkRow(1,4,7, turn)||
       checkRow(2,5,8, turn)||
       checkRow(3,6,9, turn)||
       checkRow(1,5,9, turn)||
       checkRow(3,5,7, turn)){
        
        result = true;
    }
    return result;
  }
 
//CHECK FOR OPPORTUNITY TO BLOCK OPPONENT

  function checkBlockRow(a,b,c, plTurn, amdTurn){
    var result = false;
    if(getTile(a) === plTurn && 
       getTile(b) === plTurn && 
       getTile(c) === ''){
      amdChoice = c;
      result = true;

    }else if(getTile(b) === plTurn && 
             getTile(c) === plTurn && 
             getTile(a) === ''){
      amdChoice = a;
      result = true;
    }else if (getTile(a) === plTurn && 
              getTile(c) === plTurn && 
              getTile(b) === ''){
      amdChoice = b;
      result = true;
    }
    return result;
  }

  function checkBlock(plTurn, amdTurn){
    // console.log('checkRow called on : '+ plTurn + ', '+amdTurn);
    var result = false;
    if (checkBlockRow(1,2,3, plTurn, amdTurn)||
        checkBlockRow(4,5,6, plTurn, amdTurn)||
        checkBlockRow(7,8,9, plTurn, amdTurn)||
        checkBlockRow(1,4,7, plTurn, amdTurn)||
        checkBlockRow(2,5,8, plTurn, amdTurn)||
        checkBlockRow(3,6,9, plTurn, amdTurn)||
        checkBlockRow(1,5,9, plTurn, amdTurn)||
        checkBlockRow(3,5,7, plTurn, amdTurn)){
        
        result = true;
    }
    return result;
  }

//CHECK FOR FULL BOARD

function isBoardFull(){
  var result = true;
  for(var i = 1; i <= 9 ; i++){
    if($('#' + i).text() === ''){
      result = false;
      break;
    }//if
  } //for loop
  return result;
} //isBoardFull

//CHECK DRAW
function checkDraw(){
  if (isBoardFull() && winner === null){
    return true;
  }else{
    return false;
  }
}

//CLEAR BOARD

function clearBoard(){
  winner = null;
  $('#msg').removeClass('redText');
  for(var i =1; i<=9; i++){
    $('#' + i).text('');
    $('#' + i).removeClass('yellowText');
  }
}

//BUTTONS

function startOverCaption(){
  $('#amdCaption').text('Let the computer start over');
  $('#userCaption').text("I'll start over");
}

$('#computerStarts').on('click', function(){
  amdTurn = 'X';
  plTurn ='O';
  clearBoard();
  startOverCaption();
  gameStart();
});

$('#userStarts').on('click', function(){
  plTurn = 'X';
  amdTurn = 'O';
  clearBoard();
  startOverCaption();
  gameStart();
});



}); //$(document).ready
