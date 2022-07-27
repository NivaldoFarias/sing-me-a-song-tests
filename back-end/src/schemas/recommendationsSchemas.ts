import Joi from 'joi';
import { CreateRecommendationData } from '../services/recommendationsService.js';

const youtubeLinkRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;

export const recommendationSchema = Joi.object<CreateRecommendationData>({
  name: Joi.string().required(),
  youtubeLink: Joi.string().required().pattern(youtubeLinkRegex),
});
