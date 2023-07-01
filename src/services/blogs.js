import axios from "axios";

import { parseToken, createConfig } from "./token";

const baseUrl = "/api/blogs";


const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then(response => response.data);
};


const create = async (newBlog, token) => {
  const config = createConfig(parseToken(token));
  console.info("Making POST to", baseUrl, "with", newBlog, config);

  try {
    const result = await axios.post(baseUrl, newBlog, config);
    return result;
  } catch (e) {
    if (e.response.status === 401) {
      console.error(e.response.data.error);
      return;
    }
    console.error("Oh no...", e);
  }
};

const update = async (blog, newLikes, token) => {
  try {
    const config = createConfig(parseToken(token));
    console.info("Making PUT to", baseUrl, {likes: newLikes}, config);

    const result = await axios.put("/api/blogs/" + blog.id, { likes: newLikes }, config);
    console.info("Result:", result.data);
    return result.data;
  } catch (e) {
    console.error("Couldn't update likes,", e.response.data.error);
    return blog;
  }
}

export default { getAll, create, update };
