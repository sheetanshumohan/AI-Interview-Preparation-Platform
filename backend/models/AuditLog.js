const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now
    },
    user: {
        type: String,
        required: true,
        default: 'System'
    },
    action: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['SYSTEM', 'SECURITY', 'AI_AGENT', 'API', 'USER_ACTION'],
        default: 'SYSTEM'
    },
    severity: {
        type: String,
        enum: ['Info', 'Warning', 'Critical'],
        default: 'Info'
    },
    status: {
        type: String,
        default: 'Success'
    },
    detail: {
        type: String
    },
    metadata: {
        type: Object
    }
}, { timestamps: true });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
