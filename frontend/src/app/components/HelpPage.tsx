import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Search, MessageCircle, Mail, Phone, HelpCircle, Book, Shield, DollarSign } from "lucide-react";

const faqs = [
  {
    category: "Getting Started",
    icon: Book,
    questions: [
      {
        q: "How do I create an account?",
        a: "Click the 'Sign Up' button in the header and fill in your details. You'll receive a verification email to activate your account."
      },
      {
        q: "Is ReCircle free to use?",
        a: "Yes! Creating an account and browsing products is completely free. We only charge a small commission (5%) when you successfully sell an item."
      },
      {
        q: "How do I list my first item?",
        a: "Click the 'Sell Item' button, upload clear photos of your item, fill in the details (title, price, condition, description), and submit. Your listing will be live immediately!"
      }
    ]
  },
  {
    category: "Buying",
    icon: DollarSign,
    questions: [
      {
        q: "How do I purchase an item?",
        a: "Browse products, click on an item you like, and click 'Contact Seller' to arrange purchase details, or add to cart for direct checkout if available."
      },
      {
        q: "What payment methods are accepted?",
        a: "We accept all major credit cards, debit cards, PayPal, and some sellers offer local cash pickup options."
      },
      {
        q: "Can I return an item?",
        a: "Returns depend on the seller's policy. Check the item description or contact the seller before purchasing. Most sellers offer returns within 7 days if the item doesn't match the description."
      }
    ]
  },
  {
    category: "Selling",
    icon: MessageCircle,
    questions: [
      {
        q: "How do I get paid?",
        a: "Once a sale is confirmed and the buyer receives the item, funds are released to your account within 3-5 business days. You can withdraw to your bank account or PayPal."
      },
      {
        q: "What should I include in my listing?",
        a: "Include clear photos from multiple angles, honest descriptions of condition, measurements, any flaws or damage, and what makes your item special. Detailed listings sell faster!"
      },
      {
        q: "How do I ship items?",
        a: "You can arrange shipping yourself or use our integrated shipping partners for discounted rates. Always get tracking and insurance for valuable items."
      }
    ]
  },
  {
    category: "Safety & Trust",
    icon: Shield,
    questions: [
      {
        q: "How do I stay safe when buying/selling?",
        a: "Always communicate through our platform, meet in public places for local pickups, inspect items before paying, and report suspicious activity immediately."
      },
      {
        q: "What if I receive a damaged item?",
        a: "Contact the seller immediately and document the damage with photos. If you can't resolve it, open a dispute through our Resolution Center within 48 hours."
      },
      {
        q: "How do seller ratings work?",
        a: "Buyers can rate sellers after a transaction (1-5 stars) and leave reviews. High ratings help build trust and increase sales."
      }
    ]
  }
];

export function HelpPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-gray-900 mb-3">How can we help you?</h1>
        <p className="text-gray-600 mb-8">Find answers to common questions or get in touch with our support team</p>
        
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search for help..."
            className="pl-12 h-14 rounded-2xl border-gray-300 bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Quick Contact Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-12">
        <Card className="rounded-2xl border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="pt-6 text-center">
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-7 w-7 text-emerald-600" />
            </div>
            <h3 className="text-gray-900 mb-2">Live Chat</h3>
            <p className="text-sm text-gray-600 mb-4">Chat with our support team</p>
            <Button variant="outline" className="rounded-xl w-full">
              Start Chat
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="pt-6 text-center">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="h-7 w-7 text-blue-600" />
            </div>
            <h3 className="text-gray-900 mb-2">Email Support</h3>
            <p className="text-sm text-gray-600 mb-4">We'll respond within 24hrs</p>
            <Button variant="outline" className="rounded-xl w-full">
              Send Email
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="pt-6 text-center">
            <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Phone className="h-7 w-7 text-purple-600" />
            </div>
            <h3 className="text-gray-900 mb-2">Phone Support</h3>
            <p className="text-sm text-gray-600 mb-4">Mon-Fri, 9am-6pm EST</p>
            <Button variant="outline" className="rounded-xl w-full">
              Call Now
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQs */}
      <div className="mb-12">
        <h2 className="text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
        
        <div className="space-y-6">
          {faqs.map((category, idx) => (
            <Card key={idx} className="rounded-2xl border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
                    <category.icon className="h-5 w-5 text-emerald-600" />
                  </div>
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-2">
                  {category.questions.map((faq, qIdx) => (
                    <AccordionItem key={qIdx} value={`${idx}-${qIdx}`} className="border border-gray-200 rounded-xl px-4">
                      <AccordionTrigger className="hover:no-underline text-left">
                        <span className="text-gray-900">{faq.q}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <Card className="rounded-2xl border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-emerald-600" />
            Still need help?
          </CardTitle>
          <p className="text-sm text-gray-600">Send us a message and we'll get back to you soon</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-700">Name</label>
              <Input placeholder="Your name" className="rounded-xl border-gray-300" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-700">Email</label>
              <Input type="email" placeholder="your@email.com" className="rounded-xl border-gray-300" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-700">Subject</label>
            <Input placeholder="What do you need help with?" className="rounded-xl border-gray-300" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-700">Message</label>
            <Textarea 
              placeholder="Describe your issue or question..." 
              className="rounded-xl border-gray-300 min-h-32 resize-none" 
            />
          </div>
          <Button className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl">
            Send Message
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
