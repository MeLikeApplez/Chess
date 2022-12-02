import Scene from './Scene'
import Controller from './Controller'
import { Square, Piece, King, Queen, Rook, Bishop, Knight, Pawn } from './Pieces'

export default class Chess {
    constructor(canvas) {
        this.canvasElement = canvas
        this.canvasContext = canvas.getContext('2d')
        this.Controller = new Controller(canvas)

        this.canvasElement.oncontextmenu = function() { return false }

        this.Scene = new Scene(this)

        this.Grid = [[], [], [], [], [], [], [], []]
        this.Pieces = []
        this.PGNMoves = []

        const light = '#F0D9B5'
        const dark = '#B58863'
        const spaces = this.Scene.size / 8
        const mainPieces = [Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook]
        let alternate = dark

        // setup squares
        for(let i = 0; i < 8; i++) {
            let nx = i * spaces

            for(let j = 0; j < 8; j++) {
                alternate = (i + j) % 2 === 0 ? dark : light
                
                this.Grid[i].push(new Square(j  * spaces, nx, this.Scene.size, alternate))
            }
        }

        // setup pieces
        for(let i = 0; i < 8; i++) {
            let whitePawn = new Pawn('white', i * spaces, spaces)
            let blackPawn = new Pawn('black', i * spaces, 6 * spaces)
            let whitePiece = new mainPieces[i]('white', i * spaces, 0)
            let blackPiece = new mainPieces[i]('black', i * spaces, 7 * spaces)
        
            this.Pieces.push(whitePawn, blackPawn, whitePiece, blackPiece)
        }
    }

    isValidPGN(...pgns) {
        let list = []

        for(let i = 0; i < pgns.length; i++) {
            list.push(this.readPGN(pgns[i]).isValidPGN)
        }

        return pgns.length === 1 ? list[0] : list
    }

    readPGN(...pgns) {
        let list = []
        let names = {
            'K': 'King', 'Q': 'Queen', 'R': 'Rook', 'B': 'Bishop', 'N': 'Knight', '': 'Pawn'
        }

        //  test string => d4 Nf6 Bg5 d5 Bxf6 exf6 Bxb4+ Qf2#
        for(let i = 0; i < pgns.length; i++) {
            let pgn = pgns[i]
            let name = names[pgn.match(/[A-Z]/g) ?? '']
            let spot = pgn.match(/[a-z]\d/g)?.[0] ?? ''
            let readSpot =this.readSpot(spot)
            let captures = (/\x/g).test(pgn)
            let checkmate = (/\#/g).test(pgn)
            let check = (/\+/g).test(pgn) || checkmate
            let isValidPGN = !!name && spot.length > 0 && readSpot.isValidSpot
            let result = { name, spot, captures, check, checkmate, coordinate: readSpot.coordinate, isValidPGN, PGN: pgn }

            list.push(result)
        }

        return pgns.length === 1 ? list[0] : list
    }

    readSpot(...spots) {
        let list = []
        let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

        for(let i = 0; i < spots.length; i++) {
            let spot = spots[i]
            let file = alphabet.findIndex(v => v  === spot.match(/[a-z]/g)?.[0]) + 1
            let rank = +spot.match(/\d/g)?.[0]
            let isValidSpot = (file >= 1 && file <= 8) && (rank >= 1 && rank <=8)

            list.push({ file, rank, spot, isValidSpot, coordinate: [file, rank] })
        }

        return spots.length === 1 ? list[0] : list
    }

    gridToPGN(...coordinates) {
        let list = []

        for(let i = 0; i < coordinates.length; i++) {
            let [ x, y ] = coordinates[i]

            list.push()
        }

        return coordinates.length === 1 ? list[0] : list
    }

    PGNToGrid(...pgn) {
        let list = []

        for(let i = 0; i < pgns.length; i++) {
            let pgn = pgns[i]

            list.push()
        }

        return pgns.length === 1 ? list[0] : list
    }


}