import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from './supabaseClient';
import { 
  ShoppingBag, 
  Heart, 
  Sparkles, 
  X, 
  Search, 
  User, 
  Check, 
  SlidersHorizontal, 
  ShoppingBasket,
  Star,
  Lock,
  LogOut,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Bot,
  Bookmark,
  ShoppingCart,
  Trash2,
  Camera,
  MessageCircle,
  Send,
  MapPin,
  Globe2,
  CreditCard,
  Wallet
} from 'lucide-react';

const PRODUCT_CATALOG = [
  {
    id: 1,
    name: "Cloud Puff Tote",
    category: "Everyday",
    price: 299,
    priceTier: 299,
    tag: "Soft Favorite",
    fabric: "Squishy Cotton Blend",
    rating: 4.9,
    reviews: 142,
    description: "A real soft squishy tote with a plush feel, easy daily carry, and a light structure that still stays relaxed and cute.",
    imageUrl: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=85",
    colors: [
      { id: 'cream', name: 'Cream Puff', hex: '#FDF8F2', border: 'border-stone-300' },
      { id: 'blush', name: 'Blush Rose', hex: '#F4D9D8', border: 'border-pink-300' },
      { id: 'sage', name: 'Soft Sage', hex: '#DDE9E0', border: 'border-emerald-300' },
      { id: 'lavender', name: 'Lilac Cloud', hex: '#E7DDF8', border: 'border-violet-300' }
    ],
    bgGradient: "bg-[#F9F2EE]",
    imageEmoji: "👜"
  },
  {
    id: 2,
    name: "Velvet Bubble Tote",
    category: "Everyday",
    price: 399,
    priceTier: 399,
    tag: "Best Seller",
    fabric: "Cushioned Knit",
    rating: 5.0,
    reviews: 310,
    description: "Plush, squishy, and easy to carry — this tote is built to feel like a cozy everyday handbag with a gentle puffed body.",
    imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85",
    colors: [
      { id: 'peach', name: 'Peach Cloud', hex: '#F8E2D1', border: 'border-orange-200' },
      { id: 'pink', name: 'Pink Candy', hex: '#F7D8E5', border: 'border-pink-200' },
      { id: 'sky', name: 'Blue Mist', hex: '#DDEAF8', border: 'border-sky-200' }
    ],
    bgGradient: "bg-[#FFF7F1]",
    imageEmoji: "🧸"
  },
  {
    id: 3,
    name: "Mini Soft Carry Tote",
    category: "Mini",
    price: 499,
    priceTier: 499,
    tag: "Elegant Ease",
    fabric: "Structured Puff Canvas",
    rating: 4.9,
    reviews: 98,
    description: "A soft handbag-inspired tote with a clean shape, gentle volume, and a charming everyday finish that feels polished but easy.",
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85",
    colors: [
      { id: 'butter', name: 'Butter Glow', hex: '#F7E9B4', border: 'border-yellow-200' },
      { id: 'mist', name: 'Stone Mist', hex: '#EAE7E2', border: 'border-stone-300' },
      { id: 'rose', name: 'Rose Dust', hex: '#F1D9DA', border: 'border-rose-200' }
    ],
    bgGradient: "bg-[#FFFDF8]",
    imageEmoji: "✨"
  },
  {
    id: 4,
    name: "Puff Weekend Tote",
    category: "Weekend",
    price: 399,
    priceTier: 399,
    tag: "New Drop",
    fabric: "Light Pleated Puff",
    rating: 4.8,
    reviews: 76,
    description: "A comfy, soft, everyday tote with a relaxed silhouette and roomy feel — made for quick errands and easy styling all day long.",
    imageUrl: "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=900&q=85",
    colors: [
      { id: 'mint', name: 'Mint Soft', hex: '#DDEEE5', border: 'border-emerald-200' },
      { id: 'pearl', name: 'Pearl White', hex: '#F9F7F5', border: 'border-stone-300' },
      { id: 'lilac', name: 'Lilac Glow', hex: '#EBDFF9', border: 'border-violet-200' }
    ],
    bgGradient: "bg-[#F8F6F2]",
    imageEmoji: "☁️"
  }
];

const CHARM_OPTIONS = [
  { id: 'monogram', name: 'MAVI Gold Monogram Tag', price: 60, icon: '🏷️' },
  { id: 'ribbon', name: 'Mocha Satin Bow', price: 40, icon: '🎀' },
  { id: 'pearl', name: 'Faux Pearl Chain Accent', price: 80, icon: '📿' },
  { id: 'mini-pouch', name: 'Matching Mini Coin Pouch', price: 100, icon: '👛' }
];

const PROFILE_PICTURES = [
  { id: 'cream', label: 'Cream', color: '#F4E5D7' },
  { id: 'rose', label: 'Rose', color: '#E8BFC0' },
  { id: 'sage', label: 'Sage', color: '#BFD2C1' },
  { id: 'lavender', label: 'Lilac', color: '#D7C9E8' }
];

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriceTier, setSelectedPriceTier] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [wishlistOnly, setWishlistOnly] = useState(false);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState([2]);
  const [toastMessage, setToastMessage] = useState(null);
  const [cardSelectedColor, setCardSelectedColor] = useState({});
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [customizeProduct, setCustomizeProduct] = useState(null);
  const [customColor, setCustomColor] = useState(null);
  const [selectedCharms, setSelectedCharms] = useState([]);
  const [embroideryText, setEmbroideryText] = useState('');
  const [handleLength, setHandleLength] = useState('Standard (25cm)');
  const [orderReceipt, setOrderReceipt] = useState(null);
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [customerReviews, setCustomerReviews] = useState([
    {
      id: 1,
      productId: 1,
      productName: 'Cloud Puff Tote',
      reviewer: 'Nina',
      rating: 5,
      comment: 'The texture is lovely and super soft. It feels elevated but still easy for everyday use.',
      date: '12 Jul 2026'
    },
    {
      id: 2,
      productId: 2,
      productName: 'Velvet Bubble Tote',
      reviewer: 'Maya',
      rating: 5,
      comment: 'The puff finish is even better in real life. It has such a nice soft structure and looks chic.',
      date: '28 Jul 2026'
    },
    {
      id: 3,
      productId: 3,
      productName: 'Mini Soft Carry Tote',
      reviewer: 'Ploy',
      rating: 4,
      comment: 'Perfect mini size for quick errands and travel days. The color is a little more muted in person, but still beautiful.',
      date: '04 Aug 2026'
    }
  ]);
  const [reviewForm, setReviewForm] = useState({
    productId: PRODUCT_CATALOG[0].id,
    reviewer: '',
    rating: 5,
    comment: ''
  });
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    name: '',
    email: '',
    phone: '',
    country: 'Thailand',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    shippingMethod: 'worldwide-standard',
    paymentMethod: 'promptpay'
  });
  const [catalog, setCatalog] = useState(() => {
    try {
      const savedCatalog = localStorage.getItem('mavi-catalog');
      return savedCatalog ? JSON.parse(savedCatalog) : PRODUCT_CATALOG;
    } catch {
      return PRODUCT_CATALOG;
    }
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [isOwnerMode, setIsOwnerMode] = useState(false);
  const [isOwnerLoginOpen, setIsOwnerLoginOpen] = useState(false);
  const [ownerPassword, setOwnerPassword] = useState('');
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isProfilePickerOpen, setIsProfilePickerOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'mavi', text: 'Hi! How can we help you find your perfect MAVI tote?' }
  ]);
  const [profilePhoto, setProfilePhoto] = useState(() => {
    try {
      return localStorage.getItem('mavi-profile-photo') || '';
    } catch {
      return '';
    }
  });
  const [isPageReady, setIsPageReady] = useState(false);
  const [heroImageUrl, setHeroImageUrl] = useState(() => {
    try {
      return localStorage.getItem('mavi-hero-image') || 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=1100&q=85';
    } catch {
      return 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=1100&q=85';
    }
  });
  const [heroText, setHeroText] = useState({
    badge: 'real squishy texture',
    headline: 'Soft tote bags with a plush everyday feel.',
    subtext: 'Light, cozy, and made to feel like a squishy handbag you actually want to carry every day — simple, cute, and easy to style.',
    cta: 'SHOP THE COLLECTION'
  });
  const [editedCatalog, setEditedCatalog] = useState(PRODUCT_CATALOG);

  const persistCloudContent = async (nextCatalog, nextHeroImageUrl = heroImageUrl) => {
    const { error } = await supabase.from('site_content').upsert({
      id: 1,
      catalog: nextCatalog,
      hero_image_url: nextHeroImageUrl,
      updated_at: new Date().toISOString()
    });
    if (error) throw error;
  };

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsPageReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    let isActive = true;
    const loadCloudContent = async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('catalog, hero_image_url')
        .eq('id', 1)
        .maybeSingle();

      if (!isActive) return;
      if (!error && data?.catalog?.length) {
        setCatalog(data.catalog);
        setEditedCatalog(data.catalog);
        if (data.hero_image_url) setHeroImageUrl(data.hero_image_url);
        showToast('Shared shop data loaded');
        return;
      }

      if (!error && data && !data.catalog?.length) {
        try {
          await persistCloudContent(catalog, heroImageUrl);
          showToast('Shared shop data initialized');
        } catch {
          showToast('Shared data needs one owner save');
        }
      }
    };
    loadCloudContent();
    return () => { isActive = false; };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('mavi-hero-image', heroImageUrl);
    } catch {
      showToast('Photo is too large to save in this browser');
    }
  }, [heroImageUrl]);

  useEffect(() => {
    try {
      if (profilePhoto) localStorage.setItem('mavi-profile-photo', profilePhoto);
      else localStorage.removeItem('mavi-profile-photo');
    } catch {
      showToast('Profile picture could not be saved');
    }
  }, [profilePhoto]);

  useEffect(() => {
    setEditedCatalog(catalog);
  }, [catalog]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase().trim();
    const smartTerms = normalizedQuery.split(/\s+/).filter(Boolean).map((term) => ({
      small: 'mini',
      bag: 'tote',
      pink: 'rose',
      daily: 'everyday',
      carry: 'tote'
    }[term] || term));
    return catalog.filter((product) => {
      const searchableText = [product.name, product.category, product.fabric, product.tag, product.description, ...product.colors.map((color) => color.name)].join(' ').toLowerCase();
      const matchesSearch = !normalizedQuery || smartTerms.every((term) => searchableText.includes(term));

      const matchesTier = selectedPriceTier === 'ALL' || product.priceTier === Number(selectedPriceTier);
      const matchesCategory = selectedCategory === 'ALL' || product.category === selectedCategory;
      const matchesWishlist = !wishlistOnly || wishlist.includes(product.id);

      return matchesSearch && matchesTier && matchesCategory && matchesWishlist;
    });
  }, [searchQuery, selectedPriceTier, selectedCategory, wishlistOnly, wishlist, catalog]);

  const toggleWishlist = (id) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((item) => item !== id));
      showToast('Removed from Wishlist');
    } else {
      setWishlist([...wishlist, id]);
      showToast('Saved to your MAVI Wishlist ♡');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginEmail) return;
    const nameFromEmail = loginEmail.split('@')[0];
    const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
    setUser({ name: formattedName || 'Mavi Guest', email: loginEmail });
    setIsAuthModalOpen(false);
    showToast(`Welcome back, ${formattedName}! ✨`);
  };

  const handleLogout = () => {
    setUser(null);
    showToast('Signed out successfully');
  };

  const handleOwnerLogin = (event) => {
    event.preventDefault();
    if (ownerPassword !== 'mavi-owner') {
      showToast('Use the owner demo password: mavi-owner');
      return;
    }
    setIsOwnerMode(true);
    setIsOwnerLoginOpen(false);
    setOwnerPassword('');
    setIsDashboardOpen(true);
    showToast('Owner dashboard unlocked');
  };

  const openOwnerDashboard = () => {
    if (!isOwnerMode) {
      setIsOwnerLoginOpen(true);
      return;
    }
    setIsDashboardOpen(true);
  };

  const leaveOwnerDashboard = () => {
    setIsDashboardOpen(false);
    setIsOwnerMode(false);
    setIsEditMode(false);
  };

  const openCustomizer = (product, preferredColor = null) => {
    setCustomizeProduct(product);
    const activeColor = preferredColor || cardSelectedColor[product.id] || product.colors[0];
    setCustomColor(activeColor);
    setSelectedCharms([]);
    setEmbroideryText('');
    setHandleLength('Standard (25cm)');
  };

  const toggleCharm = (charm) => {
    if (selectedCharms.some((c) => c.id === charm.id)) {
      setSelectedCharms(selectedCharms.filter((c) => c.id !== charm.id));
    } else {
      setSelectedCharms([...selectedCharms, charm]);
    }
  };

  const calculateCustomizedPrice = () => {
    if (!customizeProduct) return 0;
    const charmsPrice = selectedCharms.reduce((sum, c) => sum + c.price, 0);
    const embroideryPrice = embroideryText.trim() ? 50 : 0;
    return customizeProduct.price + charmsPrice + embroideryPrice;
  };

  const handleAddToCart = () => {
    if (!customizeProduct) return;

    const cartItem = {
      cartItemId: Date.now(),
      product: customizeProduct,
      selectedColor: customColor,
      selectedCharms,
      embroideryText,
      handleLength,
      unitPrice: calculateCustomizedPrice(),
      quantity: 1
    };

    setCart([...cart, cartItem]);
    setCustomizeProduct(null);
    setIsCartOpen(true);
    showToast('Added to Bag 🛍️');
  };

  const updateQuantity = (cartItemId, delta) => {
    setCart(cart.map((item) => {
      if (item.cartItemId === cartItemId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (cartItemId) => {
    setCart(cart.filter((item) => item.cartItemId !== cartItemId));
  };

  const totalCartPrice = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const reviewSummary = useMemo(() => {
    const summary = {};

    catalog.forEach((product) => {
      const productReviews = customerReviews.filter((review) => review.productId === product.id);
      const averageRating = productReviews.length
        ? productReviews.reduce((total, review) => total + review.rating, 0) / productReviews.length
        : product.rating || 0;

      summary[product.id] = {
        averageRating,
        reviewCount: productReviews.length
      };
    });

    return summary;
  }, [catalog, customerReviews]);

  const shippingCost = checkoutData.shippingMethod === 'worldwide-express' ? 850 : checkoutData.country === 'Thailand' ? 0 : 450;
  const checkoutTotal = totalCartPrice + shippingCost;

  const updateCheckout = (field, value) => {
    setCheckoutData((previousData) => ({ ...previousData, [field]: value }));
  };

  const openCheckout = () => {
    if (cart.length === 0) return;
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    if (cart.length === 0) return;
    if (!checkoutData.name || !checkoutData.email || !checkoutData.country || !checkoutData.address || !checkoutData.city || !checkoutData.postalCode) {
      showToast('Please complete your shipping details');
      return;
    }
    const receiptData = {
      orderId: `MAVI-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      items: [...cart],
      subtotal: totalCartPrice,
      shipping: shippingCost,
      total: checkoutTotal,
      customer: checkoutData.name || (user ? user.name : 'Guest Customer'),
      email: checkoutData.email,
      paymentMethod: checkoutData.paymentMethod,
      paymentStatus: 'Pending payment',
      shippingAddress: `${checkoutData.address}, ${checkoutData.city}, ${checkoutData.state ? `${checkoutData.state}, ` : ''}${checkoutData.postalCode}, ${checkoutData.country}`
    };
    try {
      localStorage.setItem('mavi-last-order', JSON.stringify(receiptData));
    } catch {
      showToast('Order created, but could not be saved in this browser');
    }
    const { error: orderError } = await supabase.from('orders').insert({
      order_number: receiptData.orderId,
      customer_name: receiptData.customer,
      customer_email: receiptData.email,
      customer_phone: checkoutData.phone,
      shipping_address: {
        country: checkoutData.country,
        address: checkoutData.address,
        city: checkoutData.city,
        state: checkoutData.state,
        postal_code: checkoutData.postalCode
      },
      shipping_method: checkoutData.shippingMethod,
      shipping_amount: receiptData.shipping,
      subtotal: receiptData.subtotal,
      total_amount: receiptData.total,
      payment_method: receiptData.paymentMethod,
      payment_status: 'pending',
      order_status: 'pending',
      items: receiptData.items
    });
    if (orderError) console.warn('Order database save skipped:', orderError.message);

    const nextTrackingInfo = {
      orderId: receiptData.orderId,
      status: checkoutData.shippingMethod === 'worldwide-express' ? 'In transit' : 'Packed and ready for dispatch',
      eta: checkoutData.shippingMethod === 'worldwide-express' ? '2-4 business days' : '5-8 business days',
      courier: checkoutData.country === 'Thailand' ? 'Thai Post' : 'DHL Express',
      progress: checkoutData.shippingMethod === 'worldwide-express' ? 72 : 58,
      steps: [
        { label: 'Order placed', done: true },
        { label: 'Packed in studio', done: true },
        { label: 'Shipped', done: true },
        { label: 'Out for delivery', done: false },
        { label: 'Delivered', done: false }
      ]
    };

    setTrackingInfo(nextTrackingInfo);
    setOrderReceipt(receiptData);
    setCart([]);
    setIsCheckoutOpen(false);
  };

  const handleSubmitReview = (event) => {
    event.preventDefault();

    if (!reviewForm.reviewer.trim() || !reviewForm.comment.trim()) {
      showToast('Please add your name and a short review');
      return;
    }

    const product = catalog.find((item) => item.id === Number(reviewForm.productId));
    const submittedReview = {
      id: Date.now(),
      productId: Number(reviewForm.productId),
      productName: product?.name || 'MAVI tote',
      reviewer: reviewForm.reviewer.trim(),
      rating: Number(reviewForm.rating),
      comment: reviewForm.comment.trim(),
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    setCustomerReviews((previousReviews) => [submittedReview, ...previousReviews]);
    setReviewForm({
      productId: Number(reviewForm.productId),
      reviewer: '',
      rating: 5,
      comment: ''
    });
    showToast('Thanks for your MAVI review');
  };

  const openEditor = () => {
    if (!isOwnerMode) return;
    setEditedCatalog(structuredClone(catalog));
    setIsEditMode(true);
  };

  const saveEditor = async () => {
    try {
      const catalogToSave = structuredClone(editedCatalog);
      localStorage.setItem('mavi-catalog', JSON.stringify(catalogToSave));
      await persistCloudContent(catalogToSave);
      setCatalog(catalogToSave);
      setEditedCatalog(structuredClone(catalogToSave));
      setWishlist((previousWishlist) => previousWishlist.filter((id) => catalogToSave.some((product) => product.id === id)));
      setIsEditMode(false);
      showToast('Products saved for everyone');
    } catch (error) {
      console.error('Cloud save failed:', error);
      showToast('Cloud save failed. Check the Supabase table policies.');
    }
  };

  const cancelEditor = () => {
    setEditedCatalog(structuredClone(catalog));
    setIsEditMode(false);
  };

  const updateEditedProduct = (productIndex, field, value) => {
    setEditedCatalog((previousCatalog) => previousCatalog.map((product, index) => (
      index === productIndex ? { ...product, [field]: value } : product
    )));
  };

  const getChatRecommendation = (message) => {
    const normalizedMessage = message.toLowerCase();
    const requestedTerms = normalizedMessage.split(/\s+/).filter(Boolean);
    const requestedSize = /\b(mini|small|compact)\b/.test(normalizedMessage) ? 'mini' : null;
    const requestedColor = ['blue', 'pink', 'rose', 'cream', 'white', 'sage', 'green', 'lilac', 'purple', 'yellow', 'peach', 'mint']
      .find((color) => normalizedMessage.includes(color));
    const requestedOccasion = /\b(holiday|vacation|travel|trip|weekend)\b/.test(normalizedMessage) ? 'weekend' : null;

    const scoredProducts = catalog.map((product) => {
      const productText = [product.name, product.category, product.tag, product.fabric, product.description]
        .join(' ')
        .toLowerCase();
      const productColors = Array.isArray(product.colors) ? product.colors : [];
      const matchingColor = requestedColor && productColors.find((color) => (
        color.name.toLowerCase().includes(requestedColor) ||
        (requestedColor === 'blue' && /sky|mist/.test(color.name.toLowerCase())) ||
        (requestedColor === 'green' && /sage|mint/.test(color.name.toLowerCase())) ||
        (requestedColor === 'purple' && /lilac|lavender/.test(color.name.toLowerCase()))
      ));
      const matchingTerms = requestedTerms.filter((term) => term.length > 2 && productText.includes(term));
      let score = matchingTerms.length;
      if (requestedSize === 'mini' && product.category?.toLowerCase() === 'mini') score += 8;
      if (requestedOccasion === 'weekend' && product.category?.toLowerCase() === 'weekend') score += 3;
      if (matchingColor) score += 6;
      return { product, matchingColor, score };
    }).sort((first, second) => second.score - first.score)[0];

    if (!scoredProducts?.product || scoredProducts.score === 0) return null;

    const { product, matchingColor } = scoredProducts;
    const selectedColor = matchingColor || product.colors?.[0];
    const colorMessage = requestedColor && !matchingColor
      ? ` The closest available color is ${selectedColor?.name || 'the first available shade'}.`
      : '';
    const sizeMessage = requestedSize === 'mini' && product.category?.toLowerCase() !== 'mini'
      ? ' I could not find a Mini tote with that color, so this is the closest color match.'
      : '';

    return {
      productId: product.id,
      colorId: selectedColor?.id,
      text: `I recommend ${product.name}${selectedColor ? ` in ${selectedColor.name}` : ''}.${sizeMessage}${colorMessage}`
    };
  };

  const submitChatMessage = (event) => {
    event.preventDefault();
    const message = chatMessage.trim();
    if (!message) return;
    const recommendation = getChatRecommendation(message);
    setChatMessages((previousMessages) => [
      ...previousMessages,
      { id: Date.now(), sender: 'shopper', text: message },
      {
        id: Date.now() + 1,
        sender: 'mavi',
        text: recommendation?.text || 'Tell me the size, color, or occasion you have in mind and I will find the closest MAVI tote.',
        recommendation
      }
    ]);
    setChatMessage('');
  };

  const deleteProduct = (productId) => {
    if (!window.confirm('Delete this product from your shop?')) return;
    setEditedCatalog((prev) => prev.filter((product) => product.id !== productId));
    showToast('Product deleted');
  };

  const selectProfileColor = (color) => {
    setProfilePhoto(color);
    setIsProfilePickerOpen(false);
  };

  const handleProfileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setProfilePhoto(reader.result);
      setIsProfilePickerOpen(false);
      showToast('Profile picture saved');
    };
    reader.readAsDataURL(file);
  };

  const addNewProduct = () => {
    const newProduct = {
      id: Date.now(),
      name: 'New Puff Tote',
      category: 'Everyday',
      price: 299,
      priceTier: 299,
      tag: 'New Arrival',
      fabric: 'Soft Cotton',
      rating: 4.8,
      reviews: 0,
      description: 'Fresh new favorite with a soft cloud-like feel and everyday charm.',
      imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85',
      colors: [
        { id: 'new-cream', name: 'Cream', hex: '#FDF8F2', border: 'border-stone-300' },
        { id: 'new-pink', name: 'Blush', hex: '#F7D7E5', border: 'border-pink-200' }
      ],
      bgGradient: 'bg-[#F9F2EE]',
      imageEmoji: '👜'
    };
    setEditedCatalog((prev) => [...prev, newProduct]);
  };

  const addColorToProduct = (productIndex) => {
    const newColor = {
      id: `color-${Date.now()}`,
      name: 'New Shade',
      hex: '#F7E9B4',
      border: 'border-yellow-200'
    };
    setEditedCatalog((prev) => prev.map((product, index) =>
      index === productIndex
        ? { ...product, colors: [...product.colors, newColor] }
        : product
    ));
  };

  const updateColorValue = (productIndex, colorIndex, field, value) => {
    setEditedCatalog((prev) => prev.map((product, index) => {
      if (index !== productIndex) return product;
      const nextColors = product.colors.map((color, idx) =>
        idx === colorIndex ? { ...color, [field]: value } : color
      );
      return { ...product, colors: nextColors };
    }));
  };

  const handleProductImageUpload = (event, productIndex) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setEditedCatalog((prev) => prev.map((product, index) =>
        index === productIndex ? { ...product, imageUrl: reader.result } : product
      ));
    };
    reader.readAsDataURL(file);
  };

  const handleHeroImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const maxSize = 1400;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        setHeroImageUrl(canvas.toDataURL('image/jpeg', 0.82));
        showToast('Homepage photo saved');
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const openHeroPhotoPicker = () => {
    document.getElementById('hero-photo-upload')?.click();
  };

  const runSmartSearch = (prompt) => {
    setSearchQuery(prompt);
    setSelectedCategory('ALL');
    setWishlistOnly(false);
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
    showToast(`Smart search found ${prompt.toLowerCase()} matches`);
  };

  const purchaseProduct = (product) => {
    openCustomizer(product);
    showToast('Choose your color, then add it to your bag');
  };

  const canEdit = isOwnerMode && isDashboardOpen;

  return (
    <div className={`min-h-screen bg-[#F9F6F0] text-[#4A3525] font-sans selection:bg-[#E9E0D8] ${isPageReady ? 'page-ready' : 'page-opening'}`}>
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-[#4A3525] text-[#F9F6F0] px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 text-xs font-semibold tracking-wide border border-[#6E5343]">
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-[#F9F6F0]/90 backdrop-blur-md border-b border-[#EBE4D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
          <div className="w-1/4 hidden md:flex items-center space-x-2">
            <span className="text-xs uppercase tracking-widest text-[#8C7462] font-semibold">Tote Studio</span>
          </div>

          <div className="flex flex-col items-center justify-center cursor-pointer group">
            <div className="w-10 h-10 border border-[#5C4033] rounded-full flex items-center justify-center mb-1 group-hover:bg-[#5C4033] group-hover:text-[#F9F6F0] transition-colors">
              <span className="font-serif text-sm font-bold tracking-tighter">MV</span>
            </div>
            <h1 className="font-serif tracking-[0.25em] text-xl font-bold uppercase text-[#4A3525]">
              MAVI
            </h1>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#8C7462] font-medium -mt-0.5">
              TOTE BAG
            </span>
          </div>

          <div className="w-1/4 flex items-center justify-end space-x-4">
            <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider text-[#8C7462]">Shop</span>

            <button
              type="button"
              onClick={() => setIsProfilePickerOpen(true)}
              title="Switch profile picture"
              className="h-9 w-9 overflow-hidden rounded-full border-2 border-[#D8CEBE] bg-[#EFE8E2] text-[#5C4033] transition-transform hover:scale-105"
            >
              {profilePhoto?.startsWith('data:') ? (
                <img src={profilePhoto} alt="Profile" className="h-full w-full object-cover" />
              ) : profilePhoto ? (
                <span className="block h-full w-full" style={{ backgroundColor: profilePhoto }} />
              ) : (
                <User className="mx-auto h-4 w-4" />
              )}
            </button>

            {user ? (
              <div className="flex items-center space-x-2 bg-[#EFE8E2] px-3 py-1.5 rounded-full border border-[#D8CEBE]">
                <User className="w-3.5 h-3.5 text-[#5C4033]" />
                <span className="text-xs font-semibold text-[#4A3525]">{user.name}</span>
                <button onClick={handleLogout} title="Sign Out" className="text-[#8C7462] hover:text-[#4A3525] ml-1">
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center space-x-1 text-xs font-medium text-[#5C4033] hover:text-[#4A3525] px-3 py-1.5 rounded-full hover:bg-[#EFE8E2] transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {isOwnerMode ? (
              <button
                onClick={openOwnerDashboard}
                className="flex items-center space-x-1 text-xs font-semibold text-[#5C4033] hover:text-[#4A3525] px-3 py-1.5 rounded-full hover:bg-[#EFE8E2] transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>
            ) : (
              <button
                onClick={openOwnerDashboard}
                className="flex items-center space-x-1 text-xs font-semibold text-[#5C4033] hover:text-[#4A3525] px-3 py-1.5 rounded-full hover:bg-[#EFE8E2] transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Owner login</span>
              </button>
            )}

            <button 
              onClick={() => setWishlistOnly(!wishlistOnly)}
              className={`relative p-2 rounded-full transition-colors ${
                wishlistOnly ? 'bg-[#5C4033] text-[#F9F6F0]' : 'text-[#5C4033] hover:bg-[#EFE8E2]'
              }`}
              title="Saved Items"
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 && !wishlistOnly ? 'fill-[#5C4033]' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#6E5343] text-[#F9F6F0] text-[10px] font-bold rounded-full flex items-center justify-center border border-[#F9F6F0]">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center space-x-2 bg-[#5C4033] hover:bg-[#4A3525] text-[#F9F6F0] px-4 py-2 rounded-full font-medium text-xs tracking-wider transition-all shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">BAG</span>
              {cart.length > 0 && (
                <span className="bg-[#8C7462] text-[#F9F6F0] text-[11px] font-bold px-2 py-0.5 rounded-full">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <section className="border-b border-[#F1E7E0] bg-[#FDF6F2] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1fr_0.9fr] items-stretch min-h-[430px]">
          <div className="hero-copy py-14 sm:py-20 flex flex-col justify-center max-w-xl">
            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#9B7B77] mb-5">
              {heroText.badge}
            </span>
            <h2 className="font-serif text-5xl sm:text-7xl leading-[0.94] font-normal text-[#594A56] tracking-tight">
              {heroText.headline.split(' ').map((word, index) => (
                index === heroText.headline.split(' ').length - 1 ? (
                  <span key={index} className="text-[#D79E9A]">{word}</span>
                ) : (
                  <span key={index}>{word}{' '}</span>
                )
              ))}
            </h2>
            <p className="text-sm sm:text-base text-[#78686E] max-w-md mt-6 leading-relaxed">
              {heroText.subtext}
            </p>
            <button
              onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}
              className="mt-8 w-fit bg-[#7D8F7A] hover:bg-[#687B69] text-[#FFF9F6] px-5 py-3 rounded-full text-xs font-bold tracking-wider transition-colors"
            >
              {heroText.cta} <ChevronRight className="inline-block w-3.5 h-3.5 ml-1" />
            </button>
          </div>
          <div className="hero-photo relative min-h-[300px] lg:min-h-0 lg:my-8 overflow-hidden rounded-[2rem]">
            <img
              src={heroImageUrl}
              alt="MAVI soft tote bag"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute left-5 bottom-5 bg-[#F8F5EE]/90 backdrop-blur-sm px-4 py-3 rounded-2xl border border-[#F8F5EE]">
              <span className="block text-[10px] uppercase tracking-widest font-bold text-[#536B5B]">The new everyday</span>
              <span className="block font-serif text-lg text-[#23352C]">Softly structured</span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-[#F3EEEA] p-4 rounded-3xl border border-[#E4DBD0] shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
          <div className="flex items-center justify-between gap-3 w-full md:w-auto">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C7462]">
              {isDashboardOpen ? 'Owner Dashboard' : 'Customer Storefront'}
            </span>
            {canEdit && (
              <button
                type="button"
                onClick={() => { addNewProduct(); setIsEditMode(true); }}
                className="rounded-full bg-[#5C4033] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#F9F6F0]"
              >
                + Add item
              </button>
            )}
          </div>

          <div className="relative flex-1 max-w-md">
            <Bot className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7D8F7A]" />
            <input 
              type="text"
              placeholder="Ask MAVI: small pink bag, soft daily tote..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-full border border-[#D8CEBE] bg-[#F9F6F0] focus:outline-none focus:ring-2 focus:ring-[#6E5343] placeholder-[#A08978]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8C7462] hover:text-[#4A3525]"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
            <span className="text-xs font-bold text-[#6E5343] uppercase tracking-wider">Category:</span>
            {['ALL', 'Everyday', 'Mini', 'Weekend'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-[#7D8F7A] text-[#FFF9F6] shadow-sm'
                    : 'bg-[#F9F6F0] text-[#6E5343] border border-[#D8CEBE] hover:bg-[#EAE4DC]'
                }`}
              >
                {category === 'ALL' ? 'All bags' : category}
              </button>
            ))}

            <span className="text-xs font-bold text-[#6E5343] uppercase tracking-wider flex items-center space-x-1 mr-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Tier:</span>
            </span>

            {['ALL', '299', '399', '499'].map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedPriceTier(tier)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  selectedPriceTier === tier
                    ? 'bg-[#5C4033] text-[#F9F6F0] shadow-sm'
                    : 'bg-[#F9F6F0] text-[#6E5343] border border-[#D8CEBE] hover:bg-[#EAE4DC]'
                }`}
              >
                {tier === 'ALL' ? 'All Prices' : `฿${tier}`}
              </button>
            ))}

            {wishlistOnly && (
              <button 
                onClick={() => setWishlistOnly(false)}
                className="px-3 py-2 rounded-full bg-[#E8DCD1] text-[#5C4033] text-xs font-semibold hover:bg-[#DBCCC0]"
              >
                Show All Products
              </button>
            )}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 px-2 text-[10px] text-[#8C7462]">
          <span className="flex items-center gap-1 font-bold uppercase tracking-wider"><Bot className="h-3.5 w-3.5 text-[#7D8F7A]" /> Smart search</span>
          {['small pink bag', 'soft everyday tote', 'weekend bag'].map((prompt) => (
            <button key={prompt} type="button" onClick={() => runSmartSearch(prompt)} className="rounded-full border border-[#E4DBD0] bg-[#FDFBF7] px-3 py-1 hover:border-[#7D8F7A]">
              {prompt}
            </button>
          ))}
        </div>
      </section>

      {isDashboardOpen && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="rounded-3xl border border-[#D8CEBE] bg-[#5C4033] p-5 text-[#F9F6F0] shadow-lg">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#E8DCD1]">Private owner area</p>
                <h2 className="mt-1 font-serif text-2xl">Manage your MAVI shop</h2>
                <p className="mt-1 text-xs text-[#E8DCD1]">Update products, photos, prices, colors, and homepage text.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={openEditor}
                  className="rounded-full bg-[#F9F6F0] px-4 py-2 text-xs font-bold text-[#5C4033]"
                >
                  Edit products
                </button>
                <button
                  type="button"
                  onClick={openHeroPhotoPicker}
                  className="rounded-full border border-[#E8DCD1] px-4 py-2 text-xs font-bold text-[#F9F6F0]"
                >
                  Change home photo
                </button>
                <input
                  id="hero-photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleHeroImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => { addNewProduct(); setIsEditMode(true); }}
                  className="rounded-full border border-[#E8DCD1] px-4 py-2 text-xs font-bold text-[#F9F6F0]"
                >
                  + Add item
                </button>
                <button
                  type="button"
                  onClick={leaveOwnerDashboard}
                  className="rounded-full border border-[#E8DCD1] px-4 py-2 text-xs font-bold text-[#F9F6F0]"
                >
                  View storefront
                </button>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl bg-[#6E5343] p-3"><span className="block text-[10px] text-[#E8DCD1]">Products</span><strong className="text-xl">{catalog.length}</strong></div>
              <div className="rounded-2xl bg-[#6E5343] p-3"><span className="block text-[10px] text-[#E8DCD1]">Price tiers</span><strong className="text-xl">3</strong></div>
              <div className="rounded-2xl bg-[#6E5343] p-3"><span className="block text-[10px] text-[#E8DCD1]">Orders</span><strong className="text-xl">{orderReceipt ? '1' : '0'}</strong></div>
              <div className="rounded-2xl bg-[#6E5343] p-3"><span className="block text-[10px] text-[#E8DCD1]">Status</span><strong className="text-xl">Live</strong></div>
            </div>
          </div>
        </section>
      )}

      {!isOwnerMode && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-2">
          <div className="rounded-2xl border border-[#E4DBD0] bg-[#F3EEEA] px-4 py-3 text-xs text-[#6E5343]">
            Viewer mode is active. The owner can edit products, colors, and images.
          </div>
        </div>
      )}

      {isOwnerLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#4A3525]/40 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-sm rounded-3xl border border-[#EFE1DA] bg-[#FFFDFB] p-6 shadow-2xl">
            <button onClick={() => setIsOwnerLoginOpen(false)} className="absolute right-5 top-5 text-[#8C7462] hover:text-[#4A3525]" title="Close owner login">
              <X className="h-5 w-5" />
            </button>
            <div className="mb-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C7462]">Private access</p>
              <h3 className="mt-1 font-serif text-2xl text-[#4A3525]">Owner login</h3>
              <p className="mt-1 text-xs text-[#8C7462]">Customers use the shop. Only the owner opens the dashboard.</p>
            </div>
            <form onSubmit={handleOwnerLogin} className="space-y-4">
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#6E5343]">Owner password</label>
                <input
                  type="password"
                  autoFocus
                  value={ownerPassword}
                  onChange={(event) => setOwnerPassword(event.target.value)}
                  placeholder="Enter owner password"
                  className="w-full rounded-xl border border-[#E7D8D0] bg-[#FDFBF7] p-3 text-sm text-[#4A3525] outline-none focus:ring-2 focus:ring-[#5C4033]"
                />
              </div>
              <button type="submit" className="w-full rounded-xl bg-[#5C4033] py-3 text-xs font-bold text-[#F9F6F0]">
                Open owner dashboard
              </button>
              <p className="text-center text-[10px] text-[#A08978]">Demo password: mavi-owner</p>
            </form>
          </div>
        </div>
      )}

      {isProfilePickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#4A3525]/40 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-3xl border border-[#EFE1DA] bg-[#FFFDFB] p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setIsProfilePickerOpen(false)}
              className="absolute right-5 top-5 text-[#8C7462] hover:text-[#4A3525]"
              title="Close profile pictures"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="mb-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C7462]">Profile style</p>
              <h3 className="mt-1 font-serif text-2xl text-[#4A3525]">Switch your picture</h3>
              <p className="mt-1 text-xs text-[#8C7462]">Choose a soft color or upload your own profile photo.</p>
            </div>
            <div className="mb-5 grid grid-cols-4 gap-3">
              {PROFILE_PICTURES.map((picture) => (
                <button
                  key={picture.id}
                  type="button"
                  onClick={() => selectProfileColor(picture.color)}
                  title={picture.label}
                  className="h-14 rounded-full border-2 border-white shadow-sm ring-1 ring-[#D8CEBE] transition-transform hover:scale-110"
                  style={{ backgroundColor: picture.color }}
                />
              ))}
            </div>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#5C4033] py-3 text-xs font-bold text-[#F9F6F0]">
              <Camera className="h-4 w-4" />
              Upload profile photo
              <input type="file" accept="image/*" onChange={handleProfileUpload} className="hidden" />
            </label>
            {profilePhoto && (
              <button
                type="button"
                onClick={() => selectProfileColor('')}
                className="mt-3 w-full text-xs font-semibold text-[#8C7462] hover:text-[#4A3525]"
              >
                Remove profile picture
              </button>
            )}
          </div>
        </div>
      )}

      {isEditMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#4A3525]/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#FFFDFB] rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-[#EFE1DA]">
            <div className="flex items-center justify-between pb-4 border-b border-[#F1E7E0] mb-5">
              <h3 className="font-serif text-2xl text-[#4A3525]">Edit Website</h3>
              <button onClick={cancelEditor} className="p-2 text-[#8C7462] hover:text-[#4A3525]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6E5343] mb-1">Badge text</label>
                  <input
                    value={heroText.badge}
                    onChange={(e) => setHeroText({ ...heroText, badge: e.target.value })}
                    className="w-full rounded-xl border border-[#E7D8D0] bg-[#FDFBF7] p-2.5 text-sm text-[#4A3525] outline-none ring-0"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6E5343] mb-1">Button text</label>
                  <input
                    value={heroText.cta}
                    onChange={(e) => setHeroText({ ...heroText, cta: e.target.value })}
                    className="w-full rounded-xl border border-[#E7D8D0] bg-[#FDFBF7] p-2.5 text-sm text-[#4A3525] outline-none ring-0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6E5343] mb-1">Main headline</label>
                <textarea
                  value={heroText.headline}
                  onChange={(e) => setHeroText({ ...heroText, headline: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-[#E7D8D0] bg-[#FDFBF7] p-2.5 text-sm text-[#4A3525] outline-none ring-0"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6E5343] mb-1">Subtext</label>
                <textarea
                  value={heroText.subtext}
                  onChange={(e) => setHeroText({ ...heroText, subtext: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-[#E7D8D0] bg-[#FDFBF7] p-2.5 text-sm text-[#4A3525] outline-none ring-0"
                />
              </div>

              <div className="rounded-2xl border border-[#F1E7E0] bg-[#FDFBF7] p-3 space-y-3">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6E5343]">Main tote photo</label>
                <input
                  value={heroImageUrl}
                  onChange={(e) => setHeroImageUrl(e.target.value)}
                  className="w-full rounded-xl border border-[#E7D8D0] bg-white p-2 text-sm text-[#4A3525] outline-none"
                  placeholder="Paste a tote image URL"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeroImageUpload}
                  className="w-full rounded-xl border border-[#E7D8D0] bg-white p-2 text-xs text-[#4A3525]"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#6E5343]">Product cards</h4>
                  <button
                    type="button"
                    onClick={addNewProduct}
                    className="rounded-full bg-[#5C4033] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#F9F6F0]"
                  >
                    + Add item
                  </button>
                </div>

                {editedCatalog.map((product, index) => (
                  <div key={product.id} className="rounded-2xl border border-[#F1E7E0] bg-[#FDFBF7] p-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#A08978]">Item {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => deleteProduct(product.id)}
                        className="flex items-center gap-1 rounded-full border border-rose-200 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-rose-700 hover:bg-rose-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete item
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6E5343] mb-1">Name</label>
                        <input
                          value={product.name}
                          onChange={(e) => updateEditedProduct(index, 'name', e.target.value)}
                          className="w-full rounded-xl border border-[#E7D8D0] bg-white p-2 text-sm text-[#4A3525] outline-none ring-0"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6E5343] mb-1">Price</label>
                        <input
                          type="number"
                          value={product.price}
                          onChange={(e) => {
                            const price = Number(e.target.value);
                            setEditedCatalog((previousCatalog) => previousCatalog.map((item, itemIndex) => (
                              itemIndex === index ? { ...item, price, priceTier: price } : item
                            )));
                          }}
                          className="w-full rounded-xl border border-[#E7D8D0] bg-white p-2 text-sm text-[#4A3525] outline-none ring-0"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6E5343] mb-1">Category</label>
                        <select
                          value={product.category || 'Everyday'}
                          onChange={(e) => updateEditedProduct(index, 'category', e.target.value)}
                          className="w-full rounded-xl border border-[#E7D8D0] bg-white p-2 text-sm text-[#4A3525] outline-none"
                        >
                          <option>Everyday</option>
                          <option>Mini</option>
                          <option>Weekend</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6E5343] mb-1">Tag</label>
                        <input
                          value={product.tag}
                          onChange={(e) => updateEditedProduct(index, 'tag', e.target.value)}
                          className="w-full rounded-xl border border-[#E7D8D0] bg-white p-2 text-sm text-[#4A3525] outline-none ring-0"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6E5343] mb-1">Fabric</label>
                        <input
                          value={product.fabric}
                          onChange={(e) => updateEditedProduct(index, 'fabric', e.target.value)}
                          className="w-full rounded-xl border border-[#E7D8D0] bg-white p-2 text-sm text-[#4A3525] outline-none ring-0"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6E5343] mb-1">Product image URL</label>
                      <input
                        value={product.imageUrl}
                        onChange={(e) => updateEditedProduct(index, 'imageUrl', e.target.value)}
                        className="w-full rounded-xl border border-[#E7D8D0] bg-white p-2 text-sm text-[#4A3525] outline-none ring-0"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6E5343] mb-1">Upload image file</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleProductImageUpload(e, index)}
                        className="w-full rounded-xl border border-[#E7D8D0] bg-white p-2 text-xs text-[#4A3525]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6E5343] mb-1">Description</label>
                      <textarea
                        value={product.description}
                        onChange={(e) => updateEditedProduct(index, 'description', e.target.value)}
                        rows={2}
                        className="w-full rounded-xl border border-[#E7D8D0] bg-white p-2 text-sm text-[#4A3525] outline-none ring-0"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6E5343]">Colors</label>
                        <button
                          type="button"
                          onClick={() => addColorToProduct(index)}
                          className="text-[10px] font-bold uppercase tracking-wider text-[#5C4033]"
                        >
                          + Add color
                        </button>
                      </div>

                      <div className="space-y-2">
                        {product.colors.map((color, colorIndex) => (
                          <div key={color.id} className="grid grid-cols-[1fr_1fr_60px] gap-2 items-center">
                            <input
                              value={color.name}
                              onChange={(e) => updateColorValue(index, colorIndex, 'name', e.target.value)}
                              className="rounded-xl border border-[#E7D8D0] bg-white p-2 text-xs text-[#4A3525] outline-none ring-0"
                            />
                            <input
                              value={color.hex}
                              onChange={(e) => updateColorValue(index, colorIndex, 'hex', e.target.value)}
                              className="rounded-xl border border-[#E7D8D0] bg-white p-2 text-xs text-[#4A3525] outline-none ring-0"
                            />
                            <div
                              className="h-10 rounded-xl border border-[#E7D8D0]"
                              style={{ backgroundColor: color.hex }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-[#F1E7E0] pt-4">
              <button onClick={cancelEditor} className="px-4 py-2 rounded-full border border-[#E7D8D0] text-[#5C4033] text-xs font-semibold">
                Cancel
              </button>
              <button onClick={saveEditor} className="px-5 py-2.5 rounded-full bg-[#5C4033] text-[#F9F6F0] text-xs font-bold shadow-sm">
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}

      <section id="collection" className="product-collection max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {wishlistOnly && (
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-serif text-lg text-[#4A3525] font-bold">Your Saved Wishlist ({filteredProducts.length})</h3>
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-[#F3EEEA] rounded-3xl border border-[#E4DBD0]">
            <span className="text-4xl block mb-2">🛍️</span>
            <p className="font-serif text-lg font-bold text-[#4A3525]">No MAVI tote bags match your criteria</p>
            <p className="text-xs text-[#8C7462] mt-1">Try clearing your search query or selecting a different price filter.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedPriceTier('ALL'); setWishlistOnly(false); }}
              className="mt-4 px-5 py-2 rounded-full bg-[#5C4033] text-[#F9F6F0] text-xs font-semibold"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => {
              const activeColor = cardSelectedColor[product.id] || product.colors[0];
              const isLiked = wishlist.includes(product.id);

              return (
                <div 
                  key={product.id}
                  className="product-card bg-[#FDFBF7] rounded-3xl p-5 border border-[#EBE4D8] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-[#EFE8E2] text-[#5C4033] border border-[#D8CEBE] text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                        {product.tag}
                      </span>
                      <button 
                        onClick={() => toggleWishlist(product.id)}
                        className="p-1.5 text-[#8C7462] hover:text-[#5C4033] transition-colors"
                        title={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
                      >
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-[#6E5343] text-[#6E5343]' : ''}`} />
                      </button>
                    </div>

                    <div
                      className={`w-full h-56 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden mb-4 transition-colors duration-300 ${product.bgGradient}`}
                      style={{ border: `2px solid ${activeColor.hex === '#FDFBF7' ? '#E5DED4' : activeColor.hex}` }}
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute bottom-3 left-3 bg-[#F9F6F0]/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-semibold text-[#5C4033] border border-[#E4DBD0]">
                        {activeColor.name}
                      </div>
                    </div>

                    <h3 className="font-serif font-bold text-[#4A3525] text-base mb-1 group-hover:text-[#6E5343] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#8C7462] line-clamp-2 mb-3 leading-relaxed">
                      {product.description}
                    </p>

                    <div className="mb-3 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8C7462]">
                      <Star className="w-3.5 h-3.5 fill-[#D6A967] text-[#D6A967]" />
                      <span>{(reviewSummary[product.id]?.averageRating ?? product.rating).toFixed(1)}</span>
                      <span>({reviewSummary[product.id]?.reviewCount ?? product.reviews} reviews)</span>
                    </div>

                    <div className="mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#A08978] block mb-1.5">
                        Color Selection:
                      </span>
                      <div className="flex space-x-2">
                        {product.colors.map((color) => (
                          <button
                            key={color.id}
                            onClick={() => setCardSelectedColor({ ...cardSelectedColor, [product.id]: color })}
                            className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform ${color.border} ${
                              activeColor.id === color.id ? 'ring-2 ring-[#5C4033] scale-110' : 'hover:scale-105 opacity-80'
                            }`}
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#EBE4D8]">
                    <div className="flex items-baseline justify-between mb-3">
                      <div>
                        <span className="text-xs font-bold text-[#8C7462]">฿</span>
                        <span className="text-2xl font-serif font-bold text-[#4A3525] tracking-tight ml-0.5">
                          {product.price}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold uppercase text-[#A08978] bg-[#F3EEEA] px-2 py-0.5 rounded">
                        {product.fabric}
                      </span>
                    </div>

                    <div className="grid grid-cols-[1fr_auto] gap-2">
                      <button
                        onClick={() => purchaseProduct(product)}
                        className="bg-[#5C4033] hover:bg-[#4A3525] text-[#F9F6F0] font-semibold text-xs py-3 rounded-2xl shadow-sm flex items-center justify-center gap-1.5 transition-all transform active:scale-95"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Purchase</span>
                      </button>
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className={`rounded-2xl border px-3 transition-colors ${isLiked ? 'border-[#5C4033] bg-[#EFE8E2] text-[#5C4033]' : 'border-[#D8CEBE] text-[#8C7462] hover:bg-[#EFE8E2]'}`}
                        title={isLiked ? 'Remove saved item' : 'Save item'}
                      >
                        <Bookmark className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#4A3525]/40 backdrop-blur-sm p-4">
          <div className="bg-[#F9F6F0] rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#D8CEBE] relative animate-in fade-in zoom-in-95">
            <button 
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-5 right-5 text-[#8C7462] hover:text-[#4A3525]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 border border-[#5C4033] rounded-full flex items-center justify-center mx-auto mb-2">
                <Lock className="w-5 h-5 text-[#5C4033]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#4A3525]">Sign In to MAVI</h3>
              <p className="text-xs text-[#8C7462] mt-1">Access saved tote bags and custom order history</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6E5343] mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="name@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-[#D8CEBE] bg-[#FDFBF7] focus:outline-none focus:ring-2 focus:ring-[#5C4033]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6E5343] mb-1">Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-[#D8CEBE] bg-[#FDFBF7] focus:outline-none focus:ring-2 focus:ring-[#5C4033]"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#5C4033] hover:bg-[#4A3525] text-[#F9F6F0] font-semibold text-xs py-3 rounded-xl shadow-md transition-all"
              >
                Sign In / Demo Login
              </button>
            </form>
          </div>
        </div>
      )}

      {customizeProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#4A3525]/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#F9F6F0] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#D8CEBE] relative my-8">
            <button 
              onClick={() => setCustomizeProduct(null)}
              className="absolute top-6 right-6 p-2 text-[#8C7462] hover:text-[#4A3525]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-xs font-bold uppercase tracking-widest text-[#8C7462] mb-1">
              MAVI Studio Customizer
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#4A3525] mb-6">
              Customizing: {customizeProduct.name}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div 
                className="flex flex-col items-center justify-center p-6 rounded-2xl border border-[#D8CEBE] relative min-h-[220px] transition-colors"
                style={{ backgroundColor: customColor ? customColor.hex : '#FDFBF7' }}
              >
                <img
                  src={customizeProduct.imageUrl}
                  alt={customizeProduct.name}
                  className="w-full h-40 object-cover rounded-xl mix-blend-multiply mb-3 drop-shadow-sm"
                />

                {selectedCharms.length > 0 && (
                  <div className="flex items-center space-x-1 bg-[#F9F6F0]/90 backdrop-blur-sm px-3 py-1 rounded-full border border-[#D8CEBE] shadow-xs">
                    {selectedCharms.map((c) => (
                      <span key={c.id} className="text-sm" title={c.name}>{c.icon}</span>
                    ))}
                  </div>
                )}

                {embroideryText.trim() && (
                  <div className="mt-2 bg-[#4A3525] text-[#F9F6F0] px-4 py-0.5 rounded-full">
                    <span className="text-xs font-serif italic font-semibold">
                      "{embroideryText}"
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6E5343] mb-2">
                    1. Choose Fabric Color
                  </label>
                  <div className="flex space-x-3">
                    {customizeProduct.colors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setCustomColor(color)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${color.border} ${
                          customColor?.id === color.id ? 'ring-2 ring-[#5C4033] scale-110' : 'opacity-70 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        {customColor?.id === color.id && <Check className="w-3.5 h-3.5 text-[#5C4033]" />}
                      </button>
                    ))}
                  </div>
                  <span className="text-[11px] text-[#8C7462] mt-1 block font-medium">Selected: {customColor?.name}</span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6E5343] mb-2">
                    2. Add Charm Attachments
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {CHARM_OPTIONS.map((charm) => {
                      const isSelected = selectedCharms.some((c) => c.id === charm.id);
                      return (
                        <button
                          key={charm.id}
                          onClick={() => toggleCharm(charm)}
                          className={`p-2 rounded-xl border text-left flex items-center justify-between text-xs font-medium transition-all ${
                            isSelected 
                              ? 'bg-[#5C4033] text-[#F9F6F0] border-[#5C4033]' 
                              : 'bg-[#FDFBF7] border-[#D8CEBE] text-[#4A3525] hover:bg-[#EFE8E2]'
                          }`}
                        >
                          <span className="flex items-center space-x-1.5 truncate">
                            <span>{charm.icon}</span>
                            <span className="truncate text-[11px]">{charm.name}</span>
                          </span>
                          <span className="text-[10px] opacity-80">+฿{charm.price}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6E5343] mb-1">
                    3. Custom Gold-Thread Embroidery (+฿50)
                  </label>
                  <input
                    type="text"
                    maxLength={12}
                    placeholder="e.g. M.V. or Sophia"
                    value={embroideryText}
                    onChange={(e) => setEmbroideryText(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-[#D8CEBE] bg-[#FDFBF7] focus:outline-none focus:ring-2 focus:ring-[#5C4033]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6E5343] mb-1">
                    4. Handle Strap Preference
                  </label>
                  <select 
                    value={handleLength}
                    onChange={(e) => setHandleLength(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-[#D8CEBE] bg-[#FDFBF7] focus:outline-none focus:ring-2 focus:ring-[#5C4033]"
                  >
                    <option value="Standard (25cm)">Standard Shoulder Drop (25cm)</option>
                    <option value="Extended (32cm)">Extended Crossbody Strap (32cm)</option>
                    <option value="Hand Carry (18cm)">Short Hand Carry (18cm)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#EBE4D8] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#8C7462] uppercase tracking-wider block font-bold">Calculated Price</span>
                <div className="text-2xl font-serif font-bold text-[#4A3525]">
                  ฿{calculateCustomizedPrice()}
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setCustomizeProduct(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8C7462] hover:bg-[#EFE8E2]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddToCart}
                  className="bg-[#5C4033] hover:bg-[#4A3525] text-[#F9F6F0] px-6 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center space-x-2 transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Custom Bag to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-[#4A3525]/30 backdrop-blur-xs transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-[#F9F6F0] shadow-2xl border-l border-[#EBE4D8] flex flex-col justify-between p-6">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#EBE4D8]">
                  <div className="flex items-center space-x-2">
                    <ShoppingBasket className="w-5 h-5 text-[#5C4033]" />
                    <h3 className="font-serif font-bold text-[#4A3525] text-lg">Your MAVI Shopping Bag</h3>
                  </div>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="p-1 text-[#8C7462] hover:text-[#4A3525]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                  {cart.length === 0 ? (
                    <div className="text-center py-12">
                      <span className="text-4xl block mb-2">👜</span>
                      <p className="font-serif font-bold text-[#4A3525] text-sm">Your shopping bag is empty</p>
                      <p className="text-xs text-[#8C7462] mt-1">Explore our 299, 399, and 499 THB tote collections.</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div 
                        key={item.cartItemId}
                        className="p-4 bg-[#FDFBF7] rounded-2xl border border-[#EBE4D8] flex space-x-4 items-start relative"
                      >
                        <div 
                          className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl shrink-0 border border-[#D8CEBE]"
                          style={{ backgroundColor: item.selectedColor.hex }}
                        >
                          <img
                            src={item.product.imageUrl}
                            alt=""
                            className="w-full h-full object-cover rounded-xl mix-blend-multiply"
                          />
                        </div>

                        <div className="flex-1 text-xs space-y-1">
                          <h4 className="font-serif font-bold text-[#4A3525] text-sm">{item.product.name}</h4>
                          <p className="text-[#8C7462]">Color: {item.selectedColor.name}</p>
                          
                          {item.selectedCharms.length > 0 && (
                            <p className="text-[#6E5343]">
                              Charms: {item.selectedCharms.map((c) => c.name).join(', ')}
                            </p>
                          )}
                          
                          {item.embroideryText && (
                            <p className="text-[#5C4033] font-serif italic">
                              Embroidery: "{item.embroideryText}"
                            </p>
                          )}

                          <div className="pt-2 flex items-center justify-between">
                            <div className="flex items-center space-x-2 bg-[#F3EEEA] rounded-lg px-2 py-0.5 border border-[#D8CEBE]">
                              <button 
                                onClick={() => updateQuantity(item.cartItemId, -1)}
                                className="text-[#5C4033] font-bold px-1"
                              >
                                -
                              </button>
                              <span className="font-bold text-[#4A3525]">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.cartItemId, 1)}
                                className="text-[#5C4033] font-bold px-1"
                              >
                                +
                              </button>
                            </div>

                            <span className="font-serif font-bold text-[#4A3525] text-sm">
                              ฿{item.unitPrice * item.quantity}
                            </span>
                          </div>
                        </div>

                        <button 
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-[#8C7462] hover:text-[#5C4033] p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {cart.length > 0 && (
                <div className="pt-4 border-t border-[#EBE4D8] space-y-4">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-[#8C7462]">
                      <span>Subtotal</span>
                      <span>฿{totalCartPrice}</span>
                    </div>
                    <div className="flex justify-between text-[#8C7462]">
                      <span>Worldwide shipping</span>
                      <span className="text-emerald-700 font-bold">From FREE</span>
                    </div>
                    <div className="flex justify-between font-serif font-bold text-[#4A3525] text-base pt-2 border-t border-[#EBE4D8]">
                      <span>Total Amount</span>
                      <span>฿{totalCartPrice}</span>
                    </div>
                  </div>

                  <button 
                    onClick={openCheckout}
                    className="w-full bg-[#5C4033] hover:bg-[#4A3525] text-[#F9F6F0] font-bold py-3.5 rounded-2xl shadow-md text-xs tracking-wider transition-all"
                  >
                    CHECKOUT (฿{totalCartPrice})
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#4A3525]/45 p-4 backdrop-blur-sm">
          <div className="mx-auto my-6 max-w-2xl rounded-3xl border border-[#D8CEBE] bg-[#FDFBF7] p-5 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between border-b border-[#EBE4D8] pb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C7462]">MAVI checkout</p>
                <h3 className="mt-1 font-serif text-2xl font-bold text-[#4A3525]">Delivery and payment</h3>
                <p className="mt-1 text-xs text-[#8C7462]">We deliver worldwide. Payment is confirmed after your selected method is completed.</p>
              </div>
              <button type="button" onClick={() => setIsCheckoutOpen(false)} title="Close checkout" className="p-1 text-[#8C7462] hover:text-[#4A3525]"><X className="h-5 w-5" /></button>
            </div>

            <form onSubmit={handlePlaceOrder} className="mt-5 space-y-5">
              <section>
                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[#5C4033]"><MapPin className="h-4 w-4" /> Customer and shipping address</div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ['name', 'Full name', 'e.g. Mavi Customer'],
                    ['email', 'Email', 'you@example.com'],
                    ['phone', 'Phone number', '+66'],
                    ['country', 'Country', 'Thailand']
                  ].map(([field, label, placeholder]) => (
                    <label key={field} className="text-[10px] font-bold uppercase tracking-wider text-[#6E5343]">
                      {label}
                      <input required={field !== 'phone'} type={field === 'email' ? 'email' : 'text'} value={checkoutData[field]} onChange={(event) => updateCheckout(field, event.target.value)} placeholder={placeholder} className="mt-1 w-full rounded-xl border border-[#E7D8D0] bg-white p-2.5 text-sm font-normal normal-case tracking-normal text-[#4A3525] outline-none focus:border-[#5C4033]" />
                    </label>
                  ))}
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#6E5343] sm:col-span-2">Street address<input required value={checkoutData.address} onChange={(event) => updateCheckout('address', event.target.value)} placeholder="House number and street" className="mt-1 w-full rounded-xl border border-[#E7D8D0] bg-white p-2.5 text-sm font-normal normal-case tracking-normal text-[#4A3525] outline-none focus:border-[#5C4033]" /></label>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#6E5343]">City<input required value={checkoutData.city} onChange={(event) => updateCheckout('city', event.target.value)} className="mt-1 w-full rounded-xl border border-[#E7D8D0] bg-white p-2.5 text-sm font-normal normal-case tracking-normal text-[#4A3525] outline-none focus:border-[#5C4033]" /></label>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#6E5343]">State / province<input value={checkoutData.state} onChange={(event) => updateCheckout('state', event.target.value)} className="mt-1 w-full rounded-xl border border-[#E7D8D0] bg-white p-2.5 text-sm font-normal normal-case tracking-normal text-[#4A3525] outline-none focus:border-[#5C4033]" /></label>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#6E5343]">Postal code<input required value={checkoutData.postalCode} onChange={(event) => updateCheckout('postalCode', event.target.value)} className="mt-1 w-full rounded-xl border border-[#E7D8D0] bg-white p-2.5 text-sm font-normal normal-case tracking-normal text-[#4A3525] outline-none focus:border-[#5C4033]" /></label>
                </div>
              </section>

              <section className="border-t border-[#EBE4D8] pt-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[#5C4033]"><Globe2 className="h-4 w-4" /> Worldwide delivery</div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {[['worldwide-standard', 'Standard worldwide delivery', checkoutData.country === 'Thailand' ? 'Free' : '฿450'], ['worldwide-express', 'Express worldwide delivery', '฿850']].map(([value, label, price]) => (
                    <label key={value} className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3 text-xs ${checkoutData.shippingMethod === value ? 'border-[#5C4033] bg-[#F3EEEA]' : 'border-[#E7D8D0]'}`}>
                      <span><input type="radio" name="shipping" value={value} checked={checkoutData.shippingMethod === value} onChange={(event) => updateCheckout('shippingMethod', event.target.value)} className="mr-2 accent-[#5C4033]" />{label}</span><strong>{price}</strong>
                    </label>
                  ))}
                </div>
              </section>

              <section className="border-t border-[#EBE4D8] pt-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[#5C4033]"><CreditCard className="h-4 w-4" /> Payment method</div>
                <div className="grid gap-2 sm:grid-cols-3">
                  {[['promptpay', 'PromptPay', CreditCard], ['card', 'Credit / debit card', CreditCard], ['ewallet', 'E-wallet', Wallet]].map(([value, label, Icon]) => (
                    <label key={value} className={`flex cursor-pointer flex-col gap-2 rounded-2xl border p-3 text-xs ${checkoutData.paymentMethod === value ? 'border-[#5C4033] bg-[#F3EEEA]' : 'border-[#E7D8D0]'}`}><span className="flex items-center gap-2"><input type="radio" name="payment" value={value} checked={checkoutData.paymentMethod === value} onChange={(event) => updateCheckout('paymentMethod', event.target.value)} className="accent-[#5C4033]" /><Icon className="h-4 w-4" />{label}</span><span className="text-[10px] text-[#8C7462]">Payment confirmation step follows</span></label>
                  ))}
                </div>
              </section>

              <div className="flex items-center justify-between border-t border-[#EBE4D8] pt-5"><div><span className="block text-[10px] font-bold uppercase tracking-wider text-[#8C7462]">Order total</span><strong className="font-serif text-2xl text-[#4A3525]">฿{checkoutTotal}</strong></div><button type="submit" className="rounded-2xl bg-[#5C4033] px-5 py-3 text-xs font-bold text-[#F9F6F0] shadow-md hover:bg-[#4A3525]">CONTINUE TO PAYMENT</button></div>
            </form>
          </div>
        </div>
      )}

      {orderReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#4A3525]/50 backdrop-blur-sm p-4">
          <div className="bg-[#FDFBF7] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#D8CEBE] text-center space-y-4 relative animate-in fade-in">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <h3 className="font-serif text-2xl font-bold text-[#4A3525]">Order Confirmed!</h3>
            <p className="text-xs text-[#8C7462]">Thank you, {orderReceipt.customer}. Your handcrafted MAVI tote bag order has been received.</p>

            <div className="bg-[#F3EEEA] p-4 rounded-2xl text-left text-xs space-y-2 border border-[#E4DBD0]">
              <div className="flex justify-between text-[#6E5343] font-bold pb-2 border-b border-[#D8CEBE]">
                <span>Receipt: {orderReceipt.orderId}</span>
                <span>{orderReceipt.date}</span>
              </div>

              <div className="space-y-1.5 py-1">
                {orderReceipt.items.map((i) => (
                  <div key={i.cartItemId} className="flex justify-between text-[#4A3525]">
                    <span>{i.quantity}x {i.product.name} ({i.selectedColor.name})</span>
                    <span className="font-bold">฿{i.unitPrice * i.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-[#4A3525] font-serif font-bold text-sm pt-2 border-t border-[#D8CEBE]">
                <span>Total ({orderReceipt.paymentStatus})</span>
                <span>฿{orderReceipt.total}</span>
              </div>
              <p className="pt-1 text-[10px] text-[#8C7462]">Payment method: {orderReceipt.paymentMethod === 'promptpay' ? 'PromptPay' : orderReceipt.paymentMethod === 'card' ? 'Credit / debit card' : 'E-wallet'}</p>
              <p className="text-[10px] text-[#8C7462]">Shipping to: {orderReceipt.shippingAddress}</p>
            </div>

            <button 
              onClick={() => setOrderReceipt(null)}
              className="w-full bg-[#5C4033] hover:bg-[#4A3525] text-[#F9F6F0] font-bold py-3 rounded-2xl text-xs"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="rounded-3xl border border-[#E4DBD0] bg-[#F3EEEA] p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C7462]">Order tracking</p>
              <h3 className="mt-1 font-serif text-2xl text-[#4A3525]">Track your MAVI delivery</h3>
            </div>
            <span className="inline-flex w-fit items-center rounded-full bg-[#E9E1D9] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#5C4033]">
              {trackingInfo ? trackingInfo.status : 'No active order'}
            </span>
          </div>

          {trackingInfo ? (
            <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-2xl border border-[#D8CEBE] bg-[#FDFBF7] p-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#8C7462]">Tracking ID</p>
                    <strong className="mt-1 block font-serif text-lg text-[#4A3525]">{trackingInfo.orderId}</strong>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#8C7462]">Courier</p>
                    <strong className="mt-1 block text-sm font-bold text-[#4A3525]">{trackingInfo.courier}</strong>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#8C7462]">ETA</p>
                    <strong className="mt-1 block text-sm font-bold text-[#4A3525]">{trackingInfo.eta}</strong>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#6E5343]">
                    <span>Progress</span>
                    <span>{trackingInfo.progress}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-[#E9E1D9]">
                    <div className="h-full rounded-full bg-[#7D8F7A]" style={{ width: `${trackingInfo.progress}%` }} />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#D8CEBE] bg-[#FDFBF7] p-4">
                <div className="space-y-3">
                  {trackingInfo.steps.map((step) => (
                    <div key={step.label} className="flex items-center gap-3">
                      <div className={`h-3 w-3 rounded-full ${step.done ? 'bg-[#7D8F7A]' : 'bg-[#E9E1D9]'}`} />
                      <span className={`text-xs ${step.done ? 'font-bold text-[#4A3525]' : 'text-[#8C7462]'}`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-5 text-sm text-[#6E5343]">
              Place an order to see real-time delivery updates, shipping milestones, and tracking details here.
            </p>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-[#E4DBD0] bg-[#F3EEEA] p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C7462]">Verified reviews</p>
                <h3 className="mt-1 font-serif text-2xl text-[#4A3525]">What customers are saying</h3>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-[#FDFBF7] border border-[#D8CEBE] px-3 py-1.5 text-xs font-bold text-[#5C4033]">
                <Star className="h-3.5 w-3.5 fill-[#D6A967] text-[#D6A967]" />
                {(customerReviews.reduce((sum, review) => sum + review.rating, 0) / customerReviews.length).toFixed(1)}
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {customerReviews.slice(0, 3).map((review) => (
                <div key={review.id} className="rounded-2xl border border-[#D8CEBE] bg-[#FDFBF7] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#5C4033]">{review.productName}</p>
                      <p className="text-[10px] text-[#8C7462]">{review.reviewer}</p>
                    </div>
                    <span className="text-[10px] text-[#8C7462]">{review.date}</span>
                  </div>

                  <div className="mt-2 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3.5 w-3.5 ${star <= review.rating ? 'fill-[#D6A967] text-[#D6A967]' : 'text-[#D9D3C8]'}`}
                      />
                    ))}
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-[#4A3525]">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[#E4DBD0] bg-[#FDFBF7] p-5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C7462]">Leave a review</p>
            <h3 className="mt-1 font-serif text-2xl text-[#4A3525]">Share your thoughts</h3>

            <form onSubmit={handleSubmitReview} className="mt-5 space-y-4">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6E5343]">
                Product
                <select
                  value={reviewForm.productId}
                  onChange={(event) => setReviewForm((previous) => ({ ...previous, productId: Number(event.target.value) }))}
                  className="mt-1 w-full rounded-xl border border-[#E7D8D0] bg-[#F9F6F0] p-2.5 text-sm text-[#4A3525] outline-none focus:border-[#5C4033]"
                >
                  {catalog.map((product) => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                  ))}
                </select>
              </label>

              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6E5343]">
                Your name
                <input
                  type="text"
                  value={reviewForm.reviewer}
                  onChange={(event) => setReviewForm((previous) => ({ ...previous, reviewer: event.target.value }))}
                  placeholder="Name"
                  className="mt-1 w-full rounded-xl border border-[#E7D8D0] bg-[#F9F6F0] p-2.5 text-sm text-[#4A3525] outline-none focus:border-[#5C4033]"
                />
              </label>

              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6E5343]">
                Rating
                <select
                  value={reviewForm.rating}
                  onChange={(event) => setReviewForm((previous) => ({ ...previous, rating: Number(event.target.value) }))}
                  className="mt-1 w-full rounded-xl border border-[#E7D8D0] bg-[#F9F6F0] p-2.5 text-sm text-[#4A3525] outline-none focus:border-[#5C4033]"
                >
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <option key={rating} value={rating}>{rating} star{rating > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </label>

              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6E5343]">
                Review
                <textarea
                  rows={4}
                  value={reviewForm.comment}
                  onChange={(event) => setReviewForm((previous) => ({ ...previous, comment: event.target.value }))}
                  placeholder="Tell us about your experience..."
                  className="mt-1 w-full rounded-xl border border-[#E7D8D0] bg-[#F9F6F0] p-2.5 text-sm text-[#4A3525] outline-none focus:border-[#5C4033]"
                />
              </label>

              <button type="submit" className="w-full rounded-2xl bg-[#5C4033] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#F9F6F0] shadow-sm hover:bg-[#4A3525]">
                Submit review
              </button>
            </form>
          </div>
        </div>
      </section>

      {isChatOpen && (
        <div className="fixed bottom-24 right-4 z-50 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-[#D8CEBE] bg-[#FDFBF7] shadow-2xl">
          <div className="flex items-center justify-between bg-[#5C4033] px-5 py-4 text-[#F9F6F0]">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E8DCD1]">MAVI concierge</p>
              <h3 className="font-serif text-lg">Chat with us</h3>
            </div>
            <button type="button" onClick={() => setIsChatOpen(false)} title="Close chat" className="rounded-full p-1 hover:bg-[#6E5343]"><X className="h-4 w-4" /></button>
          </div>
          <div className="max-h-72 space-y-3 overflow-y-auto p-4">
            {chatMessages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'shopper' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] ${message.sender === 'shopper' ? 'items-end' : 'items-start'}`}>
                  <p className={`rounded-2xl px-3 py-2 text-xs leading-relaxed ${message.sender === 'shopper' ? 'bg-[#5C4033] text-[#F9F6F0]' : 'bg-[#F3EEEA] text-[#5C4033]'}`}>
                    {message.text}
                  </p>
                  {message.recommendation && (
                    <button
                      type="button"
                      onClick={() => {
                        const recommendedProduct = catalog.find((product) => product.id === message.recommendation.productId);
                        const recommendedColor = recommendedProduct?.colors?.find((color) => color.id === message.recommendation.colorId);
                        if (recommendedProduct) openCustomizer(recommendedProduct, recommendedColor);
                      }}
                      className="mt-2 flex items-center gap-1 rounded-full border border-[#D8CEBE] bg-[#FDFBF7] px-3 py-1.5 text-[10px] font-bold text-[#5C4033] hover:bg-[#EFE8E2]"
                    >
                      <ShoppingBag className="h-3 w-3" /> View this tote
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 px-4 pb-3">
            {['Which tote is best for everyday use?', 'Can I customize a tote?'].map((question) => (
              <button key={question} type="button" onClick={() => setChatMessage(question)} className="rounded-full border border-[#D8CEBE] px-3 py-1.5 text-[10px] text-[#6E5343] hover:bg-[#F3EEEA]">{question}</button>
            ))}
          </div>
          <form onSubmit={submitChatMessage} className="flex gap-2 border-t border-[#EBE4D8] p-3">
            <input value={chatMessage} onChange={(event) => setChatMessage(event.target.value)} placeholder="Write a message..." aria-label="Chat message" className="min-w-0 flex-1 rounded-xl border border-[#E7D8D0] bg-white px-3 py-2 text-xs text-[#4A3525] outline-none focus:border-[#5C4033]" />
            <button type="submit" title="Send message" className="rounded-xl bg-[#5C4033] px-3 text-[#F9F6F0] hover:bg-[#4A3525]"><Send className="h-4 w-4" /></button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsChatOpen((open) => !open)}
        title="Chat with MAVI"
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#5C4033] px-4 py-3 text-xs font-bold text-[#F9F6F0] shadow-xl transition-transform hover:scale-105"
      >
        <MessageCircle className="h-4 w-4" />
        <span>Chat with MAVI</span>
      </button>

      <footer className="mt-16 border-t border-[#EBE4D8] bg-[#F3EEEA] py-12">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border border-[#5C4033] rounded-full flex items-center justify-center mb-1">
              <span className="font-serif text-xs font-bold">MV</span>
            </div>
            <span className="font-serif tracking-[0.25em] text-lg font-bold uppercase text-[#4A3525]">MAVI</span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#8C7462] font-medium">TOTE BAG</span>
          </div>

          <p className="text-xs text-[#8C7462] max-w-sm mx-auto leading-relaxed">
            Crafting elegant, durable, and squishy tote bags designed to elevate your daily style.
          </p>

          <div className="text-[11px] text-[#A08978] pt-2">
            © {new Date().getFullYear()} MAVI TOTE BAG. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
