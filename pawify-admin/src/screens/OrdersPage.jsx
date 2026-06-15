import { useState, useCallback, useRef, useEffect } from 'react';
import { getAdminOrderByTrackingCode, updateOrderStatus } from '../services/orderService';
import Button from '../components/Button';
import Alert from '../components/Alert';
import './OrdersPage.css';

const STATUS_LABELS = {
  PENDING: 'Pendiente',
  PAID: 'Pagado',
  FAILED: 'Fallado',
  CANCELED: 'Cancelado',
  IN_TRANSIT: 'En tránsito',
  DELIVERED: 'Entregado'
};

function CopyCode({ code }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  const handleCopy = useCallback((e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1500);
    });
  }, [code]);

  return (
    <span className="copy-code" onClick={handleCopy} title="Copiar tracking code">
      <span className="ot-code">{code}</span>
      <span className="copy-icon">{copied ? '✓' : '⎘'}</span>
    </span>
  );
}

function OrderDetail({ trackingCode, onBack, onStatusUpdate }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [statusError, setStatusError] = useState(null);
  const [confirmChange, setConfirmChange] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getAdminOrderByTrackingCode(trackingCode)
      .then(setOrder)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [trackingCode]);

  const handleStatusChange = useCallback(async () => {
    if (!newStatus) return;

    const isRevert = order.shipping_status === 'DELIVERED' && newStatus !== 'DELIVERED';
    if (isRevert && !confirmChange) {
      setStatusError('Confirma el cambio para continuar');
      return;
    }

    setSaving(true);
    setStatusMessage(null);
    setStatusError(null);

    try {
      const updated = await updateOrderStatus(trackingCode, newStatus);
      setOrder(updated);
      setStatusMessage(`Estado actualizado a "${STATUS_LABELS[newStatus] || newStatus}"`);
      setNewStatus('');
      setConfirmChange(false);
      if (onStatusUpdate) onStatusUpdate(trackingCode, newStatus);
    } catch (err) {
      setStatusError(err.message || 'Error al actualizar el estado');
    } finally {
      setSaving(false);
    }
  }, [trackingCode, newStatus, onStatusUpdate, order, confirmChange]);

  if (loading) return <p className="list-empty">Cargando detalle del pedido...</p>;
  if (error) return <><Alert type="error">{error}</Alert><Button variant="secondary" onClick={onBack}>Volver</Button></>;
  if (!order) return <><Alert type="error">Pedido no encontrado</Alert><Button variant="secondary" onClick={onBack}>Volver</Button></>;

  return (
    <div className="order-detail">
      <div className="detail-header">
        <Button variant="secondary" onClick={onBack} className="btn-back">← Volver</Button>
        <h2>Pedido {order.tracking_code}</h2>
      </div>

      <div className="detail-card">
        <h3>Información del pedido</h3>
        <div className="detail-info">
          <div className="detail-tracking"><span>Tracking Code:</span> <CopyCode code={order.tracking_code} /></div>
          <div><span>Comprador:</span> {order.buyer?.first_name} {order.buyer?.last_name} ({order.buyer?.username})</div>
          <div><span>Total:</span> S/ {order.total_price?.toFixed(2)}</div>
          <div><span>Fecha:</span> {new Date(order.order_at).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
          <div><span>Estado del pago:</span> <span className={`status-badge status-${order.order_status?.toLowerCase()}`}>{STATUS_LABELS[order.order_status] || order.order_status}</span></div>
          <div><span>Estado de envío:</span> <span className={`status-badge status-${order.shipping_status?.toLowerCase()}`}>{STATUS_LABELS[order.shipping_status] || order.shipping_status}</span></div>
        </div>
      </div>

      <div className="detail-card">
        <h3>Productos</h3>
        {order.details && order.details.length > 0 ? (
          <div className="detail-table">
            <div className="dt-header">
              <span>Producto</span>
              <span>Cantidad</span>
              <span>Precio</span>
              <span>Total</span>
            </div>
            {order.details.map((d) => (
              <div key={d.id} className="dt-row">
                <span className="dt-product">
                  {d.product_image && <img src={d.product_image} alt={d.product_name} className="dt-thumb" />}
                  {d.product_name}
                </span>
                <span>{d.quantity}</span>
                <span>S/ {d.price?.toFixed(2)}</span>
                <span>S/ {d.total?.toFixed(2)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="list-empty">Sin productos</p>
        )}
      </div>

      <div className="detail-card">
        <h3>Cambiar estado de envío</h3>
        <Alert type="success">{statusMessage}</Alert>
        <Alert type="error">{statusError}</Alert>
        <div className="status-change">
          <select
            value={newStatus}
            onChange={(e) => { setNewStatus(e.target.value); setConfirmChange(false); }}
            className="status-select"
          >
            <option value="">Seleccionar estado...</option>
            {['IN_TRANSIT', 'DELIVERED'].map((s) => (
              <option key={s} value={s} disabled={order.shipping_status === s}>{STATUS_LABELS[s] || s}</option>
            ))}
          </select>
          <Button onClick={handleStatusChange} loading={saving ? 'Actualizando...' : false} disabled={!newStatus}>
            Actualizar estado
          </Button>
        </div>
        {newStatus && order.shipping_status === 'DELIVERED' && newStatus !== 'DELIVERED' && (
          <div className="status-warning">
            <p>Estás revirtiendo un pedido que ya fue marcado como <strong>Entregado</strong>.</p>
            <label className="confirm-label">
              <input type="checkbox" checked={confirmChange} onChange={(e) => setConfirmChange(e.target.checked)} />
              Entiendo la acción y quiero continuar
            </label>
          </div>
        )}
      </div>

      {order.trackings && order.trackings.length > 0 && (
        <div className="detail-card">
          <h3>Historial de cambios</h3>
          <div className="tracking-list">
            {[...order.trackings].reverse().map((t) => (
              <div key={t.id} className="tracking-item">
                <div className="tracking-dot" />
                <div className="tracking-content">
                  <span className="tracking-title">{STATUS_LABELS[t.title] || t.title}</span>
                  {t.description && <span className="tracking-desc">{t.description}</span>}
                  <span className="tracking-date">{new Date(t.timestamp).toLocaleString('es-PE')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const [searchCode, setSearchCode] = useState('');
  const [selectedTracking, setSelectedTracking] = useState(null);
  const [searchError, setSearchError] = useState(null);
  const [searching, setSearching] = useState(false);

  const handleSearch = useCallback(async (e) => {
    e?.preventDefault();
    const code = searchCode.trim();
    if (!code) return;

    setSearching(true);
    setSearchError(null);
    try {
      await getAdminOrderByTrackingCode(code);
      setSelectedTracking(code);
    } catch {
      setSearchError(`No se encontró un pedido con el código "${code}"`);
    } finally {
      setSearching(false);
    }
  }, [searchCode]);

  const handleBack = useCallback(() => {
    setSelectedTracking(null);
    setSearchError(null);
    setSearchCode('');
  }, []);

  if (selectedTracking) {
    return (
      <div className="orders-page">
        <OrderDetail trackingCode={selectedTracking} onBack={handleBack} />
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1>Gestión de Pedidos</h1>

      <div className="search-section">
        <p className="search-hint">Ingresa el código de tracking del pedido para consultarlo.</p>
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            placeholder="Ej: hce30e7pqcuaf0n6"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            autoFocus
          />
          <Button type="submit" loading={searching ? 'Buscando...' : false}>Buscar pedido</Button>
        </form>
        <Alert type="error">{searchError}</Alert>
      </div>
    </div>
  );
}
