import { contactContentModel } from "../models/contact/contact_content_model.js";
import { contactModel } from "../models/contact/contact_us_model.js";

export const getContactData = async (req, res, next) => {
  try {
    const contactData = await contactModel.findOne().populate("content");
    return res.status(200).json(contactData);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const addContactData = async (req, res) => {
  try {
    const { title, content } = req.body;
    let urlImg;
    if (req.files) {
      const imgPath = req.files["img"][0].path;
      urlImg = `${process.env.BASE_URL}` + imgPath.replace(/\\/g, "/");
    }

    const newContent = new contactContentModel({
      titleOne: content.titleOne,
      titleTwo: content.titleTwo,
      phoneNumber: content.phoneNumber,
      mobileOne: content.mobileOne,
      mobileTwo: content.mobileTwo,
      location: content.location,
      email: content.email,
      emailOne: content.emailOne,
      poBox: content.emailTwo,
      whatsApp: content.whatsApp,
      faceBook: content.faceBook,
      linkedIn: content.linkedIn,
      instagram: content.instagram,
      threads: content.threads,
      snapChat: content.snapChat,
      googleMap: content.googleMap,
      youtube: content.youtube,
      tiktok: content.tiktok,
    });

    const savedContent = await newContent.save();

    const newContact = new contactModel({
      title,
      img: urlImg,
      content: savedContent._id,
    });

    const savedContact = await newContact.save();

    return res.status(201).json({
      message: "Contact data created successfully",
      data: savedContact,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const editContactData = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const contact = await contactModel.findById(id);

    if (!contact) {
      const error = new Error("Contact not found");
      error.statusCode = 404;
      throw error;
    }

    if (title) {
      contact.title = title;
    }

    if (content) {
      const contactContent = await contactContentModel.findById(
        contact.content
      );

      if (!contactContent) {
        const error = new Error("Contact Content not found.");
        error.statusCode = 404;
        throw error;
      }

      if (content.titleOne) {
        contactContent.titleOne = content.titleOne;
      }
      if (content.titleTwo) {
        contactContent.titleTwo = content.titleTwo;
      }
      if (content.phoneNumber) {
        contactContent.phoneNumber = content.phoneNumber;
      }
      if (content.location) {
        contactContent.location = content.location;
      }
      if (content.email) {
        contactContent.email = content.email;
      }
      if (content.emailOne) {
        contactContent.emailOne = content.emailOne;
      }
      if (content.mobileOne) {
        contactContent.mobileOne = content.mobileOne;
      }
      if (content.mobileTwo) {
        contactContent.mobileTwo = content.mobileTwo;
      }
      if (content.whatsApp) {
        contactContent.whatsApp = content.whatsApp;
      }
      if (content.faceBook) {
        contactContent.faceBook = content.faceBook;
      }
      if (content.youtube) {
        contactContent.youtube = content.youtube;
      }
      if (content.linkedIn) {
        contactContent.linkedIn = content.linkedIn;
      }
      if (content.instagram) {
        contactContent.instagram = content.instagram;
      }

      await contactContent.save();
    }

    const updatedContact = await contact.save();

    return res.status(200).json({
      message: "Contact data updated successfully",
      data: updatedContact,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const deleteContactData = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contact = await contactModel.findById(id);

    if (!contact) {
      const error = new Error("Contact not found");
      error.statusCode = 404;
      throw error;
    }

    const contactContentData = await contactContentModel.findByIdAndRemove(
      contact.content
    );

    await contact.remove();

    return res.status(200).json({
      message: "Contact data deleted successfully",
      data: contact,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// export const sendEmail = (req, res, next) => {
//   try {
//     const { email, name, phone, message } = req.body;
//     const transporter = nodemailer.createTransport({
//       port: 465,
//       host: "smtp.gmail.com",
//       auth: {
//         user: "valoremqrcode@gmail.com",
//         pass: "qthf wgwj ogmg nimb",
//       },
//       secure: true,
//     });
//     const mailOptions = {
//       from: email,
//       to: "info@valoremdxb.ae",
//       subject: `New Enquiry from ${name}`,
//       html: `
//         <p><strong>Name:</strong> ${name}</p>
//         <p><strong>Email:</strong> ${email}</p>
//         <p><strong>Mobile:</strong> ${phone}</p>
//         <p>${message}</p>
//       `,
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error(error);
//         res.status(500).send("Internal Server Error");
//       } else {
//         console.log("Email sent: " + info.response);
//         res.status(200).send("Enquiry submitted successfully");
//       }
//     });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };
