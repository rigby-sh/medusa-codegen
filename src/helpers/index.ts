import { OpenAI } from "@langchain/openai";
import { Ollama } from "@langchain/community/llms/ollama";
const PATTERN = /^([A-Za-z \t]*)```([A-Za-z]*)?\n([\s\S]*?)```([A-Za-z \t]*)*$/gm


export function llmFactory(modelName: string, openAIApiKey: string = process.env['OPENAI_API_KEY'] ?? '') {

    if (openAIApiKey === '') {
        console.debug('Using Ollama as LLM');
        return new Ollama({ 
            baseUrl: 'http://' + process.env.OLLAMA_HOST + ':' + process.env.OLLAMA_PORT,
            model: modelName
           });
    } else {
        console.debug('Using OpenAI as LLM');
        return new OpenAI({
            model: "gpt-4o", // Defaults to "gpt-3.5-turbo-instruct" if no model provided.
            temperature: 0.9,
          });
    }
}

function getLineNumber(text = '', matches: any) {
    return countLines(text.substr(0, matches.index))
}

function countLines(text = '') {
    return text.split('\n').length
}


export function findCodeBlocks(block: string, singleBlockMode = true) {
  let matches
  let errors = []
  let blocks = []
  while ((matches = PATTERN.exec(block)) !== null) {
    if (matches.index === PATTERN.lastIndex) {
      PATTERN.lastIndex++ // avoid infinite loops with zero-width matches
    }
    const [ match, prefix, syntax, content, postFix ] = matches
    const lang = syntax || 'none'
    const lineNumber = getLineNumber(block, matches)
    let hasError = false
    /* // debug
    console.log(`prefix: "${prefix}"`)
    console.log(`postFix: "${postFix}"`)
    console.log('syntax:', lang)
    console.log('Content:')
    console.log(content.trim())
    console.log('───────────────────────')
    /** */

    /* Validate code blocks */
    if (prefix && prefix.match(/\S/)) {
      hasError = true
      errors.push({
        line: lineNumber,
        position: matches.index,
        message: `Prefix "${prefix}" not allowed on line ${lineNumber}. Remove it to fix the code block.`,
        block: match
      })
    }
    if (postFix && postFix.match(/\S/)) {
      hasError = true
      const line = lineNumber + (countLines(match) - 1)
      errors.push({
        line,
        position: matches.index + match.length,
        message: `Postfix "${postFix}" not allowed on line ${line}. Remove it to fix the code block.`,
        block: match
      })
    }

    if (!hasError) {
      blocks.push({
        line: lineNumber,
        position: matches.index,
        syntax: lang,
        block: match,
        code: content.trim()
      })
    }
  }

  if (blocks.length === 0 && singleBlockMode) {
    blocks.push({
        line: 0,
        position:0,
        syntax: '',
        block: '',
        code: block.trim()
      })    
  }

  return {
    errors,
    blocks
  }
}