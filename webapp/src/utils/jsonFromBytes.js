export function jsonFromBytes(chunks, receivedLength) {
  const chunksAll = new Uint8Array(receivedLength); // (4.1)

  let position = 0;

  for (const chunk of chunks) {
    chunksAll.set(chunk, position); // (4.2)
    position += chunk.length;
  }

  const result = new TextDecoder('utf-8').decode(chunksAll);

  return JSON.parse(result);
}
