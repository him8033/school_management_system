require("dotenv").config();
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("../cloudConfig.js");

const School = require("../models/school.model.js");

module.exports = {
    registerSchool: async (req, res) => {
        try {
            const form = new formidable.IncomingForm();
            form.parse(req, async (err, fields, files) => {
                if (err) {
                    return res.status(500).json({ success: false, message: "Form parsing failed." });
                }

                const school = await School.findOne({ email: fields.email[0] });
                if (school) {
                    return res.status(409).json({ success: false, message: "E-mail is already registered." })
                }
                // else {
                //     const photo = files.image[0];
                //     let filepath = photo.filepath;
                //     let originalFilename = photo.originalFilename.replace(" ", "_");
                //     let newPath = path.join(__dirname, process.env.SCHOOL_IMAGE_PATH, originalFilename);

                //     let photoData = fs.readFileSync(filepath);
                //     fs.writeFileSync(newPath, photoData);
                // }
                let imageUrl;
                if (files.image) {
                    const photo = files.image[0];
                    let filepath = photo.filepath;
                    // Upload image to Cloudinary
                    const uploadResponse = await cloudinary.uploader.upload(filepath, {
                        folder: "school_Management/schools"
                    });
                    imageUrl = uploadResponse.secure_url;
                }

                const salt = bcrypt.genSaltSync(10);
                const hashPassword = bcrypt.hashSync(fields.password[0], salt);
                const newSchool = new School({
                    school_image: imageUrl,
                    school_name: fields.school_name[0],
                    email: fields.email[0],
                    owner_name: fields.owner_name[0],
                    password: hashPassword
                })

                const savedSchool = await newSchool.save();
                res.status(200).json({ success: true, data: savedSchool, message: "School is Registered Successfully." });
            })
        } catch (error) {
            res.status(500).json({ success: false, message: "School Registeration is Failed." });
        }
    },

    loginSchool: async (req, res) => {
        try {
            const school = await School.findOne({ email: req.body.email });
            if (school) {
                const isAuth = bcrypt.compareSync(req.body.password, school.password);
                if (isAuth) {
                    const jwtSecret = process.env.JWT_SECRET;
                    const token = jwt.sign({
                        id: school._id,
                        schoolId: school._id,
                        owner_name: school.owner_name,
                        school_name: school.school_name,
                        image_url: school.school_image,
                        role: "SCHOOL"
                    }, jwtSecret);
                    res.header("Authorization", token);
                    res.status(200).json({
                        success: true, message: "Success Login", user: {
                            id: school._id,
                            owner_name: school.owner_name,
                            school_name: school.school_name,
                            image_url: school.school_image,
                            role: "SCHOOL"
                        }
                    })
                } else {
                    res.status(401).json({ success: false, message: "Password is Incorrect." });
                }
            } else {
                res.status(401).json({ success: false, message: "Email is not registered." });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error [SCHOOL LOGIN]." });
        }
    },

    getAllSchool: async (req, res) => {
        try {
            const schools = await School.find().select(['-password', '-_id', '-email', '-owner_name', '-createdAt']);
            res.status(200).json({ success: true, message: "Success is fetching all Schools.", schools });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error [ALL SCHOOL DATA]." });

        }
    },

    getSchoolOwnData: async (req, res) => {
        try {
            const id = req.user.id;
            const school = await School.findOne({ _id: id }).select(['-password']);
            if (school) {
                res.status(200).json({ success: true, school });
            } else {
                res.status(404).json({ success: false, message: "School not found." });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error [OWN SCHOOL DATA]." });
        }
    },

    updateSchool: async (req, res) => {
        try {
            const id = req.user.id;
            const form = new formidable.IncomingForm();
            form.parse(req, async (err, fields, files) => {
                if (err) {
                    return res.status(500).json({ success: false, message: "Form parsing failed." });
                }

                const school = await School.findOne({ _id: id });
                if (!school) {
                    return res.status(404).json({ success: false, message: "School not found." });
                }

                // if (files.image) {
                //     const photo = files.image[0];
                //     let filepath = photo.filepath;
                //     let originalFilename = photo.originalFilename.replace(" ", "_");
                //     if (school.school_image) {
                //         let oldImagePath = path.join(__dirname, process.env.SCHOOL_IMAGE_PATH, school.school_image);
                //         if (fs.existsSync(oldImagePath)) {
                //             fs.unlink(oldImagePath, (err) => {
                //                 if (err) console.log("Error deleting old Image.", err);
                //             })
                //         }
                //     }
                //     let newPath = path.join(__dirname, process.env.SCHOOL_IMAGE_PATH, originalFilename);
                //     let photoData = fs.readFileSync(filepath);
                //     fs.writeFileSync(newPath, photoData);

                let imageUrl = school.school_image;
                if (files.image) {
                    const photo = files.image[0];
                    let filepath = photo.filepath;

                    // Delete old image from Cloudinary (if exists)
                    if (school.school_image) {
                        const publicId = school.school_image.split("/").pop().split(".")[0]; // Extract public ID
                        await cloudinary.uploader.destroy(`school_Management/schools/${publicId}`);
                    }

                    // Upload new image to Cloudinary
                    const uploadResponse = await cloudinary.uploader.upload(filepath, {
                        folder: "school_Management/schools"
                    });

                    imageUrl = uploadResponse.secure_url;
                }

                Object.keys(fields).forEach((field) => {
                    school[field] = fields[field][0];
                })
                school["school_image"] = imageUrl;

                await school.save();
                res.status(200).json({ success: true, message: "School updated Successfully.", school });

            })
        } catch (error) {
            res.status(500).json({ success: false, message: "School update is Failed." });
        }
    },
}