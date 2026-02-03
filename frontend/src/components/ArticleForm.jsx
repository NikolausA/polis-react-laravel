import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { articlesApi } from "../services/api";

const ArticleForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState(null);

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
    setGeneralError(null);

    try {
      const response = await articlesApi.create(formData);
      // Перенаправить на страницу созданной статьи
      navigate(`/articles/${response.data.data.id}`);
    } catch (err) {
      if (err.response?.data?.errors) {
        // Ошибки валидации Laravel
        setErrors(err.response.data.errors);
      } else {
        setGeneralError("Ошибка при создании статьи. Попробуйте еще раз.");
      }
      console.error("Error creating article:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Link to="/" className="back-link">
        ← Вернуться к списку
      </Link>

      <div className="form-container">
        <h1>Создать новую статью</h1>

        {generalError && <div className="error-message">{generalError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Заголовок статьи *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? "error" : ""}
              placeholder="Введите заголовок статьи"
            />
            {errors.title && (
              <span className="error-text">{errors.title[0]}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="content">Содержимое статьи *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className={errors.content ? "error" : ""}
              placeholder="Введите текст статьи (минимум 10 символов)"
              rows="10"
            />
            {errors.content && (
              <span className="error-text">{errors.content[0]}</span>
            )}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Создание..." : "Создать статью"}
            </button>
            <Link to="/" className="btn btn-secondary">
              Отмена
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArticleForm;
