const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateInvoicePDF = (invoice, booking, room, guest) => {
    return new Promise((resolve, reject) => {
        try {
            const fileName = `invoice-${invoice._id}.pdf`;
            const filePath = path.join(__dirname, "..", "uploads", "invoices", fileName);

            const doc = new PDFDocument({ margin: 50 });
            const writeStream = fs.createWriteStream(filePath);
            doc.pipe(writeStream);

            // Header
            doc
                .fontSize(20)
                .text("Hotel & Resort Booking Engine", { align: "center" })
                .fontSize(12)
                .text("Guest Invoice / Receipt", { align: "center" })
                .moveDown(2);

            // Guest & Booking Info
            doc
                .fontSize(11)
                .text(`Invoice ID: ${invoice._id}`)
                .text(`Guest Name: ${guest.name}`)
                .text(`Guest Email: ${guest.email}`)
                .text(`Booking ID: ${booking._id}`)
                .text(`Room Number: ${room.roomNumber} (${room.category})`)
                .text(`Check-In: ${new Date(booking.checkInDate).toDateString()}`)
                .text(`Check-Out: ${new Date(booking.checkOutDate).toDateString()}`)
                .moveDown(2);

            // Charges
            doc.fontSize(13).text("Billing Summary", { underline: true }).moveDown(0.5);
            doc.fontSize(11);
            doc.text(`Room Charges: Rs. ${invoice.roomCharges.toFixed(2)}`);
            doc.text(`Service Charges: Rs. ${invoice.serviceCharges.toFixed(2)}`);
            doc.text(`Discount: - Rs. ${invoice.discount.toFixed(2)}`);
            doc.text(`Tax (12%): Rs. ${invoice.taxAmount.toFixed(2)}`);
            doc.moveDown(0.5);
            doc.fontSize(13).text(`Total Amount: Rs. ${invoice.totalAmount.toFixed(2)}`, { underline: true });
            doc.moveDown(1);
            doc.fontSize(11).text(`Payment Status: ${invoice.paymentStatus.toUpperCase()}`);

            doc.moveDown(3);
            doc.fontSize(9).text("Thank you for staying with us!", { align: "center" });

            doc.end();

            writeStream.on("finish", () => {
                resolve(`/uploads/invoices/${fileName}`);
            });

            writeStream.on("error", (err) => {
                reject(err);
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = generateInvoicePDF;