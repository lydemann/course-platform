export const removeEmptyFields = obj => {
  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === 'object') removeEmptyFields(obj[key]);
    else if (obj[key] === undefined) delete obj[key];
  });
  return obj;
};
