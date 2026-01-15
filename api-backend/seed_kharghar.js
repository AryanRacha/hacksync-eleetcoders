import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.model.js';
import Issue from './models/issue.model.js';
import Report from './models/report.model.js';

dotenv.config();

const KHARGHAR_CENTER = { lat: 19.0340, lng: 73.0685 };

const categories = [
    { label: "pothole", value: "pothole" },
    { label: "unsanitary", value: "garbage" },
    { label: "water pipeline leak", value: "water supply" }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        // Find the user to associate with reports
        const user = await User.findOne({ role: "user" }); // Find any valid user
        if (!user) {
            console.error("No user found with role 'user'. Please ensure you have a user to link reports to.");
            process.exit(1);
        }

        // --- Cleanup existing Seeded Data to avoid duplicates/imageless reports ---
        console.log("Cleaning up ALL existing issues and reports...");
        await Issue.deleteMany({});
        await Report.deleteMany({});
        console.log("Cleanup complete.");

        console.log(`Using user: ${user.email} (ID: ${user._id})`);

        const issuesToInsert = [];
        const reportsToInsert = [];

        for (let i = 0; i < 10; i++) {
            // Random offset within ~2km
            const latOffset = (Math.random() - 0.5) * 0.02;
            const lngOffset = (Math.random() - 0.5) * 0.02;
            const lat = KHARGHAR_CENTER.lat + latOffset;
            const lng = KHARGHAR_CENTER.lng + lngOffset;

            const categoryObj = categories[Math.floor(Math.random() * categories.length)];

            const issueId = new mongoose.Types.ObjectId();
            const reportId = new mongoose.Types.ObjectId();

            // Assign specific image based on category
            let imageUrl = "https://via.placeholder.com/400x300?text=Issue";
            if (categoryObj.value === 'pothole') imageUrl = "https://cdn.shopify.com/s/files/1/0274/7288/7913/files/MicrosoftTeams-image_32.jpg?v=1705315718";
            else if (categoryObj.value === 'garbage') imageUrl = "https://thumbs.dreamstime.com/b/dirty-road-full-garbage-pollution-81424710.jpg";
            else if (categoryObj.value === 'water supply' || categoryObj.value.includes('water')) imageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJiNM-4xoosd0GfjDk7lJtYpeEhOvOkuclJg&s";

            const newIssue = {
                _id: issueId,
                title: `${categoryObj.label.charAt(0).toUpperCase() + categoryObj.label.slice(1)} at Location ${i + 1}`,
                category: categoryObj.value,
                status: "Submitted",
                location: {
                    type: "Point",
                    coordinates: [lng, lat] // GeoJSON [lng, lat]
                },
                address: `Near Sector ${Math.floor(Math.random() * 40)}, Kharghar, Navi Mumbai`,
                firstReportedBy: user._id,
                defaultDescription: `This is a test report for ${categoryObj.label} at location ${i + 1}.`,
                defaultImageUrl: imageUrl,
                report_id: [reportId],
                auditVerification: {
                    status: "Pending",
                    riskLevel: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)],
                    reasoning: "Seeded for testing"
                }
            };

            const newReport = {
                _id: reportId,
                issue_id: issueId,
                user_id: user._id,
                imageUrl: "https://via.placeholder.com/400x300?text=Kharghar+Pothole",
                description: `Detailed description for ${categoryObj.label} at location ${i + 1}.`
            };

            issuesToInsert.push(newIssue);
            reportsToInsert.push(newReport);
        }

        await Issue.insertMany(issuesToInsert);
        await Report.insertMany(reportsToInsert);

        console.log(`Successfully seeded 10 issues and 10 reports in Kharghar area.`);
        process.exit(0);
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

seedData();
