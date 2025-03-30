
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Route, Clock, Flag, Map, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Footer from '@/components/Footer';

const FeaturesPage = () => {
  const features = [
    {
      title: "Real-Time Traffic Integration",
      description: "Our platform seamlessly integrates live traffic data from multiple sources including MapmyIndia API, Google Maps API, and OpenStreetMap. This real-time information allows for accurate route planning that accounts for current road conditions, accidents, and congestion patterns specific to Indian roads.",
      icon: <Map className="h-10 w-10 text-logistics-600" />,
      image: "https://images.unsplash.com/photo-1589793907316-f94025b46850?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Route Optimization",
      description: "Our advanced algorithms optimize routes for heavy cargo trucks by considering multiple factors simultaneously: geographical distance, current and predicted traffic congestion, toll plaza locations and costs, and road suitability including weight restrictions and road quality. This comprehensive approach ensures the most efficient and cost-effective routes for your specific cargo needs.",
      icon: <Route className="h-10 w-10 text-logistics-600" />,
      image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Dynamic Rerouting",
      description: "When unexpected events occur on the road, our system responds in real-time. The dynamic rerouting feature automatically adjusts routes based on new information such as sudden traffic jams, road closures, or accidents. Drivers receive immediate alerts and new route suggestions, ensuring deliveries stay on schedule despite changing conditions.",
      icon: <Clock className="h-10 w-10 text-logistics-600" />,
      image: "https://images.unsplash.com/photo-1545239705-1564e58b9e4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "India-Specific Factors",
      description: "Unlike global solutions, our platform is built specifically for India's unique logistics landscape. We incorporate essential local factors including comprehensive toll costs across states, state border regulations and permit requirements, truck stop locations with amenities, and seasonal road conditions affected by monsoons. This contextual relevance makes our solution perfectly adapted to Indian transportation challenges.",
      icon: <Flag className="h-10 w-10 text-logistics-600" />,
      image: "https://images.unsplash.com/photo-1561891615-2c119fbf9920?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Map Visualization",
      description: "Our intuitive map interface provides clear visualization of routes with all critical information. Drivers and fleet managers can see major cities and logistics hubs, toll plaza locations with estimated costs, truck stops and rest areas, and receive real-time updates about road conditions. The interface is optimized for both desktop and mobile use, ensuring accessibility for office staff and drivers on the go.",
      icon: <MapPin className="h-10 w-10 text-logistics-600" />,
      image: "https://images.unsplash.com/photo-1548345680-f5475ea5df84?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 md:pb-24 px-4 bg-gradient-to-b from-logistics-50 to-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              Powerful <span className="text-logistics-600">Features</span> for Indian Logistics
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Our platform offers specialized tools designed specifically for the unique challenges of freight transport across India.
            </p>
            <Button size="lg" asChild>
              <Link to="/auth">Start Optimizing Your Routes</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Detail Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="space-y-24">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className={`order-2 ${index % 2 === 1 ? 'md:order-1' : 'md:order-2'}`}>
                  <img 
                    src={feature.image} 
                    alt={feature.title} 
                    className="rounded-lg shadow-xl w-full h-80 object-cover"
                  />
                </div>
                <div className={`space-y-6 order-1 ${index % 2 === 1 ? 'md:order-2' : 'md:order-1'}`}>
                  <div className="inline-flex items-center justify-center p-3 bg-logistics-100 rounded-lg">
                    {feature.icon}
                  </div>
                  <h2 className="text-3xl font-bold">{feature.title}</h2>
                  <p className="text-lg text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-logistics-600 text-white">
        <div className="container mx-auto max-w-7xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your logistics operations?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join hundreds of companies who are optimizing their routes and saving costs with Last Mile.
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

export default FeaturesPage;
