
function conditionalCopy(obj1, obj2, key, default_value) {
  if(obj2.hasOwnProperty(key)) {
    obj1[key] = obj2[key];
    return true;
  } else {
    obj1[key] = default_value;
    return false;
  }
}
