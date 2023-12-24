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
  if (req.user.id !== id)
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