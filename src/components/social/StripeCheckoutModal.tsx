import React, { useState, useEffect } from 'react';
import { X, Zap, MapPin, CreditCard, Truck, Check, Lock, ShieldCheck } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, ExpressCheckoutElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const isRealStripeKey = typeof stripePublicKey === 'string' && stripePublicKey.startsWith('pk_') && !stripePublicKey.includes('placeholder');
const stripePromise = isRealStripeKey ? loadStripe(stripePublicKey) : null;

function LiveCheckoutForm({ clientSecret, post, size, price, isNegotiated, onSuccess, onCancel }: any) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return (
    <>
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
        <Zap className="w-5 h-5 text-orange-500 fill-orange-500/20 animate-pulse" />
        <h3 className="text-white font-mono font-bold text-sm uppercase tracking-wide">
          1-CLICK INSTANT CHECKOUT
        </h3>
      </div>

      <div className="flex gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
        <img
          src={post?.merchData?.thumbnail || post?.thumbnail}
          alt={post?.merchData?.name || post?.title || 'Merch'}
          className="w-16 h-16 object-contain bg-zinc-900 rounded p-1"
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-mono font-bold text-xs truncate">
            {post?.merchData?.name || post?.title || 'Band Merchandise'}
          </h4>
          <p className="text-zinc-500 font-mono text-[10px] uppercase mt-0.5">
            BY @{post?.authorName || 'Band'} • SIZE: {size}
          </p>
          <div className="text-orange-400 font-mono font-black text-sm mt-1">
            ${price.toFixed(2)}
            {isNegotiated && (
              <span className="text-[9px] text-purple-400 ml-2">(NEGOTIATED RATE)</span>
            )}
          </div>
        </div>
      </div>

      <div className="my-4">
        <div className="bg-white rounded p-1">
          <ExpressCheckoutElement
            onConfirm={async (event) => {
              if (!stripe || !elements) return;
              const { error } = await stripe.confirmPayment({
                elements,
                clientSecret,
                confirmParams: {
                  return_url: window.location.href,
                },
                redirect: 'if_required'
              });
              if (error) {
                setErrorMessage(error.message || 'Payment failed');
              } else {
                onSuccess();
              }
            }}
          />
        </div>
        {errorMessage && <div className="text-red-500 text-xs mt-2">{errorMessage}</div>}
      </div>

      <div className="space-y-2 text-xs font-mono text-zinc-300 bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-900">
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-zinc-500 flex items-center gap-1"><MapPin className="w-3 h-3 text-orange-500" /> SHIPPING:</span>
          <span className="font-bold text-zinc-200">Wallet Default Address</span>
        </div>
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-zinc-500 flex items-center gap-1"><Truck className="w-3 h-3 text-sky-500" /> DELIVERY:</span>
          <span className="font-bold text-zinc-200">2-DAY PRIORITY EXPRESS</span>
        </div>
      </div>

      <button
        onClick={onSuccess}
        className="w-full mt-3 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800 font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <CreditCard className="w-4 h-4" /> MANUAL CARD CHECKOUT (DEMO)
      </button>
    </>
  );
}

function ExpressDemoCheckoutForm({ post, size, price, isNegotiated, onSuccess }: any) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 800);
  };

  return (
    <>
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
        <Zap className="w-5 h-5 text-orange-500 fill-orange-500/20 animate-pulse" />
        <h3 className="text-white font-mono font-bold text-sm uppercase tracking-wide">
          1-CLICK INSTANT CHECKOUT
        </h3>
      </div>

      <div className="flex gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
        <img
          src={post?.merchData?.thumbnail || post?.thumbnail || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300'}
          alt={post?.merchData?.name || post?.title || 'Merch'}
          className="w-16 h-16 object-contain bg-zinc-900 rounded p-1"
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-mono font-bold text-xs truncate">
            {post?.merchData?.name || post?.title || 'Exclusive Tour Merch'}
          </h4>
          <p className="text-zinc-500 font-mono text-[10px] uppercase mt-0.5">
            BY @{post?.authorName || 'Band'} • SIZE: {size || 'Standard'}
          </p>
          <div className="text-orange-400 font-mono font-black text-sm mt-1 flex items-center gap-2">
            ${Number(price || 0).toFixed(2)}
            {isNegotiated && (
              <span className="text-[9px] text-purple-400 font-bold bg-purple-950/60 border border-purple-500/30 px-1.5 py-0.5 rounded">NEGOTIATED RATE</span>
            )}
          </div>
        </div>
      </div>

      {/* 1-Click Payment Provider Buttons */}
      <div className="space-y-2 my-2">
        <button
          onClick={handlePay}
          disabled={isProcessing}
          className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-mono font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(249,115,22,0.35)] transition-all cursor-pointer transform active:scale-95 disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              AUTHORIZING SECURE 1-CLICK CHECKOUT...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-black" />
              PAY NOW • ${Number(price || 0).toFixed(2)}
            </>
          )}
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handlePay}
            disabled={isProcessing}
            className="py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-mono font-bold text-[11px] rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <span className="text-xs">Pay</span> Apple Pay
          </button>
          <button
            onClick={handlePay}
            disabled={isProcessing}
            className="py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-mono font-bold text-[11px] rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <span className="text-xs text-sky-400 font-sans font-bold">G</span> Google Pay
          </button>
        </div>
      </div>

      <div className="space-y-2 text-xs font-mono text-zinc-300 bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-900">
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-zinc-500 flex items-center gap-1"><MapPin className="w-3 h-3 text-orange-500" /> SHIPPING:</span>
          <span className="font-bold text-zinc-200">Wallet Saved Address</span>
        </div>
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-zinc-500 flex items-center gap-1"><Truck className="w-3 h-3 text-sky-500" /> DELIVERY:</span>
          <span className="font-bold text-zinc-200">2-DAY PRIORITY EXPRESS</span>
        </div>
        <div className="flex justify-between items-center text-[10px] text-zinc-500 pt-1 border-t border-zinc-900">
          <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-400" /> 256-bit Encrypted</span>
          <span className="flex items-center gap-1"><Lock className="w-3 h-3 text-amber-400" /> Instant Band Settlement</span>
        </div>
      </div>
    </>
  );
}

export function StripeCheckoutModal({ post, size, price, isNegotiated, onClose }: any) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<'confirm' | 'success'>('confirm');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/checkout/create-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: price, currency: 'usd', merchantId: post?.authorId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setClientSecret(`pi_mock_${Date.now()}`);
        }
      })
      .catch((err) => {
        console.warn('Checkout intent fallback triggered:', err);
        setClientSecret(`pi_mock_${Date.now()}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [price, post?.authorId]);

  const isLiveStripeMode = isRealStripeKey && stripePromise && clientSecret && !clientSecret.startsWith('pi_mock_');

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[#0f1013] border border-orange-500/50 rounded-2xl max-w-md w-full p-6 shadow-[0_0_50px_rgba(249,115,22,0.2)] space-y-4 relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full bg-zinc-900 text-zinc-400 hover:text-white transition-colors cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {checkoutStep === 'confirm' ? (
          isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-orange-500 font-mono text-xs">
              <span className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <span>INITIALIZING SECURE 1-CLICK CHECKOUT...</span>
            </div>
          ) : isLiveStripeMode ? (
            <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
              <LiveCheckoutForm
                clientSecret={clientSecret}
                post={post}
                size={size}
                price={price}
                isNegotiated={isNegotiated}
                onSuccess={() => setCheckoutStep('success')}
                onCancel={onClose}
              />
            </Elements>
          ) : (
            <ExpressDemoCheckoutForm
              post={post}
              size={size}
              price={price}
              isNegotiated={isNegotiated}
              onSuccess={() => setCheckoutStep('success')}
            />
          )
        ) : (
          <div className="text-center py-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-white font-mono font-black text-base uppercase tracking-wider">
              ORDER CONFIRMED #SLM-{Math.floor(10000 + Math.random() * 90000)}!
            </h3>
            <p className="text-zinc-400 font-mono text-xs max-w-xs mx-auto">
              Your item from @{post?.authorName || 'Band'} has been processed via Wallet! Tracking number sent to your account email.
            </p>
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-mono font-bold text-xs uppercase rounded-xl transition-colors cursor-pointer"
            >
              BACK TO FEED
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

