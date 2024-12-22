 const easy = [ //RedFlyer
 "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
 "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
];
const medium = [
 "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
 "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
];
const hard = [
 "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
 "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
];
const test = [
 "71258369463971425884526917352143698736792841549817532618469753225384176997635284-",
 "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
];

var errors; //numbers of errors users has left
var selectedNum; //number the user will place in board
var done; //game will run while this is false
var className; //current class name for body to be replaced when theme is changed
var solution; //board solution
let endText = document.createElement("p")//creates the end message
    endText.id = "endText"

window.onload = function(){
    document.getElementById("newGame").addEventListener("click", start);
    numberListener()
    document.getElementById("check").addEventListener("click", check);
    done = false
}

function start(){
    //level choice
    //will start game with board of selected difficulty
    //let board = test[0];
    //solution = test[1];
    if(document.getElementById("easy").checked){
        board = easy[0];
        solution = easy[1]
    }
    else if(document.getElementById("medium").checked){
        board = medium[0];
        solution = medium[1];
    }
    else {
        board = hard[0];
        solution = hard[1];
    }
    
    if(document.querySelector("body").classList.contains("light")){
        className = "light";
    }
    else if(document.querySelector("body").classList.contains("dark")){
        className = "dark";
    }
    else if(document.querySelector("body").classList.contains("brown")){
        className = "brown";
    }
    else if(document.querySelector("body").classList.contains("olive")){
        className = "olive";
    }
    //replaces old class name with new selected theme's class name
    if(document.getElementById("light").checked){
        document.querySelector("body").classList.replace(className, "light");
    }
    else if(document.getElementById("dark").checked){
        document.querySelector("body").classList.replace(className, "dark");
    }
    else if(document.getElementById("brown").checked){
        document.querySelector("body").classList.replace(className, "brown");
    }
    else if(document.getElementById("olive").checked){
        document.querySelector("body").classList.replace(className, "olive");
    }
    errors = 3; //number of errors left to 3
    document.getElementById("endMessage").appendChild(endText)//adds new blank message every time a new game is started
    document.getElementById("endText").textContent = ""
    document.getElementById("endMessage").removeChild(endText); //removes old end message
    done = false;
    document.getElementById("errors").textContent = "Errors left : 3"; //sets errors display back to 3
    makeBoard(board);
    document.getElementById("numbers").classList.remove("hide") //shows board
    document.getElementById("gamePlay").classList.remove("hide") //shows errors and check button
}

function makeBoard(board){
    clear();
    for (let i = 0; i < 81; ++i){
        let square = document.createElement("p");
        if (board.charAt(i) != "-"){ //fills square with a given value
            square.textContent = board.charAt(i);
            square.classList.add("given")
        }
        else { //only adds event listen if square did not contain a given value
            square.addEventListener("click", function(){
                square.textContent = selectedNum;
                if(this.classList.contains("incorrect")){ //if this square had a previous incorrect guess the text will be red
                    this.classList.remove("incorrect") //removes the red text so new guess will match the theme text
                }
            })
        }
        square.id = i; //gives square its own is own id number
        square.classList.add("square"); //gives square class to every tile
        //give thick border to squares that need it
        count = i+1;
        if(count%3==0){
            square.classList.add("right");
        }
        if(count%9==1){
            square.classList.add("left");
        }
        if(count>=1 && count <= 9){
            square.classList.add("top");
        }
        if((count>=19 && count <=27) || (count>=46 && count <=54 || count >=73 && count <= 81)){
            square.classList.add("bottom");
        }
        document.getElementById("board").appendChild(square);
    }
}

function clear(){
    let suqares = document.querySelectorAll(".square"); //all elements that match the square class into an array
    for (let i = 0; i < suqares.length; ++i){
        suqares[i].remove();
    }
    for (let i = 0; i < document.getElementById("numbers").children.length; ++i){
        //removes the selected class from all of the numbers in the numbers container 
        document.getElementById("numbers").children[i].classList.remove("selected"); 
    }
    //resets the number selected
    selectedNum = null;
}
function numberListener(){
    for (let i = 0; i < document.getElementById("numbers").children.length; ++i){
        document.getElementById("numbers").children[i].addEventListener("click", function() {
            if(!done){ //does not allow user to change anything afer game is over, win or lose
                for(let i = 0; i < 10; ++i){ //makes sure everything else is deselected
                    if(document.getElementById("numbers").children[i].classList.contains("selected")){
                        document.getElementById("numbers").children[i].classList.remove("selected")
                    }
                }
                if(!done){
                    this.classList.add("selected");
                    selectedNum = this.textContent
                }
            }
        })
    }
}
function check(){
    if(!done){
        let count = 0;
        let spaces = false;
        for (let i = 0; i < document.getElementById("board").children.length; ++i){
            if(document.getElementById("board").children[i].textContent != solution.charAt(i)){
                //does not penalize for blank squares
                //lets you only check answers and can check after each move
                //'\xa0' is the char representation of non-breaking space in html
                if(document.getElementById("board").children[i].textContent != "" && document.getElementById("board").children[i].textContent != '\xa0'+'\xa0'+'\xa0'){
                    document.getElementById("board").children[i].classList.add("incorrect");
                    ++count;
                }
                else{
                    spaces = true;
                }
            }
        }
        if(!spaces){ //fully filled out board
            if(count == 0){
                done = true;
                endText.textContent = "You Win! Good job."
                document.getElementById("endMessage").appendChild(endText);
            }
        }
        if(count > 0){ //checks for number of unmatched squares not including blank squares
            --errors
            document.getElementById("errors").textContent = "Errors left : " + errors; //shows current errors left
        }
        if(errors == 0){ //when user runs out of errors
            endText.textContent = "You lose. Try again."
            document.getElementById("endMessage").appendChild(endText);
            done = true
        }
    }
}