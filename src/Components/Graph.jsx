import React from 'react'
import { motion } from 'framer-motion'

const h = window.screen.height;
const w = window.screen.width;

class Graph extends React.Component {

    constructor(props) {

        super(props)
        this.state = {makeGrid: false}
        this.colors = [ "#bf80ff", "#1490ee", "#39ac73", "#96aeda", "#29a3a3", "#ff8080"]
        this.plots = []
        this.bases = {
            x: {
                model: null,
                screen: null
            },
            y : {
                model: null,
                screen: null
            }
        }

        this.ceilings = {
            x: {
                model: null,
                screen: null
            },
            y : {
                model: null,
                screen: null
            }
        }

        this.axes = ['x', 'y']
        this.tickStep = {}
        this.tickCount = {}
        this.axisLength = {}

        this.AxisValues = {}
        this.AxisStrings = {}
        this.PlotValues = {}
        this.PlotStrings = {}

        this.AxisLines = {}
        this.AxisTicks = {}
        this.PlotLines = {}
        this.PlotTicks = {}

        this.ForecastControl = null

        this.GetBounds = this.GetBounds.bind(this)
        this.GetLogRange = this.GetLogRange.bind(this)
        this.GetModelBases = this.GetModelBases.bind(this)
        this.GetRange = this.GetRange.bind(this)
        this.GetTickStepAndCount = this.GetTickStepAndCount.bind(this)
        this.GetYScale = this.GetYScale.bind(this)

        // The transform from model to screen coordinates. 
        this.Transform = this.Transform.bind(this)
        this.GetScreenBases = this.GetScreenBases.bind(this)
        

        this.toTickString = this.toAxisTickString.bind(this)
        
        //this.GetGridLinesFromState = this.GetGridLinesFromState.bind(this)
        
        this.GetAxisValues = this.GetAxisValues.bind(this)
        this.GetCeilings = this.GetCeilings.bind(this)
        this.GetAxisStrings = this.GetAxisStrings.bind(this)

        this.GetPlotValues = this.GetPlotValues.bind(this)
        this.GetPlotString = this.GetPlotStrings.bind(this)

        /* Rendering components =============== */
        this.SetGrid = this.SetGrid.bind(this)

        this.SetAxisLines = this.SetAxisLines.bind(this)
        this.SetAxisTicks = this.SetAxisTicks.bind(this)

        this.SetPlotLines = this.SetPlotLines.bind(this)
        this.SetPlotTicks = this.SetPlotTicks.bind(this)
        this.SetLegend = this.SetLegend.bind(this)
        /* ===================================== */

        /* Execution to formulate the transform from model -> screen */
        this.GetBounds()
        this.GetLogRange()
        this.GetModelBases()
        this.GetRange()
        this.GetTickStepAndCount()
        this.GetYScale()

        // Transform can now be defined

        this.GetScreenBases()
        
        this.GetAxisValues()
        this.GetCeilings()
        this.GetAxisStrings()

        this.GetPlotValues()
        this.GetPlotStrings()

        

        /* Setting Components */
        
        this.SetGrid()

        this.SetAxisTicks()
        this.SetAxisLines()

        this.SetPlotTicks()
        this.SetPlotLines()

        this.SetLegend()

    }

    GetBounds() {

        let minX = Infinity
        let minY = Infinity
        let maxX = -1 * Infinity
        let maxY = -1 * Infinity
      
        for (let plot in this.props.plots) {
            this.plots.push(plot)
            for (let point in this.props.plots[plot]) {

                const curr_x = this.props.plots[plot][point].x
                const curr_y = this.props.plots[plot][point].y
                minX = (curr_x < minX) ? curr_x : minX
                maxX = (curr_x > maxX) ? curr_x : maxX
                minY = (curr_y < minY) ? curr_y : minY
                maxY = (curr_y > maxY) ? curr_y : maxY
            }
        }

        this.minX = minX
        this.maxX = maxX
        this.minY = minY
        this.maxY = maxY
    }

    GetLogRange () {
        this.XLogRange = 10 ** Math.ceil(Math.log10(0.8 * (this.maxX - this.minX)))
        this.YLogRange = 10 ** Math.ceil(Math.log10(0.8 * (this.maxY - this.minY)))
    }
    GetModelBases () {

        this.bases.x.model =  (this.XLogRange / 10) * Math.floor(this.minX /  (this.XLogRange / 10) ) - (this.XLogRange / 10)
        this.bases.y.model = (this.YLogRange / 10) * Math.floor(this.minY /  (this.YLogRange / 10) ) - (this.YLogRange / 10)
    }

    GetRange () {
        this.XRange = this.maxX - this.bases.x.model
        this.YRange = this.maxY - this.bases.y.model     
    }

    GetTickStepAndCount () {

        this.axes.forEach( (axis) => {

        const range = (axis === 'x') ? this.XRange : this.YRange
        const logRange = (axis === 'x') ? this.XLogRange : this.YLogRange
        const tickStep = logRange  / 10
        const tickCount = Math.ceil(range / tickStep) + 2

        this.tickStep = {
            ...this.tickStep,
            [axis]: tickStep
        } 

        this.tickCount = {
            ...this.tickCount,
            [axis] : tickCount
        }
 
        this.axisLength = {
            ...this.axisLength,
            [axis]: (tickCount - 1) * tickStep
        }
    })
    }

    GetYScale () {
        this.YScale = ( this.axisLength.x / (this.props.width * w) ) * ( (this.props.height * h) / this.axisLength.y )
    }

    Transform (coordinate, value) {
        if (coordinate === 'x') {
            //normalization
            return (value - this.bases.x.model) / (this.axisLength.x) }
        else {
            //normalization plus aspect ratio scaling 
            return  -1 * ( ( (this.bases.y.model + this.YScale * (value - this.bases.y.model)) ) - this.bases.y.model ) / this.axisLength.x
        } 
    }

    GetScreenBases () {
        this.bases.x.screen = this.Transform('x', this.bases.x.model) // should be equal to 0 because of normalization in x
        this.bases.y.screen = this.Transform('y', this.bases.y.model)
    }

    toAxisTickString (axis, value) {
        return (axis === 'x') ? `${value} ${this.bases.y.screen}` : `${this.bases.x.screen} ${value}`
    }

    
    GetAxisValues () {

        this.axes.forEach( (axis) => {

        const base = (axis === 'x') ? this.bases.x.model : this.bases.y.model
        const tickStep = this.tickStep[axis]
        const tickCount = this.tickCount[axis]

        this.AxisValues = {
            ...this.AxisValues,
            [axis]: Array(tickCount).fill(0).map((_, i) => {
                return {model: base + i * tickStep, screen: this.Transform(axis, base + i * tickStep)}
            })
        }
    })
    }

    GetCeilings () {
        
        this.ceilings = {
            x: {
                model: this.AxisValues.x[this.AxisValues.x.length - 1].model,
                screen: this.AxisValues.x[this.AxisValues.x.length - 1].screen
            },
            y: {
                model: this.AxisValues.y[this.AxisValues.y.length - 1].model,
                screen: this.AxisValues.y[this.AxisValues.y.length - 1].screen
            }
            
        }
    }
    
    
    GetAxisStrings () {
        
        this.axes.forEach( (axis) => {
            
        let axisString = ''
        const values = this.AxisValues[axis]
        values.forEach((value) => {
            axisString += `${this.toAxisTickString(axis, value.screen)}, `;
        })

        this.AxisStrings = {
            ...this.AxisStrings,
            [axis]: axisString.substring(0, axisString.lastIndexOf(','))
        }
    })
    }

    GetGridLinesFromState () {
        
        const gridVariant = {
            hidden: {opacity: 0},
            visible: {opacity: 0},
            whileHover: {opacity: 1, transition: {delay: 0, duration: 0}}
        }
        if (this.state !== {}) {
            const xScreen = this.Transform('x', this.state.x)
            const yScreen = this.Transform('y', this.state.y)
            return (
            <motion.g >
            <motion.line x1={xScreen} x2={xScreen} y1={this.bases.y.screen} y2={this.ceilings.y.screen} 
            stroke="#09CBC525" strokeWidth={0.002}
            
            />
            <motion.line x1={this.bases.x.screen} x2={this.ceilings.x.screen} y1={yScreen} y2={yScreen} 
            stroke="#09CBC525" strokeWidth={0.002}
            /> 

            <text x={xScreen -0.01} y={this.bases.y.screen + 0.08} style={{fontSize: 0.02, fill: "#09CBC5"}}> {this.state.x} </text>
            <text x={this.ceilings.x.screen + 0.04} y={yScreen} style={{fontSize: 0.02, fill: "#09CBC5"}}> {this.state.y} </text>
            </motion.g>)
        }
        else {
            return (<></>)
        }
    }
    GetPlotValues () {

        for (let plot in this.props.plots) {
            const curr_plot = []
            for (let point in this.props.plots[plot]) {
                const curr_point = {
                    model: this.props.plots[plot][point],
                    screen: {
                        x: this.Transform('x', this.props.plots[plot][point].x),
                        y: this.Transform('y', this.props.plots[plot][point].y),
                    }
                }
                curr_plot.push(curr_point)
                curr_plot.sort((point1, point2) => {
                    if (point1.screen.x < point2.screen.x) {return -1}
                    else if (point1.screen.x === point2.screen.x) {return 0}
                    else {return 1}
                })
            }
            this.PlotValues = {
                ...this.PlotValues, 
                [plot] : curr_plot
            }
        }
    }

    GetPlotStrings () {

        const plots = Object.keys(this.PlotValues)

        plots.forEach((plot) => {
            let plotString = ''
            this.PlotValues[plot].forEach( (point) => {
                plotString += `${point.screen.x} ${point.screen.y}, `
            })
            this.PlotStrings = {
                ...this.PlotStrings,
                [plot] : plotString.substring(0, plotString.lastIndexOf(','))
            }
        })

    }

    

    SetAxisLines () {

        this.axes.forEach( (axis) => {
        const axisVariant = {
            hidden: {pathLength: 0}, visible: {pathLength: 1, transition: {duration: 1}}}

        this.AxisLines = {
            ...this.AxisLines,
            [axis]: <motion.polyline 
            fill="none"
            stroke="#09CBC5"
            strokeWidth="0.005"
            points={this.AxisStrings[axis]}
            variants={axisVariant}
            initial="hidden"
            animate="visible"
            />
        }
        })
    }

    SetAxisTicks () {

        const tickVariant =  {
            hidden: {opacity: 0, scale : 1}, 
            visible: {opacity: 1, scale : 1, transition: {delay: 0.5, duration: 0.5 }}, 
            whileHover: {scale: 1.5, transition: { type: 'spring', stiffness: 1000 } } }
        
        const XlabelVariant = {
            hidden: {},
            visible: {x: 0, y: 0.05},
            whileHover: {scale: 1.5}
        }

        const YlabelVariant = {
            hidden: {},
            visible: {x: 0, y: 0.05},
            whileHover: {scale: 1.5}
        }

        this.AxisTicks['x'] = this.AxisValues.x.map((value) => {
            const value_str = value.model
            return (
                <>
            <motion.circle cx={value.screen} cy={this.bases.y.screen} r="0.007" stroke="#FF00FF00" strokeWidth="0.07" fill="#FF00FF"
            variants={tickVariant}
            initial="hidden"
            animate="visible"
            whileHover="whileHover"/>
            <motion.text x={value.screen - 0.005} y={this.bases.y.screen} style={{fontSize: 0.02, fill: "#FFF"}}
            variants={XlabelVariant}
            initial="hidden"
            animate="visible"
            whileHover="whileHover">
                 {value_str}
            </motion.text>
            </>
            )
        })

        this.AxisTicks['y'] = this.AxisValues.y.map(value => {

            const value_str = value.model.toPrecision(3)
            return (
                <>
            <motion.circle cx={this.bases.x.screen} cy={value.screen} r="0.007" stroke="#FF00FF00" strokeWidth="0.07" fill="#FF00FF"
            variants={tickVariant}
            initial="hidden"
            animate="visible"
            whileHover="whileHover"/>
            <motion.text x={this.bases.x.screen - 0.011 * `${value_str}`.length - 0.04 } y={value.screen - 0.045} style={{fontSize: 0.02, fill: "#FFF"}}
            variants={YlabelVariant}
            initial="hidden"
            animate="visible"
            whileHover="whileHover">
                 {value_str}
            </motion.text>
            </>
            )
        })
    }


    SetGrid () {

        const HandleHoverStart = (x, y) => {
            this.setState(
                {
                    x: x,
                    y: y
                })
        }
        
        const gridVariant = {
            hidden: {opacity: 0},
            visible: {opacity: 0},
            whileHover: {opacity: 1, transition: {delay: 0, duration: 1}}
        }
        this.Grid = <>
            {Array(this.tickCount.x - 1).fill(0).map((_, i) => {
                return (
                    Array(this.tickCount.y - 1).fill(0).map( (_, j) => {
                        return (
                            Array(20).fill(0).map( (_, k) => {
                                return (
                                    Array(20).fill(0).map( (_, l) => {

                                        const xModel = this.bases.x.model + ((i + (k / 20)) * this.tickStep.x) 
                                        const yModel = this.bases.y.model + ((j + (l / 20)) * this.tickStep.y) 

                                        const xScreen = this.Transform('x', xModel)
                                        const yScreen = this.Transform('y', yModel)

                                        return (
                                                <motion.circle cx={xScreen} cy={yScreen} r="0.003" fill="#09CBC5" 
                                                variants={gridVariant}
                                                initial="hidden"
                                                animate="visible"
                                                whileHover="whileHover"
                                                onHoverStart={() => {HandleHoverStart(xModel, yModel)}}
                                                //onHoverEnd={() => HandleHoverEnd()}
                                                />
                                        )
                                    })
                                )
                        })
                        )
                    })
                )
            })}
        </>
    }

    SetPlotLines () {

        const plots = Object.keys(this.PlotValues)
        

        const plotVariant = {
            hidden: {pathLength: 0}, visible: {pathLength: 1, opacity: 0.5, transition: {duration: 1}}}

        plots.forEach( (plot) => {
            const curr_color = this.colors[this.plots.indexOf(plot)]
            this.PlotLines = {
                ...this.PlotLines,
                [plot] : <motion.polyline 
                fill="none"
                stroke={curr_color}
                strokeWidth="0.005"
                points={this.PlotStrings[plot]}
                variants={plotVariant}
                initial="hidden"
                animate="visible"
                />
            }
        })
    }

    SetPlotTicks () {

        const tickVariant =  {
            hidden: {fill: "#FF0000"}, 
            visible: {fill: "#FFFFFF50", transition: {delay: 0, duration: 4.8, type: 'spring', stiffness: 80, repeat: Infinity }}, 
            whileHover: {scale: 2, transition: { type: 'spring', stiffness: 1000 } } }
        
        const labelVariant = {
            hidden: {},
            visible: {x: -0.05, y: -0.01, scale: 1, opacity: 0},
            whileHover: {y: -0.01, scale: 1.2, opacity: 1, transition: {duration: 0.2}}
        }

        for (let plot in this.PlotValues) {
            const curr_plot = this.PlotValues[plot]
            this.PlotTicks = {
                ...this.PlotTicks,
                [plot] : curr_plot.map(point => {
                    return (
                        <>
                            <motion.circle cx={point.screen.x} cy={point.screen.y} r="0.005" stroke="#FF00FF00" strokeWidth="0.01" fill="#FFFFFF"
                            variants={tickVariant}
                            initial="hidden"
                            animate="visible"
                            whileHover="whileHover"/>
                            <motion.text x={point.screen.x} y={point.screen.y} style={{fontSize: 0.02, cursor:'pointer', fill: "#09CBC5"}}
                            variants={labelVariant}
                            initial="hidden"
                            animate="visible"
                            whileHover="whileHover">
                                {point.model.x}, {point.model.y.toPrecision(3)}
                            </motion.text>
                        </>
                    )
                    
                })
            }
        }
    }

    SetLegend () {
        
        const x = this.AxisValues.x[this.AxisValues.x.length - 2].screen + 0.05
        this.Legend = 
            this.plots.map((plot, i) => {
                const curr_color = this.colors[this.plots.indexOf(plot)] 
                const legendVariant =  {
                    visible: {fill: "none"},
                    whileHover: {fill: curr_color}}
                return (
                    <>
                    <motion.circle cx={x} cy={this.ceilings.y.screen + (i * 0.05)} r={0.01} stroke={ curr_color + "75"} strokeWidth="0.01" 
                    variants={legendVariant} animate="visible" whileHover="whileHover"/>
                    <text x={x + 0.03} y={this.ceilings.y.screen + (i * 0.05) + 0.01 } fill="#FFF" fontFamily='monospace' fontSize={0.02}>{plot}</text>
                    </>
                )
            }
            )
        
    }

    render() {
        const plots = this.plots
        return (
            <>
            <div >
            <svg viewBox={`${0 - 0.2} ${this.ceilings.y.screen-0.05} ${this.ceilings.x.screen + 0.5} ${ (this.bases.y.screen - this.ceilings.y.screen) + 0.2}`} 
            height={`${this.props.height}vh`} width={`${this.props.width}vw`} preserveAspectRatio='xMinYMax'>

                {this.state.makeGrid && this.Grid}
                {this.state.makeGrid && this.GetGridLinesFromState()}

                {this.AxisLines.x}
                {this.AxisTicks.x}

                {this.AxisLines.y}
                {this.AxisTicks.y}

                {plots.map(plot => {return (
                    <>
                        {this.PlotLines[plot]}
                        {this.PlotTicks[plot]}
                    </>
                )})}

                {this.Legend}
              </svg> 
              </div>
              {this.state.makeGrid && 
            <button  style={{height: 20, width: 100, backgroundColor: "#DDDDDD", borderWidth: 1, borderStyle: 'solid', borderColor: this.state.makeGrid? "#FF0000" : "#FFFFFF"}}
            onClick={() => {this.setState({...this.state, makeGrid: !this.state.makeGrid})}}> "Grid" </button>
            }
        
            </>
            
        )
    }

}

export default Graph