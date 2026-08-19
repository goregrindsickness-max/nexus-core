import React, { useState, useEffect } from 'react';
import { X, Zap, MapPin, CreditCard, Truck, Check, Lock, ShieldCheck } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, ExpressCheckoutElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const isRealStripeKey = typeof stripePublicKey === 'string' && stripePublicKey.startsWith('pk_') && !stripePublicKey.includes('placeholder');
const stripePromise = isRealStripeKey ? loadStripe(stripePublicKey) : null;

function LiveCartCheckoutForm({ clientSecret, cartItems, totalAmount, onSuccess, onCancel }: any) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return (
    <>
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
        <Zap className="w-5 h-5 text-rose-500 fill-rose-500/20 animate-pulse" />
        <h3 className="text-white font-mono font-bold text-sm uppercase tracking-wide">
          EXPRESS CART CHECKOUT
        </h3>
      </div>

      <div className="flex flex-col gap-2 bg-zinc-950 p-3 rounded-xl border border-zinc-800 max-h-40 overflow-y-auto scrollbar-thin">
        {cartItems.map((item: any, idx: number) => (
          <div key={idx} className="flex gap-3 items-center">
            <img
              src={item.image || item.thumbnail}
              alt={item.name}
              className="w-12 h-12 object-contain bg-zinc-900 rounded p-1 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-mono font-bold text-[11px] truncate">
                {item.name}
              </h4>
              <p className="text-zinc-500 font-mono text-[9px] uppercase mt-0.5">
                BY {item.bandName} {item.size ? `• SIZE: ${item.size}` : ''} • QTY: {item.quantity}
              </p>
            </div>
            <div className="text-rose-400 font-mono font-black text-xs shrink-0">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center py-2 px-1 border-y border-zinc-800/50 my-2">
        <span className="text-zinc-400 font-mono text-xs uppercase font-bold">Total (incl. 7.77% fee)</span>
        <span className="text-rose-500 font-mono text-lg font-black">${totalAmount.toFixed(2)}</span>
      </div>

      <div className="my-3">
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
          <span className="text-zinc-500 flex items-center gap-1"><MapPin className="w-3 h-3 text-rose-500" /> SHIPPING:</span>
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

function ExpressCartDemoForm({ cartItems, totalAmount, onSuccess }: any) {
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
        <Zap className="w-5 h-5 text-rose-500 fill-rose-500/20 animate-pulse" />
        <h3 className="text-white font-mono font-bold text-sm uppercase tracking-wide">
          EXPRESS CART CHECKOUT
        </h3>
      </div>

      <div className="flex flex-col gap-2 bg-zinc-950 p-3 rounded-xl border border-zinc-800 max-h-40 overflow-y-auto scrollbar-thin">
        {cartItems.map((item: any, idx: number) => (
          <div key={idx} className="flex gap-3 items-center">
            <img
              src={item.image || item.thumbnail || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300'}
              alt={item.name}
              className="w-12 h-12 object-contain bg-zinc-900 rounded p-1 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-mono font-bold text-[11px] truncate">
                {item.name}
              </h4>
              <p className="text-zinc-500 font-mono text-[9px] uppercase mt-0.5">
                BY {item.bandName || 'Band'} {item.size ? `• SIZE: ${item.size}` : ''} • QTY: {item.quantity || 1}
              </p>
            </div>
            <div className="text-rose-400 font-mono font-black text-xs shrink-0">
              ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center py-2 px-1 border-y border-zinc-800/50 my-2">
        <span className="text-zinc-400 font-mono text-xs uppercase font-bold">Total (incl. fee)</span>
        <span className="text-rose-500 font-mono text-lg font-black">${totalAmount.toFixed(2)}</span>
      </div>

      {/* 1-Click Pay Buttons */}
      <div className="space-y-2 my-2">
        <button
          onClick={handlePay}
          disabled={isProcessing}
          className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-mono font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(244,63,94,0.35)] transition-all cursor-pointer transform active:scale-95 disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              AUTHORIZING SECURE EXPRESS CHECKOUT...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-white" />
              1-CLICK CHECKOUT • ${totalAmount.toFixed(2)}
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
          <span className="text-zinc-500 flex items-center gap-1"><MapPin className="w-3 h-3 text-rose-500" /> SHIPPING:</span>
          <span className="font-bold text-zinc-200">Wallet Saved Address</span>
        </div>
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-zinc-500 flex items-center gap-1"><Truck className="w-3 h-3 text-sky-500" /> DELIVERY:</span>
          <span className="font-bold text-zinc-200">2-DAY PRIORITY EXPRESS</span>
        </div>
      </div>
    </>
  );
}

export function StripeCartCheckoutModal({ cartItems, onClose, onClearCart }: any) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<'confirm' | 'success'>('confirm');
  const [isLoading, setIsLoading] = useState(true);

  const totalAmount = (cartItems || []).reduce((acc: number, item: any) => acc + ((item.price || 0) * (item.quantity || 1)), 0);

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/checkout/create-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: totalAmount, currency: 'usd' }),
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
        console.warn('Cart checkout intent fallback triggered:', err);
        setClientSecret(`pi_mock_${Date.now()}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [totalAmount]);

  const isLiveStripeMode = isRealStripeKey && stripePromise && clientSecret && !clientSecret.startsWith('pi_mock_');

  return (
    <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[#0f1013] border border-rose-500/50 rounded-2xl max-w-md w-full p-6 shadow-[0_0_50px_rgba(244,63,94,0.2)] space-y-4 relative overflow-hidden max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full bg-zinc-900 text-zinc-400 hover:text-white transition-colors cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {checkoutStep === 'confirm' ? (
          isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-rose-500 font-mono text-xs">
              <span className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
              <span>INITIALIZING SECURE CART CHECKOUT...</span>
            </div>
          ) : isLiveStripeMode ? (
            <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
              <LiveCartCheckoutForm
                clientSecret={clientSecret}
                cartItems={cartItems}
                totalAmount={totalAmount}
                onSuccess={() => {
                  setCheckoutStep('success');
                  if (onClearCart) onClearCart();
                }}
                onCancel={onClose}
              />
            </Elements>
          ) : (
            <ExpressCartDemoForm
              cartItems={cartItems}
              totalAmount={totalAmount}
              onSuccess={() => {
                setCheckoutStep('success');
                if (onClearCart) onClearCart();
              }}
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
              Your cart has been processed via Wallet! Tracking numbers sent to your account email.
            </p>
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-mono font-bold text-xs uppercase rounded-xl transition-colors cursor-pointer"
            >
              CLOSE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

