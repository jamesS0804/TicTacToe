const tiles = document.querySelectorAll('.tiles')
const previous_button = document.querySelector('#previous')
const reset_button = document.querySelector('#reset')
const next_button = document.querySelector('#next')
const game_turn_text = document.querySelector('#game-turn')
const player_turn_text = document.querySelector('#player-turn')
const pregame_container = document.querySelector('.pregame-container')
const x_character_button = document.querySelector('#x-character')
const o_character_button = document.querySelector('#o-character')
const player2_name = document.querySelector('#player2-name')
const player_1_record = document.querySelector('#player1-record')
const player_2_record = document.querySelector('#player2-record')
const main_menu = document.querySelector('.mainmenu-container')
const vs_player_button = document.querySelector('#vs-player')
const vs_computer_button = document.querySelector('#vs-computer')
const character_selection = document.querySelector('.character-selection')
const game_container = document.querySelector('.game-container')
const menu_button = document.querySelector('#menu')

let board = [[,,,],[,,,],[,,,]]
let board_history = [[[,,,],[,,,],[,,,]]]
let move_index = 0
let game_over = false
let player_1 = ''
let player_2 = ''
let player_turn = 1
let character = ''
let turn = 1
let horizontal_counter = 0
let vertical_counter = 0
let forward_counter = 0
let backward_counter = 0
let player_1_data = [0,0,0]
let player_2_data = [0,0,0]
let game_mode = ''
let three_in_a_row = false

vs_player_button.addEventListener('click', function preGameMode(){
    return setGameMode('vs player')
})
vs_computer_button.addEventListener('click', function preGameMode(){
    return setGameMode('vs computer')
})
menu_button.addEventListener('click',goToMain)
previous_button.addEventListener('click',prevButtonClicked=()=>{
    move_index -= 1
    turn -= 1
    board = setRecordedBoard(board_history[move_index])
    setButtons()
})
next_button.addEventListener('click',nextButtonClicked=()=>{
    move_index += 1
    turn += 1
    board = setRecordedBoard(board_history[move_index])
    setButtons()
})
reset_button.addEventListener('click',resetGame=()=> {
    game_container.classList.toggle('unshow')
    pregame_container.classList.toggle('unshow')
    character_selection.classList.toggle('unshow')
})
x_character_button.addEventListener('click',setCharacter)
o_character_button.addEventListener('click',setCharacter)
function setGameMode(mode) {
    game_mode = mode
    if(game_mode === 'vs computer'){
        player2_name.innerText = 'Computer '
    }
    main_menu.classList.toggle('unshow')
    character_selection.classList.toggle('unshow')
}
function goToMain() {
    setPlayerRecord('reset')
    pregame_container.classList.toggle('unshow')
    main_menu.classList.toggle('unshow')
    game_container.classList.toggle('unshow')
}
function setPlayerRecord(condition,winner){
    switch(condition){
        case 'draw':
            player_1_data[1] += 1
            player_2_data[1] += 1
            break
        case 'win':
            if(winner === 1){
                player_1_data[0] += 1
                player_2_data[2] += 1
            } else {
                player_2_data[0] += 1
                player_1_data[2] += 1
            }
            break
        case 'reset':
            player_1_data.forEach((item,index,array) => array[index] = 0)
            player_2_data.forEach((item,index,array) => array[index] = 0)
            break
        default:
            break
    }
    
    player_1_record.innerText = `Win: ${player_1_data[0]}
                                Draw: ${player_1_data[1]}
                                Loss: ${player_1_data[2]}
                                `
    player_2_record.innerText = `Win: ${player_2_data[0]}
                                Draw: ${player_2_data[1]}
                                Loss: ${player_2_data[2]}
                                `
}
function ai() {
    let temp_moves = board.flatMap((item,index) => {
        return item.map((elem,i)=>{
           if(elem === null) return [index,i]
        })
    })
    let possible_moves = temp_moves.filter(item => item)
    let best_move = getOptimalMove(possible_moves)
    let best_move_id = `${best_move[0]}${best_move[1]}`
    if(best_move[0] === null){
        let random_tile = possible_moves[Math.floor(Math.random()*possible_moves.length)]
        best_move_id = `${random_tile[0]}${random_tile[1]}`
    } 
    document.querySelector(`#t${best_move_id}`).click()
}
function getOptimalMove(move_set){
    let chosen_move = []
    let counter_moves = [[1,1],[0,0],[0,2],[2,0],[2,2]]
    let counter_string = counter_moves.map(move => {
        return JSON.stringify(move)
    })
    if(turn === 2) {
        move_set.forEach(move => {
            let move_string = JSON.stringify(move)
            if(move_string === counter_string[0]) {
                chosen_move.push(move)
            }
        })
        if(chosen_move.length === 0) {
            counter_moves.shift()
            chosen_move.push(counter_moves[Math.floor(Math.random()*counter_moves.length)])
        }
    } else {
        chosen_move.push(my_moves(move_set))
        if(chosen_move[0] === null) {
            chosen_move.shift()
            chosen_move.push(opponent_moves(move_set))
        }
    }
    let temp = Array.from(chosen_move)
    return temp.flat()
}
function my_moves(move_set) {
    let temp_array = []
    for(let i=0;i<move_set.length;i++){
        horizontal(move_set[i][0],character)
        if(horizontal_counter >= 2) {
            temp_array.push(move_set[i])
        }
        vertical(move_set[i][1],character)
        if(vertical_counter >= 2) {
            temp_array.push(move_set[i])
        }
    }
    diagonal(character)
    if(forward_counter >= 2) {
        for(let x=0,y=0;y<3;y++){
            if(board[x][y] !== character && board[x][y] === null) {
                temp_array.push([x,y])
            }
            x++
        }
    }
    if(backward_counter >= 2) {
        for(let x=0,y=2;x<3;x++){
            if(board[x][y] !== character && board[x][y] === null) {
                temp_array.push([x,y])
            }
            y--
        }
    }
    if(temp_array.length === 0) temp_array.push(null)
    return temp_array[0]
}
function opponent_moves(move_set) {
    let opponent_character = character === 'X' ? 'O' : 'X'
    let temp_array = []
    for(let i=0;i<move_set.length;i++){
        horizontal(move_set[i][0],opponent_character)
        if(horizontal_counter >= 2) {
            temp_array.push(move_set[i])
        }
        vertical(move_set[i][1],opponent_character)
        if(vertical_counter >= 2) {
            temp_array.push(move_set[i])
        }
    }
    diagonal(opponent_character)
    if(forward_counter >= 2) {
        for(let x=0,y=0;y<3;y++){
            if(board[x][y] !== opponent_character && board[x][y] === null) {
                temp_array.push([x,y])
            }
            x++
        }
    }
    if(backward_counter >= 2) {
        for(let x=0,y=2;x<3;x++){
            if(board[x][y] !== opponent_character && board[x][y] === null) {
                temp_array.push([x,y])
            }
            y--
        } 
    }
    if(temp_array.length === 0) temp_array.push(null)
    return temp_array[0]
}
function horizontal(row,character){
    horizontal_counter = 0
    let horizontal_array = []
    for(let y=0;y<3;y++){
        if(board[row][y] === character) {
            horizontal_counter += 1
            horizontal_array.push(board[row][y])
        } else {
            horizontal_array.push(board[row][y])
        }
    }
    three_in_a_row = horizontal_array.every(move => {
        return move === character
    })
    if(three_in_a_row) {
        for(let y=0;y<3;y++){
            let winning_tiles = document.querySelector(`#t${row}${y}`)
            winning_tiles.style.background = 'green'
        }
        return true
    }
    return false
}
function vertical(col,character){
    vertical_counter = 0
    let vertical_array = []
    for(let x=0;x<3;x++){
        if(board[x][col] === character) {
            vertical_counter += 1
            vertical_array.push(board[x][col])
        } else {
            vertical_array.push(null)
        }
    }
    three_in_a_row = vertical_array.every(move => { 
        return move === character
    })
    if(three_in_a_row){
        for(let x=0;x<3;x++){
            let winning_tiles = document.querySelector(`#t${x}${col}`)
            winning_tiles.style.background = 'green'
        }
        return true
    }
    return false
}
function diagonal(character){
    let winning_tiles = {}
    forward_counter = 0
    backward_counter = 0
    let forward_slash = true
    let backward_slash = true
    let forward_array = []
    let backward_array = []
    for(let x=0,y=0;y<3;y++){
        if(board[x][y] === character) {
            forward_counter += 1
            forward_array.push(board[x][y])
        } else {
            forward_array.push(null)
        }
        x++
    }
    for(let x=0,y=2;x<3;x++){
        if(board[x][y] === character) {
            backward_counter += 1
            backward_array.push(board[x][y])
        } else {
            backward_array.push(null)
        }
        y--
    }
    forward_slash = forward_array.every(move => { 
        return move === character
    })
    backward_slash = backward_array.every(move => { 
        return move === character
    })
    if(forward_slash){
        x = 0
        y = 0
        while(y<3){
            winning_tiles = document.querySelector(`#t${x}${y}`)
            winning_tiles.style.background = 'green'
            x++,y++
        }
        return true
    } else if(backward_slash) {
        x = 0
        y = 2
        while(x<3){
            winning_tiles = document.querySelector(`#t${x}${y}`)
            winning_tiles.style.background = 'green'
            x++,y--
        }
        return true
    }
    return false
}
function setCharacter(e){
    character = e.target.value
    if(character === 'X'){
        player_1 = 'X'
        player_2 = 'O'
    } else {
        player_1 = 'O'
        player_2 = 'X'
    }
    pregame_container.classList.toggle('unshow')
    character_selection.classList.toggle('unshow')
    game_container.classList.toggle('unshow')
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
}
function setNewBoard(){
    for(let tile of tiles){
        tile.style.background = "transparent"
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
    character = player_1
    while(!game_over){
        if(turn === 10){
            draw = true
            game_over = true
            setButtons()
            break
        }
        if(turn % 2 === 0){
            player_turn = 2
            character = player_2
            if(game_mode === 'vs computer'){
                ai()
            }
        }else{
            player_turn = 1
            character = player_1
        }
        game_turn_text.innerText = `Turn ${turn}`
        if(!game_over) {
            player_turn_text.innerText = `Player ${player_turn}'s turn (${character})`
        }
        yield turn
    }
    showWinner(draw)
}
function showWinner(draw) {
    player_turn = player_turn % 2 === 0 ? 1 : 2
    if(draw){
        setPlayerRecord('draw')
        player_turn_text.innerText = `Draw!`
    } else {
        setPlayerRecord('win',player_turn)
        if(game_mode === 'vs computer' && player_turn === 2){
            character = player_2
            player_turn_text.innerText = `Computer (${character}) won!`
        } else {
            player_turn_text.innerText = `Player ${player_turn} (${character}) won!`
        }
    }
}
function getTileInfo(e){
    let tile_id = e.target.id
    let chosen_tile = document.querySelector(`#${tile_id}`)
    if(chosen_tile.innerText) return
    placeCharacterOnTile(chosen_tile, character)
    checkIfWon(chosen_tile,character)
    move_index += 1
    turn += 1
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
    while(!game_over){
        game_over = horizontal(tile_row, character)
        if(game_over) break
        game_over = vertical(tile_col, character)
        if(game_over) break
        if(tile_row === 1) {
             if(tile_col !== 1) break
        } else {
             if(tile_col === 1) break
        }
        game_over = diagonal(character)
        break
    }
}