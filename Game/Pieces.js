export class Piece {
    constructor(color, img, x, y, value) {
        this.color = color
        this.oppositeColor = color === 'white' ? 'black' : 'white'
        this.img = document.querySelector(`[src="/${img}.png"]`)
        this.x = x
        this.y = y
        this.value = value

        this.name = this.constructor.name.toLowerCase()
        this.PGNIdentifier = this.name !== 'pawn' ? (this.name === 'knight' ? 'N'  : this.constructor.name[0])  : ''
        this.spot = ''

        this.possibleMoves = []
    }

    createPGN(spot='') {
        return this.PGNIdentifier + spot
    }
}

export class King extends Piece {
    constructor(color, x, y) {
        super(color, color[0] + '_king', x, y, Infinity)
    
        this.possibleMoves = [
            [0, 1], [1, 1], [1, 0], [1, -1],
            [0, -1], [-1, -1], [-1, 0], [-1, 1]
        ]
    }
}

export class Queen extends Piece {
    constructor(color, x, y) {
        super(color, color[0] + '_queen', x, y, 9)
    
        for(let i = 0; i < 8; i++) { this.possibleMoves.push([0, i + 1]) }
        for(let i = 0; i < 8; i++) { this.possibleMoves.push([i + 1, i + 1]) }

        for(let i = 0; i < 8; i++) { this.possibleMoves.push([i + 1, 0]) }
        for(let i = 0; i < 8; i++) { this.possibleMoves.push([i + 1, -i - 1]) }

        for(let i = 0; i < 8; i++) { this.possibleMoves.push([0, -i - 1]) }
        for(let i = 0; i < 8; i++) { this.possibleMoves.push([-i - 1, -i - 1]) }

        for(let i = 0; i < 8; i++) { this.possibleMoves.push([-i - 1, 0]) }
        for(let i = 0; i < 8; i++) { this.possibleMoves.push([-i - 1, i + 1]) }

    }
}

export class Rook extends Piece {
    constructor(color, x, y) {
        super(color, color[0] + '_rook', x, y, 5)
    
        for(let i = 0; i < 8; i++) { this.possibleMoves.push([0, i + 1]) }
        for(let i = 0; i < 8; i++) { this.possibleMoves.push([i + 1, 0]) }
        for(let i = 0; i < 8; i++) { this.possibleMoves.push([0, -i - 1]) }
        for(let i = 0; i < 8; i++) { this.possibleMoves.push([-i - 1, 0]) }
    }
}

export class Bishop extends Piece {
    constructor(color, x, y) {
        super(color, color[0] + '_bishop', x, y, 3)
    
        for(let i = 0; i < 8; i++) { this.possibleMoves.push([i + 1, i + 1]) }
        for(let i = 0; i < 8; i++) { this.possibleMoves.push([i + 1, -i - 1]) }
        for(let i = 0; i < 8; i++) { this.possibleMoves.push([-i - 1, -i - 1]) }
        for(let i = 0; i < 8; i++) { this.possibleMoves.push([-i - 1, i + 1]) }
    }
}

export class Knight extends Piece {
    constructor(color, x, y) {
        super(color, color[0] + '_knight', x, y, 3)
    
        this.possibleMoves = [
            [1, 2], [2, 1], [2, -1], [1, -2],
            [-1, -2], [-2, -1], [-2, 1], [-1, 2]
        ]
    }
}

export class Pawn extends Piece {
    constructor(color, x, y) {
        super(color, color[0] + '_pawn', x, y, 1)
    
        this.possibleMoves = color === 'white' ? [
            [0, 1], [0, 2],
            [-1, 1], [1, 1]
        ] : [
            [0, -1], [0, -2],
            [-1, -1], [1, -1]
        ]

        this.MoveTwice = false
        this.EnPassant = false
        this.EnPassantSpot = ''
        this.EnPassantPiece = null
    }
}

export class Square {
    constructor(x, y, size, color) {
        this.x = x
        this.y = y
        this.width = size / 8
        this.height = size / 8
        this.centerX = (x + this.width) / 2
        this.centerY = (y + this.height) / 2
        this.spot = ''
        this.color = color
        this.piece = null
        this.highlighted = false
    }

    boxCollision(x, y) {
       return  (
        (x >= this.x && x <= this.x + this.width) && (y >= this.y && y <= this.y + this.height)
       )
    }
}