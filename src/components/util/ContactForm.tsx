import React, { FC, FormEvent, useState } from 'react';

interface FormState {
  subject: string;
  message: string;
}

const ContactForm: FC = () => {
  const [form, setForm] = useState<FormState>({ subject: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(form);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto text-2xl sm:text-3xl flex flex-col items-left gap-4">
      <label htmlFor="subject">Subject:</label>
      <input
        type="text"
        id="subject"
        name="subject"
        required
        minLength={3}
        maxLength={60}
        placeholder="Your Subject"
        value={form.subject}
        onChange={handleChange}
        className="w-full text-black text-2xl sm:text-3xl p-3 rounded-xl border border-solid border-slate-900 dark:border-none mb-4"
      />
      <label htmlFor="message">Message:</label>
      <textarea
        name="message"
        id="message"
        cols={30}
        rows={10}
        placeholder="Your Message"
        required
        value={form.message}
        onChange={handleChange}
        className="w-full text-black text-2xl sm:text-3xl p-3 rounded-xl border border-solid border-slate-900 dark:border-none"
      ></textarea>
      <button
        type="submit"
        className="bg-teal-700 hover:bg-teal-600 active:bg-teal-500 text-white p-3 w-48 rounded-xl border border-solid border-slate-900 dark:border-none"
      >
        Submit
      </button>
    </form>
  );
};

export default ContactForm;