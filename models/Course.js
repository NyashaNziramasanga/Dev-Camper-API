const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [ true, 'Please add a course title' ],
  },
  description: {
    type: String,
    required: [ true, 'Please add a description' ],
  },
  weeks: {
    type: String,
    required: [ true, 'Please add number of weeks' ],
  },
  tuition: {
    type: Number,
    required: [ true, 'Please add tuition cost' ],
  },
  minimumSkill: {
    type: String,
    required: [ true, 'Please add minimum sill' ],
    enum: [ 'beginner', 'intermediate', 'advanced' ],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true,
  },
});

// Static method eto get average of course tuitions
CourseSchema.statics.getAverageCost = async function(bootcampId) {
  console.log(`Calculating average cost`.blue.inverse);

  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' },
      },
    },
  ]);

  try {
    // Grab Bootcamp model and update bootcamp by ID and add average course
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
  } catch (err) {
    console.log(err);
  }
};

// Call getAverage cost after save
CourseSchema.post('save', function() {
  this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverage cost before remove
CourseSchema.pre('remove', function() {
  this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model('Course', CourseSchema);
