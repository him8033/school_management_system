require("dotenv").config();
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("../cloudConfig.js");

const Student = require("../models/student.model.js");

module.exports = {
    registerStudent: async (req, res) => {
        try {
            const form = new formidable.IncomingForm();
            form.parse(req, async (err, fields, files) => {
                if (err) {
                    return res.status(500).json({ success: false, message: "Form parsing failed." });
                }

                const student = await Student.findOne({ email: fields.email[0] });
                if (student) {
                    return res.status(409).json({ success: false, message: "E-mail is already registered." })
                }
                // else {
                //     const photo = files.image[0];
                //     let filepath = photo.filepath;
                //     let originalFilename = photo.originalFilename.replace(" ", "_");
                //     let newPath = path.join(__dirname, process.env.STUDENT_IMAGE_PATH, originalFilename);

                //     let photoData = fs.readFileSync(filepath);
                //     fs.writeFileSync(newPath, photoData);
                // }

                let imageUrl = null;
                if (files.image) {
                    const photo = files.image[0];
                    const filepath = photo.filepath;

                    // Upload to Cloudinary
                    const uploadResult = await cloudinary.uploader.upload(filepath, {
                        folder: "school_Management/students",
                    });

                    imageUrl = uploadResult.secure_url; // Cloudinary URL
                }

                const salt = bcrypt.genSaltSync(10);
                const hashPassword = bcrypt.hashSync(fields.password[0], salt);
                const newStudent = new Student({
                    school: req.user.schoolId,
                    email: fields.email[0],
                    name: fields.name[0],
                    student_class: fields.student_class[0],
                    age: fields.age[0],
                    gender: fields.gender[0],
                    guardian: fields.guardian[0],
                    guardian_phone: fields.guardian_phone[0],
                    student_image: imageUrl,
                    password: hashPassword,
                })

                const savedStudent = await newStudent.save();
                res.status(200).json({ success: true, data: savedStudent, message: "Student is Registered Successfully." });
            })
        } catch (error) {
            res.status(500).json({ success: false, message: "Student Registeration is Failed." });
        }
    },

    loginStudent: async (req, res) => {
        try {
            const student = await Student.findOne({ email: req.body.email });
            if (!student) {
                return res.status(401).json({ success: false, message: "Email is not registered." });
            }
            
            if (student) {
                const isAuth = bcrypt.compareSync(req.body.password, student.password);
                if (isAuth) {
                    const jwtSecret = process.env.JWT_SECRET;
                    const token = jwt.sign({
                        id: student._id,
                        schoolId: student.school,
                        name: student.name,
                        image_url: student.student_image,
                        role: "STUDENT"
                    }, jwtSecret);
                    res.header("Authorization", token);
                    res.status(200).json({
                        success: true,
                        message: "Success Login",
                        user: {
                            id: student._id,
                            schoolId: student.school,
                            student_name: student.name,
                            image_url: student.student_image,
                            role: "STUDENT"
                        }
                    })
                } else {
                    res.status(401).json({ success: false, message: "Password is Incorrect." });
                }
            } else {
                res.status(401).json({ success: false, message: "Email is not registered." });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error [STUDENT LOGIN]." });
        }
    },

    getStudentWithQuery: async (req, res) => {
        try {
            const filterQuery = {};
            const schoolId = req.user.schoolId;
            filterQuery['school'] = schoolId;

            if (req.query.hasOwnProperty('search')) {
                filterQuery['name'] = { $regex: req.query.search, $options: "i" };
            }

            if (req.query.hasOwnProperty('student_class')) {
                filterQuery['student_class'] = req.query.student_class;
            }

            const students = await Student.find(filterQuery).populate(['student_class']).select(['-password']);
            res.status(200).json({ success: true, message: "Success is fetching all Students.", students });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error [ALL STUDENT DATA]." });
        }
    },

    getStudentOwnData: async (req, res) => {
        try {
            const id = req.user.id;
            const schoolId = req.user.schoolId;
            const student = await Student.findOne({ _id: id, school: schoolId }).select(['-password']).populate('student_class');
            if (student) {
                res.status(200).json({ success: true, student });
            } else {
                res.status(404).json({ success: false, message: "Student not found." });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error [OWN STUDENT DATA]." });
        }
    },

    getStudentWithId: async (req, res) => {
        try {
            const id = req.params.id;
            const schoolId = req.user.schoolId;
            const student = await Student.findOne({ _id: id, school: schoolId }).select(['-password']);
            if (student) {
                res.status(200).json({ success: true, student });
            } else {
                res.status(404).json({ success: false, message: "Student not found." });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error [OWN STUDENT DATA]." });
        }
    },

    updateStudent: async (req, res) => {
        try {
            const id = req.params.id;
            const schoolId = req.user.schoolId;
            const form = new formidable.IncomingForm();
            form.parse(req, async (err, fields, files) => {
                if (err) {
                    return res.status(400).json({ success: false, message: "Error parsing form data." });
                }

                const student = await Student.findOne({ _id: id, school: schoolId });
                if (!student) {
                    return res.status(404).json({ success: false, message: "Student not found." });
                }

                let imageUrl = student.student_image;
                if (files.image) {
                    const photo = files.image[0];
                    let filepath = photo.filepath;

                    // Delete old image from Cloudinary (if exists)
                    if (student.student_image) {
                        const publicId = student.student_image.split("/").pop().split(".")[0]; // Extract public ID
                        await cloudinary.uploader.destroy(`school_Management/students/${publicId}`);
                    }

                    // Upload new image to Cloudinary
                    const uploadResponse = await cloudinary.uploader.upload(filepath, {
                        folder: "school_Management/students"
                    });

                    imageUrl = uploadResponse.secure_url;

                    student["student_image"] = imageUrl;
                }

                Object.keys(fields).forEach((field) => {
                    student[field] = fields[field][0];
                })
                if (fields.password) {
                    const salt = bcrypt.genSaltSync(10);
                    const hashPassword = bcrypt.hashSync(fields.password[0], salt);
                    student["password"] = hashPassword;
                }

                await student.save();
                res.status(200).json({ success: true, message: "Student updated Successfully.", student });

            })
        } catch (error) {
            res.status(500).json({ success: false, message: "Student Update is Failed." });
        }
    },

    deleteStudentWithId: async (req, res) => {
        try {
            const id = req.params.id;
            const schoolId = req.user.schoolId;
            await Student.findOneAndDelete({ _id: id, school: schoolId });
            const students = await Student.find({ school: schoolId });
            res.status(200).json({ success: true, message: "Student deleted.", students });
        } catch (error) {
            res.status(500).json({ success: false, message: "Student Delete is Failed." });
        }
    }
}