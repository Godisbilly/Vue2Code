const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const attribute = /^\s*([^\s"`<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|`([^`]*)`+|([^\s"`=<>`]+)))?/
const startTagClose = /^\s*(\/?)>/

export function parseHTML (html) {

  const ELEMENT_TYPE = 1
  const TEXT_TYPE = 3
  const stack = [] // 存放元素
  let currentParent // 指向栈中的最后一个元素
  let root

  function createASTElement (tag, attrs) {
    return {
      tag,
      type: ELEMENT_TYPE,
      children: [],
      attrs,
      parent: null
    }
  }

  function start (tag, attrs) {
    let node = createASTElement(tag, attrs)
    // 如果根节点为空，则将当前节点设为树的根节点
    if (!root) root = node
    if (currentParent) {
      node.parent = currentParent
      currentParent.children.push(node)
    }
    stack.push(node)
    currentParent = node
  }

  function chars (text) {
    text = text.replace(/\s/g, "")
    text && currentParent.children.push({
      type: TEXT_TYPE,
      text,
      parent: currentParent
    })
  }

  function end (tag) {
    let node = stack.pop()
    if (node.tag !== tag) return
    currentParent = stack[stack.length - 1]
  }


  function advance (n) {
    html = html.substring(n)
  }

  function parseStartTag () {
    const start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1], // 标签名
        attrs: []
      }
      advance(start[0].length)
      // 如果不是开始标签的结束，就一直匹配下去
      let attr, end
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length)
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
        })
      }
      if (end) {
        advance(end[0].length)
      }
      return match
    }
    return false
  }

  // html最开始肯定是一个 <
  while (html) {
    // 如果indexOf中的索引是0，则说明是个标签
    // textEnd为0，为开始标签
    // textEnd大于0，为结束标签
    let textEnd = html.indexOf('<')
    if (textEnd == 0) {
      // 开始标签的匹配
      const startTagMatch = parseStartTag()
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }

      let endTagMatch = html.match(endTag)
      if (endTagMatch) {
        end(endTagMatch[1])
        advance(endTagMatch[0].length)
        continue
      }
    }

    if (textEnd > 0) {
      let text = html.substring(0, textEnd)
      if (text) {
        chars(text)
        advance(text.length)
      }
    }
  }
  return root
}