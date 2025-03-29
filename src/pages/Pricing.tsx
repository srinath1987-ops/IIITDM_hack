
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Footer from '@/components/Footer';

const PricingPage = () => {
  const plans = [
    {
      name: "Starter",
      price: "₹9,999",
      description: "Perfect for small businesses with limited routes",
      features: [
        "Up to 5 vehicles",
        "Basic route optimization",
        "Daily traffic updates",
        "Email support",
        "7-day route history"
      ],
      popular: false,
      buttonText: "Get Started",
    },
    {
      name: "Pro",
      price: "₹24,999",
      description: "For growing businesses with moderate logistics needs",
      features: [
        "Up to 25 vehicles",
        "Advanced route optimization",
        "Real-time traffic integration",
        "Toll cost optimization",
        "Priority support",
        "30-day route history",
        "Basic analytics dashboard"
      ],
      popular: true,
      buttonText: "Get Started",
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large fleets with complex routing requirements",
      features: [
        "Unlimited vehicles",
        "Premium route optimization",
        "Real-time dynamic rerouting",
        "Advanced analytics & reporting",
        "Dedicated account manager",
        "API access",
        "Custom integrations",
        "90-day route history"
      ],
      popular: false,
      buttonText: "Contact Sales",
    }
  ];

  const faqs = [
    {
      question: "How accurate is your traffic data?",
      answer: "Our traffic data is sourced from multiple reliable providers including MapmyIndia, Google Maps, and crowd-sourced information. We update traffic conditions every 2-5 minutes in major cities and every 15 minutes in other areas."
    },
    {
      question: "Does your platform work offline?",
      answer: "Yes, our mobile app allows drivers to download routes for offline use. While real-time updates won't be available without connectivity, the basic navigation features will continue to work."
    },
    {
      question: "Can I integrate with my existing fleet management software?",
      answer: "Yes, our Enterprise plan includes API access and custom integrations with major fleet management solutions. Our team will work with you to ensure smooth data flow between systems."
    },
    {
      question: "How do you calculate toll costs?",
      answer: "We maintain a comprehensive database of toll plazas across India, with up-to-date pricing based on vehicle types. Our system calculates toll costs as part of the route optimization process, allowing you to choose routes based on time, distance, or total cost including tolls."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes, we offer a 14-day free trial of our Pro plan so you can experience the benefits of Last Mile before committing. No credit card is required to start your trial."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 md:pb-24 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
              Simple, Transparent <span className="text-logistics-600">Pricing</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Choose the plan that's right for your business, from small fleets to nationwide operations.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`flex flex-col ${
                  plan.popular 
                    ? 'border-logistics-500 shadow-lg relative' 
                    : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/2 bg-logistics-600 text-white text-sm font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.name !== "Enterprise" && <span className="text-gray-500 ml-1">/month</span>}
                  </div>
                  <p className="text-gray-500 mt-2">{plan.description}</p>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-logistics-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-logistics-600 hover:bg-logistics-700' : ''}`} 
                    variant={plan.popular ? 'default' : 'outline'}
                    asChild
                  >
                    <Link to={plan.name === "Enterprise" ? "/contact" : "/auth"}>
                      {plan.buttonText}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">
              Find answers to common questions about our platform and pricing
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-logistics-600 text-white">
        <div className="container mx-auto max-w-7xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to optimize your fleet?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Start your 14-day free trial and see the difference Last Mile can make.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/auth">Start Free Trial</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PricingPage;
