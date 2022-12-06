import Animation from './Animation'

export default class Scene {
    constructor(Chess) {
        this.Chess = Chess
        
        this.size = (window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight) - 150
        this.animation = new Animation()

        this.setSize(this.size, this.size)
        this.run()
    }

    setSize(width=0, height=0) {
        const { canvasElement, canvasContext } = this.Chess

        canvasElement.width = this.size
        canvasElement.height = this.size

        canvasElement.style.width = `${width}px`
        canvasElement.style.height = `${height}px`

        // flip the y-axis to a normal traditional graph
        canvasContext.transform(1, 0, 0, -1, 0, canvasElement.height)

        canvasContext.strokeStyle = 'white'
        canvasContext.fillStyle = 'white'
    }


    run() {
        const { canvasContext } = this.Chess
        const { size } = this
        const splitSize = this.size / 8

        let press = false
        let square = null
        this.animation.runner(() => {
            canvasContext.clearRect(0, 0, size, size)

            // controls
            const { mouseX, mouseY, mouseDown, whichMouse } = this.Chess.Controller

            // color for highlight -> rgb(224,105,84)
            if(mouseX > 0 && mouseX < this.size && mouseY > 0 && mouseY < this.size) {
                if(mouseDown) {
                    if(!press) {
                        // console.log('press')

                        square = this.Chess.rawCoordinateToSquare([mouseX, mouseY])
                        if(whichMouse === 'right') {
                            square.highlighted = !square.highlighted
                        }

                        press = true
                    }

                    if(square && square.piece && whichMouse === 'left') {
                        square.piece.x = mouseX - (this.size / 16)
                        square.piece.y = mouseY - (this.size / 16)
                    }

                    // console.log('dragging')
                } else  {
                    if(press) {
                        let spot = this.Chess.rawCoordinateToPGN([mouseX, mouseY])
                        // console.log('release')
                    
                        if(square && square.piece) {
                            let move = this.Chess.move(square.piece, spot)

                            if(!move) {
                                let [ spotX, spotY ] = this.Chess.PGNToRawCoordinate(square.spot)
                            
                                square.piece.x = spotX
                                square.piece.y = spotY
                            }
                        }
                    
                        square = null
                    }
                    press = false
                }
            }

            // drawing
            for(let i = 0; i < 8; i++) {
                let row = this.Chess.Grid[i]

                for(let j = 0; j < 8; j++) {
                    let square = row[j]

                    canvasContext.fillStyle = square.highlighted ? 'rgb(224, 105, 84)' : square.color
                    canvasContext.fillRect(square.x, square.y, splitSize, splitSize)
                    canvasContext.fill()
                }
            }

            for(let i = 0; i < this.Chess.Pieces.length; i++) {
                let piece = this.Chess.Pieces[i]
                let offsetX = piece.name === 'pawn' ? 2 : 0

                canvasContext.save()

                // x, -y
                canvasContext.scale(1, -1)
                canvasContext.translate(0, -splitSize)

                canvasContext.drawImage(piece.img, piece.x - offsetX, -piece.y, splitSize, splitSize)
            
                canvasContext.restore()
            }
        })
    }
}