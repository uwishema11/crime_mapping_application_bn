"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendVerificationEmail = (email, template) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Creating transporter with:', {
            service: 'gmail',
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        });
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        yield transporter.verify();
        console.log('Transporter verified successfully');
        const mailOptions = {
            from: `Crime Mapping Team<${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Verify Your Account',
            html: template,
        };
        console.log('Sending email to:', email);
        const info = yield transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
        return info;
    }
    catch (error) {
        console.error('Detailed email sending error:', {
            message: error.message,
            code: error.code,
            command: error.command,
            stack: error.stack,
        });
        throw new Error(`Failed to send verification email: ${error.message}`);
    }
});
exports.sendVerificationEmail = sendVerificationEmail;
