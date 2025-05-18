import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

// Define User model
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user'
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    def_status: {
        type: DataTypes.STRING,
        defaultValue: 'active'
    }
}, {
    tableName: 'users',
    timestamps: true,
    underscored: true
});

export default User;
