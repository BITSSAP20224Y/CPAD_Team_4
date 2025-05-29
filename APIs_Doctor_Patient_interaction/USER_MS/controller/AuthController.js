import bcrypt from 'bcryptjs';
import patient from '../models/patient.js';
import jwt from 'jsonwebtoken';

const register = async (req, res) => {
    console.log(req.headers);
    const {name, email, password, age, gender, phone, address} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try{
        const newPatient = new patient({
            name,
            email,
            password: hashedPassword,
            age, 
            gender, 
            phone,
            address,
        });

        const savedPatient = await newPatient.save();
        console.log("New patient created:", savedPatient);

        return res
            .status(201)
            .json({
                message: "Patient created successfully",
                patient: {
                    id: savedPatient._id,
                    name: savedPatient.name,
                    email: savedPatient.email,
                    age: savedPatient.age,
                    gender: savedPatient.gender,
                    phone: savedPatient.phone,
                    address: savedPatient.address,
                    createdAt: savedPatient.createdAt,
                },
            });
        
    
    }catch (error) {
        console.error("Error registering new patient:", error);
        return res
            .status(500)
            .json({ message: "Failed to register the patient" });
    }

}

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const patientData = await patient.findOne({ email });
        if(!patientData){
            console.log(`No patient details with matching email ${email} found`);
            res
                .status(401)
                .json({"message":`Email id ${email} not found`});
        }else{

            const isPasswordMathces = await bcrypt.compare(password, patientData.password);
        
        

        if(!isPasswordMathces){
            console.log(`The password for email ${email} did not matched`);
            res
                .status(401)
                .json({"message":`incorrect password`});

        }

        const patientToken = jwt.sign(
            {
                patient:{
                    "id":patientData._id,
                    "name": patientData.name,
                    "email": patientData.email,
                    "age": patientData.age,
                    "gender":patientData.gender,
                    "phone":patientData.phone,
                    "address":patientData.address,
                }
            },process.env.JWT,
            {expiresIn: "1h"}
        )

        res
            .status(200)
            .set('Authorization', `Bearer ${patientToken}`) // Add token to the Authorization header
            .json({
                message: "Login successful",
                token: patientToken
            })
        }
    } catch (error) {
        console.error("Error during login:", error);
        res
            .status(500)
            .json({ "message": "An unexpected error occurred during login. Please try again later." });
    }
}

export {register, login}