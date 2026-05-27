import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import FloatingButtons from '@/components/FloatingButtons';

export default function ContactPage() {
  return (
    <>
      <AnnouncementBanner />
      <Header />

      <main className="min-h-screen bg-luxury-cream">
        {/* Hero */}
        <section className="relative py-24 bg-luxury-charcoal overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/farm-landscape.png"
              alt="Contact Ratimutsa Farm"
              fill
              className="object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-charcoal via-transparent to-transparent" />
          </div>
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <span className="text-luxury-windsor-oak text-xs tracking-[0.4em] uppercase font-sans font-medium">
              Get In Touch
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mt-4 mb-4">
              Connect With Us
            </h1>
            <p className="text-gray-300 font-light text-lg max-w-xl">
              We&apos;d love to hear from you — reach out for orders, inquiries, or farm visits
            </p>
          </div>
        </section>

        <section className="container mx-auto px-6 lg:px-12 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <span className="text-luxury-windsor-oak text-xs tracking-[0.4em] uppercase font-sans font-medium">
                Reach Out
              </span>
              <h2 className="text-3xl font-serif font-bold text-luxury-charcoal mt-4 mb-8">
                Let&apos;s Connect
              </h2>

              <div className="space-y-8">
                {[
                  {
                    icon: <Phone className="w-5 h-5" strokeWidth={1.5} />,
                    title: 'Phone',
                    content: `${process.env.NEXT_PUBLIC_PHONE_NUMBER || '+263 779 527 507'} / ${process.env.NEXT_PUBLIC_PHONE_NUMBER_SECONDARY || '+263 779 527 503'} / ${process.env.NEXT_PUBLIC_PHONE_NUMBER_TERTIARY || '+263 779 527 560'} / ${process.env.NEXT_PUBLIC_PHONE_NUMBER_QUATERNARY || '+263 779 527 553'}`,
                    subtitle: 'Available during business hours',
                  },
                  {
                    icon: <Mail className="w-5 h-5" strokeWidth={1.5} />,
                    title: 'Email',
                    content: process.env.NEXT_PUBLIC_EMAIL || 'sales@ratimutsa.co.zw',
                    subtitle: 'We reply within 24 hours',
                  },
                  {
                    icon: <MapPin className="w-5 h-5" strokeWidth={1.5} />,
                    title: 'Farm Location',
                    content: process.env.NEXT_PUBLIC_ADDRESS || 'Musami, Murehwa District Zimbabwe',
                    subtitle: 'Farm visits by appointment',
                  },
                  {
                    icon: <Clock className="w-5 h-5" strokeWidth={1.5} />,
                    title: 'Business Hours',
                    content: 'Mon – Fri: 8:00 AM – 6:00 PM',
                    subtitle: 'Sat: 9:00 AM – 4:00 PM | Sun: Closed',
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-5 group">
                    <div className="w-12 h-12 bg-luxury-forest-green/5 text-luxury-forest-green rounded-sm flex items-center justify-center flex-shrink-0 group-hover:bg-luxury-forest-green group-hover:text-white transition-all duration-300">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-luxury-charcoal mb-1">{item.title}</h3>
                      <p className="text-gray-700 text-sm font-medium">{item.content}</p>
                      <p className="text-gray-400 text-xs font-light mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CBD Pickup Info */}
              <div className="mt-12 p-6 bg-luxury-forest-green/5 rounded-sm border border-luxury-forest-green/10">
                <h3 className="font-serif font-bold text-luxury-charcoal mb-2">
                  CBD Pickup Location
                </h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">
                  Orders can also be collected from our CBD pickup point. Contact us for
                  the exact address and available time slots.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="card-luxury p-8 lg:p-10">
              <h2 className="text-2xl font-serif font-bold text-luxury-charcoal mb-2">
                Send Us a Message
              </h2>
              <p className="text-sm text-gray-500 font-light mb-8">
                Fill out the form below and our team will get back to you shortly
              </p>

              <form className="space-y-5">
                <div>
                  <label className="block text-xs font-sans font-semibold tracking-wider uppercase text-luxury-charcoal mb-2">
                    Name
                  </label>
                  <input type="text" className="input-field" placeholder="Your name" />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold tracking-wider uppercase text-luxury-charcoal mb-2">
                    Email
                  </label>
                  <input type="email" className="input-field" placeholder="your@email.com" />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold tracking-wider uppercase text-luxury-charcoal mb-2">
                    Phone
                  </label>
                  <input type="tel" className="input-field" placeholder="+1234567890" />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold tracking-wider uppercase text-luxury-charcoal mb-2">
                    Customer Type
                  </label>
                  <select className="input-field">
                    <option value="b2c">Individual (B2C)</option>
                    <option value="b2b">Business (B2B)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold tracking-wider uppercase text-luxury-charcoal mb-2">
                    Message
                  </label>
                  <textarea className="input-field" rows={5} placeholder="Tell us about your order or inquiry..." />
                </div>

                <button type="submit" className="btn-primary w-full">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingButtons />
    </>
  );
}
