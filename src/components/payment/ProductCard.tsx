import React, { useState } from 'react';
import { StripeProduct } from '../../stripe-config';
import { stripeService } from '../../services/stripeService';
import { CreditCard, Loader2 } from 'lucide-react';

interface ProductCardProps {
  product: StripeProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePurchase = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { url } = await stripeService.createCheckoutSession({
        priceId: product.priceId,
        mode: product.mode,
      });

      if (url) {
        window.location.href = url;
      }
    } catch (error: any) {
      setError(error.message || 'Failed to start checkout');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="backdrop-blur-md bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {product.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          {product.description}
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50/50 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/50">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handlePurchase}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-medium transition-colors duration-200 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              {product.mode === 'subscription' ? 'Subscribe' : 'Donate'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};