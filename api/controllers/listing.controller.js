import Listing from "../models/listing.model.js";
import errorHandler from "../utils/error.js";

export const listing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const { id } = req.params;
  const foundListing = await Listing.findById(id);
  const userRef = foundListing.userRef;
  if (req.user.id !== userRef)
    return next(errorHandler(401, 'You can delete only your listing'));

  try {
    // Find the listing by ID and remove it
    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      // If the listing with the given ID is not found
      return next(errorHandler(404, 'Listing not found'));
    }

    // Return the deleted listing details
    return res.status(200).json('Listing has been deleted');
  } catch (error) {
    // Handle errors
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const { id } = req.params;
  const updateListing = await Listing.findById(id);
  if (!updateListing)
    // If the listing with the given ID is not found
    return next(errorHandler(404, 'Listing not found'));

  if (req.user.id !== updateListing.userRef)
    return next(errorHandler(401, 'You can update only your listing'));

  try {
    // Find the listing by ID and remove it
    const updateListing = await Listing.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.status(200).json(updateListing);
  } catch (err) {
    next(err);
  }
};

export const getListing = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Find the listing by ID
    const foundListing = await Listing.findById(id);

    if (!foundListing) {
      // If the listing with the given ID is not found
      return next(errorHandler(404, 'Listing not found'));
    }

    // Return the found listing details
    return res.status(200).json(foundListing);
  } catch (error) {
    // Handle errors
    next(error);
  }
};


export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;
    if (offer === undefined || offer === 'false') offer = { $in: [false, true] };

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === 'false') furnished = { $in: [false, true] };

    let parking = req.query.parking;
    if (parking === undefined || parking === 'false') parking = { $in: [false, true] };

    let type = req.query.type;
    if (type === undefined || type === 'false') type = { $in: ['sale', 'rent'] };

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';
    const order = req.query.order || 'desc';

    // Build the query object based on the provided parameters
    const query = {
      name: { $regex: new RegExp(searchTerm, 'i') },
      offer,
      furnished,
      parking,
      type,
      // description: { $regex: new RegExp(searchTerm, 'i') },
    };

    const listings = await Listing.find(query)
      .sort({ [sort]: order })
      .skip(startIndex)
      .limit(limit);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
