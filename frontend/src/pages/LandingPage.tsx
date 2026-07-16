import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Siren, Shield, HeartHandshake, MapPin, Users, Activity, ArrowRight,
  Search, Bell, Truck, PackageCheck, MessageSquare, Star, Quote,
} from 'lucide-react';
import SOSButton from '../components/ui/SOSButton';
import { useState } from 'react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

const stats = [
  { value: '12,400+', label: 'People Rescued', icon: Users },
  { value: '850+', label: 'Active Volunteers', icon: HeartHandshake },
  { value: '320+', label: 'Relief Camps', icon: Shield },
  { value: '48', label: 'Disasters Responded', icon: Activity },
];

const features = [
  { icon: Siren, title: 'Emergency SOS', desc: 'One-tap SOS alerts with live location sharing to instantly notify nearby volunteers and NGOs.' },
  { icon: MapPin, title: 'Interactive Maps', desc: 'Real-time maps showing relief camps, volunteers, and active disaster zones in your area.' },
  { icon: Bell, title: 'Real-Time Notifications', desc: 'Socket.io powered instant updates on request status, volunteer assignments, and alerts.' },
  { icon: Search, title: 'Missing Person Portal', desc: 'Report and search for missing persons with photos, last-seen locations, and status tracking.' },
  { icon: PackageCheck, title: 'Resource Requests', desc: 'Request food, water, and medicine with priority levels and track fulfillment in real time.' },
  { icon: Shield, title: 'Verified Volunteers', desc: 'Admin-verified volunteer system with skill matching, reward points, and mission history.' },
];

const stories = [
  { name: 'Arjun Mehta', role: 'Volunteer · Mumbai', missions: 12, points: 480, quote: 'During the 2023 floods, I rescued a family of four stranded on their rooftop. DisasterConnect made it possible to reach them in under 20 minutes.' },
  { name: 'Sneha Reddy', role: 'Medical Volunteer · Pune', missions: 6, points: 220, quote: 'As a trained nurse, I delivered critical insulin supplies to elderly residents cut off by floodwaters. The platform connected me to those who needed help most.' },
  { name: 'Karan Singh', role: 'Rescue Volunteer · Thane', missions: 4, points: 150, quote: 'The reward system kept me motivated. Every mission felt meaningful — knowing I was saving lives in my own community.' },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Citizen, Andheri', text: 'When floodwaters surrounded our building, I sent an SOS and a volunteer arrived within 30 minutes. This platform saved my family.', rating: 5 },
  { name: 'Dr. Rajesh Kumar', role: 'Director, Hope Foundation', text: 'As an NGO, managing relief camps and coordinating volunteers used to be chaotic. DisasterConnect brought structure and transparency.', rating: 5 },
  { name: 'Municipal Commissioner', role: 'BMC Disaster Management', text: 'The analytics dashboard gives us real-time visibility into ongoing crises. It has transformed how we coordinate city-wide responses.', rating: 5 },
];

const faqs = [
  { q: 'How does the Emergency SOS feature work?', a: 'When you trigger an SOS, your live location and emergency details are instantly broadcast to nearby available volunteers and registered NGOs. They can accept the mission and navigate to your location in real time.' },
  { q: 'Who can register as a volunteer?', a: 'Anyone over 18 can register as a volunteer. After registration, you can list your skills (first aid, rescue, logistics, medical, etc.). Admins verify volunteer profiles before they can accept critical missions.' },
  { q: 'How do NGOs use the platform?', a: 'Registered NGOs can create and manage relief camps, coordinate volunteer assignments, track food/water/medicine distribution, and receive donations — all from a dedicated dashboard.' },
  { q: 'Is my data secure?', a: 'We use JWT authentication, bcrypt password hashing, input sanitization, rate limiting, and Helmet for security headers. Your personal information is never shared without consent.' },
  { q: 'Can I use DisasterConnect without an account?', a: 'You can view public relief camp locations, disaster alerts, and the missing persons board. To submit requests or volunteer, you need to create a free account.' },
  { q: 'How are volunteer reward points calculated?', a: 'Volunteers earn points for each completed mission based on priority and response time. Points contribute to community rankings and recognition badges.' },
];

export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <StoriesSection />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
      <SOSButton variant="fixed" />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(220,38,38,0.4), transparent 50%), radial-gradient(circle at 80% 70%, rgba(249,115,22,0.3), transparent 50%)',
        }} />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1268076/pexels-photo-1268076.jpeg?auto=compress&cs=tinysrgb&w=1600)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm text-white mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success-500" />
            </span>
            Live · 850+ volunteers on standby
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance"
          >
            When disaster strikes, <span className="text-brand-400">community</span> responds.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg text-slate-300 max-w-2xl leading-relaxed"
          >
            DisasterConnect is a community-driven platform connecting citizens, volunteers, and NGOs during emergencies. Request help, coordinate rescue efforts, and rebuild together.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row gap-3"
          >
            <Link to="/register" className="btn-primary text-base px-6 py-3.5 group">
              Join the Network
              <ArrowRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <SOSButton variant="inline" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 flex items-center gap-6 text-sm text-slate-400"
          >
            <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-brand-400" /> Verified Volunteers</div>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-accent-400" /> Real-Time Maps</div>
            <div className="flex items-center gap-2"><Bell className="h-4 w-4 text-success-400" /> Instant Alerts</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="py-16 bg-white dark:bg-slate-950 border-y border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 mb-3">
                <stat.icon className="h-6 w-6" />
              </div>
              <p className="font-display text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl sm:text-4xl font-bold"
          >
            Everything you need to respond to crises
          </motion.h2>
          <p className="mt-4 text-slate-500 dark:text-slate-400">
            From emergency alerts to resource coordination, DisasterConnect brings every stakeholder onto one platform.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StoriesSection() {
  return (
    <section id="stories" className="py-20 bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl sm:text-4xl font-bold"
          >
            Volunteer stories
          </motion.h2>
          <p className="mt-4 text-slate-500 dark:text-slate-400">
            Real missions. Real impact. Meet the heroes on the ground.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {stories.map((story, i) => (
            <motion.div
              key={story.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card p-6 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white font-semibold text-lg">
                  {story.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{story.name}</p>
                  <p className="text-xs text-slate-500">{story.role}</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex-1">"{story.quote}"</p>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-500"><Truck className="h-3.5 w-3.5" /> {story.missions} missions</span>
                <span className="flex items-center gap-1.5 text-accent-600 dark:text-accent-400 font-medium"><Star className="h-3.5 w-3.5 fill-current" /> {story.points} points</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl sm:text-4xl font-bold"
          >
            Trusted by communities and organizations
          </motion.h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card p-6 relative"
            >
              <Quote className="h-8 w-8 text-brand-200 dark:text-brand-800 mb-3" />
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">{t.text}</p>
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-accent-500 text-accent-500" />
                ))}
              </div>
              <div>
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-slate-500">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faqs" className="py-20 bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl sm:text-4xl font-bold"
          >
            Frequently asked questions
          </motion.h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="card overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <span className="font-medium text-sm">{faq.q}</span>
                <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ArrowRight className="h-4 w-4 -rotate-90 text-slate-400" />
                </motion.div>
              </button>
              <motion.div
                initial={false}
                animate={{ height: open === i ? 'auto' : 0, opacity: open === i ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{faq.a}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) {
      setError('Please sign in before sending a message.');
      return;
    }
    setError('');
    setSending(true);
    try {
      await api.post('/messages/contact', { content: message });
      setSubmitted(true);
    } catch (err) {
      setError('Unable to send your message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl sm:text-4xl font-bold mb-4"
            >
              Get in touch
            </motion.h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
              Have questions about DisasterConnect? Want to partner with us or bring the platform to your city? We'd love to hear from you.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Email us</p>
                  <p className="text-sm text-slate-500">hello@disasterconnect.org</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-100 dark:bg-accent-900/40 text-accent-600 dark:text-accent-400">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">24/7 Helpline</p>
                  <p className="text-sm text-slate-500">+91 1800-DISASTER</p>
                </div>
              </div>
            </div>
          </div>
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="card p-6 space-y-4"
          >
            {submitted ? (
              <div className="text-center py-8">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-success-100 dark:bg-success-900/40 text-success-600 dark:text-success-400 mb-4">
                  <Shield className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold mb-1">Message sent!</h3>
                <p className="text-sm text-slate-500">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <>
                {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
                <div>
                  <label className="label">Name</label>
                  <input className="input" placeholder="Your name" required />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input className="input" type="email" placeholder="you@example.com" required />
                </div>
                <div>
                  <label className="label">Message</label>
                  <textarea className="input min-h-[100px] resize-none" placeholder="How can we help?" value={message} onChange={(e) => setMessage(e.target.value)} required />
                </div>
                <button type="submit" className="btn-primary w-full" disabled={sending}>{sending ? 'Sending...' : 'Send Message'}</button>
              </>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
