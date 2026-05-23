import { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import './ProductsPage.css';

const initialFormData = {
  name: '',
  description: '',
  brand: '',
  category: '',
  sub_category: '',
  price: '',
  stock: '',
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [togglingId, setTogglingId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [formData, setFormData] = useState(initialFormData);
  const [productId, setProductId] = useState(null);
  const [images, setImages] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async (search = '') => {
    setLoading(true);
    setError(null);
    try {
      const queryString = search ? `?search=${encodeURIComponent(search)}&page=0&size=100&sort=name,asc` : '?page=0&size=100&sort=name,asc';
      const response = await api.get(`/product${queryString}`);
      setProducts(response.content || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadProducts(searchQuery);
  };

  const handleToggleStatus = async (shareCode, currentActive) => {
    try {
      setTogglingId(shareCode);
      if (currentActive) {
        await api.patch(`/product/${shareCode}/deactivate`);
      } else {
        await api.patch(`/product/${shareCode}/activate`);
      }
      loadProducts(searchQuery);
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setTogglingId(null);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setFormData(initialFormData);
    setProductId(null);
    setImages(null);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setModalMode('edit');
    setFormData({
      name: product.name || '',
      description: product.description || '',
      brand: product.brand?.name || '',
      category: product.category?.name || '',
      sub_category: product.sub_category?.name || '',
      price: product.price?.toString() || '',
      stock: product.stock?.toString() || '',
    });
    setProductId(product.id);
    setImages(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData(initialFormData);
    setProductId(null);
    setImages(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        brand: formData.brand,
        category: formData.category,
        sub_category: formData.sub_category,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      };

      if (modalMode === 'create') {
        if (!images || images.length === 0) {
          alert('Por favor selecciona al menos una imagen');
          setSubmitting(false);
          return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('data', JSON.stringify(payload));
        for (let i = 0; i < images.length; i++) {
          formDataToSend.append('images', images[i]);
        }

        await api.postFormData('/product', formDataToSend);
        alert('Producto creado exitosamente');
      } else {
        await api.patch(`/product/${productId}`, payload);
        alert('Producto actualizado exitosamente');
      }

      closeModal();
      loadProducts(searchQuery);
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Gestión de Productos</h1>
      </div>

      <div className="search-bar">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">Buscar</button>
        </form>
        <button className="create-btn" onClick={openCreateModal}>
          + Crear producto
        </button>
      </div>

      {loading && <div className="loading">Cargando productos...</div>}

      {error && <div className="error">Error: {error}</div>}

      {!loading && !error && (
        <div className="products-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Marca</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data">No hay productos disponibles</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.brand?.name || '-'}</td>
                    <td>S/{product.price?.toFixed(2) || '0.00'}</td>
                    <td>{product.stock}</td>
                    <td>
                      <span className={`status-badge ${product.active ? 'active' : 'inactive'}`}>
                        {product.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="actions">
                      <button
                        className={`action-btn ${product.active ? 'deactivate' : 'activate'}`}
                        onClick={() => handleToggleStatus(product.share_code, product.active)}
                        disabled={togglingId === product.share_code}
                      >
                        {togglingId === product.share_code ? '...' : product.active ? 'Desactivar' : 'Activar'}
                      </button>
                      <button
                        className="action-btn edit"
                        onClick={() => openEditModal(product)}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalMode === 'create' ? 'Crear Producto' : 'Editar Producto'}</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="product-form">
              {modalMode === 'edit' && (
                <div className="form-group">
                  <label>ID</label>
                  <input
                    type="text"
                    value={productId}
                    disabled
                    className="form-input disabled"
                  />
                </div>
              )}

              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  className="form-input"
                  placeholder="Nombre del producto"
                />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  className="form-input"
                  placeholder="Descripción del producto"
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Marca *</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleFormChange}
                    required
                    className="form-input"
                    placeholder="Marca"
                  />
                </div>

                <div className="form-group">
                  <label>Categoría *</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    required
                    className="form-input"
                    placeholder="Categoría"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Subcategoría *</label>
                <input
                  type="text"
                  name="sub_category"
                  value={formData.sub_category}
                  onChange={handleFormChange}
                  required
                  className="form-input"
                  placeholder="Subcategoría"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Precio *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    required
                    min="0"
                    step="0.01"
                    className="form-input"
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group">
                  <label>Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleFormChange}
                    required
                    min="0"
                    className="form-input"
                    placeholder="0"
                  />
                </div>
              </div>

              {modalMode === 'create' && (
                <div className="form-group">
                  <label>Imágenes *</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    multiple
                    accept="image/*"
                    className="form-input file-input"
                  />
                  {images && (
                    <span className="file-count">{images.length} imagen(es) seleccionada(s)</span>
                  )}
                </div>
              )}

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-submit" disabled={submitting}>
                  {submitting ? 'Guardando...' : modalMode === 'create' ? 'Crear' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}