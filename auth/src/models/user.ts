import mongoose from 'mongoose';

interface UserAttrs {
  email: string;
  password: string;
}

interface UserModel extends mongoose.Model<any> {
  build(attrs: UserAttrs): any;
}

interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const buildUser = (attrs: UserAttrs) => {
  return new User(attrs);
};

userSchema.statics.build = buildUser;

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
