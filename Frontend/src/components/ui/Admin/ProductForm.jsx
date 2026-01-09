import React, { useEffect, useState } from 'react';
import FormField from './FormField';
const ProductForm = ({ onSubmit, initialData = null }) => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    isFeatured: false,
    sizes: [''],
    colors: [''],
    images: [''],
  });

  useEffect(() => {
    setCategories(['Men', 'Women', 'Children']);
  }, []);

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        sizes: initialData.sizes.length ? initialData.sizes : [''],
        colors: initialData.colors.length ? initialData.colors : [''],
        images: initialData.images.length ? initialData.images : [''],
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleArrayChange = (field, index, value) => {
    const updated = [...form[field]];
    updated[index] = value;
    setForm((prev) => ({ ...prev, [field]: updated }));
  };

  const addField = (field) => {
    setForm((prev) => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField>
        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 border border-pink-300 rounded"
          required
        />
      </FormField>

      <FormField>
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="w-full p-3 border border-pink-300 rounded"
          required
        />
      </FormField>

      <FormField>
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full p-3 border border-pink-300 rounded"
          required
        />
      </FormField>

      <FormField label="Category">
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full p-3 border border-pink-300 rounded"
          required
        >
          <option value="" disabled>Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </FormField>

      <FormField>
        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          className="w-full p-3 border border-pink-300 rounded"
          required
        />
      </FormField>

      <FormField>
        <label className="inline-flex items-center space-x-2">
          <input
            type="checkbox"
            name="isFeatured"
            checked={form.isFeatured}
            onChange={handleChange}
          />
          <span className="text-gray-700">Mark as Featured</span>
        </label>
      </FormField>

      {['sizes', 'colors', 'images'].map((field) => (
        <FormField key={field} label={field.charAt(0).toUpperCase() + field.slice(1)}>
          {form[field].map((item, i) => (
            <input
              key={i}
              type="text"
              value={item}
              onChange={(e) => handleArrayChange(field, i, e.target.value)}
              placeholder={`${field.slice(0, -1)} ${i + 1}`}
              className="w-full p-3 mb-2 border border-pink-300 rounded"
              required={field !== 'colors'} 
            />
          ))}
          <button type="button" onClick={() => addField(field)} className="text-sm text-black-600 hover:underline">
            + Add another {field.slice(0, -1)}
          </button>
        </FormField>
      ))}

      <button
        type="submit"
        className="w-full py-4 bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded"
        style={{ backgroundColor: "#FFC0CB" }}

      >
        Create Product
      </button>
    </form>
  );
};

export default ProductForm;
