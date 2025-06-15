import React, { useState } from 'react';
import { StripeProduct } from '../../stripe-config';
import { stripeService } from '../../services/stripeService';
import { Heart, Loader2 } from 'lucide-react';

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
        mode: 'payment',
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
    <div className="bg-white/90 dark:bg-gray-800/90 border border-gray-200/70 dark:border-gray-600/70 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {product.name}
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
          {product.description}
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50">
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handlePurchase}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-pink-500 hover:bg-pink-600 disabled:bg-pink-400 text-white font-medium transition-colors duration-200 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Heart className="w-5 h-5" />
              Donate
            </>
          )}
        </button>
      </div>
    </div>
  );
};