// TODO remove repeated identical points
module.exports = function optimizeShapeGroup(shapeGroup) { // eslint-disable-line max-statements
  const chunkSet = new Set();

  const resultingShapes = [];

  for (let shapeIndex = 0; shapeIndex < shapeGroup.length; shapeIndex++) {
    const shape = shapeGroup[shapeIndex];

    let splitIndex = 0;

    let hasBeenSplit = false;

    let chunkIndex;

    for (chunkIndex = 1; chunkIndex < shape.length; chunkIndex++) {
      const [lat1, lng1] = shape[chunkIndex - 1];
      const [lat2, lng2] = shape[chunkIndex];
      const chunkKey = lat1 < lat2 ? `${lat1}.${lng1}.${lat2}.${lng2}` : `${lat2}.${lng2}.${lat1}.${lng1}`;

      if (chunkSet.has(chunkKey)) {
        const newShape = shape.slice(splitIndex, chunkIndex);

        if (newShape.length > 1) { // first chunk might be already duplicated.
          resultingShapes.push(newShape);
        }
        splitIndex = chunkIndex;
        hasBeenSplit = true;
      } else {
        chunkSet.add(chunkKey);
      }
    }

    if (hasBeenSplit) {
      const newShape = shape.slice(splitIndex, chunkIndex);

      if (newShape.length > 1) {
        resultingShapes.push(newShape);
      }
    } else {
      resultingShapes.push(shape);
    }
  }

  return resultingShapes;
};
