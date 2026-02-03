import { useState } from "react";
import { commentsApi } from "../services/api";

const CommentForm = ({ articleId, onCommentAdded }) => {
  const [formData, setFormData] = useState({
    author_name: "",
    content: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Очистить ошибку поля при изменении
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess(false);

    try {
      await commentsApi.create(articleId, formData);
      // Очистить форму
      setFormData({
        author_name: "",
        content: "",
      });
      setSuccess(true);
      // Уведомить родительский компонент о добавлении комментария
      if (onCommentAdded) {
        onCommentAdded();
      }
      // Скрыть сообщение об успехе через 3 секунды
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ general: "Ошибка при добавлении комментария" });
      }
      console.error("Error creating comment:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comment-form">
      <h3>Добавить комментарий</h3>

      {success && (
        <div className="success-message">Комментарий успешно добавлен!</div>
      )}

      {errors.general && <div className="error-message">{errors.general}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="author_name">Ваше имя *</label>
          <input
            type="text"
            id="author_name"
            name="author_name"
            value={formData.author_name}
            onChange={handleChange}
            className={errors.author_name ? "error" : ""}
            placeholder="Введите ваше имя"
          />
          {errors.author_name && (
            <span className="error-text">{errors.author_name[0]}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="content">Комментарий *</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            className={errors.content ? "error" : ""}
            placeholder="Напишите ваш комментарий (минимум 3 символа)"
            rows="4"
          />
          {errors.content && (
            <span className="error-text">{errors.content[0]}</span>
          )}
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Отправка..." : "Отправить комментарий"}
        </button>
      </form>
    </div>
  );
};

export default CommentForm;
