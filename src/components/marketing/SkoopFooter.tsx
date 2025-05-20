'use client';

const product = ['Features', 'Pricing', 'Docs', 'Integrations'];
const company = ['About', 'Careers', 'Blog', 'Contact'];
const legal = ['Terms', 'Privacy'];
const social = [
  { name: 'GitHub', href: '#' },
  { name: 'Twitter', href: '#' },
  { name: 'LinkedIn', href: '#' }
];

export default function SkoopFooter() {
  return (
    <footer className="bg-slate-800 text-slate-200 py-12 px-4 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        <div>
          <div className="font-bold mb-2">Product</div>
          <ul className="space-y-1">
            {product.map(item => <li key={item}><a href="#" className="hover:text-accent-blue transition">{item}</a></li>)}
          </ul>
        </div>
        <div>
          <div className="font-bold mb-2">Company</div>
          <ul className="space-y-1">
            {company.map(item => <li key={item}><a href="#" className="hover:text-accent-blue transition">{item}</a></li>)}
          </ul>
        </div>
        <div>
          <div className="font-bold mb-2">Legal</div>
          <ul className="space-y-1">
            {legal.map(item => <li key={item}><a href="#" className="hover:text-accent-blue transition">{item}</a></li>)}
          </ul>
        </div>
        <div>
          <div className="font-bold mb-2">Social</div>
          <ul className="space-y-1">
            {social.map(item => <li key={item}><a href={item.href} className="hover:text-accent-blue transition">{item.name}</a></li>)}
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-slate-400">&copy; {new Date().getFullYear()} SKOOP. All rights reserved.</div>
    </footer>
  );
} 