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

const divideScale : Function = (scale : number, i : number, n : number) : number => Math.min(1/n, Math.max(0, scale - (1/n) * i)) * n

const getSf : Function = (sc : number) : number => Math.floor(sc/0.5)

const scaleFactor : Function = (dir : number, scale : number) : number => {
    return 0.05 * this.dir * ((1 - getSf())/lines + getSf())
}

class State {
    scale : number = 0
    dir : number = 0
    prevScale : number = 0

    update(cb : Function) {
        this.scale += scaleFactor(this.dir, this.scale)
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            cb()
        }
    }

    startUpdating(cb : Function) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            cb()
        }
    }
}
