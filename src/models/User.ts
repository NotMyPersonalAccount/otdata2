import {
	DocumentType,
	getModelForClass,
	modelOptions,
	prop,
	Ref
} from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { collection: "user" } })
export class UserSchema {
	@prop()
	public afname?: string;
	@prop()
	public alname?: string;
	@prop()
	public aadults?: string;
	@prop()
	public aadultemail?: string;
	@prop()
	public aadult1phone?: string;
	@prop()
	public aadult2phone?: string;
	@prop()
	public aethnicity?: string;
	@prop()
	public agender?: string;
	@prop()
	public grade?: number;
	@prop()
	public langflu?: string;
	@prop()
	public sped?: string;
	@prop({ unique: true, required: true })
	public otemail!: string;
	@prop()
	public aphone?: string;
	@prop({ sparse: true, unique: true })
	public aeriesid?: number;
	@prop({ sparse: true, unique: true })
	public gid?: string;
	@prop({ required: true })
	public role!: string;
	@prop()
	public astreet?: string;
	@prop()
	public acity?: string;
	@prop()
	public astate?: string;
	@prop()
	public azipcode?: number;
	@prop()
	public gpa?: number;
	@prop()
	public cohort?: string;
	@prop()
	public gclassguardians?: Map<string, any>;
	@prop()
	public gclassguardianinvites?: Map<string, any>;
	@prop()
	public lat?: number;
	@prop()
	public lon?: number;
	@prop({
		default: function (this: DocumentType<UserSchema>) {
			return this.afname;
		}
	})
	public fname?: string;
	@prop({
		default: function (this: DocumentType<UserSchema>) {
			return this.alname;
		}
	})
	public lname?: string;
	@prop({ required: true, default: false })
	public isadmin!: boolean;
	@prop()
	public pronouns?: string;
	@prop()
	public ufname?: string;
	@prop()
	public ulname?: string;
	@prop()
	public birthdate?: Date;
	@prop()
	public personalemail?: string;
	@prop()
	public altemail?: string;
	@prop()
	public mobile?: number;
	@prop()
	public ustreet?: string;
	@prop()
	public ucity?: string;
	@prop()
	public ustate?: string;
	@prop()
	public uzipcode?: number;
	@prop()
	public altphone?: number;
	@prop()
	public ugender?: string;
	@prop({ type: () => [String] })
	public uethnicity?: string[];
	@prop()
	public uethnicityother?: string;
	@prop()
	public lastedited?: string; //TODO
	@prop()
	public lastlogin?: Date;
	@prop()
	public casemanager?: string;
	@prop()
	public linkedin?: string;
	@prop()
	public shirtsize?: string;
	@prop()
	public breakstart?: Date;
	@prop()
	public breakclass?: string;
	@prop()
	public breakduration?: number;
	@prop()
	public compequiptype?: string;
	@prop()
	public compidnum?: string;
	@prop()
	public compstickernum?: number;
	@prop()
	public compdateout?: Date;
	@prop()
	public compdatereturned?: Date;
	@prop()
	public compstatus?: string;
	@prop()
	public compstatusdesc?: string;
	@prop()
	public tnum?: number;
	@prop()
	public troom?: string;
	@prop()
	public tdept?: string;
	@prop()
	public taeriesname?: string;
	@prop()
	public trmphone?: string;
	@prop({ ref: () => UserSchema })
	public this_parents_students?: Ref<UserSchema>[];
	@prop({ ref: () => UserSchema })
	public this_students_parents?: Ref<UserSchema>[];

	//TODO: Embeded documents
}

export default getModelForClass(UserSchema);

