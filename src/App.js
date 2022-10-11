import React, { useState, useEffect } from 'react'
import { HomeSvg } from './Components/HomeSvg'
import { motion } from "framer-motion"
import "./App.css"
import Indicators from './Components/Indicators'
import Unit from './Components/Unit'

const TitleVariants = {

  hidden: {opacity: 0, scale: 1},
  visible: {opacity: 1, color: "#FFFFFF", scale: 1.2, rotate: 360, x: '10vw',
    transition: {duration: 1, type: 'spring', stiffness: 100}},
  whileHover: {color: ["#09CBC5", "#FF00FF"], transition: {duration: 2, repeat: Infinity, ease: "linear", repeatType: "mirror"}}
}
function App() {

  const [indicatorBank, setIndicatorBank] = useState(null)
  const [chosenIndicators, setChosenIndicators] = useState(
    {
      indicators: null,
      count: 0,
      change: 0
    }
  )

  useEffect(() => {
    fetch("https://world-dev-indicators-api.herokuapp.com/indicators").then(response => response.json()).then(
      data => {
        setIndicatorBank(data.indicators)
        }).catch((e) => console.log(e.message))
  } , [])

  return (
      <div className='App' >

        <div className='Header' >
          <div className='Title'>
            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
              <motion.h1 variants={TitleVariants} initial="hidden" animate="visible" whileHover="whileHover" style={{fontFamily: 'Segoe UI', cursor:'pointer'}}>
                  THE WORLD DEVELOPMENT INDICATORS APP
              </motion.h1> 
              <h2 style={{color: "#FFF"}}> &gt; CAN, US</h2>
            </div>
          </div>
          <div className='Logo'>
            {<HomeSvg/>}
          </div>
          <div style={{width: "40vw", display: "flex"}}>
          </div>
        </div >

        <div >
          {!chosenIndicators.indicators && 
          <div style={{display: "flex", width: "80vw", justifyContent: "center", alignItems: "center"}}>
            <h2 style={{color: "#FFF", fontSize: 14}}>
              Pick a development indicator on the right to start viewing.</h2>
          </div>} 

          {chosenIndicators.indicators && 
          <div className="Main" >
            {chosenIndicators.indicators
            && chosenIndicators.indicators.map(indicator => {
              return (
                <Unit key={indicator.value} indicator={indicator} />
              )
            })}
          </div>}
          
          <div className="OptionsBar" >
            <h2 style={{display: "flex", flexDirection: "column", justifyContent: "cener", alignItems: "center", paddingTop: "20vh", paddingBottom: "4vh", 
            fontFamily: 'Segoe UI', color: "#96aeda"}}>INDICATORS</h2>
            <div className='Select'>
              {indicatorBank && <Indicators indicators={indicatorBank} setChosenIndicators={setChosenIndicators} count={chosenIndicators.count}/>}
            </div>
          </div>
        </div>
      
        <div className="Bottom">

              <a className='LinkedIn' target="_blank" style={{display: "flex", justifyContent: "center", alignItems: "center", color: '#DBC012', textDecoration: "none"}} href='https://www.linkedin.com/in/nureinumeya/' >
                My LinkedIn
              </a>
              <div>
                <p style={{display: "flex", justifyContent: "center", alignItems: "center", color: "#96aeda", fontSize: 10}} >
                  ALL DATA AND DESCRIPTIVE INFORMATION WAS TAKEN FROM THE &nbsp; <a href='https://www.worldbank.org/' target="_blank" style={{color: "#e9afe7", textDecoration: "none"}}>WORLD BANK</a> </p>
              </div>



        </div>

      </div>
      
  )
}

export default App