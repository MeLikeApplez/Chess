import Chess from './Chess'

const canvas = document.querySelector('canvas')
const chess = new Chess(canvas)

window.chess = chess

console.log(chess.Pieces)

console.log(
    chess.readPGN( 'Qf2#')
)
