'use strict';

/**
 * calculator service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::calculator.calculator');
