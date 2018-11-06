const w: number = window.innerWidth, h : number = window.innerHeight
const lines : number = 2
const nodes : number = 5
class RotateHexagonStepStage {
    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D

    initCanvas() {
        this.canvas.width = w
        this.canvas.height = h
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = '#BDBDBD'
        this.context.fillRect(0, 0, w, h)
    }

    handleTap() {
        this.canvas.onmousedown = () => {

        }
    }

    static init() {
        const stage : RotateHexagonStepStage = new RotateHexagonStepStage()
        stage.initCanvas()
        stage.render()
        stage.handleTap()
    }
}
