import { motion } from "framer-motion"
import { useEffect } from "react"
import { useState } from "react"

const ForecastControl = (props) => {
    const [forecast, setForecast] = useState(null)
    const [fetch, setFetch] = useState(null)
    const [question, setQuestion] = useState(null)

    const ringVariant = {
        hidden: {opacity: 0.5, strokeDasharray: 10,strokeDashoffset: 0},
        visible: {opacity: 1, strokeDasharray:  10, strokeDashoffset: fetch? 500 : 0, transition: {duration: fetch?  4 : 0}},
    }

    const controlVariant = {
        hidden: {opacity: 0, stroke:  "#09CBC5",},
        visible: {opacity: 1, stroke:  "#09CBC5"},
        whileHover: {stroke: "#e9afe7"}, 
    }

    const questionVariant = {
        hidden: {color:  "#FFFFFF25"},
        visible: {stroke:  '#FFFFFF25'},
        whileHover: {color: '#DBC012'}, 
    }

    const HandleForecast = (input) => {
        try {
            if (Number.isInteger(parseInt(input)) && parseInt(input) > 2021 && parseInt(input) < 2041) {
                setForecast(parseInt(input))
            }
        }
        catch (e) {
            console.log(e.message)
        }
    }

    if (fetch) {
        props.setForecast_to(forecast)
        setTimeout(() => {
            setFetch(false)
        }, 4000)
    }
    
    return (
            <div style={{display: "flex", position: "relative", left: "50vw", top: "-30vh", 
            flexDirection: "column", justifyContent: "center", width: "13vw"}}>
                <div style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: 'space-between'}}>
                    <div>
                    <svg viewBox="20 0 170 60" width="120" height="50"  >
                        <motion.g variants={controlVariant} initial="hidden" animate="visible" whileHover="whileHover">
                            <motion.g onClick={() => {if (forecast) {setFetch(true)}}}>
                            <motion.circle cx={50} cy={30} r={5} strokeWidth="5" fill="none" />
                            <motion.circle cx={50} cy={30} r={25}  strokeWidth="5" fill="#FFFFFF00" variants={ringVariant} initial="hidden" animate="visible" whileHover="whileHover" />
                            </motion.g>
                            <motion.text x={100} y={35}  > Forecast to:  </motion.text>
                            
                        </motion.g>
                    </svg>
                    </div>
                    <div style={{display: "flex", height: 25, marginBottom: 5}}>
                        <input type="number" placeholder="&gt;&gt;&gt;" style={{width: 50, backgroundColor: "#111111", color: '#DBC012'}} onChange={(e) => {HandleForecast(e.target.value)}}></input>
                    </div>
                </div>

                <div style={{display: "flex", flexDirection: 'row', width: "100%"}}>
                    <motion.div style={{display: "flex", flexDirection: 'column', justifyContent: 'center', alignItems: "center", width: "30%", height: 27, color: "#FFFFFF25", fontSize: 20, cursor:'pointer'}}
                    variants={questionVariant} initial="hidden" animate="visible" whileHover="whileHover"
                    onClick={() => {
                        setQuestion(true)
                        setTimeout(() => {
                            setQuestion(false)
                        }, 3000)
                    }}>
                        <p>?</p>
                    </motion.div>

                    {question && <div style={{color: '#DBC012', fontFamily: "monospace", fontSize: 10}}><p>Choose any year between 2022 and 2040 to forecast the data to.</p></div>}
                </div>
            </div>

    )
}

export default ForecastControl