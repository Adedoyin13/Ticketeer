const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User, ProfilePicture } = require("../Model/authModel");
const { OAuth2Client } = require("google-auth-library");
const { generateToken, hashToken, sendEmail } = require("../Utils/index");
const verificationEmailTemplate = require("../Utils/emailTemplates");
const jwt = require("jsonwebtoken");
const cloudinary = require("../Config/cloudinary");
const getGoogleAccessToken = require("../Utils/googleAccessToken");
const nodemailer = require("nodemailer");
const passport = require("passport");
require("./../Config/passport");
const FRONTEND_URL = process.env.FRONTEND_URL;
const crypto = require("crypto");
const multer = require("multer");
const { Event, Ticket } = require("../Model/eventModel");
const {
  sendUserRegisterMail,
  sendUserLogInMail,
  sendUserUpdateMail,
  sendUserDeleteMail,
  sendUserLogoutMail,
} = require("../Utils/sendEmail");
const storage = multer.memoryStorage();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const getInitials = (fullName) => {
  const names = fullName.trim().split(" ");
  const initials = names
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
  return initials;
};

const getRandomOrangeShade = () => {
  const hue = 30; // Orange hue
  const saturation = Math.floor(Math.random() * 20) + 80; // 80% - 100%
  const lightness = Math.floor(Math.random() * 20) + 40; // 40% - 60%
  return { h: hue, s: saturation, l: lightness };
};

const hslToHex = (h, s, l) => {
  s /= 100;
  l /= 100;

  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) =>
    Math.round(
      255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))))
    )
      .toString(16)
      .padStart(2, "0");

  return `${f(0)}${f(8)}${f(4)}`;
};

const DEFAULT_IMAGE_URL = process.env.DEFAULT_IMAGE_URL;
// const DEFAULT_IMAGE_URL = `https://via.placeholder.com/150x150?text=${name}`;

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate password length
    if (password.length < 8 || password.length > 20) {
      return res.status(400).json({
        message: "Password must be between 8 and 20 characters",
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already in use." });
    }

    // Create a new user
    const user = new User({
      name,
      email,
      password,
    });

    // Then use in your logic like this:
    const initials = getInitials(name); // e.g. "TU"
    const { h, s, l } = getRandomOrangeShade();
    const bgColor = hslToHex(h, s, l); // e.g. "ffa94d"
    const textColor = "FFFFFF";

    // Final URL
    const DEFAULT_IMAGE_URL = `https://placehold.co/150x150/${bgColor}/${textColor}?text=${initials}&font=roboto`;

    const defaultProfilePicture = await ProfilePicture.create({
      userId: user._id,
      imageUrl: DEFAULT_IMAGE_URL, // Default profile image
      cloudinaryId: null, // No Cloudinary image for default picture
    });

    // Link default profile picture to user
    user.photo = defaultProfilePicture._id;
    await user.save();

    // Generate authentication token
    const token = generateToken(user._id);

    // Set the cookie with the token
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 24 hours expiration
      sameSite: "none",
      secure: true,
    });

    // Send response with user details
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      photo: defaultProfilePicture.imageUrl, // Send profile picture URL
      location: user.location,
      interests: user.interests,
      socialMediaLinks: user.socialMediaLinks,
    });

    await sendUserRegisterMail({ email, name });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.error("Email or password not provided");
      return res.status(404).json({ message: "Please add email and password" });
    }

    let user = await User.findOne({ email }).populate("photo");

    // Check if the user exists
    if (!user) {
      return res
        .status(404)
        .json({ message: "User Not Found, please create an account" });
    }
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = generateToken(user._id);
    // console.log(token)
    if (user && isMatch) {
      res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), //expires within 24hrs
        sameSite: "none",
        secure: true,
      });

      const { _id, name, email, photo, location, interests, socialMediaLinks } =
        user;

      res.status(200).json({
        _id,
        name,
        email,
        photo,
        location,
        interests,
        socialMediaLinks,
        token,
      });
      await sendUserLogInMail({ name, email });
    } else {
      console.error("Unexpected error during login for user:", email, token);
      res.status(500).json("Something went wrong, please try again");
    }
  } catch (error) {
    console.log("Error during login process:", error);
    return res.status(500).json({ message: error.message });
  }
});

const googleLogin = asyncHandler(async (req, res) => {
  try {
    const { token } = req.body; // This token comes from the frontend after the user signs in with Google

    // console.log('Token received:', token);

    // Verify the Google ID token using the OAuth2 client
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID, // Verify the client ID matches
    });

    // Extract the user data from the Google token
    const payload = ticket.getPayload();
    const email = payload.email;

    // Check if the user already exists in the database by email
    let user = await User.findOne({ email });

    if (!user) {
      // If the user does not exist, create a new user
      console.log("User does not exist. Creating new user...");

      // Handle user creation with Google-specific data
      user = new User({
        name: payload.name,
        email,
        googleId: payload.sub, // Google-specific user ID
        authType: "google", // Mark the user as authenticated with Google
      });

      // Handle user profile photo
      const photoUrl = payload.picture; // Google provides a profile picture URL

      if (photoUrl) {
        // Create a profile picture document and link it to the user
        const profilePic = new ProfilePicture({
          userId: user._id,
          imageUrl: photoUrl,
        });

        await profilePic.save();
        user.photo = profilePic._id; // Associate the photo with the user
      }

      await user.save();
      // console.log('New user created:', user);
    }

    // Create a JWT token for the user
    const jwtToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.ACCESS_TOKEN, // Your JWT secret
      { expiresIn: "1d" } // JWT expires in 1 day
    );

    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax", // or "None" if using cross-site cookies
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // res.status(200).json({ user });

    try {
      await sendUserLogInMail({ name: user.name, email: user.email });
    } catch (error) {
      console.error("Failed to send login email:", error.message);
    }

    // Send the user data and JWT token in the response
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photo: user.photo,
        authType: user.authType,
      },
      token: jwtToken,
    });
  } catch (error) {
    console.error("Error during Google login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const loginWithGoogle = async (req, res) => {
  passport.authenticate("google", { session: false }, async (err, user) => {
    if (err || !user) {
      return res.redirect(`${FRONTEND_URL}/login`);
    }

    const token = generateToken(user);

    console.log(token);

    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: "none",
      secure: true,
    });

    try {
      await sendUserLogInMail({ name: user.name, email: user.email });
    } catch (error) {
      console.error("Failed to send login email:", error.message);
    }

    res.redirect(`${FRONTEND_URL}/dashboard`);
  })(req, res);
};

const googleAuth = passport.authenticate("google", {
  scope: ["email", "profile"],
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404).json({ message: "No user with this email" });
  }

  // Delete Token if it exists in DB
  let token = await Token.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
  }

  // Create Verification Token and Save
  const resetToken = crypto.randomBytes(32).toString("hex") + user._id;
  // console.log(resetToken);

  // Hash token and save
  const hashedToken = hashToken(resetToken);
  await new Token({
    userId: user._id,
    rToken: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 60 * (60 * 1000), // 60mins
  }).save();

  // Construct Reset URL
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  // Construct email HTML template
  const emailHtml = `
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Password Reset Request</title>
        <style>
          body {
            background-color: #0a1930;
            padding: 30px;
            font-family: Arial, Helvetica, sans-serif;
          }

          .container {
            background-color: #eee;
            padding: 10px;
            border-radius: 3px;
          }

          .color-primary {
            color: #007bff;
          }

          .color-danger {
            color: orangered;
          }

          .color-success {
            color: #28a745;
          }

          .color-white {
            color: #fff;
          }

          .color-blue {
            color: #0a1930;
          }

          a {
            font-size: 1.4rem;
            text-decoration: none;
          }

          .btn {
            font-size: 1.4rem;
            font-weight: 400;
            padding: 6px 8px;
            margin: 0 5px 0 0;
            border: 1px solid transparent;
            border-radius: 3px;
            cursor: pointer;
          }

          .btn-primary {
            color: #fff;
            background: #007bff;
          }

          .btn-secondary {
            color: #fff;
            border: 1px solid #fff;
            background: transparent;
          }

          .btn-danger {
            color: #fff;
            background: orangered;
          }

          .btn-success {
            color: #fff;
            background: #28a745;
          }

          .flex-center {
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .logo {
            padding: 5px;
            background-color: #1f93ff;
          }

          .my {
            margin: 2rem 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo flex-center">
            <h2 class="color-white">UmmahConnect</h2>
          </div>
          <h2>As Salam Alaekum Wa Rahmatullahi Wa Barokatuhu <span class="color-danger">${user.firstName}</span></h2>
          <p>Please use the URL below to reset your password:</p>
          <p>This link is valid for 1 hour.</p>
          <a href="${resetUrl}" class="btn btn-success">Reset Password</a>
          <div class="my">
            <p>Regards...</p>
            <p><b class="color-danger">UmmahConnect</b> Team</p>
          </div>
        </div>
      </body>
    </html>
  `;

  // Send Email
  try {
    await sendEmail({
      subject: "Password Reset Request - Ticketeer",
      send_to: user.email,
      sent_from: process.env.EMAIL_USER,
      reply_to: "noreply@ticketeer.com",
      html: emailHtml,
    });
    res.status(200).json({ message: "Password Reset Email Sent" });
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent, please try again");
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { resetToken } = req.params;
  const { password } = req.body;
  // console.log(resetToken);
  // console.log(password);

  const hashedToken = hashToken(resetToken);

  const userToken = await Token.findOne({
    rToken: hashedToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or Expired Token");
  }

  // Find User
  const user = await User.findOne({ _id: userToken.userId });

  // Now Reset password
  user.password = password;
  await user.save();

  res.status(200).json({ message: "Password Reset Successful, please login" });
});

const getProfilePicture = asyncHandler(async (req, res) => {
  try {
    const userId = req.userId; // Get ID from authenticated user
    const user = await User.findById(userId).populate("photo");

    if (!user) {
      return res.status(404).json({ message: "User Not Found!" });
    }

    const { _id, photo } = user;

    return res.status(200).json({
      _id,
      photo,
    });
  } catch (error) {
    console.error(error);
    return res.status(404).json({ message: "User not found" });
  }
});

const uploadProfilePictur = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Find the user by ID
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete old Cloudinary image if it exists
    if (user.photo && user.photo.cloudinaryId) {
      await cloudinary.uploader.destroy(user.photo.cloudinaryId);
    }

    // Convert Cloudinary upload_stream into a Promise
    const uploadToCloudinary = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profile_pictures", resource_type: "image" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        stream.end(buffer);
      });
    };

    // Upload Image to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer);

    // Update user's profile picture
    const newPhoto = await ProfilePicture.create({
      userId: user._id,
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id,
    });

    // Update user's profile picture reference
    user.photo = newPhoto._id;
    await user.save();

    return res.status(201).json({
      photo: newPhoto,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const uploadProfilePicture = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const file = req.file; // Assuming you’re using multer or base64 body

  if (!file) {
    return res.status(400).json({ message: "No image provided" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // 1. Delete old photo from Cloudinary if it exists
  if (user.photo && user.photo.cloudinaryId) {
    await cloudinary.uploader.destroy(user.photo.cloudinaryId);
  }

  // 2. Upload new photo
  const result = await cloudinary.uploader.upload(file.path || file, {
    folder: "profile_photos", // optional folder in Cloudinary
  });

  // 3. Update user with new photo data
  user.photo = {
    url: result.secure_url,
    cloudinaryId: result.public_id,
  };

  await user.save();

  res.status(200).json({
    message: "Photo updated successfully",
    photo: user.photo,
  });
});

const updateProfilePicture = async (req, res) => {
  try {
    const userId = req.userId;
    // console.log(userId)

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let user = await User.findById(userId).populate("photo");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If user already has a Cloudinary image, delete the old one
    if (user.photo && user.photo.cloudinaryId) {
      await cloudinary.uploader.destroy(user.photo.cloudinaryId);
    }

    // Upload new image to Cloudinary
    const result = await cloudinary.uploader
      .upload_stream({ folder: "profile_pictures" }, async (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return res.status(500).json({ message: "Cloudinary upload failed" });
        }

        // Update user's profile picture details
        user.photo.imageUrl = result.secure_url;
        user.photo.cloudinaryId = result.public_id;
        await user.photo.save();

        res.status(200).json({
          profilePicture: user.photo,
        });
      })
      .end(req.file.buffer); // Pass buffer from multer's memory storage
  } catch (error) {
    console.error("Profile Picture Update Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteProfilePicture = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("photo");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If user has a Cloudinary image, delete it
    if (user.photo && user.photo.cloudinaryId) {
      await cloudinary.uploader.destroy(user.photo.cloudinaryId);
    }

    // Reset to default profile picture
    user.photo.imageUrl = DEFAULT_IMAGE_URL;
    user.photo.cloudinaryId = null;
    await user.photo.save();

    res.status(200).json({
      photo: user.photo,
    });
  } catch (error) {
    console.error("Delete Profile Picture Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from auth middleware

    // Fetch user information and exclude password from the response
    const user = await User.findById(userId)
      .select("-password") // Exclude password
      .populate("photo") // Populate user's photo
      .populate({
        path: "ticket", // Populate ticket references
        populate: [
          {
            path: "eventId",
            select:
              "title description eventType meetLink category location startDate startTime endDate endTime",
          },
          { path: "ticketTypeId", select: "type price description" },
        ],
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send the user data along with their purchased tickets
    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching user data" });
  }
});

const getUserTickets = asyncHandler(async (req, res) => {
  try {
    // Get logged-in user's ID from the request (auth middleware should set this)
    const userId = req.userId;

    // Fetch the tickets purchased by the user
    const tickets = await Ticket.find({ userId })
      .populate({
        path: "eventId", // Populate event details related to the ticket
        select:
          "title description eventType meetLink category location startDate startTime endDate endTime",
      })
      .populate({
        path: "ticketTypeId", // Populate ticket type details
        select: "type price description",
      });

    // Check if the user has purchased any tickets
    if (!tickets) {
      return res
        .status(404)
        .json({ message: "No tickets found for this user" });
    }

    // Send response with the tickets and their event details
    return res.status(200).json({
      message: "Tickets fetched successfully",
      tickets,
    });
  } catch (error) {
    console.error("❌ Error fetching user tickets:", error);
    return res
      .status(500)
      .json({ message: "Error fetching user tickets", error: error.message });
  }
});

const updateThemeMode = async (req, res) => {
  const { userId } = req.userId; // Assuming you have user in req.user
  const { themeMode } = req.body;

  if (!['light', 'dark'].includes(themeMode)) {
    return res.status(400).json({ error: 'Invalid mode value' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { themeMode },
      { new: true }
    );
    res.json({ themeMode: updatedUser.themeMode });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update mode' });
  }
};

const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find()
      .populate("photo")
      .sort("-createdAt")
      .select("-password");
    if (!users) {
      return res.status(500).json({ message: "Something went wrong" });
    }
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(404).json({ message: "User not found" });
  }
});

const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json({ isLoggedIn: false, message: "No token provided" });
  }

  try {
    jwt.verify(token, process.env.ACCESS_TOKEN);
    return res.json({ isLoggedIn: true, message: "User is authenticated" });
  } catch (error) {
    return res.json({ isLoggedIn: false, message: "Invalid or expired token" });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.userId;
    const {
      oldPassword,
      password,
      socialMediaLinks,
      name,
      location,
      interests,
      photo,
    } = req.body;

    const user = await User.findById(userId).populate("photo");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user._id.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this user" });
    }

    const oldName = user.name;
    const hadCustomPhoto = user.photo?.cloudinaryId ? true : false;
    const oldCloudinaryId = user.photo?.cloudinaryId;

    // Handle Password Change
    if (oldPassword && password) {
      const passwordIsCorrect = await bcrypt.compare(
        oldPassword,
        user.password
      );
      if (!passwordIsCorrect) {
        return res.status(400).json({ message: "Old password is incorrect" });
      }
      user.password = password;
    }

    // Update Fields
    if (name) user.name = name;
    if (location) user.location = location;
    if (interests) user.interests = interests;

    if (socialMediaLinks) {
      user.socialMediaLinks = {
        ...user.socialMediaLinks.toObject(),
        ...socialMediaLinks,
      };
    }

    // Handle Photo Update or Removal
    if (photo) {
      const photoDoc = user.photo;

      const newCloudinaryId = photo.cloudinaryId || null;
      const photoWasDeleted = hadCustomPhoto && !newCloudinaryId;

      // If user deleted uploaded photo -> remove from Cloudinary
      if (photoWasDeleted && oldCloudinaryId) {
        await cloudinary.uploader.destroy(oldCloudinaryId);
      }

      photoDoc.imageUrl = photo.imageUrl || photoDoc.imageUrl;
      photoDoc.cloudinaryId = newCloudinaryId;
      photoDoc.googleId = photo.googleId || photoDoc.googleId;
      photoDoc.uploadedAt = new Date();
      await photoDoc.save();

      // If photo was removed, regenerate initials-based image
      if (photoWasDeleted) {
        const initials = getInitials(user.name);
        const { h, s, l } = getRandomOrangeShade();
        const bgColor = hslToHex(h, s, l);
        const textColor = "FFFFFF";

        const newImageUrl = `https://placehold.co/150x150/${bgColor}/${textColor}?text=${initials}&font=roboto`;

        await ProfilePicture.findOneAndUpdate(
          { userId: user._id },
          { imageUrl: newImageUrl, cloudinaryId: null, googleId: null }
        );
      }
    }

    // Regenerate initials if name changed and no custom image exists
    if (
      oldName !== name &&
      (!user.photo || !user.photo.cloudinaryId)
    ) {
      const initials = getInitials(name);
      const { h, s, l } = getRandomOrangeShade();
      const bgColor = hslToHex(h, s, l);
      const textColor = "FFFFFF";

      const newImageUrl = `https://placehold.co/150x150/${bgColor}/${textColor}?text=${initials}&font=roboto`;

      await ProfilePicture.findOneAndUpdate(
        { userId: user._id },
        { imageUrl: newImageUrl }
      );
    }

    await user.save();

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      location: user.location,
      interests: user.interests,
      socialMediaLinks: user.socialMediaLinks,
      photo: user.photo
        ? {
            _id: user.photo._id,
            userId: user.photo.userId,
            imageUrl: user.photo.imageUrl,
            cloudinaryId: user.photo.cloudinaryId,
            googleId: user.photo.googleId || null,
            uploadedAt: user.photo.uploadedAt,
          }
        : null,
    });

    await sendUserUpdateMail({ name: user.name, email: user.email });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.userId; // Get ID from authenticated user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user._id.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this user" });
    }

    // Store user details for mail before deletion
    const { name, email } = user;

    // Delete all events created by this user
    await Event.deleteMany({ organizer: userId });
    await ProfilePicture.deleteOne({ userId: userId });

    // Delete user
    await user.deleteOne();

    // Send email *after* successful deletion
    await sendUserDeleteMail({ name, email });

    res.status(200).json({
      message: "Account and associated events deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user and events:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const getUserBookedEvents = async (req, res) => {
  const userId = req.user._id;

  try {
    // Find the user by ID and populate the booked events
    const user = await User.findById(userId).populate("bookedEvents");

    if (!user) {
      // Return 404 if the user is not found
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has booked any events
    // if (!user.bookedEvents.length) {
    //   return res.status(404).json({ message: "No booked events found for this user" });
    // }

    // Retrieve the event details for the booked events
    const bookedEvents = await Event.find({ _id: { $in: user.bookedEvents } })
      .populate("tickets")
      .select("title description date location");

    // Return the list of booked events
    res.status(200).json({ bookedEvents });
  } catch (error) {
    // Handle any errors during the process
    res.status(500).json({ message: error.message });
  }
};

const logoutUser = asyncHandler(async (req, res) => {
  try {
    const { name, email } = req.user; // or wherever you're storing authenticated user info

    // Clear the cookie
    res.cookie("token", "", {
      path: "/",
      httpOnly: true,
      expires: new Date(0),
      sameSite: "none",
      secure: true,
    });

    // Send logout email before responding
    await sendUserLogoutMail({ name, email });

    res.status(200).json({ message: "Logout Successful" });
  } catch (error) {
    console.error("Error in logoutUser:", error.message);
    res.status(500).json({ message: "Logout failed" });
  }
});


// const Stripe = require('stripe');
// const stripe = Stripe('sk_test_YOUR_SECRET_KEY'); // Replace with your real secret key


// app.post('/create-payment-intent', async (req, res) => {
//   const { amount } = req.body;

//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount, // amount in cents (e.g., $10 = 1000)
//       currency: 'usd',
//     });

//     res.send({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.listen(4242, () => console.log('Server running on port 4242'));

module.exports = {
  registerUser,
  loginUser,
  updateThemeMode,
  uploadProfilePicture,
  updateProfilePicture,
  deleteProfilePicture,
  getProfilePicture,
  googleLogin,
  forgotPassword,
  resetPassword,
  loginWithGoogle,
  googleAuth,
  getUserTickets,
  logoutUser,
  getUser,
  getUsers,
  loginStatus,
  updateUser,
  // changePassword,
  deleteUser,
  getUserBookedEvents,
};
