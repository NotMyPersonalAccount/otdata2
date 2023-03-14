import { createModel } from "@/utils/mongoose";
import { Schema } from "mongoose";

export default createModel(
	"User",
	new Schema({
		afname: String,
		alname: String,
		aaname: String,
		aadult1phone: String,
		aadult2phone: String,
		aethnicity: String,
		agender: String,
		grade: Number,
		langflu: String,
		sped: String,
		otemail: { type: String, unique: true, required: true }
	}, {collection: "user"})
);

