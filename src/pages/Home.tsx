
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, CheckCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Footer from '@/components/Footer';
import { AnimatedTestimonials } from '@/components/ui/animated-testimonials';
import { MacbookScroll } from '@/components/ui/macbook-scroll';
import { useTheme } from '@/context/ThemeContext';

const HomePage = () => {
  const { theme } = useTheme();
  
  const features = [
    {
      title: "Real-Time Traffic Integration",
      description: "Access live traffic data from MapmyIndia API, Google Maps, and OpenStreetMap to get accurate road conditions and plan efficiently.",
      icon: <Truck className="h-12 w-12 text-logistics-600" />,
    },
    {
      title: "Route Optimization",
      description: "Our advanced algorithms optimize routes considering distance, traffic, toll costs, and road suitability specifically for heavy cargo trucks.",
      icon: <Truck className="h-12 w-12 text-logistics-600" />,
    },
    {
      title: "Dynamic Rerouting",
      description: "Instantly adjust routes when facing unexpected events like traffic jams or road closures, keeping your deliveries on schedule.",
      icon: <Truck className="h-12 w-12 text-logistics-600" />,
    },
  ];

  const testimonials = [
    {
      quote:
        "Last Mile has transformed how we manage our fleet. The route optimization has cut our fuel costs by 15% in just three months.",
      name: "Rajesh Kumar",
      designation: "Fleet Manager, Logistics Co",
      src: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      quote:
        "The real-time traffic integration is a game-changer. We can now predict delivery times with amazing accuracy and plan our operations better.",
      name: "Priya Sharma",
      designation: "Operations Director, FreightIndia",
      src: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
      quote:
        "As a small business owner, the toll cost optimization alone has saved me lakhs of rupees annually. Highly recommended solution!",
      name: "Vikram Singh",
      designation: "Owner, Singh Transports",
      src: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    {
      quote:
        "The scalability and performance have been game-changing for our growing logistics company. New routes are optimized instantly.",
      name: "Anita Desai",
      designation: "VP of Operations, FastTrack Logistics",
      src: "https://randomuser.me/api/portraits/women/4.jpg",
    },
    {
      quote:
        "Last Mile's border regulation features have made interstate transport much more streamlined. We no longer worry about compliance issues.",
      name: "Harish Mehta",
      designation: "Transport Manager, PanIndia Freight",
      src: "https://randomuser.me/api/portraits/men/5.jpg",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="pt-16 md:pt-24 pb-6 md:pb-12 px-4 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-5">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
                Optimize Your <span className="text-logistics-600 dark:text-logistics-400">Freight Routes</span> Across India
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-md">
                Last Mile delivers intelligent route optimization for cargo transport across India, saving time, fuel, and money with real-time traffic data.
              </p>
              <div className="pt-2">
                <Button size="lg" asChild className="group bg-logistics-600 hover:bg-logistics-700 dark:bg-logistics-500 dark:hover:bg-logistics-600">
                  <Link to="/auth" className="flex items-center gap-2">
                    Get Started
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="hidden md:block relative">
              <img 
                src="https://iili.io/3AH7Ihg.png" 
                alt="Freight transport" 
                className="rounded-lg w-[700px] h-[400px] mx-auto object-cover" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* MacBook Scroll Feature */}
      <section className="py-4 md:py-8 bg-white dark:bg-gray-900 overflow-hidden">
        <MacbookScroll 
          title={
            <span className="dark:text-white">
              Real-time route planning <br /> for efficient freight transport
            </span>
          }
          src="https://iili.io/3AH7Ihg.png" 
          showGradient={false}
        />
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 md:py-16 px-4 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-300">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Why Choose Last Mile</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We provide cutting-edge solutions for the unique challenges of freight transport in India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="relative overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-gray-800">
                <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-100 opacity-80 dark:from-gray-800 dark:to-gray-900"></div>
                <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                <CardContent className="relative z-10 p-6 h-full">
                  <div className="mb-4 text-logistics-600 dark:text-logistics-400">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button variant="outline" asChild className="dark:text-white dark:border-gray-600 dark:hover:bg-gray-700">
              <Link to="/features" className="inline-flex items-center">
                View All Features
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-16 px-4 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">What Our Customers Say</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Hear from logistics professionals who have transformed their operations with Last Mile
            </p>
          </div>

          <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 animated-gradient text-white">
        <div className="container mx-auto max-w-7xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to optimize your logistics?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join hundreds of logistics companies across India who are saving time and money with Last Mile.
          </p>
          <Button size="lg" variant="secondary" asChild className="bg-white text-logistics-700 hover:bg-gray-100">
            <Link to="/auth">Get Started Now</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
