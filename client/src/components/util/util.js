/**
 * Remove and insert an element in an array
 * @param {array} array Array to remove and insert element from
 * @param {number} sourceIndex Source index
 * @param {number} destinationIndex Destination index
 * @param {string} id Id of the todolist being dragged
 * @return {array} Mutated array with elements in a new order
 */
export const removeAndInsertArrayElement = (
  array,
  sourceIndex,
  destinationIndex,
  id
) => {
  // Remove the item being dragged
  array.splice(sourceIndex, 1);
  // Insert item being dragged
  array.splice(destinationIndex, 0, id);

  return array;
};

/**
 * Get a select range of array elements from an array
 * @param {array} array Array to remove and insert element from
 * @param {number} sourceIndex Source index
 * @param {number} destinationIndex Destination index
 * @return {array} Array with selected range of index
 */
export const selectArrayFromRange = (array, sourceIndex, destinationIndex) => {
  let newArray = [];
  newArray = array.splice(sourceIndex, destinationIndex + 1);

  return newArray;
};

/**
 * Get the ids that have shifted after moving
 * @param {array} copyArray Array of new order
 * @param {array} originalArray Array of old order
 * @param {number} sourceIndex Source index
 * @param {number} destinationIndex Destination index
 * @return {[array1, array2]} array1 Shifted array with the new elements, array2 Shifted array with the old elements
 */
export const getShiftedIds = (
  copyArray,
  originalArray,
  sourceIndex,
  destinationIndex
) => {
  let array1 = [];
  let array2 = [];
  // Moving the down the list
  if (sourceIndex < destinationIndex) {
    // The ids of all the elements that shifted after the move
    array1 = selectArrayFromRange(copyArray, sourceIndex, destinationIndex);
    // Get the original ids that have shifted after the move
    array2 = selectArrayFromRange(originalArray, sourceIndex, destinationIndex);
  }
  // Moving up the list
  else {
    // The ids of all the elements that shifted after the move
    array1 = selectArrayFromRange(copyArray, destinationIndex, sourceIndex);
    // Get the original ids that have shifted after the move
    array2 = selectArrayFromRange(originalArray, destinationIndex, sourceIndex);
  }

  return [array1, array2];
};

/**
 * If array has matching element, push onto new array. Return the new array
 * @param {array} array1 Array of elements with values
 * @param {array} array2 2-d array of elements with values
 * @return {array} Array with the matching elements
 */
export const findMatchingElementsInArrays = (array1, array2) => {
  // let matchingElements = [];

  // // Get the matching todos with the shifted todos
  // array1.forEach((arrayElement1, i) => {
  //   array2.forEach((_arrayElement2, j) => {
  //     if (array2[j][0].includes(arrayElement1)) {
  //       matchingElements.push({
  //         id: array2[j][1].id,
  //       });
  //     }
  //   });
  // });

  return array2.filter(function (el) {
    return array1.indexOf(el) !== -1;
  });

  // return matchingElements;
};
