import mongoose from 'mongoose';
import ms from 'ms';

export interface IAuthLinks {
	_id: string;
	code: string;
	created: number;
	email: string;
	expired: number;
}

export const authLinksModel =
	(mongoose.models['auth-links'] as mongoose.Model<IAuthLinks>) ??
	mongoose.model<IAuthLinks>(
		'auth-links',
		new mongoose.Schema<IAuthLinks>({
			email: {
				type: String,
				required: true
			},
			code: {
				type: String,
				required: true
			},
			expired: {
				type: Number,
				default: () => Date.now() + ms('1h')
			},
			created: {
				type: Number,
				default: Date.now
			}
		})
	);
