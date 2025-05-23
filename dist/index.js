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
const app_1 = __importDefault(require("./app"));
const prismaClient_1 = require("./db/prismaClient");
const PORT = 4000;
function checkDatabaseConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield prismaClient_1.prisma.$connect();
            console.log('✅ Database is connected!');
        }
        catch (error) {
            console.error('❌ Database connection failed:', error);
        }
    });
}
checkDatabaseConnection();
app_1.default.listen(PORT, () => console.log(`Server is learning on port ${PORT}`));
