const w: number = window.innerWidth, h : number = window.innerHeight
const lines : number = 2
const nodes : number = 5
class RotateHexagonStepStage {
    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D
    renderer : Renderer = new Renderer()

    initCanvas() {
        this.canvas.width = w
        this.canvas.height = h
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = '#BDBDBD'
        this.context.fillRect(0, 0, w, h)
        this.renderer.render(this.context)
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.renderer.handleTap(() => {
                this.render()
            })
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
    return 0.05 * dir * ((1 - getSf(scale))/lines + getSf(scale))
}

class State {
    scale : number = 0
    dir : number = 0
    prevScale : number = 0

    update(cb : Function) {
        const k : number = scaleFactor(this.dir, this.scale)
        console.log(`scale factor is ${k}`)
        this.scale += k
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

class Animator {
    animated : boolean = false
    interval : number

    start(cb : Function) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(cb, 50)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}

class RHSNode {

    next : RHSNode
    prev : RHSNode
    state : State = new State()

    constructor(private i : number) {
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < nodes - 1) {
            this.next = new RHSNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context : CanvasRenderingContext2D) {
        const gap : number = w / (nodes + 1)
        const size : number = gap / 3
        const sc1 = divideScale(this.state.scale, 0, 2)
        const sc2 = divideScale(this.state.scale, 1, 2)
        context.lineWidth = Math.min(w, h) / 60
        context.lineCap = 'round'
        context.strokeStyle = '#311B92'
        context.save()
        context.translate(gap * (this.i + 1), h/2)
        context.rotate(Math.PI * sc2)
        for(var i = 0; i < lines; i++) {
            const sc : number = divideScale(sc1, i, lines)
            context.save()
            context.scale(1, 1 - 2 * i)
            context.beginPath()
            context.moveTo(-size, 0)
            context.lineTo(-size + size/5, -size/2 * sc)
            context.lineTo(size - size/5, -size/2 * sc)
            context.lineTo(size, 0)
            context.stroke()
            context.restore()
        }
        context.restore()
        if (this.next) {
            this.next.draw(context)
        }
    }

    update(cb : Function) {
        this.state.update(cb)
    }

    startUpdating(cb : Function) {
        this.state.startUpdating(cb)
    }

    getNext(dir : number, cb : Function) : RHSNode {
        var curr : RHSNode = this.prev
        if (dir == 1) {
            curr = this.next
        }
        if (curr) {
            return curr
        }
        cb()
        return this
    }
}

class RotateHexagonStep {

    root : RHSNode = new RHSNode(0)

    curr : RHSNode = this.root

    dir : number = 1

    draw(context : CanvasRenderingContext2D) {
        this.root.draw(context)
    }

    update(cb : Function) {
        this.curr.update(() => {
            this.curr = this.curr.getNext(this.dir, () => {
                this.dir *= -1
            })
            cb()
        })
    }

    startUpdating(cb : Function) {
        this.curr.startUpdating(cb)
    }
}

class Renderer {
    rhs : RotateHexagonStep = new RotateHexagonStep()

    animator : Animator = new Animator()

    render(context : CanvasRenderingContext2D) {
        this.rhs.draw(context)
    }

    handleTap(cb : Function) {
        this.rhs.startUpdating(() => {
            this.animator.start(() => {
                cb()
                this.rhs.update(() => {
                    this.animator.stop()
                    cb()
                })
            })
        })
    }
}
