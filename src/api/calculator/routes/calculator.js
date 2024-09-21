'use strict';

/**
 * calculator router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::calculator.calculator');
