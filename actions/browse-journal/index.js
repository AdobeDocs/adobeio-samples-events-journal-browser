/*
* <license header>
*/

/**
 * This is a sample action showcasing how to access an external API
 *
 * Note:
 * You might want to disable authentication and authorization checks against Adobe Identity Management System for a generic action. In that case:
 *   - Remove the require-adobe-auth annotation for this action in the manifest.yml of your application
 *   - Remove the Authorization header from the array passed in checkMissingRequestInputs
 *   - The two steps above imply that every client knowing the URL to this deployed action will be able to invoke it without any authentication and authorization checks against Adobe Identity Management System
 *   - Make sure to validate these changes against your security requirements before deploying the action
 */


const fetch = require('node-fetch')
const { Core, Events } = require('@adobe/aio-sdk')
const { errorResponse, getBearerToken, stringParameters, checkMissingRequestInputs } = require('../utils')

async function fetchJournalling(params, token) {
  const eventsClient = await Events.init(params.ims_org_id, params.apiKey, token)
  journalling = await eventsClient.getEventsFromJournal(params.journalling_url, {}, true)
  return journalling
}

function getApiEndpoint(params) {
  switch (params.action) {
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

// main function that will be executed by Adobe I/O Runtime
async function main (params) {
  // create a Logger
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

  try {
    // 'info' is the default level if not set
    logger.info('Calling the main action')

    // log parameters, only if params.LOG_LEVEL === 'debug'
    logger.debug(stringParameters(params))

    // check for missing request input parameters and headers
    const requiredParams = ['journalling_url']
    const requiredHeaders = ['x-gw-ims-org-id', 'Authorization', 'x-api-key']
    const errorMessage = checkMissingRequestInputs(params, requiredParams, requiredHeaders)
    if (errorMessage) {
      // return and log client errors
      return errorResponse(400, errorMessage, logger)
    }

    // extract the user Bearer token from the Authorization header
    const token = getBearerToken(params)

    // replace this with the api you want to access
    const apiEndpoint = getApiEndpoint(params)

    const journal_headers = {
      'x-ims-org-id':params.__ow_headers['x-ims-org-id'],
      'x-api-key':params.__ow_headers['x-api-key'],
      'Authorization':params.__ow_headers['authorization'],
    }

    journal_params = {
      ims_org_id: journal_headers['x-ims-org-id'],
      apiKey: journal_headers['x-api-key'],
      journalling_url: apiEndpoint
    }

    const journalling = await fetchJournalling(journal_params, token);

    const response = {
      statusCode: 200,
      body: journalling
    }

    // log the response status code
    logger.info(`${response.statusCode}: successful request`)
    return response
  } catch (error) {
    // log any server errors
    logger.error(error)
    // return with 500
    return errorResponse(500, 'server error', logger)
  }
}

exports.main = main
