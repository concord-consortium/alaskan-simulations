// rehypeRaw needs to be mocked, as it uses ESM that is not supported in Jest yet.
function rehypeRaw() {
  return undefined;
}

export default rehypeRaw;

