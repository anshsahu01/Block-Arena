import { User } from "../models/user.model.js";
import { isValidHexColor } from "../utils/validators.js";
import { sanitizeUser } from "../utils/serializers.js";

export const updatePreferences = async (userId, { color }) => {
  if (!isValidHexColor(color)) {
    throw {
      statusCode: 400,
      message: "Color must be a 6-digit hex value like #12AB34",
    };
  }

  const updated = await User.findByIdAndUpdate(userId, { color }, { new: true, runValidators: true }).lean();

  if (!updated) {
    throw { statusCode: 404, message: "User not found" };
  }

  return {
    user: sanitizeUser(updated),
  };
};
