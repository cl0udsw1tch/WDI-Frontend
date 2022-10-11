
import Select from 'react-select'

const Indicators = (props) => {

  const options = props.indicators.map( indicator => {
    return (
      {
        value: indicator.Code, 
        label: indicator.Name
      }
    )
  })

  const colorStyles = {
    control: (styles) => ({...styles, backgroundColor: "#111111", color: "#FFFFFF", width: "15vw", borderColor:"#FFF", outline: null}),
    option: (styles, {isFocused, isSelected}) => ({
        ...styles,
        
        backgroundColor: "#111111",
        color: !isFocused? "#09CBC5" :"#FF00FF",
        borderBottomStyle: "solid",
        borderBottomColor: "#333333",
        borderBottomWidth: 1,
        width: "15vw",
        fontFamily: 'monospace'
    }),
    multiValue: (styles) => ({
      ...styles,
      width: "15vw",
      backgroundColor: "#111111",
      color: "#39e600",
      fontFamily: 'monospace'
      
    }),
    multiValueLabel: (styles) => ({
      ...styles,
      color: "#FFFFFF",
      width: "15vw",
      fontFamily: 'monospace'
    }),
    
  }
  const handleChosenIndicators = (chosenIndicators) => {

    if (chosenIndicators.length === 0) {
      props.setChosenIndicators({
        indicators: null,
        change: 0,
        count: 0
      })
    }
    else{
      props.setChosenIndicators({
        indicators: chosenIndicators,
        change: chosenIndicators.length - props.count,
        count: chosenIndicators.length
      })
    }
  }

  return (
    <Select options={options} onChange={ chosenIndicators => handleChosenIndicators(chosenIndicators)} isMulti
    maxMenuHeight={"40vh"} styles={colorStyles} />
  )
}

export default Indicators