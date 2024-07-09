import { createUser, findUserByEmailOrPhone } from "../models/userModel.js";

export const identifyUser = async (req, res) => {
  const { email, phoneNumber } = req.body;

  try {
    const contact = await findUserByEmailOrPhone({ email, phoneNumber });
    console.log('Contact found:', contact);

    if (!contact || contact.length === 0) {
      // If no contact found, create a new primary contact
      const newContact = await createUser({
        email,
        phoneNumber,
        linkedId: null,
        linkPrecedence: "primary",
      });
      console.log(phoneNumber);
      return res.status(200).json({
        contact: {
          primaryContactId: newContact.id,
          emails: email ? [email] : [],
          phoneNumbers: phoneNumber ? [phoneNumber] : [],
          secondaryContactIds: [],
        },
      });
    }

    // Identify the primary contact and collect the required data
    let primaryContact = contact[0];
    let emails = new Set();
    let phoneNumbers = new Set();
    let secondaryContactIds = [];

    contact.forEach((contact) => {
      if (contact.linkPrecedence === "primary") {
        primaryContact = contact;
      } else {
        secondaryContactIds.push(contact.id);
      }
      if (contact.email) emails.add(contact.email);
      if (contact.phoneNumber) phoneNumbers.add(contact.phoneNumber);
    });

    return res.status(200).json({
      contact: {
        primaryContactId: primaryContact.id,
        emails: Array.from(emails),
        phoneNumbers: Array.from(phoneNumbers),
        secondaryContactIds: secondaryContactIds,
      },
    });
  } catch (error) {
    console.error("Error identifying user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const register = async (req, res) => {
  const { email, phoneNumber } = req.body;
  let linkedId = null;
  let linkPrecedence = 'primary';

  try {
    if (!email && !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "At least one of email or phoneNumber must be provided"
      });
    }

    const existingContact = await findUserByEmailOrPhone({ email, phoneNumber });
    // console.log("Existing contact:", existingContact); // Add logging to check existing contact

    if (existingContact && existingContact.length > 0) {
      const primaryContact = existingContact.find(contact => contact.linkPrecedence === 'primary');
      if (primaryContact) {
        linkedId = primaryContact.id;
        linkPrecedence = 'secondary';
      }
    }

    const user = await createUser({ email, phoneNumber, linkedId, linkPrecedence });
    // console.log('Newly created user:', user); // Add logging to check new user creation

    return res.status(200).json({
      message: "User registered",
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
