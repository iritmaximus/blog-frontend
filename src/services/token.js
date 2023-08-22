export const parseToken = (token) => {
  if (token) {
    return "Bearer " + token;
  }
  throw Error("No token given");
};

export const createConfig = (token) => {
  if (token) {
    return {
      headers: { Authorization: token },
    };
  }
};
