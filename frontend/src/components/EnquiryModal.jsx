import { useState } from "react";
import {
  X,
  Send,
  MessageCircle,
  PhoneCall,
  Loader2,
  CalendarDays,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../lib/api";
import { CONTACT } from "../data/contact";

const EnquiryModal = ({ isOpen, onClose, pkg }) => {
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    message: "",
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [adults, setAdults] = useState(1);
  const [status, setStatus] = useState("idle");

  if (!isOpen) return null;

  const handleChange = (e) =>
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await api.post("/enquiries", {
        package_id: pkg?.id || null,
        ...formData,
        travel_date: startDate ? startDate.toISOString().split("T")[0] : "",
        group_size: adults,
      });
    } catch {
      /* fallback */
    }
    setStatus("success");
  };

  const packageTitle = pkg?.title || "General Enquiry";
  const travelDateStr = startDate ? startDate.toLocaleDateString() : "Flexible";
  const waMessage = encodeURIComponent(
    `Hi, I'm ${formData.customer_name}. I'm interested in ${packageTitle}. Travel Date: ${travelDateStr}, Guests: ${adults}. ${formData.message}`,
  );
  const waLink = `https://wa.me/${CONTACT.phonePrimaryWhatsApp}?text=${waMessage}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full sm:max-w-md bg-white border border-gray-200 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <h3 className="text-lg md:text-xl font-bold text-gray-900">
            Request to book
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 md:p-6">
          {status === "success" ? (
            <div className="text-center py-6 md:py-8">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-6 h-6 md:w-8 md:h-8 text-emerald-600" />
              </div>
              <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                Request Sent!
              </h4>
              <p className="text-gray-500 text-sm md:text-base mb-6 md:mb-8">
                Thank you, {formData.customer_name}. Our team will contact you
                shortly.
              </p>
              <div className="space-y-3 md:space-y-4">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg font-medium transition-colors text-sm md:text-base shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 md:w-5 md:h-5 mr-2" />{" "}
                  Continue on WhatsApp
                </a>
                <a
                  href={CONTACT.phonePrimaryTel}
                  className="w-full flex items-center justify-center py-3 bg-white hover:bg-gray-50 text-gray-800 rounded-lg font-medium transition-colors border border-gray-300 text-sm md:text-base shadow-sm"
                >
                  <PhoneCall className="w-4 h-4 md:w-5 md:h-5 mr-2" /> Call Us
                  Directly
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <p className="text-sm text-gray-900 font-bold mb-1">
                    {packageTitle}
                  </p>
                  <p className="text-xs text-gray-500">
                    {pkg?.price
                      ? `₹${pkg.price.toLocaleString()} per package`
                      : "Pricing varies"}
                  </p>
                </div>
              </div>

              {/* Airbnb style date picker container */}
              <div className="border border-gray-300 rounded-xl overflow-hidden mt-4">
                <div className="flex border-b border-gray-300">
                  <div className="flex-1 p-3 border-r border-gray-300 relative cursor-pointer">
                    <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wide">
                      Check-in
                    </label>
                    <div className="relative mt-1">
                      <CalendarDays className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        placeholderText="Add date"
                        withPortal
                        portalId="checkin-datepicker-portal"
                        calendarClassName="z-[9999]"
                        popperClassName="z-[9999]"
                        className="w-full bg-transparent border-none text-gray-900 text-sm focus:outline-none placeholder:text-gray-400 pl-6 cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="flex-1 p-3 relative cursor-pointer">
                    <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wide">
                      Checkout
                    </label>
                    <div className="relative mt-1">
                      <CalendarDays className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        placeholderText="Add date"
                        withPortal
                        portalId="checkout-datepicker-portal"
                        calendarClassName="z-[9999]"
                        popperClassName="z-[9999]"
                        className="w-full bg-transparent border-none text-gray-900 text-sm focus:outline-none placeholder:text-gray-400 pl-6 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3 flex justify-between items-center">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wide">
                      Guests
                    </label>
                    <span className="text-sm text-gray-900">
                      {adults} guest{adults > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => adults > 1 && setAdults((a) => a - 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-800 hover:text-gray-800 disabled:opacity-30 disabled:hover:border-gray-300"
                    >
                      -
                    </button>
                    <span className="text-sm font-medium w-4 text-center">
                      {adults}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAdults((a) => a + 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-800 hover:text-gray-800"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <input
                  required
                  type="text"
                  name="customer_name"
                  placeholder="Full Name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
                <input
                  required
                  type="tel"
                  name="customer_phone"
                  placeholder="Phone Number"
                  value={formData.customer_phone}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
                <textarea
                  name="message"
                  rows="2"
                  placeholder="Message the host (optional)"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-3.5 bg-[#FF5A5F] hover:bg-[#FF424D] text-white rounded-lg font-bold text-base transition-all mt-4 flex items-center justify-center shadow-md shadow-[#FF5A5F]/20"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />{" "}
                    Requesting...
                  </>
                ) : (
                  "Request to book"
                )}
              </button>
              <p className="text-center text-xs text-gray-500 mt-2">
                You won't be charged yet
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnquiryModal;
