import { parseToken } from "./token";

const baseUrl = "/api/blogs/";

const getAll = async () => {
  const response = await fetch(baseUrl);
  if (response.status === 500) {
    console.error(response);
    return;
  }
  const result = await response.json();
  return result;
};

const create = async (newBlog, token) => {
  const parsedToken = parseToken(token);
  console.info("Making POST to", baseUrl, "with", newBlog, parsedToken);

  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: parsedToken,
      },
      body: JSON.stringify(newBlog),
    });
    const result = await response.json();
    return result;
  } catch (e) {
    console.error("lol, oh no", e);
  }
};

const update = async (blog, newLikes, token) => {
  try {
    const parsedToken = parseToken(token);
    const url = baseUrl + blog.id;
    console.info("Making PUT to", url, { likes: newLikes }, token);

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: parsedToken,
      },
      body: JSON.stringify({ likes: newLikes }),
    });
    const result = await response.json();
    console.info(result);
    return result;
  } catch (e) {
    console.error("Not good,", e);
    return blog;
  }
};

const deleteBlog = async (blog, token) => {
  try {
    const parsedToken = parseToken(token);
    const response = await fetch(baseUrl + blog.id, {
      method: "DELETE",
      headers: {
        Authorization: parsedToken,
      },
    });
    const result = await response.json();
    console.info(result);
    return result;
  } catch (e) {
    console.error("JSON parsing for DELETE failed", e);
    console.error("Data causing error:", blog, token, baseUrl + blog.id);
  }
};

export default { getAll, create, update, deleteBlog };
