import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const articlesApi = {
  getAll: (page = 1) => api.get(`/articles?page=${page}`),

  getOne: (id) => api.get(`/articles/${id}`),

  create: (data) => api.post("/articles", data),
};

export const commentsApi = {
  create: (articleId, data) =>
    api.post(`/articles/${articleId}/comments`, data),
};

export default api;
