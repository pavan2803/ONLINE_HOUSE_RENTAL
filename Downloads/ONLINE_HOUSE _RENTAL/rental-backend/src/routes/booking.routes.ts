import { Router } from 'express';
import { Booking } from '../models/booking.model';
import { authenticateJWT, authorizeRoles, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// Get all bookings (Owner or Tenant)
router.get('/', authenticateJWT, async (req: AuthRequest, res, next) => {
  const filter: any = {};
  if (req.user!.role === 'tenant') filter.tenant = req.user!._id;
  // For owner, show bookings for properties they own
  const bookings = await Booking.find(filter)
    .populate({ path: 'property', match: req.user!.role === 'owner' ? { owner: req.user!._id } : {} })
    .populate('tenant', 'name email');
  // If owner, filter out bookings for properties not owned by them
  const filtered = req.user!.role === 'owner' ? bookings.filter(b => b.property && (b.property as any).owner.toString() === req.user!._id.toString()) : bookings;
  res.json(filtered);
});

// Create booking (Tenant)
router.post('/', authenticateJWT, authorizeRoles('tenant'), async (req: AuthRequest, res, next) => {
  const { property } = req.body;
  if (!property) {
    return res.status(400).json({ error: 'Property required' });
  }
  const booking = await Booking.create({ property, tenant: req.user!._id, status: 'Pending' });
  res.status(201).json(booking);
});

// Approve or reject booking (Owner)
router.patch('/:id', authenticateJWT, authorizeRoles('owner'), async (req: AuthRequest, res, next) => {
  const { status } = req.body;
  if (!['Approved', 'Rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  const booking = await Booking.findById(req.params.id).populate('property');
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  // Only the owner of the property can approve/reject
  const property: any = booking.property;
  if (!property || property.owner.toString() !== req.user!._id.toString()) {
    return res.status(403).json({ error: 'Forbidden: not your property' });
  }
  booking.status = status;
  await booking.save();
  res.json(booking);
});

export default router;
