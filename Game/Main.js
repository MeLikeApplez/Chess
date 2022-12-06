import Chess from './Chess'

const canvas = document.querySelector('canvas')
const chess = new Chess(canvas)

window.chess = chess

const [ king ] = chess.getPieces('king')
const [ queen ] = chess.getPieces('queen', 'd1')
const [ rook ] = chess.getPieces('rook', '', '')
const [ bishop ] = chess.getPieces('bishop')
const [ knight ] = chess.getPieces('knight')
const [ pawn ] = chess.getPieces('pawn', 'e2')

console.log(chess.Pieces)