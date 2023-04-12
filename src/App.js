import { useEffect, useState } from 'react';
import './App.css';
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from './consts.js';


const GITHUB_USERNAME = 'bodunadebiyi'
const URL = `https://recruiting.verylongdomaintotestwith.ca/api/${GITHUB_USERNAME}/character`


function App() {
  const MAX_SCORE = 70
  const [classInView, setClassInView] = useState(null)
  const attributeObject = ATTRIBUTE_LIST.reduce((previous, current) => {
    previous[current] = 0
    return previous
  }, {})
  const [attributeValues, setAttributeValues] = useState(attributeObject)
  const totalScore = Object.values(attributeValues).reduce((x, y) => x + y, 0)

  const persistState = async (data) => {
    await fetch(URL, {method: 'POST', body: JSON.stringify(data)})
  }

  const fetchState = async () => {
    const response = await fetch(URL)
    const data = await response.json()
    if (data?.message && data?.message === 'Item not found') {
      return null
    }
    setAttributeValues(data)
  }

  useEffect(() => {
    fetchState()
  }, [])

  const increment = attribute => () => {
    if (totalScore > MAX_SCORE) return
    setAttributeValues({...attributeValues, [attribute]: attributeValues[attribute] + 1})
  }

  const decrement = attribute => () => {
    setAttributeValues({...attributeValues, [attribute]: attributeValues[attribute] - 1})
  }

  const showMinimumStats = cls => () => {
    setClassInView({name: cls, stats: CLASS_LIST[cls]})
  }

  const classMatch = (() => {
    const match = Object.keys(CLASS_LIST).reduce((prev, curr) => {
      prev[curr] = true
      return prev
    }, {})

    for (let attr of ATTRIBUTE_LIST) {
      const classes = Object.keys(CLASS_LIST)
      for (let cls of classes) {
        if (!match[cls]) continue
        if (attributeValues[attr] < CLASS_LIST[cls][attr]) {
          match[cls] = false
        }
      }
    }
    return match
  })()

  const calculateAbilityModifier = (attr) => {
    return Math.floor((attributeValues[attr] - 10) / 2)
  }


  return (
    <div className="App">
      <header className="App-header">
        <h1>React Coding Exercise</h1>
      </header>
      <section className="App-section">
        <div>
          <button onClick={() => persistState(attributeValues)}>Save Character</button>
        </div>
        <div>
          {Object.keys(CLASS_LIST).map((cls, i) => (
            <span
              onClick={showMinimumStats(cls)}
              key={i}
              style={{
                cursor: 'pointer',
                background: classMatch[cls] ? 'green' : 'transparent',
                margin: "0 20px"
              }}>
              {cls}
            </span>
          ))}
        </div>
        {ATTRIBUTE_LIST.map((attr, i) => (
          <div key={i}>
            <div>{attr}: {attributeValues[attr]}</div>
            <div>Ability Modifier: {calculateAbilityModifier(attr)}</div>
            <button onClick={increment(attr)}>+</button>
            <button onClick={decrement(attr)}>-</button>
          </div>
        ))}
        {!!classInView && (
          <>
            <p>Stats for {classInView.name}</p>
            {Object.keys(classInView.stats).map((attr, i) => (
              <p key={i}>{attr}: {classInView.stats[attr]}</p>
            ))}
          </>
        )}
      </section>
    </div>
  );
}

export default App;
