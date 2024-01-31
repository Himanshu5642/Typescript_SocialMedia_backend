import mongoose, { Document, Schema } from 'mongoose';

interface ICategory extends Document {
    name: String;
}

const categorySchema = new Schema<ICategory>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export const Category = mongoose.model<ICategory>('category', categorySchema);

const categories = [
    { name: 'all' },
    { name: 'food' },
    { name: 'car' },
    { name: 'videos' },
    { name: 'photography' },
    { name: 'games' },
    { name: 'fun' },
];

Category.countDocuments().then((count) => {
    if (count === 0) {
        // Use the insertMany method to save multiple documents at once
        Category.insertMany(categories)
            .then(savedDocuments => {
                console.log('Documents saved:', savedDocuments);
            })
            .catch(error => {
                console.error('Error saving documents:', error);
            });
    }
});