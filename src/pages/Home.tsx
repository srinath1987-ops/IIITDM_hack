
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, CheckCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Footer from '@/components/Footer';

const HomePage = () => {
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
      name: "Rajesh Kumar",
      role: "Fleet Manager, Logistics Co",
      content: "Last Mile has transformed how we manage our fleet. The route optimization has cut our fuel costs by 15% in just three months.",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      name: "Priya Sharma",
      role: "Operations Director, FreightIndia",
      content: "The real-time traffic integration is a game-changer. We can now predict delivery times with amazing accuracy.",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
      name: "Vikram Singh",
      role: "Owner, Singh Transports",
      content: "As a small business owner, the toll cost optimization alone has saved me lakhs of rupees annually. Highly recommended!",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 md:pb-24 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
                Optimize Your <span className="text-logistics-600">Freight Routes</span> Across India
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-md">
                Last Mile delivers intelligent route optimization for cargo transport across India, saving time, fuel, and money with real-time traffic data.
              </p>
              <div className="pt-4">
                <Button size="lg" asChild className="group">
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

              {/* <div className="absolute inset-0 bg-logistics-600/10 rounded-lg"></div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Last Mile</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide cutting-edge solutions for the unique challenges of freight transport in India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="relative overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-100 opacity-80"></div>
                <div className="absolute inset-0 bg-white/50 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                <CardContent className="relative z-10 p-6 h-full">
                  <div className="mb-4 text-logistics-600">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button variant="outline" asChild>
              <Link to="/features" className="inline-flex items-center">
                View All Features
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from logistics professionals who have transformed their operations with Last Mile
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border border-gray-200 hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="h-10 w-10 rounded-full mr-3"
                    />
                    <div>
                      <h4 className="font-medium">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-logistics-600 text-white">
        <div className="container mx-auto max-w-7xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to optimize your logistics?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join hundreds of logistics companies across India who are saving time and money with Last Mile.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/auth">Get Started Now</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
