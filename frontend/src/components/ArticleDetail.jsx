import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { articlesApi } from "../services/api";
import CommentForm from "./CommentForm";

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await articlesApi.getOne(id);
      setArticle(response.data.data);
    } catch (err) {
      setError("Ошибка при загрузке статьи");
      console.error("Error fetching article:", err);
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCommentAdded = () => {
    // Перезагрузить статью, чтобы показать новый комментарий
    fetchArticle();
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Загрузка статьи...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
        <Link to="/" className="btn">
          ← Вернуться к списку
        </Link>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container">
        <div className="error">Статья не найдена</div>
        <Link to="/" className="btn">
          ← Вернуться к списку
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <Link to="/" className="back-link">
        ← Вернуться к списку
      </Link>

      <article className="article-detail">
        <h1>{article.title}</h1>
        <p className="date">Опубликовано: {formatDate(article.created_at)}</p>
        <div className="content">{article.content}</div>
      </article>

      <section className="comments-section">
        <h2>Комментарии ({article.comments.length})</h2>

        {article.comments.length > 0 ? (
          <div className="comments-list">
            {article.comments.map((comment) => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <strong>{comment.author_name}</strong>
                  <span className="comment-date">
                    {formatDate(comment.created_at)}
                  </span>
                </div>
                <p className="comment-content">{comment.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-comments">Комментариев пока нет. Будьте первым!</p>
        )}

        <CommentForm articleId={id} onCommentAdded={handleCommentAdded} />
      </section>
    </div>
  );
};

export default ArticleDetail;
