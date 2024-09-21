'use strict';

/**
 * calculator controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('api::calculator.calculator');

module.exports = createCoreController('api::calculator.calculator', ({ strapi }) => ({
    async findOne(ctx) {
        const { id } = ctx.params;

        // Find the calculator by slug
        const entity = await strapi.db.query("api::calculator.calculator").findOne({
            where: { slug: id },
            populate: ["image", "seo"]
        });

        if (entity) {
            // Find related calculators by category and locale
            const categoryCalculators = await strapi.db.query("api::calculator.calculator").findMany({
                where: { cate_name: entity.cate_name, locale: entity.locale },
                // limit: 4,
                populate: ["image"]
            });

            // Filter out the current calculator from the related calculators
            const relatedCalculators = categoryCalculators
                .filter(calculator => calculator.slug !== id)
                .map(calculator => ({
                    id: calculator.id,
                    name: calculator.name,
                    image: calculator.image.url,
                    slug: calculator.slug,
                }));

            // Attach the related calculators to the entity
            entity.relatedCalculators = relatedCalculators;

            // Sanitize and transform the response
            const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
            const transformedEntity = this.transformResponse(sanitizedEntity);
            return transformedEntity;
        } else {
            return ctx.notFound(); // Return 404 if the calculator doesn't exist
        }
    },
}));
