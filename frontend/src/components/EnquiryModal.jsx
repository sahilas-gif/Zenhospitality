import QuoteDrawer from './QuoteDrawer';

// Tour and package enquiries use the shared quote drawer.
const EnquiryModal = ({ isOpen, onClose, pkg }) => (
  <QuoteDrawer
    open={isOpen}
    onClose={onClose}
    context={{
      type: pkg?.id ? 'package' : 'general',
      packageId: pkg?.id || null,
      title: pkg?.title || 'Tour enquiry',
      subtitle: pkg?.price ? `From ₹${Number(pkg.price).toLocaleString('en-IN')} per person` : 'Pricing tailored to your group',
      stay: false,
    }}
  />
);

export default EnquiryModal;
