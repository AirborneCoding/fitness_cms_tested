'use strict';

/**
 * program controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('api::program.program');

module.exports = createCoreController('api::program.program', ({ strapi }) => ({
    async findOne(ctx) {
        const { id } = ctx.params;

        // Find the program by slug
        const entity = await strapi.db.query("api::program.program").findOne({
            where: { slug: id },
            populate: ["image", "seo"]
        });

        if (entity) {
            // Find related programs by category and locale
            const categoryPrograms = await strapi.db.query("api::program.program").findMany({
                where: {
                    cate_name: entity.cate_name,
                    interest: entity.interest,
                    locale: entity.locale
                },
                limit: 4,
                populate: ["image"]
            });

            // Filter out the current program from the related programs
            const relatedPrograms = categoryPrograms
                .filter(program => program.slug !== id)
                .map(program => ({
                    id: program.id,
                    title: program.title,
                    image: program.image.url,
                    slug: program.slug,
                }));

            // Attach the related programs to the entity
            entity.relatedPrograms = relatedPrograms;

            // Sanitize and transform the response
            const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
            const transformedEntity = this.transformResponse(sanitizedEntity);
            return transformedEntity;
        } else {
            return ctx.notFound(); // Return 404 if the program doesn't exist
        }
    },
}));
