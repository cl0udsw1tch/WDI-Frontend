import { motion } from 'framer-motion'
import { useState } from 'react'



export const HomeSvg = () => {


  const LogoVariants = {
    hidden: {
      stroke: "#FF00FF",
      pathLength: 0,
      
    },
  
    visible: {
      fill: "#111111",
      stroke: "#FF00FF",
      rotateY: 0,
      pathLength: 1.2,
      transition: {
        duration: 1
      }
    },
    whileTap: {
      pathLength: [2, 0],
      scale: [1, 0.8],
      transition: {
        duration: 0.5,
      }
    },
    whileHover: {
      stroke: ["#FF00FF", "#09CBC5", "#39e600", '#DBC012', "#FF00FF"],
      transition: {
        ease: "linear",
        duration: 3,
        repeat: Infinity
      }
    }
  }

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      id="svg5"
      width="49.653"
      height="51.351"
      version="1.1"
      viewBox="0 0 13.137 13.587"

    >


      <g id="house" transform="matrix(1.09451 0 0 1.32166 -5.823 -7.093)">

          <motion.path

            variants={LogoVariants}
            initial="hidden"
            animate="visible"
            whileHover="whileHover"
            whileTap="whileTap"

            id="walls"
            fill="none"
            stroke="#000"
            strokeDasharray="none"
            strokeOpacity="1"
            strokeWidth="0.265"
            d="M17.19 15.514v-4.55l-5.868-5.417-5.87 5.418v4.55h4.914v-3.038c0-1.526 1.683-1.527 1.683 0v3.037z"
          ></motion.path>
      
      </g>
    </motion.svg>
  )
}
