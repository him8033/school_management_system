require("dotenv").config();
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("../cloudConfig.js");

const Teacher = require("../models/teacher.model.js");

module.exports = {
    registerTeacher: async (req, res) => {
        try {
            const form = new formidable.IncomingForm();
            
            form.parse(req, async (err, fields, files) => {
                if (err) {
                    return res.status(500).json({ success: false, message: "Form parsing failed." });
                }

                const teacher = await Teacher.findOne({ email: fields.email[0] });
                if (teacher) {
                    return res.status(409).json({ success: false, message: "E-mail is already registered." })
                }
                // else {
                //     const photo = files.image[0];
                //     let filepath = photo.filepath;
                //     let originalFilename = photo.originalFilename.replace(" ", "_");
                //     let newPath = path.join(__dirname, process.env.TEACHER_IMAGE_PATH, originalFilename);

                //     let photoData = fs.readFileSync(filepath);
                //     fs.writeFileSync(newPath, photoData);
                // }

                let imageUrl = null;
                if (files.image) {
                    const photo = files.image[0];
                    const filepath = photo.filepath;

                    // Upload to Cloudinary
                    const uploadResult = await cloudinary.uploader.upload(filepath, {
                        folder: "school_Management/teachers",
                    });

                    imageUrl = uploadResult.secure_url; // Cloudinary URL
                }

                const salt = bcrypt.genSaltSync(10);
                const hashPassword = bcrypt.hashSync(fields.password[0], salt);
                const newTeacher = new Teacher({
                    school: req.user.schoolId,
                    email: fields.email[0],
                    name: fields.name[0],
                    qualification: fields.qualification[0],
                    age: fields.age[0],
                    gender: fields.gender[0],
                    teacher_image: imageUrl,
                    password: hashPassword,
                })

                const savedTeacher = await newTeacher.save();
                res.status(200).json({ success: true, data: savedTeacher, message: "Teacher is Registered Successfully." });
            })
        } catch (error) {
            res.status(500).json({ success: false, message: "Teacher Registeration is Failed." });
        }
    },

    loginTeacher: async (req, res) => {
        try {
            const teacher = await Teacher.findOne({ email: req.body.email });
            if (teacher) {
                const isAuth = bcrypt.compareSync(req.body.password, teacher.password);
                if (isAuth) {
                    const jwtSecret = process.env.JWT_SECRET;
                    const token = jwt.sign({
                        id: teacher._id,
                        schoolId: teacher.school,
                        name: teacher.name,
                        image_url: teacher.teacher_image,
                        role: "TEACHER"
                    }, jwtSecret);
                    res.header("Authorization", token);
                    res.status(200).json({
                        success: true,
                        message: "Success Login",
                        user: {
                            id: teacher._id,
                            schoolId: teacher.school,
                            teacher_name: teacher.name,
                            image_url: teacher.teacher_image,
                            role: "TEACHER"
                        }
                    })
                } else {
                    res.status(401).json({ success: false, message: "Password is Incorrect." });
                }
            } else {
                res.status(401).json({ success: false, message: "Email is not registered." });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error [TEACHER LOGIN]." });
        }
    },

    getTeacherWithQuery: async (req, res) => {
        try {
            const filterQuery = {};
            const schoolId = req.user.schoolId;
            filterQuery['school'] = schoolId;

            if (req.query.hasOwnProperty('search')) {
                filterQuery['name'] = { $regex: req.query.search, $options: "i" };
            }

            const teachers = await Teacher.find(filterQuery).select(['-password']);
            res.status(200).json({ success: true, message: "Success is fetching all Teachers.", teachers });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error [ALL TEACHER DATA]." });
        }
    },

    getTeacherOwnData: async (req, res) => {
        try {
            const id = req.user.id;
            const schoolId = req.user.schoolId;
            const teacher = await Teacher.findOne({ _id: id, school: schoolId }).select(['-password']);
            if (teacher) {
                res.status(200).json({ success: true, teacher });
            } else {
                res.status(404).json({ success: false, message: "Teacher not found." });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error [OWN TEACHER DATA]." });
        }
    },

    getTeacherWithId: async (req, res) => {
        try {
            const id = req.params.id;
            const schoolId = req.user.schoolId;
            const teacher = await Teacher.findOne({ _id: id, school: schoolId }).select(['-password']);
            if (teacher) {
                res.status(200).json({ success: true, teacher });
            } else {
                res.status(404).json({ success: false, message: "Teacher not found." });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error [OWN TEACHER DATA]." });
        }
    },

    updateTeacher: async (req, res) => {
        try {
            const id = req.params.id;
            const schoolId = req.user.schoolId;
            const form = new formidable.IncomingForm();
            form.parse(req, async (err, fields, files) => {
                if (err) {
                    return res.status(500).json({ success: false, message: "Form parsing failed." });
                }

                const teacher = await Teacher.findOne({ _id: id, school: schoolId });
                if (!teacher) {
                    return res.status(404).json({ success: false, message: "Teacher not found." });
                }

                let imageUrl = teacher.teacher_image;
                if (files.image) {
                    const photo = files.image[0];
                    let filepath = photo.filepath;

                    // Delete old image from Cloudinary (if exists)
                    if (teacher.teacher_image) {
                        const publicId = teacher.teacher_image.split("/").pop().split(".")[0]; // Extract public ID
                        await cloudinary.uploader.destroy(`school_Management/teachers/${publicId}`);
                    }

                    // Upload new image to Cloudinary
                    const uploadResponse = await cloudinary.uploader.upload(filepath, {
                        folder: "school_Management/teachers"
                    });

                    imageUrl = uploadResponse.secure_url;

                    teacher["teacher_image"] = imageUrl;
                }

                Object.keys(fields).forEach((field) => {
                    teacher[field] = fields[field][0];
                })
                if (fields.password) {
                    const salt = bcrypt.genSaltSync(10);
                    const hashPassword = bcrypt.hashSync(fields.password[0], salt);
                    teacher["password"] = hashPassword;
                }

                await teacher.save();
                res.status(200).json({ success: true, message: "Teacher updated Successfully.", teacher });

            })
        } catch (error) {
            res.status(500).json({ success: false, message: "Teacher Update is Failed." });
        }
    },

    deleteTeacherWithId: async (req, res) => {
        try {
            const id = req.params.id;
            const schoolId = req.user.schoolId;
            await Teacher.findOneAndDelete({ _id: id, school: schoolId });
            const teachers = await Teacher.find({ school: schoolId });
            res.status(200).json({ success: true, message: "Teacher deleted.", teachers });
        } catch (error) {
            res.status(500).json({ success: false, message: "Teacher Delete is Failed." });
        }
    }
}