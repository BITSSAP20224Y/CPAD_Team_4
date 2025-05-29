import mongoose from 'mongoose';

import Department from './Department_model.js';

const doctorSchema = new mongoose.Schema({
  
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    departmentName: { type: String, required: true } // Use department name instead of ID
  });
  
  // Middleware to auto-add doctor to department based on departmentName
doctorSchema.post('save', async function (doc) {
    try {
      const department = await Department.findOne({ name: doc.name });
  
      if (department) {
        await Department.findByIdAndUpdate(department._id, {
          $addToSet: { doctors: doc._id }
        });
      } else {
        console.log(`Department with name ${doc.name} not found.`);
      }
    } catch (error) {
      console.error('Error adding doctor to department:', error);
    }
  });

export default mongoose.model('Doctor', doctorSchema)