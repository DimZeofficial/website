import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Sun, 
  Moon, 
  Search, 
  Trash2, 
  Plus, 
  Minus, 
  Check, 
  X, 
  Lock, 
  Layers, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  ChevronLeft,
  ShieldCheck,
  Tag,
  FileText,
  Maximize2,
  AlertCircle
} from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';
import CookieConsent from './components/CookieConsent.jsx';
import PrivacyPolicy from './components/PrivacyPolicy.jsx';
import './App.css';

// Product Catalog
const PRODUCTS = [
  {
    id: 1,
    name: 'Poker Chips Fidget',
    category: 'Mechanical',
    price: 2.00,
    desc: 'Stackable poker chip fidget toy with a satisfying click action between each chip. A portable desk toy you can fidget with one-handed.',
    material: 'PLA',
    printTime: '2h 24m',
    image: '/poker_chips.png',
    images: ['/poker_chips.png'],
    specs: {
      layerHeight: '0.20 mm',
      infill: '100% Cubic',
      weight: '34 grams',
      dimensions: '60 x 60 x 12 mm',
      strength: 'Medium',
      finish: 'Matte, smooth click'
    },
    partColors: [
      { name: 'Red', code: '#DC2626' },
      { name: 'Green', code: '#16A34A' },
      { name: 'Blue', code: '#2563EB' },
      { name: 'Yellow', code: '#EAB308' }
    ],
    outerColors: [
      { name: 'White', code: '#FFFFFF' },
      { name: 'Black', code: '#1a1a1a' }
    ]
  },
  {
    id: 2,
    name: 'Spiral Fidget',
    category: 'Mechanical',
    price: 3.00,
    desc: 'Two-piece print-in-place spiral fidget toy. Smooth rotating action between the top and bottom sections. Choose your own top and bottom colour combo.',
    material: 'PLA',
    printTime: '1h 12m',
    image: '/spiral_full.png',
    images: ['/spiral_full.png', '/spiral_upside.png', '/spiral_parts.png'],
    specs: {
      layerHeight: '0.20 mm',
      infill: '0%',
      weight: '14 grams',
      dimensions: '55 x 55 x 40 mm',
      strength: 'Medium',
      finish: 'Matte, smooth rotation'
    },
    partColors: [
      { name: 'Red', code: '#DC2626' },
      { name: 'Green', code: '#16A34A' },
      { name: 'Blue', code: '#2563EB' },
      { name: 'Yellow', code: '#EAB308' },
      { name: 'Black', code: '#1a1a1a' }
    ]
  },
  {
    id: 3,
    name: 'Hexagon Fidget',
    category: 'Mechanical',
    price: 1.50,
    desc: 'Six-sided spin-and-click fidget with a satisfying tactile rotation. Choose your colour and add a handle for extra grip.',
    material: 'PLA',
    printTime: '17 mins',
    printTimeWithHandle: '40 mins',
    image: '/hex_flat.png',
    images: ['/hex_flat.png', '/hex_full.png'],
    specs: {
      layerHeight: '0.20 mm',
      infill: '100%',
      weight: '5 grams',
      dimensions: '50 x 50 x 18 mm',
      strength: 'Medium',
      finish: 'Matte, smooth click'
    },
    specsWithHandle: {
      layerHeight: '0.20 mm',
      infill: '15% Gyroid',
      weight: '13 grams',
      dimensions: '50 x 50 x 18 mm',
      strength: 'Medium',
      finish: 'Matte, smooth click'
    },
    colors: [
      { name: 'Red', code: '#DC2626' },
      { name: 'Green', code: '#16A34A' },
      { name: 'Blue', code: '#2563EB' },
      { name: 'Yellow', code: '#EAB308' },
      { name: 'Black', code: '#1a1a1a' },
      { name: 'White', code: '#FFFFFF' }
    ],
    addonOptions: [
      { id: 'handle', label: 'Add Handle', price: 0.50, desc: 'Ergonomic grip handle attachment' }
    ]
  }
];

// Available Coupons
const COUPONS = {
  'PRINT10': { code: 'PRINT10', type: 'percent', value: 10, label: '10% OFF prints' },
  'SILVER20': { code: 'SILVER20', type: 'percent', value: 20, label: '20% OFF (Silver Tier)' },
  'FREESHIP': { code: 'FREESHIP', type: 'shipping', value: 4.99, label: 'Free Shipping' }
};


const loadFromStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

function App() {
  // Theme State
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  
  // Navigation Routing States
  const [currentView, setCurrentView] = useState('catalog'); // 'catalog' | 'product-detail'
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [activeFooterModal, setActiveFooterModal] = useState(null); // null | 'filament' | 'sizing' | 'terms' | 'contact'
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  
  // Skeleton Loader State
  const [isPageLoading, setIsPageLoading] = useState(false);
  
  // Cart State
  const [cart, setCart] = useState(() => loadFromStorage('cart', []));
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Selected configuration on details page
  const [detailsColor, setDetailsColor] = useState(null);
  const [topColor, setTopColor] = useState(null);
  const [bottomColor, setBottomColor] = useState(null);
  const [handleSelected, setHandleSelected] = useState(false);
  const [selectedDetailImage, setSelectedDetailImage] = useState(0);
  
  // Track which product has the active "Get" button expanded on the catalog grid
  const [activeGetProductId, setActiveGetProductId] = useState(null);
  
  // Coupon State
  const [promoInput, setPromoInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [promoFeedback, setPromoFeedback] = useState({ message: '', type: '' });
  
  // Checkout State
  const [checkoutStep, setCheckoutStep] = useState('cart');
  const [checkoutForm, setCheckoutForm] = useState(() => {
    const saved = loadFromStorage('savedCheckoutInfo', null);
    return saved || {
      email: '',
      birthdate: '',
      fullName: '',
      phone: '',
      address: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvv: ''
    };
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  // Toasts State
  const [toasts, setToasts] = useState([]);
  
  // Cookie Consent State
  const [cookieConsent, setCookieConsent] = useState(() => localStorage.getItem('cookie_consent_v1'));
  const [showCookieBanner, setShowCookieBanner] = useState(() => !localStorage.getItem('cookie_consent_v1'));
  
  // Contact Form State
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactStatus, setContactStatus] = useState(null);


  // Search placeholders rotation
  const placeholders = [
    'fidgets, toys, games...', // Hint example requested by user
    'vases, gears, stands...',
    'carbon fiber, PLA filaments...',
    'custom mechanical brackets...'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Sync theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Navigate from URL path
  const navigateFromPath = (path) => {
    setIsPageLoading(true);
    setIsCartOpen(false);

    if (path === '/cart') {
      setIsCartOpen(true);
      setCheckoutStep('cart');
      setCurrentView('catalog');
      setSelectedProductId(null);
      setIsPageLoading(false);
      return;
    }

    if (path === '/checkout') {
      setIsCartOpen(true);
      setCheckoutStep('checkout');
      setCurrentView('catalog');
      setSelectedProductId(null);
      setIsPageLoading(false);
      return;
    }

    if (path === '/contact') {
      setCurrentView('contact');
      setSelectedProductId(null);
      setIsPageLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (path === '/privacy-policy') {
      setCurrentView('privacy-policy');
      setSelectedProductId(null);
      setIsPageLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const productMatch = path.match(/^\/product\/(\d+)$/);
    if (productMatch) {
      const pid = parseInt(productMatch[1]);
      setCurrentView('product-detail');
      setSelectedProductId(pid);
      setSelectedDetailImage(0);
      const prod = PRODUCTS.find((p) => p.id === pid);
      setHandleSelected(false);
      if (prod && prod.partColors && prod.partColors.length > 0) {
        setTopColor(prod.partColors[0]);
        setBottomColor(prod.outerColors ? prod.outerColors[0] : prod.partColors[0]);
        setDetailsColor(null);
      } else if (prod && prod.colors && prod.colors.length > 0) {
        setDetailsColor(prod.colors[0]);
        setTopColor(null);
        setBottomColor(null);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setIsPageLoading(false), 600);
      return;
    }

    setCurrentView('catalog');
    setSelectedProductId(null);
    setIsPageLoading(false);
  };

  // Initialize from URL
  useEffect(() => {
    navigateFromPath(window.location.pathname);
  }, []);

  // Listen for browser back/forward
  useEffect(() => {
    const onPop = () => navigateFromPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Trigger simulated page loading skeletons when page views change
  const navigateTo = (view, productId = null) => {
    setIsPageLoading(true);
    setCurrentView(view);
    setSelectedProductId(productId);
    setSelectedDetailImage(0);
    
    // Update URL
    let url;
    if (view === 'product-detail' && productId) {
      url = `/product/${productId}`;
    } else if (view === 'contact') {
      url = '/contact';
    } else if (view === 'privacy-policy') {
      url = '/privacy-policy';
    } else {
      url = '/';
    }
    window.history.pushState({}, '', url);
    
    // Set default color when entering details page
    if (view === 'product-detail' && productId) {
      const prod = PRODUCTS.find((p) => p.id === productId);
      setHandleSelected(false);
      if (prod && prod.partColors && prod.partColors.length > 0) {
        setTopColor(prod.partColors[0]);
        setBottomColor(prod.outerColors ? prod.outerColors[0] : prod.partColors[0]);
        setDetailsColor(null);
      } else if (prod && prod.colors && prod.colors.length > 0) {
        setDetailsColor(prod.colors[0]);
        setTopColor(null);
        setBottomColor(null);
      }
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setTimeout(() => {
      setIsPageLoading(false);
    }, 600); // 600ms page loading duration
  };

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Trigger brief skeleton loading on search and filters
  useEffect(() => {
    if (currentView === 'catalog') {
      setIsPageLoading(true);
      const timer = setTimeout(() => {
        setIsPageLoading(false);
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [selectedCategory, searchQuery]);

  const addToast = (text) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    addToast(`Switched to ${theme === 'light' ? 'Dark' : 'Light'} mode`);
  };

  // Cart operations
  const addToCart = (product, customColor = null, addons = {}) => {
    const colorName = customColor ? customColor.name : (product.colors ? product.colors[0].name : 'Default');
    setCart((prevCart) => {
      const existing = prevCart.find(
        (item) => item.product.id === product.id && item.color === colorName && item.addons?.handle === addons.handle
      );
      if (existing) {
        return prevCart.map((item) => 
          item.product.id === product.id && item.color === colorName && item.addons?.handle === addons.handle
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1, color: colorName, addons }];
    });
    const addonLabel = addons.handle ? ' + Handle' : '';
    addToast(`Added ${product.name} (${colorName}${addonLabel}) to cart`);
  };

  const updateQuantity = (item, amount) => {
    setCart((prevCart) => {
      return prevCart.map((ci) => {
        if (ci.product.id === item.product.id && ci.color === item.color && ci.addons?.handle === item.addons?.handle) {
          const newQty = ci.quantity + amount;
          return newQty > 0 ? { ...ci, quantity: newQty } : null;
        }
        return ci;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (item) => {
    setCart((prevCart) => prevCart.filter((ci) => !(ci.product.id === item.product.id && ci.color === item.color && ci.addons?.handle === item.addons?.handle)));
    addToast(`Removed ${item.product.name} (${item.color}${item.addons?.handle ? ' + Handle' : ''}) from cart`);
  };

  // Coupons
  const applyPromo = () => {
    const cleanCode = promoInput.trim().toUpperCase();
    if (!cleanCode) return;
    
    if (COUPONS[cleanCode]) {
      setAppliedCoupon(COUPONS[cleanCode]);
      setPromoFeedback({
        message: `Success! ${COUPONS[cleanCode].label} applied.`,
        type: 'success'
      });
      addToast(`Coupon "${cleanCode}" applied successfully`);
    } else {
      setPromoFeedback({
        message: 'Invalid discount code.',
        type: 'error'
      });
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setPromoFeedback({ message: '', type: '' });
    setPromoInput('');
    addToast('Coupon code removed');
  };

  // Contact Form Submission (rate-limited proxy)
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactSubmitting(true);
    setContactStatus(null);

    const form = e.target;
    const data = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setContactStatus({ type: 'success', message: 'Message sent successfully! We will get back to you soon.' });
        form.reset();
      } else if (res.status === 429) {
        const err = await res.json();
        setContactStatus({ type: 'error', message: err.error });
      } else {
        setContactStatus({ type: 'error', message: 'Failed to send message. Please try again.' });
      }
    } catch {
      setContactStatus({ type: 'error', message: 'Network error. Please check your connection.' });
    } finally {
      setContactSubmitting(false);
    }
  };

  // Cookie Consent Handlers
  const handleCookieAccept = () => {
    localStorage.setItem('cookie_consent_v1', 'accepted');
    setCookieConsent('accepted');
    setShowCookieBanner(false);
  };

  const handleCookieReject = () => {
    localStorage.setItem('cookie_consent_v1', 'rejected');
    setCookieConsent('rejected');
    setShowCookieBanner(false);
  };

  const handleCookiePreferences = () => {
    localStorage.removeItem('cookie_consent_v1');
    setCookieConsent(null);
    setShowCookieBanner(true);
  };

  // Form Masking Helpers
  const maskBirthdate = (value) => {
    const clean = value.replace(/\D/g, '');
    if (clean.length === 0) return '';
    if (clean.length <= 2) return clean;
    if (clean.length <= 4) return `${clean.slice(0, 2)}/${clean.slice(2)}`;
    return `${clean.slice(0, 2)}/${clean.slice(2, 4)}/${clean.slice(4, 8)}`;
  };

  const maskPhone = (value) => {
    const clean = value.replace(/\D/g, '');
    if (clean.length === 0) return '';
    if (clean.length <= 3) return `(${clean}`;
    if (clean.length <= 6) return `(${clean.slice(0, 3)}) ${clean.slice(3)}`;
    return `(${clean.slice(0, 3)}) ${clean.slice(3, 6)}-${clean.slice(6, 10)}`;
  };

  const maskCardNumber = (value) => {
    const clean = value.replace(/\D/g, '');
    const parts = [];
    for (let i = 0; i < clean.length; i += 4) {
      parts.push(clean.slice(i, i + 4));
    }
    return parts.join('-').slice(0, 19);
  };

  const maskCardExpiry = (value) => {
    const clean = value.replace(/\D/g, '');
    if (clean.length === 0) return '';
    if (clean.length <= 2) return clean;
    return `${clean.slice(0, 2)}/${clean.slice(2, 4)}`;
  };

  const maskCVV = (value) => {
    return value.replace(/\D/g, '').slice(0, 3);
  };

  const handleInputChange = (field, masker) => (e) => {
    const rawVal = e.target.value;
    const formatted = masker ? masker(rawVal) : rawVal;
    setCheckoutForm((prev) => ({ ...prev, [field]: formatted }));
    
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Form Validation
  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!checkoutForm.email || !emailRegex.test(checkoutForm.email)) {
      errors.email = 'Enter a valid email address';
    }
    if (!checkoutForm.birthdate || checkoutForm.birthdate.length < 10) {
      errors.birthdate = 'Enter date in DD/MM/YYYY format';
    }
    if (!checkoutForm.fullName.trim()) {
      errors.fullName = 'Name is required';
    }
    if (!checkoutForm.phone || checkoutForm.phone.length < 14) {
      errors.phone = 'Phone number is incomplete';
    }
    if (!checkoutForm.address.trim()) {
      errors.address = 'Shipping address is required';
    }
    if (!checkoutForm.cardNumber || checkoutForm.cardNumber.length < 19) {
      errors.cardNumber = 'Card number is incomplete';
    }
    if (!checkoutForm.cardExpiry || checkoutForm.cardExpiry.length < 5) {
      errors.cardExpiry = 'Expiry is incomplete';
    }
    if (!checkoutForm.cardCvv || checkoutForm.cardCvv.length < 3) {
      errors.cardCvv = 'CVV is incomplete';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Pricing calculations
  const getItemPrice = (item) => {
    let price = item.product.price;
    if (item.addons?.handle) price += 0.50;
    return price;
  };
  const subtotal = cart.reduce((sum, item) => sum + (getItemPrice(item) * item.quantity), 0);
  
  let shippingFee = subtotal === 0 ? 0 : 4.99;
  let discountAmount = 0;

  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      discountAmount = subtotal * (appliedCoupon.value / 100);
    } else if (appliedCoupon.type === 'shipping') {
      shippingFee = 0;
      discountAmount = appliedCoupon.value;
    }
  }

  const grandTotal = Math.max(0, subtotal - (appliedCoupon?.type === 'percent' ? discountAmount : 0) + (appliedCoupon?.type === 'shipping' ? 0 : shippingFee));

  // Form Checkout Submission
  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      addToast('Please correct form errors');
      return;
    }

    setIsSubmittingOrder(true);
    setTimeout(() => {
      setIsSubmittingOrder(false);
      const orderId = `PLY-${Math.floor(100000 + Math.random() * 900000)}`;
      setCompletedOrder({
        orderId,
        itemsCount: cart.reduce((s, i) => s + i.quantity, 0),
        subtotal: subtotal.toFixed(2),
        discount: (appliedCoupon?.type === 'percent' ? discountAmount : 0).toFixed(2),
        shipping: (appliedCoupon?.type === 'shipping' ? 0 : shippingFee).toFixed(2),
        total: grandTotal.toFixed(2),
        shippingAddress: checkoutForm.address,
        billingName: checkoutForm.fullName
      });
      setCheckoutStep('success');
      setCart([]);
      setAppliedCoupon(null);
      setPromoInput('');
      setPromoFeedback({ message: '', type: '' });
      addToast('Order placed successfully!');
    }, 1500);
  };

  // Filter Catalog Items
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.material.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const displaySkeleton = isPageLoading;
  const currentProduct = PRODUCTS.find((p) => p.id === selectedProductId);
  const currentSpecs = handleSelected && currentProduct?.specsWithHandle ? currentProduct.specsWithHandle : currentProduct?.specs;
  const currentPrintTime = handleSelected && currentProduct?.printTimeWithHandle ? currentProduct.printTimeWithHandle : currentProduct?.printTime;

  return (
    <div className="app-container" onClick={() => setActiveGetProductId(null)}>
      {/* Toast Alerts */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast">
            <Sparkles size={16} />
            <span>{toast.text}</span>
          </div>
        ))}
      </div>

      {/* Navigation Header */}
      <header className="site-header">
        <div className="header-inner">
          <button 
            className="logo-section" 
            onClick={() => navigateTo('catalog')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}
          >
            <img src="/logo.png" alt="Ed's 3D Prints" className="site-logo" />
            <span className="logo-text">Ed's 3D Prints</span>
          </button>

          {/* Search bar with dynamic placeholders */}
          <div className="search-container">
            <Search className="search-icon-inside" size={16} />
            <input
              type="text"
              className="search-input"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (currentView !== 'catalog') {
                  navigateTo('catalog');
                }
              }}
              placeholder={placeholders[placeholderIndex]}
              aria-label="Search items"
            />
            {searchQuery && (
              <button 
                className="close-btn" 
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="header-actions">
            {/* Theme Toggle */}
            <button 
              className="action-btn" 
              onClick={handleToggleTheme}
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Cart drawer toggle */}
            <button 
              className="action-btn" 
              onClick={() => { window.history.pushState({}, '', '/cart'); setIsCartOpen(true); setCheckoutStep('cart'); }}
              aria-label="Open shopping cart"
              title="Open cart"
            >
              <ShoppingBag size={18} />
              {cart.length > 0 && (
                <span className="cart-badge">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      {currentView === 'privacy-policy' ? (
        <PrivacyPolicy onNavigate={navigateTo} />
      ) : currentView === 'contact' ? (
        <main className="contact-page">
          <h1 className="contact-page-title">Contact Support Desk</h1>
          <p className="contact-page-desc">Have custom STL files or need help with a bulk order? Leave a message and our technicians will assist you.</p>
          <form onSubmit={handleContactSubmit} className="contact-form">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input type="text" name="name" className="form-input" required placeholder="Your Name" />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" name="email" className="form-input" required placeholder="you@domain.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Message Requirements</label>
              <textarea name="message" className="form-input" rows={5} required placeholder="Include link to your CAD file, scaling desires, and material choice..." style={{ resize: 'vertical' }} />
            </div>
            <button type="submit" className="submit-order-btn" style={{ maxWidth: '320px' }} disabled={contactSubmitting}>
              {contactSubmitting ? 'Sending...' : 'Send Support Query'}
            </button>
            {contactStatus && (
              <div className={`contact-status ${contactStatus.type}`}>
                {contactStatus.message}
              </div>
            )}
          </form>
        </main>
      ) : currentView === 'catalog' ? (
        <>
          {/* Hero Banner (Catalog view only) */}
          <section className="hero-banner">
            <div className="hero-content">
              <p className="hero-subtitle">Custom 3D Prints</p>
              <h1 className="hero-title">Clean, simple and affordable 3D printed items.</h1>

            </div>
          </section>

          {/* Control Bar */}
          <div className="controls-bar">
            <nav className="category-filters" aria-label="Product categories">
              {['All', 'Mechanical'].map((cat) => (
                <button
                  key={cat}
                  className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </nav>


          </div>

          {/* Products Storefront Grid */}
          <main className="storefront-section">
            {displaySkeleton ? (
              <div className="product-grid" aria-label="Loading products">
                {[1, 2, 3, 4].map((n) => (
                  <article key={n} className="skeleton-card">
                    <div className="skeleton-image skeleton-shimmer"></div>
                    <div className="skeleton-category skeleton-shimmer"></div>
                    <div className="skeleton-title skeleton-shimmer"></div>
                    <div className="skeleton-desc skeleton-shimmer"></div>
                    <div className="skeleton-desc-2 skeleton-shimmer"></div>
                    <div className="skeleton-price skeleton-shimmer"></div>
                    <div className="skeleton-button skeleton-shimmer"></div>
                  </article>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="product-grid">
                {filteredProducts.map((product) => {
                  return (
                  <article key={product.id} className="product-card">
                    <div 
                      className="product-image-container" 
                      onClick={() => navigateTo('product-detail', product.id)}
                      style={{ cursor: 'pointer', position: 'relative' }}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-image"
                        loading="lazy"
                      />
                    </div>
                    
                    <div className="product-card-info">
                      <span className="product-category">{product.category}</span>
                      <h2 
                        className="product-title" 
                        onClick={() => navigateTo('product-detail', product.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        {product.name}
                      </h2>
                      
                      <div className="product-specs">
                        <span className="spec-item">
                          <Layers size={12} /> {product.material}
                        </span>
                        <span className="spec-item">
                          <Clock size={12} /> {product.printTime}
                        </span>
                      </div>

                      <p className="product-desc">{product.desc}</p>
                      
                      <div className="product-price-section">
                        <div className="price-row">
                          <span className="price-prefix">From</span>
                          <span className="product-price">£{product.price.toFixed(2)} GBP</span>
                        </div>
                        {product.originalPrice && (
                          <span className="product-original-price">£{product.originalPrice.toFixed(2)} GBP</span>
                        )}
                      </div>

                      {activeGetProductId !== product.id ? (
                        <button 
                          className="product-add-btn"
                          onClick={(e) => { e.stopPropagation(); setActiveGetProductId(product.id); }}
                        >
                          <span>Get</span>
                        </button>
                      ) : (
                        <div className="get-options-container">
                          <button 
                            className="get-option-btn buy-now"
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              addToCart(product); 
                              setIsCartOpen(true); 
                              setActiveGetProductId(null); 
                            }}
                          >
                            Buy Now
                          </button>
                          <button 
                            className="get-option-btn add-to-cart"
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              addToCart(product); 
                              setActiveGetProductId(null); 
                            }}
                          >
                            Add to Cart
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
                <p style={{ color: 'var(--text-secondary)' }}>No items found matching your filters.</p>
                <button 
                  className="filter-pill" 
                  onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                  style={{ marginTop: '1rem', display: 'inline-block' }}
                >
                  Reset Filters
                </button>
              </div>
            )}
          </main>
        </>
      ) : (
        /* INDIVIDUAL PRODUCT DETAILS PAGE VIEW */
        <main className="product-detail-container">
          <button className="back-to-store-btn" onClick={() => navigateTo('catalog')}>
            <ChevronLeft size={16} />
            <span>Back to Storefront</span>
          </button>

          {displaySkeleton ? (
            /* Product details skeleton loader style */
            <div className="skeleton-detail-layout">
              <div className="skeleton-detail-img skeleton-shimmer"></div>
              <div className="skeleton-detail-info">
                <div className="skeleton-category skeleton-shimmer" style={{ width: '20%' }}></div>
                <div className="skeleton-title skeleton-shimmer" style={{ width: '60%', height: '32px' }}></div>
                <div className="skeleton-desc skeleton-shimmer" style={{ height: '80px', marginTop: '1rem' }}></div>
                <div className="skeleton-price skeleton-shimmer" style={{ width: '35%', height: '24px' }}></div>
                <div className="skeleton-button skeleton-shimmer" style={{ height: '48px', width: '50%' }}></div>
              </div>
            </div>
          ) : currentProduct ? (
            <div className="product-detail-layout">
              {/* Product Image with arrows */}
              <div className="detail-gallery">
                <div className="detail-image-panel" style={{ position: 'relative' }}>
                  {currentProduct.outerColors && topColor && bottomColor ? (
                    <img 
                      key={`${topColor.name}-${bottomColor.name}`}
                      src={`/poker_chips_${topColor.name[0].toLowerCase()}${bottomColor.name === 'Black' ? '_b' : ''}.png`}
                      alt={`${currentProduct.name} - ${topColor.name}, ${bottomColor.name} outer`} 
                      className="detail-image" 
                    />
                  ) : (
                    <img 
                      key={selectedDetailImage}
                      src={(currentProduct.images || [currentProduct.image])[selectedDetailImage]} 
                      alt={currentProduct.name} 
                      className="detail-image" 
                    />
                  )}
                  {!currentProduct.outerColors && currentProduct.images && currentProduct.images.length > 1 && (
                    <>
                      <button 
                        className="gallery-arrow gallery-arrow-left"
                        onClick={() => setSelectedDetailImage((prev) => prev === 0 ? currentProduct.images.length - 1 : prev - 1)}
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button 
                        className="gallery-arrow gallery-arrow-right"
                        onClick={() => setSelectedDetailImage((prev) => prev === currentProduct.images.length - 1 ? 0 : prev + 1)}
                      >
                        <ChevronLeft size={20} style={{ transform: 'rotate(180deg)' }} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Product Info & Specifications details */}
              <div className="detail-info-panel">
                <div className="detail-header">
                  <span className="detail-category">{currentProduct.category}</span>
                  <h1 className="detail-title">{currentProduct.name}</h1>
                    <div className="detail-price-box">
                    <span className="detail-price">
                      £{(currentProduct.price + (handleSelected ? 0.50 : 0)).toFixed(2)} GBP
                    </span>
                    {currentProduct.addonOptions?.length > 0 && (
                      <span className="detail-original-price" style={{ fontWeight: 400, fontSize: '0.8rem' }}>
                        {handleSelected ? `Base £${currentProduct.price.toFixed(2)}` : `+£0.50 for handle`}
                      </span>
                    )}
                  </div>
                </div>

                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{currentProduct.desc}</p>

                {/* Top/Bottom Part Colour Pickers */}
                {currentProduct.partColors && !currentProduct.outerColors && (
                  <>
                    <div className="detail-options-group">
                      <span className="option-title">Top Part Colour</span>
                      <div className="color-dots-row">
                        {currentProduct.partColors.map((color, index) => (
                          <button
                            key={index}
                            className={`color-picker-dot ${topColor?.name === color.name ? 'active' : ''}`}
                            style={{ backgroundColor: color.code }}
                            onClick={() => setTopColor(color)}
                            title={color.name}
                          />
                        ))}
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Selected: <b>{topColor?.name}</b>
                      </span>
                    </div>

                    <div className="detail-options-group">
                      <span className="option-title">Bottom Part Colour</span>
                      <div className="color-dots-row">
                        {currentProduct.partColors.map((color, index) => (
                          <button
                            key={index}
                            className={`color-picker-dot ${bottomColor?.name === color.name ? 'active' : ''}`}
                            style={{ backgroundColor: color.code }}
                            onClick={() => setBottomColor(color)}
                            title={color.name}
                          />
                        ))}
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Selected: <b>{bottomColor?.name}</b>
                      </span>
                    </div>
                  </>
                )}

                {/* Inner/Outer Colour Pickers (Poker Chips) */}
                {currentProduct.partColors && currentProduct.outerColors && (
                  <>
                    <div className="detail-options-group">
                      <span className="option-title">Inner Colour</span>
                      <div className="color-dots-row">
                        {currentProduct.partColors.map((color, index) => (
                          <button
                            key={index}
                            className={`color-picker-dot ${topColor?.name === color.name ? 'active' : ''}`}
                            style={{ backgroundColor: color.code }}
                            onClick={() => setTopColor(color)}
                            title={color.name}
                          />
                        ))}
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Selected: <b>{topColor?.name}</b>
                      </span>
                    </div>

                    <div className="detail-options-group">
                      <span className="option-title">Outer Ring</span>
                      <div className="color-dots-row">
                        {currentProduct.outerColors.map((color, index) => (
                          <button
                            key={index}
                            className={`color-picker-dot ${bottomColor?.name === color.name ? 'active' : ''}`}
                            style={{ backgroundColor: color.code }}
                            onClick={() => setBottomColor(color)}
                            title={color.name}
                          />
                        ))}
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Selected: <b>{bottomColor?.name}</b>
                      </span>
                    </div>
                  </>
                )}

                {/* Single Colour Picker */}
                {currentProduct.colors && !currentProduct.partColors && (
                  <div className="detail-options-group">
                    <span className="option-title">Select Colorway</span>
                    <div className="color-dots-row">
                      {currentProduct.colors.map((color, index) => (
                        <button
                          key={index}
                          className={`color-picker-dot ${detailsColor?.name === color.name ? 'active' : ''}`}
                          style={{ backgroundColor: color.code }}
                          onClick={() => setDetailsColor(color)}
                          title={color.name}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Selected: <b>{detailsColor?.name}</b>
                    </span>
                  </div>
                )}

                {/* Add-on Options */}
                {currentProduct.addonOptions?.map((addon) => (
                  <div key={addon.id} className="detail-options-group">
                    <label className="addon-toggle-label">
                      <input
                        type="checkbox"
                        checked={addon.id === 'handle' ? handleSelected : false}
                        onChange={() => {
                          if (addon.id === 'handle') setHandleSelected((p) => !p);
                        }}
                      />
                      <span>
                        {addon.label} — <strong>+£{addon.price.toFixed(2)}</strong>
                      </span>
                    </label>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {addon.desc}
                    </span>
                  </div>
                ))}

                {/* Technical Specifications details table */}
                <div className="detail-options-group">
                  <span className="option-title">Technical Specifications</span>
                  <table className="tech-spec-table">
                    <tbody>
                      <tr>
                        <td className="tech-spec-label">Print Material</td>
                        <td className="tech-spec-val">{currentProduct.material}</td>
                      </tr>
                      <tr>
                        <td className="tech-spec-label">Fabrication Time</td>
                        <td className="tech-spec-val">{currentPrintTime}</td>
                      </tr>
                      <tr>
                        <td className="tech-spec-label">Layer Resolution</td>
                        <td className="tech-spec-val">{currentSpecs.layerHeight}</td>
                      </tr>
                      <tr>
                        <td className="tech-spec-label">Infill Density</td>
                        <td className="tech-spec-val">{currentSpecs.infill}</td>
                      </tr>
                      <tr>
                        <td className="tech-spec-label">Part Weight</td>
                        <td className="tech-spec-val">{currentSpecs.weight}</td>
                      </tr>
                      <tr>
                        <td className="tech-spec-label">Bounding Dimensions</td>
                        <td className="tech-spec-val">{currentSpecs.dimensions}</td>
                      </tr>
                      <tr>
                        <td className="tech-spec-label">Extrusion Finish</td>
                        <td className="tech-spec-val">{currentSpecs.finish}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <button 
                    className="submit-order-btn" 
                    onClick={() => {
                      if (currentProduct.outerColors) {
                        addToCart(currentProduct, { name: `${topColor?.name} / ${bottomColor?.name} Outer` }, { handle: handleSelected });
                      } else if (currentProduct.partColors) {
                        addToCart(currentProduct, { name: `${topColor?.name} (Top) / ${bottomColor?.name} (Bottom)` }, { handle: handleSelected });
                      } else {
                        addToCart(currentProduct, detailsColor, { handle: handleSelected });
                      }
                    }}
                    style={{ maxWidth: '320px' }}
                  >
                    <ShoppingBag size={18} />
                    <span>Add Configured Item to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <p>Product not found.</p>
              <button className="back-to-store-btn" onClick={() => navigateTo('catalog')}>
                Return to catalog
              </button>
            </div>
          )}
        </main>
      )}

      {/* Cart Side Drawer Overlay Backdrop */}
      <div className={`drawer-backdrop ${isCartOpen ? 'open' : ''}`} onClick={() => { window.history.pushState({}, '', '/'); setIsCartOpen(false); }}>
        {/* Drawer Panel */}
        <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
          <header className="drawer-header">
            <h2 className="drawer-title">
              <ShoppingBag size={20} />
              <span>Shopping Cart</span>
            </h2>
            <button className="close-btn" onClick={() => { window.history.pushState({}, '', '/'); setIsCartOpen(false); }} aria-label="Close drawer">
              <X size={20} />
            </button>
          </header>

          <div className="drawer-content">
            {checkoutStep === 'cart' && (
              <>
                {cart.length === 0 ? (
                  <div className="empty-state">
                    <ShoppingBag className="empty-icon" size={48} strokeWidth={1} />
                    <p>Your cart is empty.</p>
                    <button className="product-add-btn" style={{ width: 'auto' }} onClick={() => setIsCartOpen(false)}>
                      Browse Store
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Cart Items list */}
                    <div className="cart-items-list">
                      {cart.map((item, index) => (
                        <div key={index} className="cart-item">
                          <img src={item.product.image} alt={item.product.name} className="cart-item-image" />
                          <div className="cart-item-details">
                            <span className="cart-item-name">{item.product.name}</span>
                            <span className="cart-item-meta">
                              {item.color}{item.addons?.handle ? ' + Handle' : ''} • {item.product.material}
                            </span>
                            <span className="cart-item-price">£{getItemPrice(item).toFixed(2)}</span>
                            
                            <div className="cart-item-actions">
                              <div className="quantity-controller">
                                <button className="quantity-btn" onClick={() => updateQuantity(item, -1)}>
                                  <Minus size={12} />
                                </button>
                                <span className="quantity-val">{item.quantity}</span>
                                <button className="quantity-btn" onClick={() => updateQuantity(item, 1)}>
                                  <Plus size={12} />
                                </button>
                              </div>
                              <button className="delete-item-btn" onClick={() => removeFromCart(item)}>
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Coupons and Subtotal summary */}
                    <div className="promo-section">
                      <label className="promo-label">Discount Coupon</label>
                      <div className="promo-row">
                        <input
                          type="text"
                          className="promo-input"
                          placeholder="Code: e.g. PRINT10"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                        />
                        <button className="promo-btn" onClick={applyPromo}>
                          Apply
                        </button>
                      </div>
                      
                      {promoFeedback.message && (
                        <div className={`promo-feedback ${promoFeedback.type}`}>
                          {promoFeedback.type === 'success' ? <Check size={12} /> : <AlertCircle size={12} />}
                          <span>{promoFeedback.message}</span>
                        </div>
                      )}

                      {appliedCoupon && (
                        <div className="coupon-badge">
                          <Tag size={12} />
                          <span>{appliedCoupon.code} ({appliedCoupon.label})</span>
                          <button className="coupon-remove-btn" onClick={removeCoupon}>
                            <X size={12} />
                          </button>
                        </div>
                      )}

                      {!appliedCoupon && (
                        <p className="promo-hints">Hint: Use codes <b>PRINT10</b> (10% off), <b>SILVER20</b> (20% off), or <b>FREESHIP</b></p>
                      )}
                    </div>

                    <div className="order-totals">
                      <div className="total-row">
                        <span>Subtotal</span>
                        <span>£{subtotal.toFixed(2)}</span>
                      </div>
                      
                      {appliedCoupon?.type === 'percent' && (
                        <div className="total-row">
                          <span>Discount ({appliedCoupon.value}%)</span>
                          <span className="discount-amount">-£{discountAmount.toFixed(2)}</span>
                        </div>
                      )}

                      <div className="total-row">
                        <span>Shipping</span>
                        <span>
                          {appliedCoupon?.type === 'shipping' ? (
                            <span className="discount-amount">Free (was £4.99)</span>
                          ) : (
                            subtotal === 0 ? '£0.00' : `£${shippingFee.toFixed(2)}`
                          )}
                        </span>
                      </div>

                      <div className="total-row grand-total">
                        <span>Total (GBP)</span>
                        <span>£{grandTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <button 
                      className="submit-order-btn" 
                      onClick={() => { window.history.pushState({}, '', '/checkout'); setCheckoutStep('checkout'); }}
                      style={{ marginTop: '0.5rem' }}
                    >
                      <Lock size={16} />
                      <span>Proceed to Checkout</span>
                    </button>
                  </>
                )}
              </>
            )}

            {/* Checkout Forms with Input Masks and Box styles */}
            {checkoutStep === 'checkout' && (
              <form className="checkout-section" onSubmit={handlePlaceOrder}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 className="checkout-title">1. Account Details</h3>
                  <button type="button" className="close-btn" style={{ fontSize: '0.75rem' }} onClick={() => { window.history.pushState({}, '', '/cart'); setCheckoutStep('cart'); }}>
                    ← Back to Cart
                  </button>
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="you@domain.com"
                    value={checkoutForm.email}
                    onChange={handleInputChange('email')}
                  />
                  {formErrors.email && <span style={{ color: 'var(--accent)', fontSize: '0.7rem' }}>{formErrors.email}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Birth Date (DD/MM/YYYY)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="DD/MM/YYYY"
                    value={checkoutForm.birthdate}
                    onChange={handleInputChange('birthdate', maskBirthdate)}
                  />
                  {formErrors.birthdate && <span style={{ color: 'var(--accent)', fontSize: '0.7rem' }}>{formErrors.birthdate}</span>}
                </div>

                <h3 className="checkout-title" style={{ marginTop: '0.5rem' }}>2. Shipping Address</h3>

                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Jane Doe"
                    value={checkoutForm.fullName}
                    onChange={handleInputChange('fullName')}
                  />
                  {formErrors.fullName && <span style={{ color: 'var(--accent)', fontSize: '0.7rem' }}>{formErrors.fullName}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="(000) 000-0000"
                    value={checkoutForm.phone}
                    onChange={handleInputChange('phone', maskPhone)}
                  />
                  {formErrors.phone && <span style={{ color: 'var(--accent)', fontSize: '0.7rem' }}>{formErrors.phone}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Delivery Address</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Street, City, Postal Code"
                    value={checkoutForm.address}
                    onChange={handleInputChange('address')}
                  />
                  {formErrors.address && <span style={{ color: 'var(--accent)', fontSize: '0.7rem' }}>{formErrors.address}</span>}
                </div>

                <h3 className="checkout-title" style={{ marginTop: '0.5rem' }}>3. Secure Card Payment</h3>

                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="0000-0000-0000-0000"
                    value={checkoutForm.cardNumber}
                    onChange={handleInputChange('cardNumber', maskCardNumber)}
                  />
                  {formErrors.cardNumber && <span style={{ color: 'var(--accent)', fontSize: '0.7rem' }}>{formErrors.cardNumber}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Expiry Date</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="MM/YY"
                      value={checkoutForm.cardExpiry}
                      onChange={handleInputChange('cardExpiry', maskCardExpiry)}
                    />
                    {formErrors.cardExpiry && <span style={{ color: 'var(--accent)', fontSize: '0.7rem' }}>{formErrors.cardExpiry}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">CVV Security Code</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="000"
                      value={checkoutForm.cardCvv}
                      onChange={handleInputChange('cardCvv', maskCVV)}
                    />
                    {formErrors.cardCvv && <span style={{ color: 'var(--accent)', fontSize: '0.7rem' }}>{formErrors.cardCvv}</span>}
                  </div>
                </div>

                <div className="order-totals" style={{ marginTop: '0.5rem' }}>
                  <div className="total-row grand-total">
                    <span>Grand Total</span>
                    <span>£{grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', cursor: 'pointer', marginTop: '0.25rem' }}>
                  <input type="checkbox" checked={saveInfo} onChange={() => setSaveInfo((p) => !p)} />
                  Save my details for next time
                </label>

                <button 
                  type="submit" 
                  className="submit-order-btn" 
                  disabled={isSubmittingOrder}
                >
                  {isSubmittingOrder ? (
                    <span>Processing Payment...</span>
                  ) : (
                    <>
                      <ShieldCheck size={16} />
                      <span>Authorize Payment & Place Order</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Order Success Display */}
            {checkoutStep === 'success' && completedOrder && (
              <div className="order-success-screen">
                <div className="success-icon-wrap">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="success-title">Order Confirmed</h3>
                <p className="success-msg">
                  Thank you for your order, <b>{completedOrder.billingName}</b>! Your custom prints are scheduled for our print queues.
                </p>

                <div className="success-details-box">
                  <div className="success-detail-row">
                    <span>Order Ref</span>
                    <b>{completedOrder.orderId}</b>
                  </div>
                  <div className="success-detail-row">
                    <span>Items Count</span>
                    <span>{completedOrder.itemsCount} items</span>
                  </div>
                  {parseFloat(completedOrder.discount) > 0 && (
                    <div className="success-detail-row">
                      <span>Discount</span>
                      <span className="discount-amount">-£{completedOrder.discount}</span>
                    </div>
                  )}
                  <div className="success-detail-row">
                    <span>Shipping</span>
                    <span>{parseFloat(completedOrder.shipping) === 0 ? 'Free' : `£${completedOrder.shipping}`}</span>
                  </div>
                  <div className="success-detail-row" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.4rem', marginTop: '0.4rem' }}>
                    <span>Amount Paid</span>
                    <b>£{completedOrder.total}</b>
                  </div>
                  <div className="success-detail-row" style={{ flexDirection: 'column', alignItems: 'flex-start', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Deliver To</span>
                    <span style={{ fontSize: '0.75rem', marginTop: '0.1rem' }}>{completedOrder.shippingAddress}</span>
                  </div>
                </div>

                <button 
                  className="product-add-btn" 
                  onClick={() => { window.history.pushState({}, '', '/'); setIsCartOpen(false); setCheckoutStep('cart'); }}
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Vercel Analytics — only activated when cookie consent is given */}
      {cookieConsent === 'accepted' && <Analytics />}

      {/* Cookie Consent Banner — shown until user accepts or rejects */}
      <CookieConsent
        visible={showCookieBanner}
        onAccept={handleCookieAccept}
        onReject={handleCookieReject}
        onPrivacy={() => navigateTo('privacy-policy')}
      />

      {/* Interactive Footer Modal Overlays */}
      <div className={`modal-backdrop ${activeFooterModal ? 'open' : ''}`} onClick={() => setActiveFooterModal(null)}>
        <div className="modal-content-panel" onClick={(e) => e.stopPropagation()}>
          <header className="modal-header-section">
            <h3 className="modal-title">
              {activeFooterModal === 'filament' && <Layers size={18} className="logo-icon" />}
              {activeFooterModal === 'sizing' && <Maximize2 size={18} className="logo-icon" />}
              {activeFooterModal === 'terms' && <FileText size={18} className="logo-icon" />}
              <span>
                {activeFooterModal === 'filament' && "Ed's 3D Prints Filament Guide"}
                {activeFooterModal === 'sizing' && 'Scaling & Dimensions Guide'}
                {activeFooterModal === 'terms' && 'Terms of Custom Service'}
              </span>
            </h3>
            <button className="close-btn" onClick={() => setActiveFooterModal(null)}>
              <X size={20} />
            </button>
          </header>

          <div className="modal-body-section">
            {activeFooterModal === 'filament' && (
              <>
                <p>We work exclusively with professional-grade FDM filaments. Choose the material that best matches your structural and visual requirements.</p>
                <table className="filament-grid-table">
                  <thead>
                    <tr>
                      <th>Material</th>
                      <th>Strength</th>
                      <th>Heat Deflection</th>
                      <th>Finish Type</th>
                      <th>Best Use Cases</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><b>Matte PLA</b></td>
                      <td>Medium</td>
                      <td>55°C</td>
                      <td>Flat Matte</td>
                      <td>Interior decor, sculptures, architectural mockups.</td>
                    </tr>
                    <tr>
                      <td><b>Silk PLA</b></td>
                      <td>Medium-Low</td>
                      <td>52°C</td>
                      <td>High Gloss Metallic</td>
                      <td>Aesthetics toys, display pieces, gift items.</td>
                    </tr>
                    <tr>
                      <td><b>Recycled PETG</b></td>
                      <td>High</td>
                      <td>75°C</td>
                      <td>Semi-Gloss</td>
                      <td>Functional brackets, outdoor containers, watertight pots.</td>
                    </tr>
                    <tr>
                      <td><b>Tough ABS</b></td>
                      <td>Very High</td>
                      <td>98°C</td>
                      <td>Slight Satin</td>
                      <td>Mechanical gears, enclosures, high durability fixtures.</td>
                    </tr>
                    <tr>
                      <td><b>Carbon Fiber PLA</b></td>
                      <td>Ultra High</td>
                      <td>60°C</td>
                      <td>Micro-Textured Matte</td>
                      <td>Rigid structural joints, lightweight desktop mounts.</td>
                    </tr>
                  </tbody>
                </table>
                <p style={{ fontSize: '0.8rem', fontStyle: 'italic', marginTop: '1rem' }}>
                  *Note: Technical datasheet copies can be requested in PDF format by messaging our print desk.
                </p>
              </>
            )}

            {activeFooterModal === 'sizing' && (
              <>
                <p>Our standard print sizes are calculated according to the bounding box dimensions of each model. Custom scale overrides can be applied on request.</p>
                <div className="sizing-chart-cards">
                  <div className="sizing-chart-card">
                    <div className="size-scale">50%</div>
                    <div className="size-label">Compact Scale</div>
                    <p className="size-desc">Miniatures & keychains. Faster printing times, shorter turnaround.</p>
                  </div>
                  <div className="sizing-chart-card">
                    <div className="size-scale">100%</div>
                    <div className="size-label">Designed Scale</div>
                    <p className="size-desc">Engineered tolerances. Perfect fit for mechanical gears and assemblies.</p>
                  </div>
                  <div className="sizing-chart-card">
                    <div className="size-scale">150%</div>
                    <div className="size-label">Display Scale</div>
                    <p className="size-desc">Increased volume impact. Optimized infill structures for sturdy weight.</p>
                  </div>
                </div>
                <h4>Build Volume Limitation</h4>
                <p>
                  Our modern CoreXY fabrication platforms support maximum contiguous builds of <b>256 x 256 x 256 mm</b>. 
                  Models larger than these dimensions will be split into engineered dovetail interlocking modules.
                </p>
              </>
            )}

            {activeFooterModal === 'terms' && (
              <>
                <p>By placing an order for on-demand 3D printing fabrication services, you agree to the following terms:</p>
                <h4>1. Production & Fulfillment</h4>
                <p>Each item is printed individually to order. Print queue placement depends on order volume. Expected fabrication times are estimations and do not include transit times.</p>
                <h4>2. Refund & Cancellation Policy</h4>
                <p>Since each part is fabricated using custom colored material to order, cancellations can only be completed before the print cycle commences. Returns are not accepted unless parts arrive damaged or with clear defects violating CAD model specs.</p>
                <h4>3. Surface Quality & Characteristics</h4>
                <p>FDM printing is an additive layering process. Microscopic layer lines, minor seams, and support structures are normal artifacts of this fabrication and do not qualify as defects.</p>
              </>
            )}


          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="site-footer">
        <div className="footer-inner">
          <p className="footer-text">
            © {new Date().getFullYear()} Ed's 3D Prints. Clean geometric engineering files fabricated on-demand.
          </p>
          <nav className="footer-links" aria-label="Footer Navigation">
            <button className="footer-link" onClick={() => setActiveFooterModal('filament')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              Filament Guide
            </button>
            <button className="footer-link" onClick={() => setActiveFooterModal('sizing')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              Sizing Chart
            </button>
            <button className="footer-link" onClick={() => setActiveFooterModal('terms')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              Terms of service
            </button>
            <button className="footer-link" onClick={() => navigateTo('privacy-policy')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              Privacy Policy
            </button>
            <button className="footer-link" onClick={handleCookiePreferences} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              Cookie Preferences
            </button>
            <button className="footer-link" onClick={() => navigateTo('contact')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              Contact
            </button>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export default App;
