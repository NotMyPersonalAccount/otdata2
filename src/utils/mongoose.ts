import mongoose, { Model, Mongoose, Schema } from "mongoose";

declare global {
	var mongoose: {
		promise: Promise<Mongoose> | null;
		conn: Mongoose | null;
	};
}

let cached = global.mongoose;
if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

export async function connectMongo() {
	if (cached.conn) return cached.conn;
	if (!cached.promise) {
		cached.promise = mongoose
			.connect(process.env.MONGODB_URI as string, {
				bufferCommands: false
			})
			.then(mongoose => mongoose);
	}

	try {
		cached.conn = await cached.promise;
	} catch (e) {
		cached.conn = null;
		throw e;
	}
	return cached.conn;
}

export function createModel<T>(name: string, schema: Schema<T>): Model<T> {
	return mongoose.models[name] ?? mongoose.model<T>(name, schema);
}



