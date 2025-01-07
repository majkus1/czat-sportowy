import mongoose from 'mongoose';

const MatchAnalysisSchema = new mongoose.Schema({
  fixtureId: {
    type: String,
    required: true,
    unique: true,
  },
  analysis: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.MatchAnalysis || mongoose.model('MatchAnalysis', MatchAnalysisSchema);
