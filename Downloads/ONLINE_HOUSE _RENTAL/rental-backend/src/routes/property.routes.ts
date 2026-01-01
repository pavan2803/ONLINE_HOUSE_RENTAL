import { Router } from 'express';
import { Property } from '../models/property.model';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.middleware';

const router = Router();

// Get all properties (with optional filters)
router.get('/', async (req, res) => {
  const { location, minRent, maxRent, amenities } = req.query;
  const filter: any = {};
  if (location) filter.location = location;
  if (minRent || maxRent) filter.rent = {};
  if (minRent) filter.rent.$gte = Number(minRent);
  if (maxRent) filter.rent.$lte = Number(maxRent);
  if (amenities) filter.amenities = { $all: (Array.isArray(amenities) ? amenities : [amenities]) };
  const properties = await Property.find(filter).populate('owner', 'name email');
  res.json(properties);
});

// Get property by id
router.get('/:id', async (req, res) => {
  const property = await Property.findById(req.params.id).populate('owner', 'name email');
  if (!property) return res.status(404).json({ error: 'Property not found' });
  res.json(property);
});

// Create property (Owner only)
import { AuthRequest } from '../middleware/auth.middleware';

router.post('/', authenticateJWT, authorizeRoles('owner'), async (req: AuthRequest, res, next) => {
  const { title, description, rent, location, amenities, photos } = req.body;
  if (!title || !location || !rent || rent <= 0) {
    return res.status(400).json({ error: 'Invalid property data' });
  }
  const property = await Property.create({
    owner: req.user!._id,
    title,
    description,
    rent,
    location,
    amenities,
    photos,
  });
  res.status(201).json(property);
});

export default router;
