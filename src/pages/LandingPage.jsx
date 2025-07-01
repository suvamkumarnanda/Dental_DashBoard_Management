import React, { useState, useContext } from 'react';
import patient from "../assets/smiling.jpg";
import checkupImg from '../assets/checkup.jpg';
import whiteTeethImg from '../assets/whiteteeth.jpg';
import implantImg from '../assets/implant.jpg';
import { AppointmentsContext } from '../context/AppointmentsContext';

const LandingPage = () => {
  const { addAppointment } = useContext(AppointmentsContext);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    appointmentDateTime: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.appointmentDateTime
    ) {
      alert('Please fill all fields including appointment date and time.');
      return;
    }

    addAppointment({
      id: Date.now(),
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      appointmentDateTime: formData.appointmentDateTime,
      bookedAt: new Date().toISOString(),
    });

    alert('Appointment booked successfully!');

    setFormData({
      fullName: '',
      email: '',
      phone: '',
      appointmentDateTime: '',
    });
  };

  return (
    <div className="min-h-screen flex flex-col">

      {/* Hero Section */}
      <section className="bg-aqua-50 flex flex-col md:flex-row items-center justify-between px-6 py-20 container mx-auto">
        <div className="max-w-xl mb-10 md:mb-0">
          <h2 className="text-4xl font-extrabold text-black-900 mb-4">
            Your dental health is our top priority.
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Your smile is our priority. Our dental care app connects you with expert dentists, easy appointment scheduling, treatment tracking, and helpful tips for better oral health. Whether it’s a quick cleaning or long-term care, we’re here to make dental visits stress-free.
          </p>
          <a
            href="#contact"
            className="inline-block bg-pink-700 text-white px-6 py-3 rounded shadow hover:bg-pink-800 transition"
          >
            Make an Appointment
          </a>
        </div>
        <div>
          <img
            src={patient}
            alt="Smiling patient"
            className="rounded-lg shadow-lg max-w-full h-auto"
          />
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl  text-black-800 mb-12 font-semibold text-center">
            Our Services
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center p-6 border rounded shadow hover:shadow-lg transition">
              <img
                src={checkupImg}
                alt="Dental Checkup"
                className="mx-auto w-50 mb-4 h-25"
              />
              <h4 className="text-xl font-semibold mb-2">Dental Checkups</h4>
              <p className="text-gray-600">
                Thorough examination of your teeth, gums, and other oral tissues to assess their health and identify any potential problems
              </p>
            </div>
            <div className="text-center p-6 border rounded shadow hover:shadow-lg transition">
              <img
                src={whiteTeethImg}
                alt="Teeth Whitening"
                className="mx-auto mb-4 h-25 w-50"
              />
              <h4 className="text-xl font-semibold mb-2">Teeth Whitening</h4>
              <p className="text-gray-600">
               Enhance your confidence and brighten your smile with our safe, gentle, and highly effective teeth whitening treatments designed to deliver radiant results.
              </p>
            </div>
            <div className="text-center p-6 border rounded shadow hover:shadow-lg transition">
              <img
                src={implantImg}
                alt="Dental Implants"
                className="mx-auto mb-4 h-25 w-50"
              />
              <h4 className="text-xl font-semibold mb-2">Dental Implants</h4>
              <p className="text-gray-600">
                Regain your complete smile and confidence with our durable, natural-looking dental implants designed to seamlessly replace missing teeth
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-blue-50 py-16">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h3 className="text-3xl font-semibold text-black-900 mb-6">About Us</h3>
          <p className="text-gray-700 leading-relaxed">
           At DentaSphere, we blend advanced technology with compassionate design to redefine the dental care experience. Our goal is simple: to make clinic management smarter and patient care smoother.
With intuitive tools for scheduling, treatment tracking, and team collaboration, DentaSphere equips dental professionals to focus on what truly matters—providing outstanding care. We believe in combining innovation with empathy, ensuring every feature serves both clinicians and their patients with clarity and care.
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-aqua-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <h3 className="text-3xl font-semibold text-black-800 mb-12 text-center">
            What Our Patients Say
          </h3>
          <div className="space-y-8">
            <blockquote className="border-l-4  italic text-gray-700 border-blue-700 pl-6">
              “By far the best dental experience I’ve ever had! Great staff. Highly recommended!”
              <footer className="mt-2  text-black-700 font-semibold">- Thomas K</footer>
            </blockquote>
            <blockquote className="border-l-4  pl-6 italic text-gray-700 border-black-700">
              “Professional, friendly, and thorough. Highly recommend for anyone looking for quality dental care.”
              <footer className="mt-2  text-black-700 font-semibold">- Alex C</footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Contact / CTA Section with appointment booking form */}
      <section id="contact" className="bg-pink-700 py-16 text-white">
        <div className="container  text-center mx-auto px-6 max-w-3xl">
          <h3 className="text-3xl  mb-6 font-semibold">Schedule Your Visit Today</h3>
          <p className="mb-8">
            Call us at +91 422753270 or fill out the form below to book your appointment.
          </p>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              className="w-full px-4 py-3 rounded text-gray-900"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="w-full px-4 py-3 rounded text-gray-900"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              className="w-full px-4 py-3 rounded text-gray-900"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <label htmlFor="appointmentDateTime" className="block text-left mb-1 font-semibold">
              Appointment Date & Time
            </label>
            <input
              type="datetime-local"
              id="appointmentDateTime"
              name="appointmentDateTime"
              className="w-full px-4 py-3 rounded text-gray-900"
              value={formData.appointmentDateTime}
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="w-full bg-lime-200 text-blue-900 font-bold py-3 rounded hover:bg-yellow-500 transition"
            >
              Book Appointment
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-6 text-center">
        &copy; {new Date().getFullYear()} DentaSphere. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
