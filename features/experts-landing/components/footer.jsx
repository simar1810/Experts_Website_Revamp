import { Facebook, Linkedin, Twitter, Instagram } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = function ({ brand, listingId }) {
  const footerLinks = {
    "Our Company": ["Home", "About", "Services", "News", "Contact"],
    "Services": ["Market Research", "Market Analysis", "SEO Consultancy", "Page Ranking", "SMM"],
    "Features": ["Brand Strategy", "Audience Analytics", "Copywriting", "Team Training", "Email Marketing"]
  };

  return (
    <footer className="w-full flex flex-col font-sans">
      <div className="bg-[var(--brand-primary)] text-white px-6 py-16 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="flex items-center gap-1">
              <span className="text-3xl font-black tracking-tight leading-none">Superfoods</span>
              <span className="text-xl font-light self-end opacity-80">valley</span>
            </div>
            <p className="text-sm leading-relaxed opacity-70 max-w-xs">
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
            </p>
            <div className="flex gap-4 items-center">
              <Facebook className="w-5 h-5 cursor-pointer hover:opacity-70 transition-opacity" />
              <Linkedin className="w-5 h-5 cursor-pointer hover:opacity-70 transition-opacity" />
              <Twitter className="w-5 h-5 cursor-pointer hover:opacity-70 transition-opacity" />
              <Instagram className="w-5 h-5 cursor-pointer hover:opacity-70 transition-opacity" />
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="flex flex-col gap-4">
              <h4 className="text-lg font-bold mb-2">{title}</h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-bold mb-2">Subscribe</h4>
            <div className="flex flex-col gap-4">
              <Input
                type="email"
                placeholder="Email"
                className="bg-white/10 border-none text-white placeholder:text-white/50 h-12 rounded-lg"
              />
              <Button
                className="bg-white text-[var(--brand-primary)] hover:bg-white/90 font-bold rounded-xl h-12 w-full md:w-32"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[var(--brand-secondary)] py-4 text-center">
        <p className="text-white font-bold text-sm tracking-wide">
          Right Reserved to @ {brand?.branding?.displayName || brand?.name}
        </p>
      </div>
    </footer>
  );
};

export default Footer;