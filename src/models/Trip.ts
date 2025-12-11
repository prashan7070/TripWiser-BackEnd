import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity {
  name: string;
  isCompleted: boolean;
}

const ActivitySchema = new Schema<IActivity>({
  name: { type: String, required: true },
  isCompleted: { type: Boolean, default: false }
});

export interface IStop {
  locationName: string;

  coordinates: {
    lat: number;
    lng: number;
  };

  order: number;

  arrivalDate?: Date;
  departureDate?: Date;

  hotel?: {
    name?: string;
    address?: string;
    pricePerNight?: number;
    bookingLink?: string;
  };

  activities: IActivity[];
}

const StopSchema = new Schema<IStop>({
  locationName: { type: String, required: true },

  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },

  order: { type: Number, required: true },

  arrivalDate: { type: Date },
  departureDate: { type: Date },

  hotel: {
    name: { type: String },
    address: { type: String },
    pricePerNight: { type: Number },
    bookingLink: { type: String }
  },

  activities: [ActivitySchema]
});


export interface ITrip extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  travelStyle: string;
  stops: IStop[];
  isAiGenerated: boolean;
  notes?: string;
  coverImage?: string;
  status: 'draft' | 'active' | 'completed';
}


const TripSchema = new Schema<ITrip>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    title: { type: String, required: true },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    budget: { type: Number, default: 0 },

    travelStyle: {
      type: String,
      enum: ['adventure', 'leisure', 'cultural', 'luxury', 'family'],
      default: 'leisure'
    },

    stops: [StopSchema],

    isAiGenerated: { type: Boolean, default: false },

    notes: { type: String },

    coverImage: { type: String },

    status: {
      type: String,
      enum: ['draft', 'active', 'completed'],
      default: 'active'
    }
  },
  { timestamps: true }
);

export default mongoose.model<ITrip>('Trip', TripSchema);
