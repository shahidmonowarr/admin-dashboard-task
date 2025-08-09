import { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import type { Article } from "../types/article";

interface EditArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article | null;
  onSave: (updatedArticle: Article) => void;
}

export const EditArticleModal = ({
  isOpen,
  onClose,
  article,
  onSave,
}: EditArticleModalProps) => {
  const [formData, setFormData] = useState<
    Omit<Article, "id" | "author" | "publishedDate">
  >({
    title: "",
    content: "",
    status: "Draft",
  });
  const [errors, setErrors] = useState<{ title?: string; content?: string }>(
    {}
  );
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        content: article.content,
        status: article.status,
      });
    }
  }, [article]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.content.trim()) newErrors.content = "Content is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate() && article) {
      onSave({
        ...article,
        ...formData,
      });
      onClose();
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  <div className="border-b border-gray-200">
                    <nav className="-mb-px flex">
                      <button
                        onClick={() => setActiveTab("edit")}
                        className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm ${
                          activeTab === "edit"
                            ? "border-indigo-500 text-indigo-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setActiveTab("preview")}
                        className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm ${
                          activeTab === "preview"
                            ? "border-indigo-500 text-indigo-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        Preview
                      </button>
                    </nav>
                  </div>
                </Dialog.Title>

                {activeTab === "edit" ? (
                  <form onSubmit={handleSubmit} className="mt-4 space-y-6">
                    <div className="px-2">
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                          errors.title ? "border-red-500" : ""
                        } py-2 px-3`}
                        value={formData.title}
                        onChange={handleChange}
                      />
                      {errors.title && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.title}
                        </p>
                      )}
                    </div>

                    <div className="px-2">
                      <label
                        htmlFor="content"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Content
                      </label>
                      <textarea
                        id="content"
                        name="content"
                        rows={4}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                          errors.content ? "border-red-500" : ""
                        } py-2 px-3`}
                        value={formData.content}
                        onChange={handleChange}
                      />
                      {errors.content && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.content}
                        </p>
                      )}
                    </div>

                    <div className="px-2">
                      <label
                        htmlFor="status"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 px-2">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                        onClick={onClose}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="mt-4 p-4 border rounded">
                    <h2 className="text-xl font-bold mb-4">{formData.title}</h2>
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: formData.content.replace(/\n/g, "<br>"),
                      }}
                    />
                    <div className="mt-4 text-sm text-gray-500">
                      Status: {formData.status}
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
