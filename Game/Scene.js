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

        this.animation.runner(() => {
            canvasContext.clearRect(0, 0, size, size)

            // controls

            // color for highlight -> rgb(224,105,84)


            // drawing
            for(let i = 0; i < 8; i++) {
                let row = this.Chess.Grid[i]

                for(let j = 0; j < 8; j++) {
                    let square = row[j]

                    canvasContext.fillStyle = square.color
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