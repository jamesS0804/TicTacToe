const tiles = document.querySelectorAll('.tiles')
const previous_button = document.querySelector('#previous')
const reset_button = document.querySelector('#reset')
const next_button = document.querySelector('#next')
let board = [[,,,],[,,,],[,,,]]
let board_history = [[[,,,],[,,,],[,,,]]]
let move_index = 0
let player_1 = 'X'
let player_2 = 'O'
let player_turn = 1
let character = ''
let turn = 1

function placeCharacterOnTile(tile, character){
    let tile_id_array = tile.id.split('')
    let tile_row = tile_id_array[1]
    let tile_col = tile_id_array[2]
    let json = JSON.stringify(board_history[board_history.length - 1])
    let new_board = JSON.parse(json)
    new_board[tile_row][tile_col] = character
    board_history.push(new_board)
    board = new_board
    tile.innerText = character
}
function setNewBoard(new_board){
    let x = 0
    let y = 0
    for(let tile of tiles){
        if(y > 2){
            y = 0
            x += 1
        }
        tile.innerText = new_board[x][y] || ""
        y += 1
    }
}
previous_button.addEventListener('click',()=>{
    move_index -= 1
    turn -= 2
    board = setNewBoard(board_history[move_index])
    setButtons()
    startGame().next()
})
next_button.addEventListener('click',()=>{
    move_index += 1
    board = setNewBoard(board_history[move_index])
    setButtons()
    startGame().next()
})
reset_button.addEventListener('click',()=>{
    board = [[,,,],[,,,],[,,,]]
    board_history = [[[,,,],[,,,],[,,,]]]
    move_index = 0
    turn = 1
    character = player_1
    player_turn = 1
    setButtons()
    for(let tile of tiles){
        tile.innerText = ""
    }
    startGame().next()
})
function setButtons(){
    previous_button.disabled = false
    next_button.disabled = false
    if(move_index === 0){
        previous_button.disabled = true
    }
    if(move_index === board_history.length - 1 || board_history.length === 1){
        next_button.disabled = true
    }   
}
function* startGame(){
    setButtons()
    let game_over = false 
    character = player_1
    while(!game_over){
        console.log(turn)
        if(turn === 10){
            alert('Draw!')
            game_over = true
        }
        if(turn % 2 === 0){
            console.log('Here!')
            player_turn = 2
            character = player_2
        }else{
            player_turn = 1
            character = player_1
        }
        //alert(`Player ${player_turn}'s turn`)
        yield turn += 1
    }
}
function checkIfWon(tile, character){
    let tile_id_array = tile.id.split('')
    let tile_row = tile_id_array[1]
    let tile_col = tile_id_array[2]
    
    
}
for(let tile of tiles){
    tile.addEventListener('click',(e)=>{
        let tile_id = e.target.id
        let chosen_tile = document.querySelector(`#${tile_id}`)
        placeCharacterOnTile(chosen_tile, character)
        if(turn > 5){
            console.log('checking...')
            checkIfWon(chosen_tile,character)
        }
        move_index += 1
        setButtons()
        startGame().next()
        /*
        console.log(`index: ${move_index}`)
        console.log(`board: ${board}`)
        console.log(`history: ${board_history}`)
        console.log(`length: ${board_history.length}`)
        */
    })
}
startGame().next()