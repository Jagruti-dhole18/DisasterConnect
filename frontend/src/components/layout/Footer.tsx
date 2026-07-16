import { Link } from 'react-router-dom';
import { LifeBuoy, Mail, Phone, MapPin, Github, Twitter, Linkedin, Facebook } from 'lucide-react';

const links = {
  Platform: [
    { label: 'Home', to: '/' },
    { label: 'Features', to: '/#features' },
    { label: 'Volunteer Stories', to: '/#stories' },
    { label: 'FAQs', to: '/#faqs' },
  ],
  Account: [
    { label: 'Sign In', to: '/login' },
    { label: 'Register', to: '/register' },
    { label: 'Forgot Password', to: '/forgot-password' },
  ],
  Resources: [
    { label: 'Relief Camps', to: '/relief-camps' },
    { label: 'Missing Persons', to: '/missing-persons' },
    { label: 'Disaster Alerts', to: '/alerts' },
    { label: 'Contact', to: '/#contact' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
                <LifeBuoy className="h-5 w-5" />
              </div>
              <span className="font-display text-lg font-bold">DisasterConnect</span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mb-4">
              A community-driven disaster response platform connecting citizens, volunteers, and NGOs during emergencies.
            </p>
            <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@disasterconnect.org</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> +91 1800-DISASTER</p>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Mumbai, India</p>
            </div>
          </div>
          {Object.entries(links).map(([heading, items]) => (
            <div key={heading}>
              <h4 className="text-sm font-semibold mb-3 text-slate-900 dark:text-slate-100">{heading}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link to={item.to} onClick={(e) => {
                      if (item.to.includes('#')) {
                        e.preventDefault();
                        const targetId = item.to.substring(item.to.indexOf('#') + 1);
                        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }} className="text-sm text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} DisasterConnect. Built for communities in crisis.
          </p>
          <div className="flex items-center gap-3">
            {[Twitter, Linkedin, Facebook, Github].map((Icon, i) => (
              <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-brand-600 hover:text-white transition-colors">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
