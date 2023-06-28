import axios from "axios";

export const login = async credentials => {
  try {
    const response = await axios.post("/api/login", credentials);
    const jsonResponse = JSON.stringify(response.data);
    return jsonResponse;
  } catch (e) {
    if (e.response.status === 400) {
      console.error("Login failed:", e.response.data.error);
      return;
    }
    console.error("Something else went wrong... sos");
    return;
  }
};
