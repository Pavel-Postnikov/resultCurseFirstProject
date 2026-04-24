"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./GenerateButton.module.css";

export function GenerateButton() {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("frontend-разработчики с базовым знанием JS");
  const [level, setLevel] = useState("intermediate");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function handleClose() {
    if (loading) return;
    setOpen(false);
    setNotice(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setNotice(null);

    timeoutRef.current = setTimeout(() => {
      setLoading(false);
      setNotice(
        "AI-генерация новых тем пока не поддерживается. Сейчас доступны готовые Journey из списка ниже.",
      );
      timeoutRef.current = null;
    }, 10_000);
  }

  function handleOpen() {
    setOpen(true);
    setNotice(null);
  }

  function resetNotice() {
    if (notice) {
      setNotice(null);
    }
  }

  return (
    <>
      <button className={styles.trigger} onClick={handleOpen}>
        + Новая тема
      </button>

      {open && (
        <div className={styles.backdrop} onClick={handleClose}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Создать новую тему</h2>
              <button className={styles.closeBtn} onClick={handleClose} disabled={loading}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <label className={styles.label}>
                Тема курса
                <input
                  className={styles.input}
                  type="text"
                  placeholder="например: React hooks, SQL для начинающих..."
                  value={topic}
                  onChange={(e) => {
                    setTopic(e.target.value);
                    resetNotice();
                  }}
                  required
                  disabled={loading}
                  autoFocus
                />
              </label>

              <label className={styles.label}>
                Целевая аудитория
                <input
                  className={styles.input}
                  type="text"
                  placeholder="frontend-разработчики, студенты..."
                  value={audience}
                  onChange={(e) => {
                    setAudience(e.target.value);
                    resetNotice();
                  }}
                  disabled={loading}
                />
              </label>

              <label className={styles.label}>
                Уровень
                <select
                  className={styles.select}
                  value={level}
                  onChange={(e) => {
                    setLevel(e.target.value);
                    resetNotice();
                  }}
                  disabled={loading}
                >
                  <option value="beginner">Beginner — с нуля</option>
                  <option value="intermediate">Intermediate — базовые знания есть</option>
                  <option value="advanced">Advanced — углублённый уровень</option>
                </select>
              </label>

              <button className={styles.submit} type="submit" disabled={loading || !topic.trim()}>
                {loading ? (
                  <span className={styles.loadingRow}>
                    <span className={styles.spinner} />
                    Генерирую...
                  </span>
                ) : (
                  "Сгенерировать"
                )}
              </button>

              {loading && (
                <p className={styles.hint}>
                  Обычно занимает 15–30 секунд. Не закрывай окно.
                </p>
              )}

              {notice && <div className={styles.notice}>{notice}</div>}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
