import { useState } from "react";
import type { FormEvent } from "react";
import type { BookData } from "../lib/api";

type FormValues = Omit<BookData, "id">;
type Props = { onSubmit: (book: FormValues) => Promise<void> };

const initialValues: FormValues = { name: "", author: "", genre: "", year: "" };

function validate(values: FormValues) {
  const currentYear = new Date().getFullYear();
  return {
    name: values.name.trim().length >= 3 ? "" : "Tên sách phải từ 3 ký tự trở lên.",
    author: values.author.trim() ? "" : "Tác giả không được để trống.",
    genre: values.genre.trim() ? "" : "Thể loại không được để trống.",
    year: /^\d+$/.test(values.year) && Number(values.year) >= 1900 && Number(values.year) <= currentYear
      ? "" : `Năm xuất bản phải từ 1900 đến ${currentYear}.`,
  };
}

export default function Form({ onSubmit }: Props) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState(initialValues);
  const [submitting, setSubmitting] = useState(false);

  const update = (field: keyof FormValues, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    setErrors(validate(next));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;
    setSubmitting(true);
    try {
      await onSubmit({ ...values, name: values.name.trim(), author: values.author.trim(), genre: values.genre.trim(), year: String(Number(values.year)) });
      setValues(initialValues);
      setErrors(initialValues);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Thêm sách thất bại!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="book-form" noValidate onSubmit={submit}>
      {([
        ["name", "Tên sách:", "text"],
        ["author", "Tác giả:", "text"],
        ["genre", "Thể loại:", "text"],
        ["year", "Năm xuất bản:", "number"],
      ] as const).map(([field, label, type]) => (
        <div className="form-group" key={field}>
          <label htmlFor={`book-${field}`}>{label}</label>
          <input id={`book-${field}`} type={type} value={values[field]} onChange={(event) => update(field, event.target.value)} />
          <span className="error-msg">{errors[field]}</span>
        </div>
      ))}
      <button type="submit" id="btn-submit" disabled={submitting || Object.values(errors).some(Boolean)}>
        {submitting ? "Đang thêm..." : "Thêm Sách"}
      </button>
    </form>
  );
}
