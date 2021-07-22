/* 
* <license header>
*/

import React from 'react'
import { Provider, defaultTheme, Grid, View, darkTheme } from '@adobe/react-spectrum'
import ErrorBoundary from 'react-error-boundary'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import SideBar from './SideBar'
import ActionsForm from './ActionsForm'
import { Home } from './Home'
import { About } from './About'

function App (props) {
  console.log('runtime object:', props.runtime)
  console.log('ims object:', props.ims)

  // use exc runtime event handlers
  // respond to configuration change events (e.g. user switches org)
  props.runtime.on('configuration', ({ imsOrg, imsToken, locale }) => {
    console.log('configuration change', { imsOrg, imsToken, locale })
  })
  // respond to history change events
  props.runtime.on('history', ({ type, path }) => {
    console.log('history change', { type, path })
  })

  let [darkMode, setDarkMode] = React.useState(false)

  return (
    <ErrorBoundary onError={onError} FallbackComponent={fallbackComponent}>
      <Router>
        <Provider theme={defaultTheme} colorScheme={darkMode ? "dark" : "light"}>
          <Grid
            areas={['sidebar content']}
            columns={['256px', '3fr']}
            rows={['auto']}
            minHeight='100vh'
          >
            <View
              gridArea='sidebar'
              backgroundColor='gray-200'
              padding='size-200'
            >
              <SideBar setDarkMode={setDarkMode.bind(this)}></SideBar>
            </View>
            <View gridArea='content'
            backgroundColor='gray-50'
            padding='size-200'
            paddingStart='size-300'
            >
              <Switch>
                {/* <Route exact path='/'>
                  <Home></Home>
                </Route> */}
                <Route exact path='/'>
                  <ActionsForm runtime={props.runtime} ims={props.ims} />
                </Route>
                <Route path='/about'>
                  <About></About>
                </Route>
              </Switch>
            </View>
          </Grid>
        </Provider>
      </Router>
    </ErrorBoundary>
  )

  // Methods

  // error handler on UI rendering failure
  function onError (e, componentStack) { }

  // component to show if UI fails rendering
  function fallbackComponent ({ componentStack, error }) {
    return (
      <React.Fragment>
        <h1 style={{ textAlign: 'center', marginTop: '20px' }}>
          Something went wrong :(
        </h1>
        <pre>{componentStack + '\n' + error.message}</pre>
      </React.Fragment>
    )
  }
}

export default App
