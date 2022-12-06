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

        this.Turn = 'white'
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
                let square = new Square(j  * spaces, nx, this.Scene.size, alternate)

                square.spot = this.coordinateToPGN([j + 1, i + 1])

                this.Grid[i].push(square)
            }
        }

        // setup pieces
        for(let i = 0; i < 8; i++) {
            let whitePawn = new Pawn('white', i * spaces, spaces)
            let blackPawn = new Pawn('black', i * spaces, 6 * spaces)
            let whitePiece = new mainPieces[i]('white', i * spaces, 0)
            let blackPiece = new mainPieces[i]('black', i * spaces, 7 * spaces)
        
            whitePawn.spot = this.coordinateToPGN([i + 1, 2])
            this.grid(i + 1, 2).piece = whitePawn

            blackPawn.spot = this.coordinateToPGN([i + 1, 7])
            this.grid(i + 1, 7).piece = blackPawn
            
            whitePiece.spot = this.coordinateToPGN([i + 1, 1])
            this.grid(i + 1, 1).piece = whitePiece

            blackPiece.spot = this.coordinateToPGN([i + 1, 8])
            this.grid(i + 1, 8).piece = blackPiece

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

    PGNDistance(from, to) {
        if(!(this.isValidPGN(from) && this.isValidPGN(to))) return null
        from = this.readPGN(from)
        to = this.readPGN(to)

        return this.coordinateDistance(from.coordinate, to.coordinate)
    }

    coordinateDistance([ x1, y1 ]=[], [ x2, y2 ]=[]) {
        return [x2 - x1, y2 - y1]
    }

    readPGN(...pgns) {
        let list = []
        let names = {
            'K': 'King', 'Q': 'Queen', 'R': 'Rook', 'B': 'Bishop', 'N': 'Knight', '': 'Pawn'
        }

        //  test string => d4 Nf6 Bg5 d5 Bxf6 exf6 Bxb4+ Qf2#
        for(let i = 0; i < pgns.length; i++) {
            let pgn = pgns[i]

            let castleShort = pgn === 'O-O'
            let castleLong = pgn === 'O-O-O'
            let castle = castleShort || castleLong

            let name = castle ? 'King' :  names[pgn.match(/[A-Z]/g) ?? '']

            let spot = castle ? pgn :  pgn.match(/[a-z]\d/g)?.[0] ?? ''
            let readSpot =this.readSpot(spot)
            
            let captures = (/\x/g).test(pgn)
            let checkmate = (/\#/g).test(pgn)
            let check = (/\+/g).test(pgn) || checkmate

            let coordinate = castle ? [-1, -1] : readSpot.coordinate

            let isValidPGN = !!name&& spot.length > 0 && (castle || readSpot.isValidSpot)
            let result = {
                 name, spot, 
                 captures, check, checkmate, 
                 coordinate,
                 castle, castleShort, castleLong,
                 isValidPGN, PGN: pgn,
            }

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

    coordinateToPGN(...coordinates) {
        let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
        let list = []

        for(let i = 0; i < coordinates.length; i++) {
            let [ x, y ] = coordinates[i]
            x -= 1
            
            if(x< 0 || x > 7 || y < 1 || y > 8) {
                list.push(null)
                continue
            }

            list.push(alphabet[x] + y)
        }

        return coordinates.length === 1 ? list[0] : list
    }

    PGNToCoordinate(...pgns) {
        let list = []

        for(let i = 0; i < pgns.length; i++) {
            let pgn = this.readPGN(pgns[i])

            list.push(pgn.isValidPGN ? pgn.coordinate : [-1, -1])
        }

        return pgns.length === 1 ? list[0] : list
    }

    PGNToGridSquare(...pgns) {
        let list = []

        for(let i = 0; i < pgns.length; i++) {
            let pgn = pgns[i]
            let square = this.grid(...this.PGNToCoordinate(pgn))

            list.push(square)
        }

        return pgns.length === 1 ? list[0] : list
    }

    rawCoordinateToSquare(...coordinates) {
        const spaces = this.Scene.size / 8
        let list = []

        for(let i = 0; i < coordinates.length; i++) {
            let [ x, y ] = coordinates[i]
            let nx = Math.floor(x / spaces) + 1
            let ny = Math.floor(y / spaces) + 1

            list.push(this.grid(nx, ny))
        }

        return coordinates.length === 1 ? list[0] : list
    }

    rawCoordinateToPGN(...coordinates) {
        let toSquares = this.rawCoordinateToSquare(...coordinates)

        return coordinates.length === 1 ? toSquares.spot : toSquares.map(v => v.spot)
    }

    PGNToRawCoordinate(...pgns) {
        const spaces = this.Scene.size / 8
        let list = []

        for(let i = 0; i < pgns.length; i++) {
            let pgn = pgns[i]
            let [ x, y ] = this.PGNToCoordinate(pgn)

            if(x === -1 || y === -1) {
                list.push([x, y])
                continue
            }

            x = (x - 1) * spaces
            y = (y - 1) * spaces

            list.push([x, y])
        }

        return pgns.length === 1 ? list[0] : list
    }

    getPossibleMoves(currentSpot, possibleMoves) {
       if(!this.isValidPGN(currentSpot)) return null

       let newMoves = []
       currentSpot = this.PGNToCoordinate(currentSpot)

        for(let i = 0; i < possibleMoves.length; i++) {
            let moves = possibleMoves[i]

            let translate = this.coordinateToPGN([moves[0] + currentSpot[0], moves[1] + currentSpot[1]])

            if(!translate) continue
            
            newMoves.push(translate)
        }

       return newMoves
    }

    getLegalMoves(piece) {
        if(!(piece instanceof Piece)) return null

        let possibleMoves = piece.possibleMoves
        let legalMoves = []
        let [ cx, cy ] = this.PGNToCoordinate(piece.spot)

        for(let i = 0; i < possibleMoves.length; i++) {
            let moves = possibleMoves[i]
            let [ x, y ] = [cx + moves[0], cy + moves[1]]
            let square = this.grid(x, y)


            if(!square) continue
            let sameColor = square.piece && square.piece.color === piece.color
            let rangePiece = piece.name === 'queen' || piece.name === 'rook' || piece.name === 'bishop'
            
            if(sameColor) {
                if(rangePiece) i += 7 - (i % 8)
                continue
            } 
            
            if(rangePiece) {
                if(!sameColor && square.piece) {
                    console.log(square.piece)

                    i += 7 - (i % 8)
                    legalMoves.push(square.spot)

                    continue
                }
            }

            if(piece.name === 'pawn') {
                let [ dx, dy ] = this.PGNDistance(piece.spot, square.spot)
                
                if(piece.MoveTwice && (dy === 2 || dy === -2)) {


                        continue
                }

                // take en passant
                if(piece.EnPassant) {
                    console.log(piece)
                }

                if(!piece.MoveTwice && (dy === 2 || dy === -2)) {
                    let left = this.grid(x - 1, y)
                    let right = this.grid(x + 1, y)
                    let behind = piece.color === 'white' ? -1 : 1

                    // en passant
                    if(left?.piece && left?.piece.name === 'pawn') {
                        let coordinate = this.PGNToCoordinate(square.spot)
                        
                        coordinate[1] += behind

                        left.piece.EnPassant = true
                        left.piece.EnPassantPiece = piece
                        left.piece.EnPassantSpot =this.coordinateToPGN(coordinate)
                    }
                    if(right?.piece && right?.piece.name === 'pawn') {
                        let coordinate = this.PGNToCoordinate(square.spot)

                        coordinate[1] += behind

                        right.piece.EnPassant = true
                        right.piece.EnPassantPiece = piece
                        right.piece.EnPassantSpot =this.coordinateToPGN(coordinate)
                    }
                }
            }

            // square.highlighted = !square.highlighted

            legalMoves.push(square.spot)
        }

        return legalMoves
    }

    isLegalMove(piece, spot) {
        if(!(piece instanceof Piece)) return null
        let legalMoves = this.getLegalMoves(piece)

        return legalMoves.some(v => v === spot)
    }

    getPieces(pieceName, pieceSpot, pieceColor) {
        let pieces = []

        if(pieceName) pieces = this.Pieces.filter(p => p.name === pieceName)
        if(pieceColor) pieces = this.Pieces.filter(p => p.color === pieceColor)
        if(pieceSpot) pieces = this.Pieces.filter(p => p.spot === pieceSpot)

        return pieces
    }

    move(piece, spot) {
        if(!(piece instanceof Piece)) return null
        if(piece.color !== this.Turn) return false

        let spotSquare = this.PGNToGridSquare(spot)
        let oldSquare = this.PGNToGridSquare(piece.spot)
        
        if(!this.isLegalMove(piece, spot)) return false
        if(spotSquare.piece) this.remove(spotSquare.piece)
        let [ x, y ] = this.PGNToRawCoordinate(spot)
        let [ dx, dy ] = this.PGNDistance(piece.spot, spot)

        if(piece.name === 'pawn') {
            if(dy === 2 || dy === -2) piece.MoveTwice = true
        }

        piece.x = x
        piece.y = y

        spotSquare.piece = piece
        oldSquare.piece.spot = spot
        oldSquare.piece = null

        this.Turn = this.Turn === 'white' ? 'black' : 'white'

        return true
    }

    remove(piece) {
        let index = this.Pieces.findIndex(v => v === piece)

        return this.Pieces.splice(index, 1)
    }

    grid(x=1, y=1) {
        x -= 1
        y -= 1

        if(x< 0 || x > 7 || y < 0 || y > 7) return null

        return this.Grid[y][x]
    }
}