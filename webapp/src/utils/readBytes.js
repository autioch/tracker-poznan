export function readBytes(reader, contentLength, onProgressFn) {
  let resolve;

  let receivedLength = 0;

  const chunks = [];
  const promise = new Promise((res) => {
    resolve = res;
  });

  function readFromReader({ done, value }) {
    if (!done) {
      chunks.push(value);
      receivedLength += value.length;
      const percent = (receivedLength / contentLength) * 100;

      onProgressFn(percent);

      return reader.read().then(readFromReader);
    }

    return resolve({
      chunks,
      receivedLength
    });
  }

  reader.read().then(readFromReader);

  return promise;
}
