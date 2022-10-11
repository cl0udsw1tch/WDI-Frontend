import Graph from "./Graph"
import Meta from "./Meta"
import ForecastControl from "./ForecastControl"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import "../App.css"

const HandleData = (data) => {

    let graphData = {}
    const countries = Object.keys(data)
  
    countries.forEach((country) => {
      graphData = {
        ...graphData,
        [country]: {}
      }
    }
    )
    countries.forEach((country) => {
  
        const dates = Object.keys(data[country].data)
        const newFeatures = dates.map((date) => {
            return ({
                x: parseInt(date),
                y: data[country].data[date]
            })
        })
        graphData = {
            ...graphData,
            [country]: newFeatures
        }
    }
    )
    return graphData
  
  }

const plotTitleVariants = {

    whileHover: {scale: 1.5, originX: 0, transition: {duration: 0.1}}
  
  }
  
const Unit = (props) => {
    const [graphData, setGraphData] = useState(null)
    const [metaData, setMetaData] = useState(null)
    const [forecast_to, setForecast_to] = useState(null)
    const [forecastData, setForecastData] = useState(null)

    useEffect(() => { 

        fetch("/data/"  + props.indicator.value,  {
            method: 'GET',
            credentials: "include",
            cache: 'no-cache',
            headers: new Headers({
                'content-type': 'application/json'
            })
            }).then(response => response.json()).then(
            data => {
                setGraphData(HandleData(data))
            }).catch((e) => console.log(e.message))


        fetch("/meta/" + props.indicator.value,  {
            method: "GET",
            credentials: "include",
            cache: 'no-cache',
            headers: new Headers({
                'content-type': 'application/json'
            })
            }).then(response => response.json()).then(
            data => {
                setMetaData(data)
            }).catch((e) => console.log(e.message))
      
    }, [])

    useEffect(() => {
        if (forecast_to) {
            fetch("/forecast", {
                method: 'POST',
                credentials: "include",
                body: JSON.stringify({data: graphData, forecast_to: forecast_to}),
                cache: 'no-cache',
                headers: new Headers({
                    'content-type': 'application/json'
                })
                }).then(response => response.json()).then(data => {
                    console.log(`data sent, got response ${JSON.stringify(data)}`);
                
                    setForecastData(data)
                }
            ).catch( (e) => console.log('error', e.message))
        }
    }, [forecast_to])

    const newData = {...graphData, ...forecastData}

    return (
        <>
        <div className='Grid'> 
            {graphData && <div className='Plot' >

                <motion.h2 style={{display: "flex", alignItems: "center",  height: "5vh", textAlign: 'center', 
                marginLeft: 100, fontSize: 16, fontFamily: "monospace", color: "#09CBC5", cursor:'pointer'}} 
                variants={plotTitleVariants} whileHover="whileHover">{props.indicator.label}</motion.h2>

                <Graph key={forecastData? forecastData[Object.keys(forecastData)[0]].length : null} plots={newData} width={65} height={65} /> 

                <ForecastControl setForecast_to={setForecast_to}/>

            </div>}
            {metaData && <div className='Meta'> 
                <Meta indicator={props.indicator} metadata={metaData}/>
            </div>}
        </div>
        <div style={{display: "flex", flexDirection: "row", justifyContent: 'center', width: "80vw", height: "10vh"}}>
        <svg  viewBox="0 49 100 2" width="20%" height="50%">
            <line x1="0" y1="50" x2="100" y2="50" stroke='#DBC012' strokeWidth={0.2} />
        </svg>
        </div>
        </>
    )
}

export default Unit