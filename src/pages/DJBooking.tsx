import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Calendar, MapPin, Music, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { djProfile } from '../data/dj';

const eventTypes = [
  { id: 'private', label: 'Private Event', description: 'House parties, birthdays, gatherings' },
  { id: 'art', label: 'Art Shows', description: 'Galleries, art battles, exhibitions' },
  { id: 'lounge', label: 'Lounges / Bars', description: 'Venue residencies, one-off sets' },
  { id: 'collab', label: 'Collaborative Set', description: 'B2B sets, guest appearances' },
  { id: 'other', label: 'Other', description: 'Something unique' },
];

const DJBooking = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    eventType: '',
    date: '',
    location: '',
    details: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just show success state
    // TODO: Connect to email service or form backend
    console.log('Booking request:', formData);
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Request Received!</h1>
          <p className="text-muted-foreground mb-8">
            Thanks for reaching out. I'll get back to you within 24-48 hours to discuss your event.
          </p>
          <Link to="/dj">
            <Button variant="outline" className="border-purple-500/50 hover:bg-purple-500/10">
              Back to DJ Page
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="container mx-auto px-4 pt-8 pb-12">
          <Link to="/dj" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft size={20} />
            <span>Back to DJ</span>
          </Link>

          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Book {djProfile.name}
            </h1>
            <p className="text-xl text-muted-foreground">
              Looking for a DJ for your event? Let's make it happen.
            </p>
          </div>
        </div>

        {/* Booking Form */}
        <div className="container mx-auto px-4 pb-20">
          <div className="max-w-2xl mx-auto">
            {/* What I Offer */}
            <div className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 mb-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Music className="w-5 h-5 text-purple-400" />
                What I Bring
              </h2>
              <p className="text-muted-foreground mb-4">
                High-energy, groove-driven sets tailored to your crowd. Specializing in soulful house, funk, and adaptable multi-genre performances.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full">Private Events</span>
                <span className="text-xs px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full">Art Shows</span>
                <span className="text-xs px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full">Lounges / Bars</span>
                <span className="text-xs px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full">Collaborative Sets</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-background border border-border/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-background border border-border/50 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              {/* Event Type */}
              <div>
                <label htmlFor="eventType" className="block text-sm font-medium mb-2">
                  Event Type *
                </label>
                <select
                  id="eventType"
                  name="eventType"
                  required
                  value={formData.eventType}
                  onChange={handleChange}
                  className="w-full bg-background border border-border/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all appearance-none"
                >
                  <option value="">Select an event type...</option>
                  {eventTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.label} - {type.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium mb-2">
                  Preferred Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full bg-background border border-border/50 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full bg-background border border-border/50 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                    placeholder="City, Venue, or Address"
                  />
                </div>
              </div>

              {/* Details */}
              <div>
                <label htmlFor="details" className="block text-sm font-medium mb-2">
                  Additional Details
                </label>
                <textarea
                  id="details"
                  name="details"
                  rows={4}
                  value={formData.details}
                  onChange={handleChange}
                  className="w-full bg-background border border-border/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all resize-none"
                  placeholder="Tell me about your event, expected crowd size, vibe you're going for, any special requests..."
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                Send Booking Request
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                I typically respond within 24-48 hours.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DJBooking;
