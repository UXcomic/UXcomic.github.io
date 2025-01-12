require('dotenv').config()
const notion = require('../../utilities/notion-sdk-helper')
const {
  successResponse,
  errorResponse,
  badRequestResponse,
} = require('../../utilities/response-helper')
const { getContentData } = require('../../utilities/notion-content-helper')

exports.handler = async function (event, context) {
  try {
    const { blockId } = event.queryStringParameters
    if (!blockId) return badRequestResponse('invalid block id')
    const queryResponse = await notion.blocks.children.list({
      block_id: blockId,
    })
    const content = getContentData(queryResponse)
    return successResponse(content)
  } catch (error) {
    console.error('Notion API Error:', JSON.stringify(error))
    console.log('Context info:', JSON.stringify(context))
    return errorResponse()
  }
}
