import axios from "axios";

const baseUrl = "/api/blogs";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then(response => response.data);
};

const tokenToBearer = token => {
  if (token) {
    return "Bearer " + token;
  }
  console.error("No token given");
  return;
};

const create = async (newBlog, token) => {
  const config = {
    headers: { Authorization: tokenToBearer(token) }
  };

  console.info("Making POST to", baseUrl, "with", newBlog, config);
  try {
    const result = await axios.post(baseUrl, newBlog, config);
    return result;
  } catch (e) {
    if (e.response.status === 401) {
      console.error(e.response.data.error);
      return;
    }
    console.error("Oh no...");
  }
};

export default { getAll, create };
