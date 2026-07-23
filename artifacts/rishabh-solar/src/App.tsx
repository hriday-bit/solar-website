import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { useEffect, useState, useRef, ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Sun, Battery, Zap, Sliders, Layers, Package, ShieldCheck, 
  Wrench, Headphones, CreditCard, MapPin, Star, Menu, X, 
  PhoneCall, Phone, Mail, Clock, ArrowRight
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

// ---------------------------------------------
// Constants
// ---------------------------------------------
const PHONE_NUMBER = "+919873403889";
const PHONE_DISPLAY = "09873403889";
const WHATSAPP_LINK = `wa.me/919873403889?text=${encodeURIComponent("Hi, I'm interested in solar panels/batteries")}`;
const ADDRESS = "In front of Vishal Mega Mart and Petrol Pump, Railway Road, Dadri, Uttar Pradesh 203207";
const WHATSAPP_URL = `https://${WHATSAPP_LINK}`;

// ---------------------------------------------
// Components
// ---------------------------------------------

const Button = ({ 
  children, 
  className = "", 
  variant = "primary", 
  size = "default",
  ...props 
}: { 
  children: React.ReactNode, 
  className?: string, 
  variant?: "primary" | "secondary" | "outline" | "ghost",
  size?: "default" | "sm" | "lg" | "icon",
  [key: string]: any 
}) => {
  const baseStyle = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-sm",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-12 rounded-md px-8 text-lg",
    icon: "h-10 w-10",
  };
  
  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

// ---------------------------------------------
// Layout Components
// ---------------------------------------------

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Products', href: '#products' },
    { name: 'Why Us', href: '#why-us' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2 z-50">
          <div className="p-1.5 bg-primary rounded-full">
            <Sun className="h-6 w-6 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className={`font-heading font-bold text-lg leading-tight tracking-tight ${isScrolled ? 'text-secondary' : 'text-white'}`}>
              RISHABH ENTERPRISES
            </span>
            <span className="font-heading font-semibold text-primary text-xs leading-none tracking-widest">
              UTL SOLAR
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className={`text-sm font-medium hover:text-primary transition-colors ${
                  isScrolled ? 'text-foreground' : 'text-white/90'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>
          <a href={`tel:${PHONE_NUMBER}`}>
            <Button className="glow-hover gap-2 rounded-full font-bold">
              <Phone className="h-4 w-4" /> Call Now
            </Button>
          </a>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden z-50 p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? (
            <X className={isScrolled ? "text-foreground" : "text-white"} />
          ) : (
            <Menu className={isScrolled ? "text-foreground" : "text-white"} />
          )}
        </button>

        {/* Mobile Menu */}
        <div 
          className={`fixed inset-0 bg-secondary flex flex-col pt-24 px-6 gap-6 transition-transform duration-300 ease-in-out z-40 md:hidden ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-white text-2xl font-heading font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <div className="mt-8">
            <a href={`tel:${PHONE_NUMBER}`} onClick={() => setMobileMenuOpen(false)}>
              <Button size="lg" className="w-full gap-2 rounded-full text-lg">
                <Phone className="h-5 w-5" /> {PHONE_DISPLAY}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

// ---------------------------------------------
// Section Components
// ---------------------------------------------

function Hero() {
  return (
    <section id="home" className="relative min-h-[100dvh] flex items-center pt-20 overflow-hidden bg-gradient-to-br from-secondary via-secondary to-primary/90 text-white">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-20">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] animate-[spin_60s_linear_infinite]">
          <defs>
            <radialGradient id="sun-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF8A00" stopOpacity="1" />
              <stop offset="100%" stopColor="#FF8A00" stopOpacity="0" />
            </radialGradient>
          </defs>
          {[...Array(12)].map((_, i) => (
            <polygon 
              key={i}
              points="50,50 100,45 100,55" 
              fill="url(#sun-grad)" 
              transform={`rotate(${i * 30} 50 50)`}
            />
          ))}
        </svg>
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <Star className="h-4 w-4 text-primary fill-primary" />
              <span className="text-sm font-medium tracking-wide">5.0 Rated Google Reviews</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold font-heading leading-[1.1] mb-6">
              Powering Homes with <span className="text-primary">Clean Solar</span> Energy
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl font-light">
              Your Trusted UTL Solar Authorized Dealer in Dadri, UP. Genuine products, expert installation, and reliable after-sales service.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a href={`tel:${PHONE_NUMBER}`}>
                <Button size="lg" className="w-full sm:w-auto gap-2 rounded-full glow-hover text-lg h-14 px-8">
                  <PhoneCall className="h-5 w-5" />
                  Call {PHONE_DISPLAY}
                </Button>
              </a>
              <a href="#contact">
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 rounded-full text-lg h-14 px-8 border-white text-white hover:bg-white hover:text-secondary bg-transparent">
                  Get Free Quote <ArrowRight className="h-5 w-5" />
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-[0]">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px] md:h-[100px]">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,130.94,119.5,193.32,109.12Z" className="fill-background"></path>
        </svg>
      </div>
    </section>
  );
}

const AnimatedCounter = ({ end, duration = 2 }: { end: number, duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      let animationFrame: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / (duration * 1000);
        
        if (progress < 1) {
          setCount(Math.floor(end * progress));
          animationFrame = requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}</span>;
};

function About() {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-bold tracking-wider text-primary uppercase mb-2">About Us</h2>
            <h3 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-foreground">
              Your Local Energy Partner in Dadri
            </h3>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              Rishabh Enterprises is a proudly local business and the authorized dealer for UTL Solar in Dadri, Uttar Pradesh. We believe in bringing high-quality, reliable, and affordable solar energy solutions to our community.
            </p>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              From residential rooftop systems to commercial installations, our expert team ensures seamless setup, transparent pricing, and unmatched after-sales support. When you choose us, you're choosing peace of mind.
            </p>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-green-50 border border-green-100 dark:bg-green-900/10 dark:border-green-900/30">
              <div className="bg-accent text-white p-3 rounded-full">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">Authorized UTL Dealer</h4>
                <p className="text-sm text-muted-foreground">100% Genuine Products with Manufacturer Warranty</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-6">
            {[
              { label: "Years in Business", value: 10, suffix: "+" },
              { label: "Happy Customers", value: 500, suffix: "+" },
              { label: "Installations Done", value: 1000, suffix: "+" },
              { label: "Customer Rating", value: 5, suffix: ".0" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-card p-6 rounded-2xl shadow-sm border border-border text-center hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="text-4xl md:text-5xl font-bold font-heading text-primary mb-2">
                  <AnimatedCounter end={stat.value} />{stat.suffix}
                </div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Products() {
  const products = [
    { icon: Sun, title: "Solar Panels", desc: "High-efficiency Mono PERC and Polycrystalline panels." },
    { icon: Battery, title: "Solar Batteries", desc: "Long-lasting Tubular and modern Lithium batteries." },
    { icon: Zap, title: "Inverters / PCUs", desc: "Smart hybrid inverters tailored for local power conditions." },
    { icon: Sliders, title: "Charge Controllers", desc: "MPPT and PWM controllers for optimized charging." },
    { icon: Layers, title: "Complete Systems", desc: "On-grid, Off-grid, and Hybrid complete installations." },
    { icon: Package, title: "Solar Accessories", desc: "Wires, structures, MC4 connectors, and safety switches." },
  ];

  return (
    <section id="products" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold tracking-wider text-primary uppercase mb-2">Our Offerings</h2>
          <h3 className="text-3xl md:text-5xl font-heading font-bold mb-6 text-foreground">
            Complete Solar Solutions
          </h3>
          <p className="text-muted-foreground text-lg">
            As an authorized UTL dealer, we provide a full range of genuine solar products to power your home or business.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-lg transition-all duration-300 group"
            >
              <div className="h-14 w-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <product.icon className="h-7 w-7" />
              </div>
              <h4 className="text-xl font-bold font-heading mb-3">{product.title}</h4>
              <p className="text-muted-foreground mb-6 line-clamp-2">{product.desc}</p>
              <a 
                href={WHATSAPP_URL}
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
              >
                Enquire Now <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  const features = [
    { icon: ShieldCheck, title: "Genuine Products", desc: "100% authentic UTL Solar products directly from the manufacturer." },
    { icon: Wrench, title: "Expert Installation", desc: "Professional fitting by trained technicians ensuring maximum efficiency." },
    { icon: Headphones, title: "After-Sales Service", desc: "Reliable maintenance and prompt warranty support when you need it." },
    { icon: CreditCard, title: "Affordable Pricing", desc: "Transparent pricing with flexible EMI options available." },
    { icon: MapPin, title: "Local Dealer", desc: "Based right here in Dadri, providing fast and personalized service." },
    { icon: Star, title: "5-Star Rated", desc: "Trusted by hundreds of families and businesses in our community." },
  ];

  return (
    <section id="why-us" className="py-24 bg-secondary text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold tracking-wider text-primary uppercase mb-2">Why Choose Us</h2>
          <h3 className="text-3xl md:text-5xl font-heading font-bold mb-6">
            The Rishabh Advantage
          </h3>
          <p className="text-white/80 text-lg">
            We don't just sell boxes; we deliver complete, reliable energy solutions backed by local trust.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors"
            >
              <div className="mb-4 text-primary">
                <feature.icon className="h-10 w-10" />
              </div>
              <h4 className="text-xl font-bold font-heading mb-2">{feature.title}</h4>
              <p className="text-white/70">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  const reviews = [
    { name: "Rajesh Kumar", text: "Excellent service! Got my rooftop solar installed within 2 days. Very professional team.", date: "1 month ago" },
    { name: "Sunita Sharma", text: "Best solar dealer in Dadri. Genuine UTL products at fair prices. Highly recommended!", date: "3 months ago" },
    { name: "Amit Verma", text: "After-sales support is outstanding. They helped me set up the system perfectly.", date: "4 months ago" },
    { name: "Priya Singh", text: "Got complete solar system for my shop. Reduced electricity bill by 80%. Amazing!", date: "6 months ago" },
  ];

  return (
    <section id="reviews" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-12 items-center mb-16">
          <div className="md:w-1/3 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">What Our Clients Say</h2>
            <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
              <span className="text-6xl font-bold text-foreground">5.0</span>
              <div className="flex flex-col gap-1">
                <div className="flex text-primary">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-6 w-6 fill-primary" />)}
                </div>
                <span className="text-sm font-medium text-muted-foreground">Based on Google Reviews</span>
              </div>
            </div>
          </div>
          
          <div className="md:w-2/3 flex overflow-x-auto pb-8 snap-x snap-mandatory gap-6 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
            {reviews.map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-card border border-border p-6 rounded-2xl min-w-[300px] w-[300px] md:w-auto md:flex-1 snap-center shadow-sm"
              >
                <div className="flex text-primary mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-primary" />)}
                </div>
                <p className="text-foreground italic mb-6">"{review.text}"</p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="h-10 w-10 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-lg">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{review.name}</div>
                    <div className="text-xs text-muted-foreground">{review.date}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  // Using the generated images
  const images = [
    "/gallery-1.jpg", // Rooftop
    "/gallery-2.jpg", // Batteries
    "/gallery-3.jpg", // Inverter
    "/gallery-4.jpg", // Team
    "/gallery-5.jpg", // Complete system
    "/gallery-6.jpg", // Controller
  ];

  return (
    <section id="gallery" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold tracking-wider text-primary uppercase mb-2">Our Work</h2>
          <h3 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            Recent Installations
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {images.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative group aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden bg-muted"
            >
              {/* Added a subtle placeholder color while image loads */}
              <div className="absolute inset-0 bg-muted animate-pulse" />
              <img 
                src={src} 
                alt={`Solar installation ${i+1}`} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  message: z.string().min(10, "Please provide some details"),
});

function Contact() {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      phone: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof contactSchema>) {
    toast({
      title: "Message Sent Successfully!",
      description: "We will get back to you shortly.",
      duration: 5000,
    });
    form.reset();
  }

  return (
    <section id="contact" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          
          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Get a Free Quote</h2>
            <p className="text-muted-foreground mb-8">
              Fill out the form below and our solar experts will contact you with a customized solution.
            </p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" className="bg-card" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+91 98765 43210" className="bg-card" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Requirements</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="I am looking for a solar system for my home..." 
                          className="min-h-[120px] bg-card"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" size="lg" className="w-full text-lg glow-hover">
                  Submit Request
                </Button>
              </form>
            </Form>
          </motion.div>

          {/* Info Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col h-full"
          >
            <div className="bg-secondary text-white p-8 rounded-t-2xl shadow-lg">
              <h3 className="text-2xl font-heading font-bold mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/20 p-3 rounded-full text-primary shrink-0">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Our Store</h4>
                    <p className="text-white/80 leading-relaxed">{ADDRESS}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary/20 p-3 rounded-full text-primary shrink-0">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Phone / WhatsApp</h4>
                    <a href={`tel:${PHONE_NUMBER}`} className="block text-white/80 hover:text-primary transition-colors">{PHONE_DISPLAY}</a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary/20 p-3 rounded-full text-primary shrink-0">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Business Hours</h4>
                    <p className="text-white/80">Mon - Sat: 9:00 AM - 8:00 PM</p>
                    <p className="text-white/80">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Map */}
            <div className="flex-1 w-full min-h-[300px] rounded-b-2xl overflow-hidden shadow-lg border-x border-b border-border">
              <iframe 
                src="https://maps.google.com/maps?q=Railway+Road+Dadri+Uttar+Pradesh+203207&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Rishabh Enterprises Location"
              ></iframe>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#0f172a] text-white pt-16 pb-8 border-t-[4px] border-primary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="p-1 bg-primary rounded-full">
                <Sun className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-lg leading-tight tracking-tight text-white">
                  RISHABH ENTERPRISES
                </span>
                <span className="font-heading font-semibold text-primary text-xs leading-none tracking-widest">
                  UTL SOLAR
                </span>
              </div>
            </div>
            <p className="text-white/70 mb-6 max-w-sm">
              Authorized UTL Solar dealer in Dadri, UP. Bringing clean, reliable, and affordable energy solutions to every home and business.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 font-heading">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'About', 'Products', 'Why Us', 'Contact'].map((link) => (
                <li key={link}>
                  <a 
                    href={`#${link.toLowerCase().replace(' ', '-')}`} 
                    className="text-white/70 hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <ArrowRight className="h-3 w-3" /> {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 font-heading">Connect With Us</h4>
            <div className="flex flex-col gap-4">
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-white/70 hover:text-accent transition-colors">
                <div className="bg-white/10 p-2 rounded-full">
                  <Phone className="h-4 w-4" />
                </div>
                WhatsApp Us
              </a>
              <a href={`tel:${PHONE_NUMBER}`} className="flex items-center gap-3 text-white/70 hover:text-primary transition-colors">
                <div className="bg-white/10 p-2 rounded-full">
                  <PhoneCall className="h-4 w-4" />
                </div>
                Call Us
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm text-center md:text-left">
            © {new Date().getFullYear()} Rishabh Enterprises UTL Solar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FloatingButtons() {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
      <a 
        href={`tel:${PHONE_NUMBER}`}
        className="h-14 w-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform relative group"
        aria-label="Call Us"
      >
        <PhoneCall className="h-6 w-6" />
        <span className="absolute right-full mr-4 bg-black/80 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Call Now
        </span>
      </a>
      
      <a 
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        className="h-14 w-14 bg-accent text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform relative group pulse-ring-effect"
        aria-label="WhatsApp Us"
      >
        {/* Using Phone icon for WhatsApp since we only have lucide icons */}
        <Phone className="h-7 w-7" />
        <span className="absolute right-full mr-4 bg-black/80 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          WhatsApp
        </span>
      </a>
    </div>
  );
}

// ---------------------------------------------
// App Main
// ---------------------------------------------

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <About />
      <Products />
      <WhyUs />
      <Reviews />
      <Gallery />
      <Contact />
      <Footer />
      <FloatingButtons />
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold font-heading text-foreground">
          Page Not Found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground mb-6">
          The page you are looking for does not exist.
        </p>
        <a href="/">
          <Button>Return Home</Button>
        </a>
      </div>
    </div>
  );
}

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
