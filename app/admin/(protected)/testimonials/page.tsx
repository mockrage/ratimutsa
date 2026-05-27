import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import TestimonialToggle from './TestimonialToggle';

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Testimonials</h1>
        <Link href="/admin/testimonials/new" className="btn-primary">
          + Add Testimonial
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400">⭐</span>
                ))}
              </div>
              <TestimonialToggle
                testimonialId={testimonial.id}
                isActive={testimonial.isActive}
              />
            </div>
            <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                {testimonial.location && (
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                )}
              </div>
              <Link
                href={`/admin/testimonials/${testimonial.id}/edit`}
                className="text-blue-600 hover:underline text-sm font-semibold"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
