const countReducer = (count, action) => {
  switch (action.type) {
    case "INCREASE":
      return count + 1;

    case "DECREASE":
      return count - 1;

    case "RESET":
      return 0;

    default:
      return count;
  }
};

export default countReducer;
