import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Award,
  CheckCircle,
  ChefHat,
  ChevronRight,
  Clock,
  Flame,
  Loader2,
  Mail,
  MapPin,
  Menu,
  Microwave,
  Phone,
  Shield,
  Star,
  ThumbsUp,
  Utensils,
  WashingMachine,
  Wind,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ApplianceType, BookingStatus, ServiceType } from "../backend.d";
import { useCreateBooking, useGetTestimonials } from "../hooks/useQueries";

const SERVICES = [
  {
    icon: WashingMachine,
    name: "Washing Machine",
    type: ApplianceType.WashingMachine,
    desc: "Repair, deep clean servicing & fresh installation",
    color: "bg-teal-50 text-teal-700",
  },
  {
    icon: Wind,
    name: "Dryer",
    type: ApplianceType.Dryer,
    desc: "Drum repair, heating element fix & new setup",
    color: "bg-amber-50 text-amber-700",
  },
  {
    icon: Utensils,
    name: "Dishwasher",
    type: ApplianceType.Dishwasher,
    desc: "Pump repair, leak fix & professional installation",
    color: "bg-teal-50 text-teal-700",
  },
  {
    icon: Microwave,
    name: "Microwave",
    type: ApplianceType.Microwave,
    desc: "Magnetron repair, door fix & mounting",
    color: "bg-amber-50 text-amber-700",
  },
  {
    icon: ChefHat,
    name: "Chimney",
    type: ApplianceType.Chimney,
    desc: "Filter clean, motor repair & fresh installation",
    color: "bg-teal-50 text-teal-700",
  },
  {
    icon: Flame,
    name: "Hob / Chula",
    type: ApplianceType.HobChula,
    desc: "Burner repair, gas fitting & safety check",
    color: "bg-amber-50 text-amber-700",
  },
];

const TRUST_SIGNALS = [
  {
    icon: Award,
    title: "Certified Technicians",
    desc: "Our team holds industry certifications with 10+ years of hands-on experience.",
  },
  {
    icon: Zap,
    title: "Same-Day Service",
    desc: "Book before noon and get a technician at your door the same day.",
  },
  {
    icon: Shield,
    title: "Genuine Parts Only",
    desc: "We use only manufacturer-approved parts to ensure your appliance lasts.",
  },
  {
    icon: ThumbsUp,
    title: "90-Day Warranty",
    desc: "All repairs come with a 90-day service warranty for complete peace of mind.",
  },
];

const FAQS = [
  {
    q: "What areas do you serve?",
    a: "We currently serve all major areas in the city and surrounding suburbs within a 30-km radius. Enter your address during booking and we'll confirm availability.",
  },
  {
    q: "How quickly can you send a technician?",
    a: "For urgent calls, we offer same-day service if booked before 12 PM. Standard appointments are available within 24–48 hours at your preferred time slot.",
  },
  {
    q: "Do you provide a service warranty?",
    a: "Yes! Every repair comes with a 90-day parts and labour warranty. If the same fault recurs within 90 days, we fix it free of charge.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept cash, UPI, credit/debit cards, and all major digital wallets. Payment is collected only after the service is complete and you're satisfied.",
  },
  {
    q: "Do you charge a visit fee?",
    a: "A nominal visit and diagnosis fee of ₹199 applies, which is waived if you proceed with the repair. No hidden charges — ever.",
  },
  {
    q: "Can I reschedule or cancel a booking?",
    a: "Absolutely. You can reschedule or cancel up to 2 hours before the appointment at no cost by calling us or updating through email.",
  },
];

const SAMPLE_TESTIMONIALS = [
  {
    id: BigInt(0),
    author: "Priya Sharma",
    content:
      "My washing machine was making a terrible noise. ApplianceFix sent a technician the very next morning, diagnosed the drum bearing issue, and had it running perfectly within 2 hours. Truly outstanding service!",
    rating: BigInt(5),
    timestamp: BigInt(0),
  },
  {
    id: BigInt(1),
    author: "Rahul Mehta",
    content:
      "Got my new dishwasher installed. The technician arrived on time, was extremely professional, and even showed me how to use all the functions. The price was transparent with no surprises.",
    rating: BigInt(5),
    timestamp: BigInt(0),
  },
  {
    id: BigInt(2),
    author: "Sunita Patel",
    content:
      "Our chimney was clogged and the smoke was unbearable. ApplianceFix did a thorough deep clean and also noticed a loose filter bracket which they fixed on the spot. Very thorough work!",
    rating: BigInt(4),
    timestamp: BigInt(0),
  },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { data: testimonials } = useGetTestimonials();
  const createBooking = useCreateBooking();

  const displayTestimonials =
    testimonials && testimonials.length > 0
      ? testimonials
      : SAMPLE_TESTIMONIALS;

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    applianceType: "" as ApplianceType | "",
    serviceType: "" as ServiceType | "",
    preferredDate: "",
    notes: "",
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.applianceType || !form.serviceType) {
      toast.error("Please select appliance type and service type.");
      return;
    }
    try {
      await createBooking.mutateAsync({
        name: form.name,
        phone: form.phone,
        email: form.email,
        address: form.address,
        applianceType: form.applianceType as ApplianceType,
        serviceType: form.serviceType as ServiceType,
        preferredDate: form.preferredDate,
        description: form.notes,
      });
      toast.success("Booking submitted! We'll contact you shortly.");
      setForm({
        name: "",
        phone: "",
        email: "",
        address: "",
        applianceType: "",
        serviceType: "",
        preferredDate: "",
        notes: "",
      });
    } catch {
      toast.error("Failed to submit booking. Please try again.");
    }
  };

  const navLinks = [
    { label: "Services", id: "services" },
    { label: "About", id: "why-us" },
    { label: "Testimonials", id: "testimonials" },
    { label: "FAQ", id: "faq" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* NAVBAR */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-warm border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <Wrench className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl text-foreground">
                Appliance<span className="text-primary">Fix</span>
              </span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  type="button"
                  key={link.id}
                  data-ocid="nav.link"
                  onClick={() => scrollTo(link.id)}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <Button
                data-ocid="nav.primary_button"
                onClick={() => scrollTo("booking")}
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-warm font-semibold"
              >
                Book Now
              </Button>
            </div>

            {/* Mobile menu toggle */}
            <button
              type="button"
              data-ocid="nav.toggle"
              className="md:hidden p-2 rounded-md text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden bg-white border-b border-border shadow-warm-lg"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <button
                    type="button"
                    key={link.id}
                    data-ocid="nav.link"
                    onClick={() => scrollTo(link.id)}
                    className="text-left px-4 py-3 text-sm font-medium text-foreground hover:bg-accent rounded-md"
                  >
                    {link.label}
                  </button>
                ))}
                <Button
                  data-ocid="nav.primary_button"
                  onClick={() => scrollTo("booking")}
                  className="mt-2 bg-primary text-primary-foreground"
                >
                  Book Now
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO */}
      <section
        id="hero"
        className="relative min-h-[92vh] flex items-center overflow-hidden hero-gradient"
      >
        {/* Background image overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-appliance-repair.dim_1200x600.jpg')",
          }}
        />
        {/* Decorative circles */}
        <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-10 w-72 h-72 rounded-full bg-teal-500/10 blur-3xl" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-24 pb-16">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <Badge className="mb-6 bg-amber-500/20 text-amber-200 border-amber-500/30 font-medium px-4 py-1.5 text-sm">
                ✦ Trusted by 5,000+ Households
              </Badge>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6 text-balance">
                Fast &amp; Reliable
                <span className="block text-amber-400">Appliance Repair</span>
                &amp; Installation
              </h1>
              <p className="text-lg sm:text-xl text-white/75 max-w-xl mb-10 leading-relaxed">
                Professional repair, servicing &amp; installation for washing
                machines, dryers, dishwashers, microwaves, chimneys &amp; hobs —
                at your doorstep.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                data-ocid="hero.primary_button"
                size="lg"
                onClick={() => scrollTo("booking")}
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-base font-semibold shadow-warm-lg px-8 py-6"
              >
                Book a Service <ChevronRight className="ml-1 w-5 h-5" />
              </Button>
              <Button
                data-ocid="hero.secondary_button"
                size="lg"
                variant="outline"
                asChild
                className="border-white/30 text-white hover:bg-white/10 text-base font-semibold px-8 py-6"
              >
                <a href="tel:+919876543210">
                  <Phone className="mr-2 w-5 h-5" /> Call Us Now
                </a>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mt-12 flex flex-wrap gap-6"
            >
              {[
                "Same-Day Service",
                "90-Day Warranty",
                "Certified Technicians",
              ].map((t) => (
                <div
                  key={t}
                  className="flex items-center gap-2 text-white/80 text-sm"
                >
                  <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  {t}
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            aria-hidden="true"
            viewBox="0 0 1440 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 80L1440 80L1440 30C1200 80 960 0 720 30C480 60 240 0 0 30L0 80Z"
              fill="oklch(0.97 0.008 85)"
            />
          </svg>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-amber-100 text-amber-700 border-amber-200">
              Our Services
            </Badge>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
              What We Fix &amp; Install
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Expert technicians for all your home appliance needs — repair,
              routine servicing, or brand new installation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service, i) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Card className="group card-hover border-border bg-card overflow-hidden cursor-default h-full">
                  <CardContent className="p-6">
                    <div
                      className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}
                    >
                      <service.icon className="w-7 h-7" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                      {service.name}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {service.desc}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["Repair", "Servicing", "Installation"].map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-medium px-2.5 py-1 bg-accent text-accent-foreground rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section id="why-us" className="py-20 md:py-28 bg-amber-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-amber-100 text-amber-700 border-amber-200">
              Why ApplianceFix
            </Badge>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
              The Difference You Can Feel
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              We hold ourselves to a higher standard because your home deserves
              the best.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {TRUST_SIGNALS.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKING FORM */}
      <section id="booking" className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <Badge className="mb-4 bg-amber-100 text-amber-700 border-amber-200">
                Book a Service
              </Badge>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
                Schedule Your Appointment
              </h2>
              <p className="text-muted-foreground text-lg">
                Fill in the details below and we'll reach out to confirm your
                slot.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="border-border shadow-warm-lg">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="font-medium">
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          data-ocid="booking.input"
                          required
                          value={form.name}
                          onChange={(e) =>
                            setForm((p) => ({ ...p, name: e.target.value }))
                          }
                          placeholder="Priya Sharma"
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="font-medium">
                          Phone Number *
                        </Label>
                        <Input
                          id="phone"
                          data-ocid="booking.input"
                          required
                          value={form.phone}
                          onChange={(e) =>
                            setForm((p) => ({ ...p, phone: e.target.value }))
                          }
                          placeholder="+91 98765 43210"
                          type="tel"
                          className="h-11"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-medium">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        data-ocid="booking.input"
                        required
                        value={form.email}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, email: e.target.value }))
                        }
                        placeholder="priya@example.com"
                        type="email"
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="font-medium">
                        Service Address *
                      </Label>
                      <Textarea
                        id="address"
                        data-ocid="booking.textarea"
                        required
                        value={form.address}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, address: e.target.value }))
                        }
                        placeholder="House/Flat no., Street, Area, City, PIN"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label className="font-medium">Appliance Type *</Label>
                        <Select
                          value={form.applianceType}
                          onValueChange={(v) =>
                            setForm((p) => ({
                              ...p,
                              applianceType: v as ApplianceType,
                            }))
                          }
                        >
                          <SelectTrigger
                            data-ocid="booking.select"
                            className="h-11"
                          >
                            <SelectValue placeholder="Select appliance" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={ApplianceType.WashingMachine}>
                              Washing Machine
                            </SelectItem>
                            <SelectItem value={ApplianceType.Dryer}>
                              Dryer
                            </SelectItem>
                            <SelectItem value={ApplianceType.Dishwasher}>
                              Dishwasher
                            </SelectItem>
                            <SelectItem value={ApplianceType.Microwave}>
                              Microwave
                            </SelectItem>
                            <SelectItem value={ApplianceType.Chimney}>
                              Chimney
                            </SelectItem>
                            <SelectItem value={ApplianceType.HobChula}>
                              Hob / Chula
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="font-medium">Service Type *</Label>
                        <Select
                          value={form.serviceType}
                          onValueChange={(v) =>
                            setForm((p) => ({
                              ...p,
                              serviceType: v as ServiceType,
                            }))
                          }
                        >
                          <SelectTrigger
                            data-ocid="booking.select"
                            className="h-11"
                          >
                            <SelectValue placeholder="Select service" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={ServiceType.Repair}>
                              Repair
                            </SelectItem>
                            <SelectItem value={ServiceType.Servicing}>
                              Servicing
                            </SelectItem>
                            <SelectItem value={ServiceType.Installation}>
                              Installation
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date" className="font-medium">
                        Preferred Date *
                      </Label>
                      <Input
                        id="date"
                        data-ocid="booking.input"
                        required
                        type="date"
                        value={form.preferredDate}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            preferredDate: e.target.value,
                          }))
                        }
                        min={new Date().toISOString().split("T")[0]}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes" className="font-medium">
                        Additional Notes
                      </Label>
                      <Textarea
                        id="notes"
                        data-ocid="booking.textarea"
                        value={form.notes}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, notes: e.target.value }))
                        }
                        placeholder="Describe the issue, brand/model, or any other details…"
                        rows={3}
                      />
                    </div>

                    <Button
                      data-ocid="booking.submit_button"
                      type="submit"
                      size="lg"
                      disabled={createBooking.isPending}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-12 text-base shadow-warm"
                    >
                      {createBooking.isPending ? (
                        <>
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" />{" "}
                          Submitting…
                        </>
                      ) : (
                        "Book Service"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-20 md:py-28 bg-amber-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-amber-100 text-amber-700 border-amber-200">
              Customer Reviews
            </Badge>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
              What Our Customers Say
            </h2>
            <p className="text-muted-foreground text-lg">
              Real stories from real homes we've helped.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayTestimonials.map((t, i) => (
              <motion.div
                key={String(t.id)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full border-border bg-white shadow-warm">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex gap-0.5 mb-4">
                      {[1, 2, 3, 4, 5].map((si) => (
                        <Star
                          key={`star-${si}`}
                          className={`w-4 h-4 ${
                            si <= Number(t.rating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-foreground/80 text-sm leading-relaxed flex-1 mb-4 italic">
                      &ldquo;{t.content}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                        {t.author.charAt(0)}
                      </div>
                      <span className="font-semibold text-foreground text-sm">
                        {t.author}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <Badge className="mb-4 bg-amber-100 text-amber-700 border-amber-200">
                FAQ
              </Badge>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
                Common Questions
              </h2>
              <p className="text-muted-foreground text-lg">
                Everything you need to know before booking.
              </p>
            </motion.div>

            <Accordion type="single" collapsible className="space-y-3">
              {FAQS.map((faq, i) => (
                <AccordionItem
                  key={faq.q}
                  value={`faq-${i}`}
                  className="border border-border rounded-xl px-6 bg-card shadow-xs"
                >
                  <AccordionTrigger
                    data-ocid="faq.toggle"
                    className="font-semibold text-foreground text-left hover:no-underline py-5"
                  >
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-20 md:py-28 bg-amber-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <Badge className="mb-4 bg-amber-100 text-amber-700 border-amber-200">
              Get in Touch
            </Badge>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
              We're Here to Help
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: Phone,
                title: "Call Us",
                value: "+91 98765 43210",
                sub: "Mon–Sat, 8 AM – 8 PM",
                href: "tel:+919876543210",
              },
              {
                icon: Mail,
                title: "Email Us",
                value: "support@appliancefix.in",
                sub: "Reply within 2 hours",
                href: "mailto:support@appliancefix.in",
              },
              {
                icon: MapPin,
                title: "Our Location",
                value: "Sector 18, Noida",
                sub: "Uttar Pradesh, 201301",
                href: "#",
              },
              {
                icon: Clock,
                title: "Business Hours",
                value: "Mon–Sat: 8 AM–8 PM",
                sub: "Sunday: 10 AM–5 PM",
                href: "#",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Card className="border-border bg-white shadow-warm h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <p className="font-semibold text-foreground text-sm mb-1">
                      {item.title}
                    </p>
                    <a
                      href={item.href}
                      data-ocid="contact.link"
                      className="text-primary font-medium text-sm hover:underline block"
                    >
                      {item.value}
                    </a>
                    <p className="text-muted-foreground text-xs mt-1">
                      {item.sub}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-foreground text-white/70 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Wrench className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-white">
                Appliance<span className="text-amber-400">Fix</span>
              </span>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm">
              {navLinks.map((link) => (
                <button
                  type="button"
                  key={link.id}
                  data-ocid="footer.link"
                  onClick={() => scrollTo(link.id)}
                  className="hover:text-white transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <a
                data-ocid="footer.link"
                href="/admin"
                className="hover:text-white transition-colors"
              >
                Admin
              </a>
            </div>

            <p className="text-sm text-center">
              &copy; {new Date().getFullYear()}. Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
