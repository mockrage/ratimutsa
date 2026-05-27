'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ApprovalActions({ productId, productName }: { productId: string; productName: string }) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      await fetch(`/api/admin/products/${productId}/approve`, { method: 'POST' });
      router.refresh();
    } catch (err) {
      alert('Failed to approve product');
    }
    setIsLoading(false);
  };

  const handleReject = async () => {
    if (!rejectionNotes.trim()) {
      alert('Please provide rejection notes');
      return;
    }
    setIsLoading(true);
    try {
      await fetch(`/api/admin/products/${productId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: rejectionNotes }),
      });
      setShowRejectModal(false);
      router.refresh();
    } catch (err) {
      alert('Failed to reject product');
    }
    setIsLoading(false);
  };

  return (
    <div className="flex-shrink-0">
      <div className="flex gap-2">
        <button
          onClick={handleApprove}
          disabled={isLoading}
          className="btn-luxury bg-luxury-forest-green text-white border-luxury-forest-green text-xs py-2 px-4 hover:bg-transparent hover:text-luxury-forest-green"
        >
          Approve
        </button>
        <button
          onClick={() => setShowRejectModal(true)}
          disabled={isLoading}
          className="btn-luxury bg-red-600 text-white border-red-600 text-xs py-2 px-4 hover:bg-transparent hover:text-red-600"
        >
          Reject
        </button>
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card-luxury p-8 max-w-md w-full mx-4">
            <h3 className="text-lg font-serif font-bold text-luxury-charcoal mb-2">
              Reject: {productName}
            </h3>
            <p className="text-sm text-gray-500 font-light mb-6">
              Please provide a reason for rejection
            </p>
            <textarea
              value={rejectionNotes}
              onChange={(e) => setRejectionNotes(e.target.value)}
              className="input-field mb-4"
              rows={4}
              placeholder="Reason for rejection..."
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowRejectModal(false)}
                className="btn-outline text-xs py-2 px-4"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={isLoading}
                className="btn-luxury bg-red-600 text-white border-red-600 text-xs py-2 px-4 hover:bg-transparent hover:text-red-600"
              >
                {isLoading ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
