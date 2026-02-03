import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { articlesApi } from "../services/api";

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchArticles(currentPage);
  }, [currentPage]);

  const fetchArticles = async (page) => {
    try {
      setLoading(true);
      setError(null);
      const response = await articlesApi.getAll(page);
      setArticles(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      setError("Ошибка при загрузке статей");
      console.error("Error fetching articles:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getExcerpt = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Загрузка статей...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Блог статей</h1>
        <Link to="/create" className="btn btn-primary">
          Создать статью
        </Link>
      </div>

      <div className="articles-grid">
        {articles.map((article) => (
          <div key={article.id} className="article-card">
            <h2>
              <Link to={`/articles/${article.id}`}>{article.title}</Link>
            </h2>
            <p className="date">{formatDate(article.created_at)}</p>
            <p className="excerpt">{getExcerpt(article.content)}</p>
            <Link to={`/articles/${article.id}`} className="read-more">
              Читать далее →
            </Link>
          </div>
        ))}
      </div>

      {pagination.last_page > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn"
          >
            ← Предыдущая
          </button>
          <span className="page-info">
            Страница {pagination.current_page} из {pagination.last_page}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === pagination.last_page}
            className="btn"
          >
            Следующая →
          </button>
        </div>
      )}
    </div>
  );
};

export default ArticleList;
