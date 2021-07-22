/* 
* <license header>
*/

import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import ErrorBoundary from 'react-error-boundary'
import {
  Flex,
  Heading,
  Form,
  Picker,
  TextArea,
  Button,
  ActionButton,
  StatusLight,
  ProgressCircle,
  Item,
  Text,
  View,
  TextField
} from '@adobe/react-spectrum'
import Play from '@spectrum-icons/workflow/Play'
import FastForward from "@spectrum-icons/workflow/FastForward";
import Rewind from "@spectrum-icons/workflow/Rewind";

import actions from '../config.json'
import actionWebInvoke from '../utils'

const ActionsForm = (props) => {
  const [state, setState] = useState({
    actionSelected: null,
    actionResponse: null,
    actionResponseError: null,
    actionHeaders: null,
    actionHeadersValid: null,
    actionParams: null,
    actionParamsValid: null,
    actionInvokeInProgress: false,
    actionResult: '',
    actionResponseHeaders: '',
    query: '',
    time: '',
    next: null,
  })


  useEffect(() => {
    setState(
      state => ({
        ...state,
        actionHeaders: {
          "x-gw-ims-org-id":"C74F69D7594880280A495D09@AdobeOrg",
          "Authorization":"Bearer eyJhbGciOiJSUzI1NiIsIng1dSI6Imltc19uYTEta2V5LTEuY2VyIn0.eyJpZCI6IjE2MjY5MTY1MTYyMThfYTk4NWZmYzctZjZiMy00MDJiLTg3ZTctZjAzYzdjZDlhYjRlX3VlMSIsInR5cGUiOiJhY2Nlc3NfdG9rZW4iLCJjbGllbnRfaWQiOiJmMzdiNTM2MjU0Y2Q0NWU5YmQ3NGFlYjMxZDEyOTc3MSIsInVzZXJfaWQiOiJCOEIxMzgxMDYwRTVBNjcwMEE0OTVDNzVAdGVjaGFjY3QuYWRvYmUuY29tIiwiYXMiOiJpbXMtbmExIiwiYWFfaWQiOiJCOEIxMzgxMDYwRTVBNjcwMEE0OTVDNzVAdGVjaGFjY3QuYWRvYmUuY29tIiwiZmciOiJWVDY2WFVaSEZMRzVQWDRDR01aQkJIUUFMRT09PT09PSIsIm1vaSI6ImIxYzJiYjYzIiwiZXhwaXJlc19pbiI6Ijg2NDAwMDAwIiwic2NvcGUiOiJhZG9iZWlvX2FwaSxvcGVuaWQsQWRvYmVJRCxyZWFkX29yZ2FuaXphdGlvbnMsYWRkaXRpb25hbF9pbmZvLnJvbGVzLGFkZGl0aW9uYWxfaW5mby5wcm9qZWN0ZWRQcm9kdWN0Q29udGV4dCIsImNyZWF0ZWRfYXQiOiIxNjI2OTE2NTE2MjE4In0.c3PNrfNLh6c8Qr889vy_gCawYa54Vv--HYX4oOKTOSoZ2ssL0nauPd1o6fKHw8wf34SSxnNcCnHQB0_ifRKzrHV9giS7sVU7o4B5etnqttycPeeqrAK9lcUyqmA1b2hpTry4E8s4mj9a2il6gk6Wvq6vQFJ2_JLylNae2S85dnfjRgGIob8i8fr6fdlx7zX_kreHT5ZumLOBjXLtGpcE-8XpkL3h1zhG3E2qDZliiJto_8AZDZK28rLqebcFo22LlJSY8fFjoC9-p74cjidR98y91lCX-r2labR88Tw-F5ZVjv03AWK6cSasTbyZdgoo3R95VnZfaMpmkosXqD3zPg"
        },
      })
    )
  }, []);

  function formatQueryHeaders(headers) {
    return (
      `x-ims-org-id: ${headers['x-gw-ims-org-id']}\n`
      + `Authorization: Bearer <JWT Token>\n`
      + `x-api-key: ${headers['x-api-key']}`
    )
  }

  function getUrl(name, params) {
    switch (name) {
      case 'oldest':
        return params.journalling_url
      case 'next':
        return params.next
      case 'latest':
        return params.journalling_url + '?latest=true'
      default:
        return null
    }
  }

  function getQuery(name, headers, params) {
    return 'GET ' + getUrl(name, params) + '\n\n' + formatQueryHeaders(headers)
  }

  return (
    <View>
      <Heading level={1}>Journal Browser</Heading>
      <Flex direction="row" gap="size-300" wrap>
        <Flex direction="column" minWidth="size-4600" width="30%" justifyContent="space-between">
          {Object.keys(actions).length > 0 && (
            <>
              <Flex direction="column">
                <Form>
                  <TextField 
                    label="Journalling endpoint URL"
                    onChange={(input)=>{setState({...state, actionParams: {...state.actionParams, 'journalling_url':input}})}}
                    validationState={( !state.actionResponseError ) ? 'valid' : 'invalid'}
                  />

                  <TextField 
                    label="IMS Org Id"
                    onChange={(input)=>{setState({...state, actionHeaders: {...state.actionHeaders, 'x-ims-org-id':input}})}}
                    validationState={( !state.actionResponseError ) ? 'valid' : 'invalid'}
                  />

                  <TextField 
                    label="Authorization"
                    onChange={(input)=>{setState({...state, actionHeaders: {...state.actionHeaders, 'journal-auth':input}})}}
                    validationState={( !state.actionResponseError ) ? 'valid' : 'invalid'}
                  />

                  <TextField 
                    label="API Key"
                    onChange={(input)=>{setState({...state, actionHeaders: {...state.actionHeaders, 'x-api-key':input}})}}
                    validationState={( !state.actionResponseError ) ? 'valid' : 'invalid'}
                  />
                </Form>
              </Flex>
            
              <Flex 
                direction="row" 
                justifyContent="space-between"
                marginTop="size-300"
              >
                <ActionButton
                  variant="primary"
                  type="button"
                  onPress={() => invokeAction('oldest')}
                ><Rewind aria-label="Oldest" /><Text>Oldest</Text></ActionButton>

                <ActionButton
                  variant="primary"
                  type="button"
                  onPress={() => invokeAction('next')}
                  isDisabled={!state.next}
                ><Play aria-label="Next" /><Text>Next</Text></ActionButton>

                <ActionButton
                  variant="primary"
                  type="button"
                  onPress={() => invokeAction('latest')}
                ><FastForward aria-label="Latest" /><Text>Latest</Text></ActionButton>
              </Flex>
            </>
          )}
          <Flex height="size-400" justifyContent="center" alignItems="center" marginTop="size-200">
            <ProgressCircle
              aria-label="loading"
              isIndeterminate
              isHidden={!state.actionInvokeInProgress}
              marginStart="size-100"
            />
            {state.actionResponseError && !state.actionInvokeInProgress && (
              <View padding={`size-100`} marginTop={`size-100`} marginBottom={`size-100`} borderRadius={`small `}>
                <StatusLight variant="negative">Failure! See the complete error in your browser console.</StatusLight>
              </View>
            )}
            {!state.actionResponseError && state.actionResponse && !state.actionInvokeInProgress && (
              <View padding={`size-100`} marginTop={`size-100`} marginBottom={`size-100`} borderRadius={`small `}>
                <StatusLight variant="positive">Success! See the complete response in your browser console.</StatusLight>
              </View>
            )}
          </Flex>
          <TextField
            aria-label="Time"
            isReadOnly={true}
            width="100%"
            isQuiet
            value={state.time}
          />
          <TextArea
            label="Query"
            isReadOnly={true}
            height="size-3600"
            width="100%"
            value={state.query}
            validationState={( !state.actionResponseError ) ? 'valid' : 'invalid'}
          />
        </Flex>
        
        {Object.keys(actions).length === 0 && <Text>You have no actions !</Text>}
          <Flex direction="column" minWidth="size-4600" width="50%" gap="size-400">
            <Form>
              <TextArea
                label="Headers"
                isReadOnly={true}
                height="size-3600"
                width="100%"
                value={state.actionResponseHeaders}
                validationState={( !state.actionResponseError ) ? 'valid' : 'invalid'}
              />
              <TextArea
                label="Events"
                isReadOnly={true}
                height="size-5000"
                width="100%"
                value={state.actionResult}
                validationState={( !state.actionResponseError ) ? 'valid' : 'invalid'}
              />
            </Form>
          </Flex>
      </Flex>
    </View>
  )

  // Methods

  // invokes a the selected backend actions with input headers and params
  async function invokeAction (name) {
    const actionName = name ?? state.actionSelected
    const headers = state.actionHeaders || {}
    const params = state.actionParams || {}
    const startTime = Date.now()
    // all headers to lowercase
    Object.keys(headers).forEach((h) => {
      const lowercase = h.toLowerCase()
      if (lowercase !== h) {
        headers[lowercase] = headers[h]
        headers[h] = undefined
        delete headers[h]
      }
    })
    setState({ 
      ...state, 
      actionInvokeInProgress: true, 
      actionResult: 'calling action ... ', 
      actionResponseHeaders: 'calling action...',
    })
    // set the authorization header and org from the ims props object
    if (props.ims.token && !headers.authorization) {
      headers.authorization = `Bearer ${props.ims.token}`
    }
    if (props.ims.org && !headers['x-gw-ims-org-id']) {
      headers['x-gw-ims-org-id'] = props.ims.org
    }
    let formattedResult = ""
    try {
      // invoke backend action
      params.next = state.next
      params.action = name
      const actionResponse = await actionWebInvoke(actions['browse-journal'], headers, params)
      time = `Time: ${Date.now() - startTime} ms\n`
      formattedResult = JSON.stringify(actionResponse.events ?? {},0,2)
      formattedActionResponseHeaders = JSON.stringify(actionResponse.responseHeaders,0,2)
      // store the response
      query = getQuery(name, headers, params)
      next = actionResponse.link ? actionResponse.link.next : params.journalling_url + '?latest=true'
      setState({
        ...state,
        actionResponse,
        actionResult: formattedResult,
        actionResponseHeaders: formattedActionResponseHeaders,
        actionResponseError: null,
        actionInvokeInProgress: false,
        next: next,
        query: query,
        time: time
      })
      console.log(`Response from ${actionName}:`, actionResponse)
    } catch (e) {
      // log and store any error message
      time = `Time: ${Date.now() - startTime} ms\n`
      query = getQuery(name, headers, params)
      formattedActionResponseHeaders = e.message
      console.error(e)
      setState({
        ...state,
        actionResponse: null,
        actionResult: '',
        actionResponseHeaders: formattedActionResponseHeaders,
        actionResponseError: e.message,
        actionInvokeInProgress: false,
        next: null,
        query: query,
        time: time
      })
    }
  }
}

ActionsForm.propTypes = {
  runtime: PropTypes.any,
  ims: PropTypes.any
}

export default ActionsForm
