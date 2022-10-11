import { useState } from "react"
import { motion } from "framer-motion"
import "../App.css"



const Meta = ({indicator, metadata}) => {
    
    const [opened, setOpened] = useState(false)
    const [keyChosen, setKeyChosen] = useState(null)

    const ringVariant = {
        hidden: {opacity: 0, strokeDasharray: 0, strokeDashoffset: 0},
        visible: {opacity: 1, strokeDasharray: opened? 0 : 10},
        whileHover: {strokeDashoffset: 50}
    }

    const controlVariant = {
        hidden: {opacity: 0,},
        visible: {opacity: 1, stroke: opened? "#09CBC5" : "#FF0000",},
        whileHover: {stroke: '#DBC012',}
    }

    const CodeVariant = {
        hidden: {opacity: 0},
        visible: {scale: opened? 1 : 0.2, opacity: opened? 1 : 0, x: opened? 80 : -50, color: opened? "#09CBC5" : "#FF0000",},
        whileHover: {scale: 1, color: '#DBC012', opacity: 1, x: 80, transition : {stiffness: 0}}
    }

    const keyVariant = {
        hidden: {opacity: 0},
        visible: {opacity: 1, color: "#09CBC5"},
        whileHover: {scale: 1.1, color: '#DBC012', transition : {stiffness: 0}}
    }
    
    const keys = Object.keys(metadata)
    return (
        <>
        <div className='ControlContainer'>
            
                <svg viewBox="0 0 400 100" width="400" height="80"  >
                    <motion.g variants={controlVariant} initial="hidden" animate="visible" whileHover="whileHover">
                        <motion.circle cx="50" cy="50" r={1} strokeWidth="5" fill="none" />
                        <motion.circle cx="50" cy="50" r={20}  strokeWidth="5" fill="#FFFFFF00"  onClick={() => {setOpened(!opened); setKeyChosen(null)}} variants={ringVariant} initial="hidden" animate="visible" whileHover="whileHover"/>
                        <motion.text x="20" y="50" fontSize={20} variants={CodeVariant}  > Code: { indicator.value } </motion.text>
                    </motion.g>
                </svg>
        
        </div>
        {opened && 
        <div className="InfoContainer" >

            {keyChosen ? 
            <>
            <div className="KeyTitle">
                <div>
                <h3 >{keyChosen}</h3>
                </div >
                <motion.h3  onClick={() => {setKeyChosen(null)}} variants={{whileHover: {scale: 2}}} whileHover="whileHover" style={{cursor:'pointer'}}> &lt; </motion.h3>
            </div>
            <div className="KeyInfoContainer" >
            <div className="KeyInfo">
                <p>{metadata[keyChosen]}</p>
            </div>
            </div>
            </>
            
            : keys.filter(key => key !== "Code" && metadata[key] !== "").map((key) => {
                        return (
                            <motion.div className="KeyContainer" onClick={() => {setKeyChosen(key)}} variants={keyVariant} initial="hidden" animate="visible" whileHover="whileHover"> 
                                {key}
                            </motion.div>
                        )
                    })}
        </div>}

        </>

    )
}

export default Meta