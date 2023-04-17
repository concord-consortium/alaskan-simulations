// ReactMarkdown needs to be mocked, as it uses ESM that is not supported in Jest yet.
function ReactMarkdown({ children }){
  return children;
}

export default ReactMarkdown;
