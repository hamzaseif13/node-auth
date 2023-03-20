const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    savedMovies: [{
        type: mongoose.Schema.Types.ObjectId, ref: "movie", default: []
    }],
    

});

// UserSchema.pre(
//     'save',
//     async function (next) {
//         const user = this;
//         const hash = await bcrypt.hash(this.password, 10);
//         this.password = hash;
//         next();
//     }
// );

UserSchema.methods.isValidPassword = async function (password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
    return compare; 
}

UserSchema.pre("save", function (next) {
    const user = this
    if (this.isModified("password") || this.isNew) {
        bcrypt.genSalt(10, function (saltError, salt) {
            if (saltError) {
                return next(saltError)
            } else {
                bcrypt.hash(user.password, salt, function (hashError, hash) {
                    if (hashError) {
                        return next(hashError)
                    }
                    user.password = hash
                    next()
                })
            }
        })
    } else {
        return next()
    }
})  


const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;