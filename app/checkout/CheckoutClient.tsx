'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Truck, Store, MapPin, AlertCircle } from 'lucide-react';
import { getCart, getCartTotal, clearCart, CartItem } from '@/lib/cart';

type Step = 'info' | 'delivery' | 'payment';
type DeliveryOption = 'DELIVERY' | 'PICKUP';
type DeliverySlot = 'MORNING' | 'MIDDAY' | 'END_OF_DAY';
type CustomerType = 'B2C' | 'B2B';

export default function CheckoutClient() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentStep, setCurrentStep] = useState<Step>('info');
  const [customerType, setCustomerType] = useState<CustomerType>('B2C');
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    notes: '',
  });
  const [deliveryData, setDeliveryData] = useState({
    deliveryOption: 'DELIVERY' as DeliveryOption,
    deliverySlot: 'MORNING' as DeliverySlot,
    deliveryDate: '',
    deliveryAddress: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const cartItems = getCart();
    if (cartItems.length === 0) {
      router.push('/cart');
    }
    setCart(cartItems);
    const savedType = localStorage.getItem('customerType') as CustomerType;
    if (savedType) setCustomerType(savedType);
  }, [router]);

  const DELIVERY_FEE = 5;
  const subtotal = getCartTotal();
  const total = subtotal + (deliveryData.deliveryOption === 'DELIVERY' ? DELIVERY_FEE : 0);

  const steps: { key: Step; label: string; number: number }[] = [
    { key: 'info', label: 'Customer Info', number: 1 },
    { key: 'delivery', label: 'Delivery', number: 2 },
    { key: 'payment', label: 'Review & Pay', number: 3 },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === currentStep);

  const validateInfoStep = () => {
    if (!formData.customerName || !formData.customerPhone) {
      setError('Name and phone number are required.');
      return false;
    }
    setError('');
    return true;
  };

  const validateDeliveryStep = () => {
    if (deliveryData.deliveryOption === 'DELIVERY') {
      if (!deliveryData.deliveryDate) {
        setError('Please select a delivery date.');
        return false;
      }
      if (new Date(deliveryData.deliveryDate) < new Date(new Date().toDateString())) {
        setError('Delivery date cannot be in the past.');
        return false;
      }
      if (!deliveryData.deliveryAddress) {
        setError('Please enter your delivery address.');
        return false;
      }
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (currentStep === 'info' && validateInfoStep()) {
      setCurrentStep('delivery');
    } else if (currentStep === 'delivery' && validateDeliveryStep()) {
      setCurrentStep('payment');
    }
  };

  const handleBack = () => {
    if (currentStep === 'delivery') setCurrentStep('info');
    else if (currentStep === 'payment') setCurrentStep('delivery');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          customerType,
          deliveryOption: deliveryData.deliveryOption,
          deliverySlot: deliveryData.deliveryOption === 'DELIVERY' ? deliveryData.deliverySlot : null,
          deliveryDate: deliveryData.deliveryOption === 'DELIVERY' ? deliveryData.deliveryDate : null,
          deliveryAddress: deliveryData.deliveryOption === 'DELIVERY' ? deliveryData.deliveryAddress : null,
          deliveryFee: deliveryData.deliveryOption === 'DELIVERY' ? DELIVERY_FEE : 0,
          items: cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount: total,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit order');
      }

      const data = await response.json();
      clearCart();
      router.push(`/order-success?orderId=${data.orderId}`);
    } catch (err) {
      setError('Failed to submit order. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppOrder = () => {
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '263787909822';
    // Remove any non-numeric characters just in case
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    const orderDetails = cart.map(item =>
      `${item.name} - ${item.quantity} ${item.unit} @ $${item.price.toFixed(2)}`
    ).join('%0A');
    const delivery = deliveryData.deliveryOption === 'DELIVERY'
      ? `%0ADelivery: ${deliveryData.deliveryDate} (${deliveryData.deliverySlot})%0AAddress: ${deliveryData.deliveryAddress}`
      : '%0APickup from CBD';
    const message = `Hi! I'd like to place an order:%0A%0A${orderDetails}%0A%0ASubtotal: $${subtotal.toFixed(2)}${deliveryData.deliveryOption === 'DELIVERY' ? `%0ADelivery Fee: $${DELIVERY_FEE}` : ''}%0ATotal: $${total.toFixed(2)}%0A%0ACustomer Type: ${customerType}%0AName: ${formData.customerName}%0APhone: ${formData.customerPhone}${delivery}`;
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-12">
        {steps.map((step, idx) => (
          <div key={step.key} className="flex items-center">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => {
              if (idx < currentStepIndex) {
                setCurrentStep(step.key);
              }
            }}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-sans font-semibold transition-all duration-300 ${idx <= currentStepIndex
                ? 'bg-luxury-forest-green text-white'
                : 'bg-gray-200 text-gray-400'
                }`}>
                {idx < currentStepIndex ? (
                  <Check className="w-4 h-4" strokeWidth={2} />
                ) : (
                  step.number
                )}
              </div>
              <span className={`text-xs font-sans tracking-wider uppercase hidden sm:block ${idx <= currentStepIndex ? 'text-luxury-charcoal font-medium' : 'text-gray-400'
                }`}>
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`w-16 h-px mx-4 transition-colors duration-300 ${idx < currentStepIndex ? 'bg-luxury-forest-green' : 'bg-gray-200'
                }`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Form Area */}
        <div className="lg:col-span-3">
          {/* Step 1: Customer Info */}
          {currentStep === 'info' && (
            <div className="card-luxury p-8">
              <h2 className="text-2xl font-serif font-bold text-luxury-charcoal mb-2">
                Contact Information
              </h2>
              <p className="text-sm text-gray-500 font-light mb-8">
                We&apos;ll use this to contact you about your order
              </p>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-sans font-semibold tracking-wider uppercase text-luxury-charcoal mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="input-field"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold tracking-wider uppercase text-luxury-charcoal mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="input-field"
                    placeholder="+1234567890"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold tracking-wider uppercase text-luxury-charcoal mb-2">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="input-field"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold tracking-wider uppercase text-luxury-charcoal mb-2">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="input-field"
                    rows={4}
                    placeholder="Any special instructions..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Delivery */}
          {currentStep === 'delivery' && (
            <div className="card-luxury p-8">
              <h2 className="text-2xl font-serif font-bold text-luxury-charcoal mb-2">
                Delivery Options
              </h2>
              <p className="text-sm text-gray-500 font-light mb-8">
                Choose how you&apos;d like to receive your order
              </p>

              <div className="space-y-6">
                {/* Delivery / Pickup Toggle */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setDeliveryData({ ...deliveryData, deliveryOption: 'DELIVERY' })}
                    className={`p-5 rounded-sm border-2 transition-all duration-300 text-left ${deliveryData.deliveryOption === 'DELIVERY'
                      ? 'border-luxury-forest-green bg-luxury-forest-green/5'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <Truck className={`w-6 h-6 mb-2 ${deliveryData.deliveryOption === 'DELIVERY' ? 'text-luxury-forest-green' : 'text-gray-400'}`} strokeWidth={1.5} />
                    <p className="font-sans font-semibold text-sm text-luxury-charcoal">Delivery</p>
                    <p className="text-xs text-gray-500 font-light mt-0.5">$5.00 delivery fee</p>
                  </button>
                  <button
                    onClick={() => setDeliveryData({ ...deliveryData, deliveryOption: 'PICKUP' })}
                    className={`p-5 rounded-sm border-2 transition-all duration-300 text-left ${deliveryData.deliveryOption === 'PICKUP'
                      ? 'border-luxury-forest-green bg-luxury-forest-green/5'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <Store className={`w-6 h-6 mb-2 ${deliveryData.deliveryOption === 'PICKUP' ? 'text-luxury-forest-green' : 'text-gray-400'}`} strokeWidth={1.5} />
                    <p className="font-sans font-semibold text-sm text-luxury-charcoal">CBD Pickup</p>
                    <p className="text-xs text-gray-500 font-light mt-0.5">Free — collect at CBD</p>
                  </button>
                </div>

                {deliveryData.deliveryOption === 'DELIVERY' && (
                  <>
                    <div>
                      <label className="block text-xs font-sans font-semibold tracking-wider uppercase text-luxury-charcoal mb-2">
                        Delivery Date *
                      </label>
                      <input
                        type="date"
                        value={deliveryData.deliveryDate}
                        onChange={(e) => setDeliveryData({ ...deliveryData, deliveryDate: e.target.value })}
                        className="input-field"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-sans font-semibold tracking-wider uppercase text-luxury-charcoal mb-2">
                        Delivery Slot
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: 'MORNING' as DeliverySlot, label: 'Morning', time: '8am – 12pm' },
                          { value: 'MIDDAY' as DeliverySlot, label: 'Midday', time: '12pm – 3pm' },
                          { value: 'END_OF_DAY' as DeliverySlot, label: 'Evening', time: '3pm – 6pm' },
                        ].map((slot) => (
                          <button
                            key={slot.value}
                            onClick={() => setDeliveryData({ ...deliveryData, deliverySlot: slot.value })}
                            className={`p-3 rounded-sm border text-center transition-all duration-300 ${deliveryData.deliverySlot === slot.value
                              ? 'border-luxury-forest-green bg-luxury-forest-green/5 text-luxury-forest-green'
                              : 'border-gray-200 text-gray-600 hover:border-gray-300'
                              }`}
                          >
                            <p className="text-xs font-sans font-semibold">{slot.label}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{slot.time}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-sans font-semibold tracking-wider uppercase text-luxury-charcoal mb-2">
                        Delivery Address *
                      </label>
                      <textarea
                        value={deliveryData.deliveryAddress}
                        onChange={(e) => setDeliveryData({ ...deliveryData, deliveryAddress: e.target.value })}
                        className="input-field"
                        rows={3}
                        placeholder="Enter your full delivery address..."
                      />
                    </div>
                  </>
                )}

                {deliveryData.deliveryOption === 'PICKUP' && (
                  <div className="p-5 bg-luxury-forest-green/5 rounded-sm border border-luxury-forest-green/10">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-luxury-forest-green mt-0.5" strokeWidth={1.5} />
                      <div>
                        <h4 className="font-sans font-semibold text-sm text-luxury-charcoal mb-1">CBD Pickup Location</h4>
                        <p className="text-sm text-gray-600 font-light">
                          Our team will contact you with the exact pickup address and available time slots after your order is confirmed.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Review & Pay */}
          {currentStep === 'payment' && (
            <div className="card-luxury p-8">
              <h2 className="text-2xl font-serif font-bold text-luxury-charcoal mb-2">
                Review & Submit
              </h2>
              <p className="text-sm text-gray-500 font-light mb-8">
                Please review your order details before submitting
              </p>

              {/* Order Review */}
              <div className="space-y-6">
                <div className="p-5 bg-luxury-cream rounded-sm">
                  <h3 className="text-xs font-sans font-semibold tracking-wider uppercase text-luxury-charcoal mb-3">
                    Contact Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400 font-light">Name</span>
                      <p className="font-medium text-luxury-charcoal">{formData.customerName}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 font-light">Phone</span>
                      <p className="font-medium text-luxury-charcoal">{formData.customerPhone}</p>
                    </div>
                    {formData.customerEmail && (
                      <div>
                        <span className="text-gray-400 font-light">Email</span>
                        <p className="font-medium text-luxury-charcoal">{formData.customerEmail}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-400 font-light">Type</span>
                      <p className="font-medium text-luxury-charcoal">{customerType}</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-luxury-cream rounded-sm">
                  <h3 className="text-xs font-sans font-semibold tracking-wider uppercase text-luxury-charcoal mb-3">
                    Delivery
                  </h3>
                  <div className="text-sm">
                    <span className="badge-green">
                      {deliveryData.deliveryOption === 'DELIVERY' ? 'Delivery' : 'CBD Pickup'}
                    </span>
                    {deliveryData.deliveryOption === 'DELIVERY' && (
                      <div className="mt-3 space-y-1">
                        <p className="text-gray-600">{deliveryData.deliveryDate} — {deliveryData.deliverySlot.toLowerCase()}</p>
                        <p className="text-gray-600">{deliveryData.deliveryAddress}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Placeholder */}
                <div className="p-5 bg-amber-50 border border-amber-200 rounded-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertCircle className="w-5 h-5 text-amber-600" strokeWidth={1.5} />
                    <h3 className="font-sans font-semibold text-sm text-amber-900">Payment Pending</h3>
                  </div>
                  <p className="text-sm text-amber-700 font-light">
                    Payment processing will be available soon. Your order will be submitted as &ldquo;Pending Payment&rdquo;
                    and our team will contact you to arrange payment.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-sm text-sm font-sans">
              {error}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            {currentStepIndex > 0 ? (
              <button onClick={handleBack} className="btn-outline text-xs">
                ← Back
              </button>
            ) : (
              <div />
            )}

            {currentStep !== 'payment' ? (
              <button onClick={handleNext} className="btn-primary text-xs">
                Continue →
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleWhatsAppOrder}
                  className="btn-luxury bg-green-600 text-white border-green-600 hover:bg-transparent hover:text-green-600 text-xs flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                  WhatsApp Order
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="btn-primary text-xs"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Order'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-2">
          <div className="card-luxury p-6 sticky top-24">
            <h3 className="text-sm font-sans font-semibold tracking-wider uppercase text-luxury-charcoal mb-6">
              Order Summary
            </h3>

            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.productId} className="flex justify-between items-start">
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="font-sans font-medium text-sm text-luxury-charcoal truncate">{item.name}</p>
                    <p className="text-xs text-gray-400 font-light">
                      {item.quantity} {item.unit} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-serif font-semibold text-sm text-luxury-forest-green flex-shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-light">Subtotal</span>
                <span className="font-sans">${subtotal.toFixed(2)}</span>
              </div>
              {deliveryData.deliveryOption === 'DELIVERY' && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-light">Delivery Fee</span>
                  <span className="font-sans">${DELIVERY_FEE.toFixed(2)}</span>
                </div>
              )}
              {deliveryData.deliveryOption === 'PICKUP' && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-light">Pickup</span>
                  <span className="text-luxury-garden-lime font-sans font-medium">Free</span>
                </div>
              )}
              <div className="border-t border-gray-100 pt-3">
                <div className="flex justify-between">
                  <span className="font-serif font-bold text-luxury-charcoal">Total</span>
                  <span className="text-xl font-serif font-bold text-luxury-forest-green">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
