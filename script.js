const tiles = document.querySelectorAll('.tiles')
const previous_button = document.querySelector('#previous')
const reset_button = document.querySelector('#reset')
const next_button = document.querySelector('#next')
const game_turn_text = document.querySelector('#game-turn')
const player_turn_text = document.querySelector('#player-turn')
const pregame_container = document.querySelector('.pregame-container')
const x_character_button = document.querySelector('#x-character')
const o_character_button = document.querySelector('#o-character')
let board = [[,,,],[,,,],[,,,]]
let board_history = [[[,,,],[,,,],[,,,]]]
let move_index = 0
let game_over = false
let player_1 = ''
let player_2 = ''
let player_turn = 1
let character = ''
let turn = 1

previous_button.addEventListener('click',prevButtonClicked=()=>{
    move_index -= 1
    turn -= 1
    board = setRecordedBoard(board_history[move_index])
    setButtons()
    startGame().next()
})
next_button.addEventListener('click',nextButtonClicked=()=>{
    move_index += 1
    turn += 1
    board = setRecordedBoard(board_history[move_index])
    setButtons()
    startGame().next()
})
reset_button.addEventListener('click',setNewBoard)
x_character_button.addEventListener('click',setCharacter)
o_character_button.addEventListener('click',setCharacter)

function setCharacter(e){
    character = e.target.value
    if(character === 'X'){
        player_1 = 'X'
        player_2 = 'O'
    } else {
        player_1 = 'O'
        player_2 = 'X'
    }
    setNewBoard()
}
function setButtons(){
    if(game_over === true){
        for(let tile of tiles){
            tile.removeEventListener('click',getTileInfo)
        }
        previous_button.disabled = false
        next_button.disabled = false
        if(move_index === 0){
            previous_button.disabled = true
        }
        if(move_index === board_history.length - 1 || board_history.length === 1){
            next_button.disabled = true
        }
    } else {
        previous_button.disabled = true
        next_button.disabled = true
    }
    if(turn % 2 === 0){
        player_turn = 2
        character = player_2
    }else{
        player_turn = 1
        character = player_1
    }
    game_turn_text.innerText = `Turn ${turn}`
    player_turn_text.innerText = `Player ${player_turn}'s turn (${character})`  
}
function setNewBoard(){
    pregame_container.classList.toggle('unshow')
    for(let tile of tiles){
        tile.style.background = "gray"
        tile.addEventListener('click',getTileInfo)
    }
    board = [[,,,],[,,,],[,,,]]
    board_history = [[[,,,],[,,,],[,,,]]]
    move_index = 0
    turn = 1
    character = player_1
    player_turn = 1
    game_over = false
    setButtons()
    for(let tile of tiles){
        tile.innerText = ""
    }
    startGame().next()
}
function* startGame(){
    let draw = false
    setButtons() 
    character = player_1
    while(!game_over){
        if(turn === 10){
            alert('Draw!')
            draw = true
            game_over = true
            setButtons()
            break
        }
        if(turn % 2 === 0){
            player_turn = 2
            character = player_2
        }else{
            player_turn = 1
            character = player_1
        }
        game_turn_text.innerText = `Turn ${turn}`
        player_turn_text.innerText = `Player ${player_turn}'s turn (${character})`
        yield turn += 1
    }
    player_turn -= 1
    player_turn_text.innerText = draw ? `Draw!` : `Player ${player_turn} (${character}) won!`
}
function getTileInfo(e){
    let tile_id = e.target.id
    let chosen_tile = document.querySelector(`#${tile_id}`)
    if(chosen_tile.innerText) return
    placeCharacterOnTile(chosen_tile, character)
    checkIfWon(chosen_tile,character)
    move_index += 1
    setButtons()
    startGame().next()
}
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
function setRecordedBoard(new_board){
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
function checkIfWon(tile, character){
    let tile_id_array = tile.id.split('')
    let tile_row = Number(tile_id_array[1])
    let tile_col = Number(tile_id_array[2])

    horizontal(tile_row, character)
    vertical(tile_col, character)
    if(tile_row === 1) {
         if(tile_col !== 1) return
    } else {
         if(tile_col === 1) return
    }
    diagonal(character)
}
function horizontal(row,character){
    for(let y=0;y<3;y++){
        if(board[row][y] !== character) return
    }
    for(let y=0;y<3;y++){
        let winning_tiles = document.querySelector(`#t${row}${y}`)
        winning_tiles.style.background = 'green'
    }
    game_over = true
}
function vertical(col,character){
    for(let x=0;x<3;x++){
        if(board[x][col] !== character) return
    }
    for(let x=0;x<3;x++){
        let winning_tiles = document.querySelector(`#t${x}${col}`)
        winning_tiles.style.background = 'green'
    }
    game_over = true
}
function diagonal(character){
    let winning_tiles = {}
    let x = 0
    let y = 0
    let forward_slash = true
    let backward_slash = true
    while(y<3){
        if(board[x][y] !== character) forward_slash = false
        x++,y++
    }
    x = 0
    y = 2
    while(x<3){
        if(board[x][y] !== character) backward_slash = false
        x++,y--
    }
    if(!forward_slash && !backward_slash) return
    if(forward_slash){
        x = 0
        y = 0
        while(y<3){
            winning_tiles = document.querySelector(`#t${x}${y}`)
            winning_tiles.style.background = 'green'
            x++,y++
        }
    } else {
        x = 0
        y = 2
        while(x<3){
            winning_tiles = document.querySelector(`#t${x}${y}`)
            winning_tiles.style.background = 'green'
            x++,y--
        }
    }
    game_over = true
}