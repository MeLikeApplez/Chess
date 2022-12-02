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
    }

    createPGN(spot='') {
        return this.PGNIdentifier + spot
    }
}

export class King extends Piece {
    constructor(color, x, y) {
        super(color, color[0] + '_king', x, y, Infinity)
    }
}

export class Queen extends Piece {
    constructor(color, x, y) {
        super(color, color[0] + '_queen', x, y, 9)
    }
}

export class Rook extends Piece {
    constructor(color, x, y) {
        super(color, color[0] + '_rook', x, y, 5)
    }
}

export class Bishop extends Piece {
    constructor(color, x, y) {
        super(color, color[0] + '_bishop', x, y, 3)
    }
}

export class Knight extends Piece {
    constructor(color, x, y) {
        super(color, color[0] + '_knight', x, y, 3)
    }
}

export class Pawn extends Piece {
    constructor(color, x, y) {
        super(color, color[0] + '_pawn', x, y, 1)
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
        this.color = color
        this.spot = ''
        this.piece = null
    }

    boxCollision(x, y) {
       return  (
        (x >= this.x && x <= this.x + this.width) && (y >= this.y && y <= this.y + this.height)
       )
    }
}