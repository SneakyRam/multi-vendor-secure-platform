import React, { useState, useEffect, useCallback } from 'react';
import { CATEGORIES } from './data/products';
import { Product, CategoryType } from './types';
import { InitialLoader } from './components/InitialLoader';
import { Navbar } from './components/Navbar';
import { ProductStage } from './components/ProductStage';
import { CatalogDrawer } from './components/CatalogDrawer';
import { TrustEngineSection } from './components/TrustEngineSection';
import { LookbookGrid } from './components/LookbookGrid';
import { ProductModal } from './components/ProductModal';
import { SearchModal } from './components/SearchModal';
import { CartDrawer, CartItem } from './components/CartDrawer';
import { SecurityBadge } from './components/SecurityBadge';
import { Footer } from './components/Footer';
import { VendorPortal } from './components/VendorPortal';
import { AdminSecurityPortal } from './components/AdminSecurityPortal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileCategoryFeed } from './components/MobileCategoryFeed';
import { AiAssistantModal } from './components/AiAssistantModal';
import { Bot, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [currentRole, setCurrentRole] = useState<'customer' | 'vendor' | 'admin'>('customer');
  const [activeCategoryId, setActiveCategoryId] = useState<CategoryType>('shoes');
  const [productIndex, setProductIndex] = useState<number>(0);
  const [inspectedProduct, setInspectedProduct] = useState<Product | null>(null);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);



  // Find active category chapter
  const currentCategory =
    CATEGORIES.find((c) => c.id === activeCategoryId) || CATEGORIES[0];
  const currentProduct =
    currentCategory.products[productIndex] || currentCategory.products[0];

  // Switch category and reset product index to 0
  const handleSelectCategory = useCallback((categoryId: string) => {
    setActiveCategoryId(categoryId as CategoryType);
    setProductIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Launch ANY product directly into the 3D cinematic stage
  const handleSelectProduct = useCallback((product: Product) => {
    setActiveCategoryId(product.category);
    const cat = CATEGORIES.find((c) => c.id === product.category);
    if (cat) {
      const idx = cat.products.findIndex((p) => p.id === product.id);
      setProductIndex(idx >= 0 ? idx : 0);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0F172A] selection:bg-neutral-200 selection:text-black relative">
      
      {/* 1. Luminous Light Beam Preloader: NEXORA as the light */}
      {!loadingComplete && (
        <InitialLoader onComplete={() => setLoadingComplete(true)} />
      )}

      {/* 2. Top Luxury Navigation Bar with Triple-Experience Switcher */}
      <Navbar
        activeCategory={activeCategoryId}
        cartCount={totalCartCount}
        currentRole={currentRole}
        onSelectRole={setCurrentRole}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenCatalog={() => setIsCatalogOpen(true)}
        onOpenAi={() => setIsAiOpen(true)}
        onSelectCategory={handleSelectCategory}
      />

      {/* Main Content Area: Customer vs Vendor vs Admin */}
      {currentRole === 'vendor' ? (
        <VendorPortal />
      ) : currentRole === 'admin' ? (
        <AdminSecurityPortal />
      ) : (
        <main>
          {/* 1. Cinematic 3D Hero Stage (Highlight of NEXORA on BOTH Desktop & Mobile) */}
          <section id="stage" className="relative w-full">
            <ProductStage
              category={currentCategory}
              product={currentProduct}
              productIndex={productIndex}
              onSelectProductIndex={(idx) => setProductIndex(idx)}
              onInspectProduct={(prod) => setInspectedProduct(prod)}
              onAddToCart={handleAddToCart}
              onOpenCatalog={() => setIsCatalogOpen(true)}
            />
          </section>

          {/* Mobile View: Sequential Category-by-Category Scroll Flow (Shoes -> Headphones -> Watches -> Cameras -> Backpacks) */}
          <MobileCategoryFeed
            onInspectProduct={(prod) => setInspectedProduct(prod)}
            onAddToCart={handleAddToCart}
          />

          {/* 4. Cryptographic Trust Engine & Verification Terminal */}
          <TrustEngineSection />

          {/* 5. Curated Lookbook & Bento Directory Grid */}
          <LookbookGrid
            onLaunchStage={handleSelectProduct}
            onInspectProduct={(prod) => setInspectedProduct(prod)}
            onAddToCart={handleAddToCart}
          />

          {/* 6. Luxury Footer */}
          <Footer onSelectCategory={handleSelectCategory} />
        </main>
      )}

      {/* Modals & Slide-overs */}
      <CatalogDrawer
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        onSelectProduct={handleSelectProduct}
        onAddToCart={handleAddToCart}
      />

      <ProductModal
        product={inspectedProduct}
        onClose={() => setInspectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(prod) => {
          handleSelectProduct(prod);
          setIsSearchOpen(false);
        }}
      />

      <AiAssistantModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        onSelectProduct={handleSelectProduct}
      />

      <CartDrawer
        isOpen={isCartOpen}
        items={cartItems}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />


      {/* 7. Fixed Cybersecurity Status Badge (Desktop Only) */}
      <div className="hidden md:block">
        <SecurityBadge />
      </div>

      {/* 8. Luxury Frosted Mobile Bottom Navigation Bar (Section 35) */}
      <MobileBottomNav
        currentRole={currentRole}
        cartCount={totalCartCount}
        onSelectRole={setCurrentRole}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />
    </div>
  );
};
