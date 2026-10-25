import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { useToast } from "../../hooks/useToast";
import Button from "../../components/ui/Button";

const emptyForm = {
name: "",
brand: "Generic",
description: "",
category: "",
price: "",
mrp: "",
unit: "",
stock: "",
imageUrl: "",
isActive: true,
isFeatured: false,
isBestSeller: false,
};

function ProductForm() {
const { id } = useParams();
const isEdit = Boolean(id);

const navigate = useNavigate();
const { show } = useToast();

const [form, setForm] = useState({ ...emptyForm });
const [categories, setCategories] = useState([]);
const [submitting, setSubmitting] = useState(false);
const [uploadingImage, setUploadingImage] = useState(false);
const [loadingProduct, setLoadingProduct] = useState(false);
const [error, setError] = useState("");

// Load categories
useEffect(() => {
let cancelled = false;

async function loadCategories() {
  try {
    const res = await axiosClient.get("/categories");

    if (!cancelled) {
      setCategories(res.data.categories || []);
    }
  } catch (err) {
    console.error("Category fetch error:", err);

    if (!cancelled) {
      show("Categories load nahi ho payi.", "error");
    }
  }
}

loadCategories();

return () => {
  cancelled = true;
};

}, []);

// Load existing product while editing
useEffect(() => {
if (!isEdit) {
setForm({ ...emptyForm });
return;
}

let cancelled = false;

async function loadProduct() {
  setLoadingProduct(true);
  setError("");

  try {
    const res = await axiosClient.get(`/products/${id}`);
    const p = res.data?.product;

    if (!p) {
      throw new Error("Product data response mein nahi mila.");
    }

    if (cancelled) return;

    setForm({
      ...emptyForm,
      name: p.name ?? "",
      brand: p.brand ?? "Generic",
      description:
        typeof p.description === "string"
          ? p.description
          : "",
      category:
        typeof p.category === "object"
          ? p.category?._id ?? ""
          : p.category ?? "",
      price: p.price ?? "",
      mrp: p.mrp ?? "",
      unit: p.unit ?? "",
      stock: p.stock ?? "",
      imageUrl: p.imageUrl ?? "",
      isActive: p.isActive ?? true,
      isFeatured: p.isFeatured ?? false,
      isBestSeller: p.isBestSeller ?? false,
    });
  } catch (err) {
    console.error("Product fetch error:", err);

    if (!cancelled) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Product load nahi ho paya.";

      setError(message);
      show(message, "error");
    }
  } finally {
    if (!cancelled) {
      setLoadingProduct(false);
    }
  }
}

loadProduct();

return () => {
  cancelled = true;
};

}, [id, isEdit]);

function update(field, value) {
setForm((prev) => ({
...prev,
[field]: value,
}));
}

// Select category and use its image if product has no image
function handleCategoryChange(e) {
const selectedId = e.target.value;

const selectedCategory = categories.find(
  (category) => category._id === selectedId,
);

setForm((prev) => ({
  ...prev,
  category: selectedId,
  imageUrl:
    prev.imageUrl || selectedCategory?.imageUrl || "",
}));

}

// Upload product image
async function handleImageUpload(e) {
const input = e.target;
const file = input.files?.[0];

if (!file) return;

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

if (!allowedTypes.includes(file.type)) {
  show("Sirf JPG, PNG ya WEBP image upload karein.", "error");
  input.value = "";
  return;
}

if (file.size > 5 * 1024 * 1024) {
  show("Image size 5 MB se kam honi chahiye.", "error");
  input.value = "";
  return;
}

setUploadingImage(true);
setError("");

try {
  const formData = new FormData();

  formData.append("image", file);

  if (form.name.trim()) {
    formData.append("name", form.name.trim());
  }

  const res = await axiosClient.post("/upload", formData);

  const imageUrl = res.data?.imageUrl;

  if (!imageUrl) {
    throw new Error(
      "Upload response mein imageUrl nahi mila.",
    );
  }

  update("imageUrl", imageUrl);
  show("Product image uploaded successfully.");
} catch (err) {
  console.error("Image upload error:", err);

  show(
    err.response?.data?.error ||
      err.response?.data?.message ||
      err.message ||
      "Image upload failed.",
    "error",
  );
} finally {
  setUploadingImage(false);
  input.value = "";
}

}

// Remove selected image URL
function removeImage() {
update("imageUrl", "");
}

// Create or update product
async function handleSubmit(e) {
e.preventDefault();

setError("");

if (isEdit && loadingProduct) {
  show("Product data load hone ka wait karein.", "error");
  return;
}

if (uploadingImage) {
  show("Image upload hone ka wait karein.", "error");
  return;
}

const price = Number(form.price);
const mrp = Number(form.mrp);
const stock = Number(form.stock);

if (
  form.price === "" ||
  form.mrp === "" ||
  form.stock === "" ||
  !Number.isFinite(price) ||
  !Number.isFinite(mrp) ||
  !Number.isFinite(stock) ||
  price < 0 ||
  mrp < 0 ||
  stock < 0
) {
  setError("Price, MRP aur stock ki valid values bharein.");
  return;
}

if (!form.name.trim()) {
  setError("Product name zaroori hai.");
  return;
}

if (!form.category) {
  setError("Product category select karein.");
  return;
}

setSubmitting(true);

try {
  const payload = {
    ...form,
    name: form.name.trim(),
    price,
    mrp,
    stock,
  };

  if (isEdit) {
    await axiosClient.put(`/products/${id}`, payload);
    show("Product updated successfully.");
  } else {
    await axiosClient.post("/products", payload);
    show("Product created successfully.");
  }

  navigate("/admin/products");
} catch (err) {
  console.error("Product save error:", err);

  const message =
    err.response?.data?.error ||
    err.response?.data?.message ||
    "Could not save product.";

  setError(message);
  show(message, "error");
} finally {
  setSubmitting(false);
}

}

return (
<div className="max-w-xl">
<h1 className="text-xl font-bold text-ink-900 mb-6">
{isEdit ? "Edit Product" : "Add Product"}
</h1>

  {loadingProduct ? (
    <p className="text-sm text-ink-500 mb-4">
      Loading existing product data...
    </p>
  ) : null}

  <form
    onSubmit={handleSubmit}
    className="flex flex-col gap-4"
  >
    {/* Product Name */}
    <div>
      <label className="block text-xs text-ink-500 mb-1.5">
        Name
      </label>

      <input
        value={form.name}
        onChange={(e) => update("name", e.target.value)}
        required
        disabled={loadingProduct || submitting}
        className="w-full px-4 py-2.5 rounded-lg border border-ink-300/60 text-sm"
      />
    </div>

    {/* Brand */}
    <div>
      <label className="block text-xs text-ink-500 mb-1.5">
        Brand
      </label>

      <input
        value={form.brand}
        onChange={(e) => update("brand", e.target.value)}
        className="w-full px-4 py-2.5 rounded-lg border border-ink-300/60 text-sm"
      />
    </div>

    {/* Category */}
    <div>
      <label className="block text-xs text-ink-500 mb-1.5">
        Category
      </label>

      <select
        value={form.category}
        onChange={handleCategoryChange}
        required
        disabled={loadingProduct || submitting}
        className="w-full px-4 py-2.5 rounded-lg border border-ink-300/60 text-sm"
      >
        <option value="">Select category</option>

        {categories.map((category) => (
          <option
            key={category._id}
            value={category._id}
          >
            {category.name}
          </option>
        ))}
      </select>
    </div>

    {/* Price and MRP */}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-xs text-ink-500 mb-1.5">
          Price (₹)
        </label>

        <input
          type="number"
          min="0"
          step="0.01"
          value={form.price}
          onChange={(e) => update("price", e.target.value)}
          required
          disabled={loadingProduct || submitting}
          className="w-full px-4 py-2.5 rounded-lg border border-ink-300/60 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs text-ink-500 mb-1.5">
          MRP (₹)
        </label>

        <input
          type="number"
          min="0"
          step="0.01"
          value={form.mrp}
          onChange={(e) => update("mrp", e.target.value)}
          required
          disabled={loadingProduct || submitting}
          className="w-full px-4 py-2.5 rounded-lg border border-ink-300/60 text-sm"
        />
      </div>
    </div>

    {/* Unit and Stock */}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-xs text-ink-500 mb-1.5">
          Unit (e.g. 1 kg)
        </label>

        <input
          value={form.unit}
          onChange={(e) => update("unit", e.target.value)}
          required
          disabled={loadingProduct || submitting}
          className="w-full px-4 py-2.5 rounded-lg border border-ink-300/60 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs text-ink-500 mb-1.5">
          Stock
        </label>

        <input
          type="number"
          min="0"
          step="1"
          value={form.stock}
          onChange={(e) => update("stock", e.target.value)}
          required
          disabled={loadingProduct || submitting}
          className="w-full px-4 py-2.5 rounded-lg border border-ink-300/60 text-sm"
        />
      </div>
    </div>

    {/* Description */}
    <div>
      <label className="block text-xs text-ink-500 mb-1.5">
        Description
      </label>

      <textarea
        value={form.description}
        onChange={(e) =>
          update("description", e.target.value)
        }
        rows={3}
        disabled={loadingProduct || submitting}
        className="w-full px-4 py-2.5 rounded-lg border border-ink-300/60 text-sm"
      />
    </div>

    {/* Product Image Upload and Preview */}
    <div>
      <label className="block text-xs text-ink-500 mb-1.5">
        Product Image
      </label>

      <p className="text-xs text-ink-500 mb-3">
        Category select karne par uski image default ho sakti
        hai. Aap apni product image bhi upload kar sakte hain.
        JPG, PNG ya WEBP; maximum 5 MB.
      </p>

      <div className="flex items-start gap-4">
        {form.imageUrl ? (
          <img
            src={form.imageUrl}
            alt="Product preview"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                "/images/products/placeholder.jpg";
            }}
            className="w-24 h-24 object-cover rounded-lg border border-ink-300/60"
          />
        ) : (
          <div className="w-24 h-24 rounded-lg border border-dashed border-ink-300/60 flex items-center justify-center text-ink-500 text-xs text-center p-2">
            No image selected
          </div>
        )}

        <div className="flex flex-col gap-2 min-w-0">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageUpload}
            disabled={
              uploadingImage ||
              loadingProduct ||
              submitting
            }
            className="w-full text-sm"
          />

          {uploadingImage && (
            <p className="text-xs text-ink-500">
              Uploading image...
            </p>
          )}

          {form.imageUrl && (
            <button
              type="button"
              onClick={removeImage}
              disabled={uploadingImage || submitting}
              className="text-sm text-red-600 text-left hover:underline"
            >
              Remove image
            </button>
          )}
        </div>
      </div>
    </div>

    {/* Product Status */}
    <div className="flex flex-wrap gap-6">
      <label className="flex items-center gap-2 text-sm text-ink-700">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) =>
            update("isActive", e.target.checked)
          }
          disabled={loadingProduct || submitting}
        />
        Active
      </label>

      <label className="flex items-center gap-2 text-sm text-ink-700">
        <input
          type="checkbox"
          checked={form.isFeatured}
          onChange={(e) =>
            update("isFeatured", e.target.checked)
          }
          disabled={loadingProduct || submitting}
        />
        Featured
      </label>

      <label className="flex items-center gap-2 text-sm text-ink-700">
        <input
          type="checkbox"
          checked={form.isBestSeller}
          onChange={(e) =>
            update("isBestSeller", e.target.checked)
          }
          disabled={loadingProduct || submitting}
        />
        Best Seller
      </label>
    </div>

    {/* Error */}
    {error && (
      <p className="text-sm text-danger" role="alert">
        {error}
      </p>
    )}

    {/* Submit */}
    <Button
      type="submit"
      disabled={
        submitting ||
        uploadingImage ||
        loadingProduct
      }
    >
      {uploadingImage
        ? "Uploading Image..."
        : submitting
          ? "Saving..."
          : loadingProduct
            ? "Loading Product..."
            : isEdit
              ? "Update Product"
              : "Create Product"}
    </Button>
  </form>
</div>

);
}

export default ProductForm;
